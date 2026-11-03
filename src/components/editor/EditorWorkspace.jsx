"use client";

// 編輯一篇文章或照片集：左邊編輯、右邊即時預覽（跟網站上的樣子一樣）

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MarkdownRenderer from "@/components/articles/MarkdownRenderer";
import { api, isMediaFile, uploadFiles } from "./api";
import { essayBlock, imagesIn, newPhotoItem, newSectionItem, parseEssay, photoLine, serializeEssay } from "./essay";
import PlaceFields from "./PlaceFields";
import PhotoBoard from "./PhotoBoard";
import { Field, inputClass, UploadProgress } from "./ui";

// 文章模式拖進照片時，依張數和直橫自動選排版
function snippetFor(results) {
  const images = results.filter((r) => r.kind === "image");
  const videos = results.filter((r) => r.kind === "video").map((r) => photoLine({ kind: "video", src: r.url }));
  let imageBlock = [];
  if (images.length === 2) {
    const portraits = images.filter((r) => r.height > r.width).length;
    const variant = portraits === 2 ? ' data-variant="portrait"' : portraits === 1 ? ' data-variant="mixed"' : "";
    imageBlock = [`<div class="two-images"${variant}>\n\n${images.map((r) => photoLine({ src: r.url, width: r.width, height: r.height })).join("\n\n")}\n\n</div>`];
  } else if (images.length >= 3) {
    imageBlock = [essayBlock(images.map(newPhotoItem))];
  } else {
    imageBlock = images.map((r) => `![](${r.url})`);
  }
  return [...imageBlock, ...videos].join("\n\n");
}

const TOOLBAR = [
  { label: "H2", text: "## 標題" },
  { label: "H3", text: "### 小標題" },
  { label: "引言", text: '<div class="pullquote">\n\n一句想強調的話\n\n</div>' },
  { label: "提示框", text: '<div class="callout" data-title="小提醒">\n\n內容\n\n</div>' },
  { label: "分隔", text: '<div class="divider"></div>' },
];

export default function EditorWorkspace({ initial, countries, cities }) {
  const router = useRouter();
  const { category, slug } = initial;
  const [meta, setMeta] = useState(initial.meta);
  const [places, setPlaces] = useState({ countries, cities });
  const [body, setBody] = useState(initial.body);
  const [essay, setEssay] = useState(() => parseEssay(initial.body));
  const [saved, setSaved] = useState({ meta: initial.meta, body: initial.body });
  const [status, setStatus] = useState("");
  const [uploads, setUploads] = useState([]);
  const [tab, setTab] = useState("edit");
  const textarea = useRef(null);
  const fileInput = useRef(null);

  const isPhotos = meta.type === "photos";
  const dirty = body !== saved.body || JSON.stringify(meta) !== JSON.stringify(saved.meta);
  const previewBody = useDeferredValue(body);
  const images = useMemo(() => imagesIn(body), [body]);
  const citySlugs = String(meta.cities || "").split(",").map((s) => s.trim()).filter(Boolean);

  const setField = (key, value) => setMeta((current) => ({ ...current, [key]: value }));

  const updateEssay = useCallback((next) => {
    setEssay(next);
    setBody(serializeEssay(next.intro, next.items));
  }, []);

  const switchType = (type) => {
    if (type === "photos") setEssay(parseEssay(body));
    setField("type", type);
  };

  const save = useCallback(async () => {
    setStatus("儲存中…");
    try {
      const { article } = await api("article", { method: "PUT", body: { category, slug, meta, body } });
      setMeta(article.meta);
      setSaved({ meta: article.meta, body });
      setStatus(`已儲存 ${new Date().toLocaleTimeString()}`);
      return true;
    } catch (err) {
      setStatus(`儲存失敗：${err.message}`);
      return false;
    }
  }, [category, slug, meta, body]);

  // ⌘S / Ctrl+S 儲存；有沒存的變更時離開頁面會提醒
  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "s") {
        event.preventDefault();
        save();
      }
    };
    const onLeave = (event) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [save, dirty]);

  const insertAtCursor = (text) => {
    const el = textarea.current;
    const start = el ? el.selectionStart : body.length;
    const end = el ? el.selectionEnd : body.length;
    const before = body.slice(0, start).replace(/\n*$/, "");
    const after = body.slice(end).replace(/^\n*/, "");
    const next = [before, text, after].filter(Boolean).join("\n\n");
    setBody(next);
    requestAnimationFrame(() => {
      if (!el) return;
      const caret = (before ? before.length + 2 : 0) + text.length;
      el.focus();
      el.setSelectionRange(caret, caret);
    });
  };

  const addFiles = async (fileList) => {
    const files = fileList.filter(isMediaFile);
    if (!files.length) return;
    setUploads(files.map((file, index) => ({ index, name: file.name, status: "uploading" })));
    const results = await uploadFiles(files, { category, slug }, (progress) =>
      setUploads((current) => current.map((item) => (item.index === progress.index ? { ...item, ...progress } : item)))
    );
    if (!results.length) return;

    if (!meta.image) {
      const firstImage = results.find((r) => r.kind === "image");
      if (firstImage) setField("image", firstImage.url);
    }
    if (isPhotos) updateEssay({ ...essay, items: [...essay.items, ...results.map(newPhotoItem)] });
    else insertAtCursor(snippetFor(results));
    setTimeout(() => setUploads((current) => current.filter((item) => item.status === "error")), 2500);
  };

  const rename = async () => {
    const next = window.prompt("新的文章代號（網址和 R2 資料夾都會跟著改）", slug)?.trim();
    if (!next || next === slug) return;
    if (dirty && !(await save())) return;
    setStatus("改名中：搬移 R2 資料夾…");
    try {
      const result = await api("rename", { method: "POST", body: { category, from: slug, to: next } });
      setStatus(`已改名，搬了 ${result.moved} 個檔案、更新 ${result.rewritten} 個檔案的網址`);
      setSaved({ meta, body });
      router.replace(`/editor/${category}/${next}`);
    } catch (err) {
      setStatus(`改名失敗：${err.message}`);
    }
  };

  const toggleCity = (value) => {
    const next = citySlugs.includes(value) ? citySlugs.filter((c) => c !== value) : [...citySlugs, value];
    setField("cities", next.join(","));
  };

  return (
    <main className="min-h-screen bg-[#f4efe6] pt-[72px]">
      {/* 上方工具列 */}
      <div className="sticky top-[72px] z-20 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[#786f63]/20 bg-[#f4efe6]/95 px-5 py-3 backdrop-blur sm:px-8">
        <Link href="/editor" className="text-sm text-[#817769] hover:text-[#29251f]">
          ← Editor
        </Link>
        <button type="button" onClick={rename} className="font-mono text-sm text-[#504a43] hover:text-[#456b9b]" title="改文章代號">
          {category}/{slug} ✎
        </button>
        <div className="flex text-xs">
          {[
            ["article", "文章"],
            ["photos", "照片集"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => switchType(value)}
              className={["px-3 py-1.5", (meta.type || "article") === value ? "bg-[#29251f] text-[#f4efe6]" : "border border-[#786f63]/30 text-[#504a43]"].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="text-xs text-[#9a8f80]">{status || (dirty ? "有尚未儲存的變更" : "")}</span>
        <div className="ml-auto flex items-center gap-3">
          <div className="flex text-xs lg:hidden">
            {["edit", "preview"].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setTab(value)}
                className={["px-3 py-1.5", tab === value ? "bg-[#456b9b] text-white" : "border border-[#786f63]/30"].join(" ")}
              >
                {value === "edit" ? "編輯" : "預覽"}
              </button>
            ))}
          </div>
          <a href={`/${category}/articles/${slug}`} target="_blank" rel="noreferrer" className="text-sm text-[#817769] hover:text-[#29251f]">
            開啟頁面 ↗
          </a>
          <button type="button" onClick={save} disabled={!dirty} className="bg-[#29251f] px-4 py-2 text-sm text-[#f4efe6] disabled:opacity-40">
            儲存 ⌘S
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2">
        {/* 編輯 */}
        <section className={["space-y-6 px-5 py-8 sm:px-8", tab === "edit" ? "" : "hidden lg:block"].join(" ")}>
          <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
            <Field label="標題">
              <input value={meta.title || ""} onChange={(e) => setField("title", e.target.value)} className={inputClass} />
            </Field>
            <Field label="日期">
              <input type="date" value={meta.date || ""} onChange={(e) => setField("date", e.target.value)} className={inputClass} />
            </Field>
          </div>

          {category === "travel" && (
            <PlaceFields
              places={places}
              onPlaces={setPlaces}
              country={meta.country}
              citySlugs={citySlugs}
              onCountry={(value) => setMeta((m) => ({ ...m, country: value, cities: "" }))}
              onToggleCity={toggleCity}
            />
          )}

          <Field label="標籤" hint="用逗號分隔，第一個會顯示在標題下">
            <input value={meta.tags || ""} onChange={(e) => setField("tags", e.target.value)} className={inputClass} />
          </Field>

          {!isPhotos && (
            <Field label="摘要" hint="列表卡片上顯示的那段話">
              <textarea value={meta.description || ""} onChange={(e) => setField("description", e.target.value)} rows={3} className={inputClass} />
            </Field>
          )}

          <Field label="封面照" hint={images.length ? "點一張設為封面" : "上傳照片後可以在這裡選"}>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setField("image", src)}
                  className={["h-16 w-20 shrink-0 overflow-hidden", meta.image === src ? "ring-2 ring-[#c4896b] ring-offset-2 ring-offset-[#f4efe6]" : "opacity-70 hover:opacity-100"].join(" ")}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </Field>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => fileInput.current?.click()} className="bg-[#456b9b] px-3 py-1.5 text-xs text-white">
                ＋ 加入照片 / 影片
              </button>
              <input
                ref={fileInput}
                type="file"
                multiple
                accept="image/*,video/*,.heic,.heif"
                className="hidden"
                onChange={(e) => {
                  addFiles([...e.target.files]);
                  e.target.value = "";
                }}
              />
              {!isPhotos &&
                TOOLBAR.map((tool) => (
                  <button key={tool.label} type="button" onClick={() => insertAtCursor(tool.text)} className="border border-[#786f63]/30 px-2.5 py-1.5 text-xs text-[#504a43] hover:bg-white">
                    {tool.label}
                  </button>
                ))}
            </div>
            <UploadProgress items={uploads} />
          </div>

          {isPhotos ? (
            <>
              <Field label="開頭的一段話（可空白）">
                <textarea value={essay.intro} onChange={(e) => updateEssay({ ...essay, intro: e.target.value })} rows={3} className={inputClass} />
              </Field>
              <PhotoBoard
                items={essay.items}
                onChange={(items) => updateEssay({ ...essay, items })}
                onAddFiles={addFiles}
                onAddSection={() => updateEssay({ ...essay, items: [...essay.items, newSectionItem()] })}
              />
            </>
          ) : (
            <textarea
              ref={textarea}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onDrop={(e) => {
                if (!e.dataTransfer.files.length) return;
                e.preventDefault();
                addFiles([...e.dataTransfer.files]);
              }}
              onPaste={(e) => {
                const files = [...(e.clipboardData?.files || [])];
                if (!files.length) return;
                e.preventDefault();
                addFiles(files);
              }}
              placeholder="開始寫…  把照片拖進來會自動上傳並插入：兩張自動並排、三張以上變成照片集"
              className="min-h-[60vh] w-full resize-y border border-[#786f63]/25 bg-white/60 p-4 font-mono text-[14px] leading-7 text-[#29251f] outline-none focus:bg-white"
            />
          )}
        </section>

        {/* 預覽 */}
        <section
          className={[
            "border-l border-[#786f63]/15 bg-[#f4efe6] px-5 py-10 sm:px-10 lg:sticky lg:top-[129px] lg:h-[calc(100vh-129px)] lg:overflow-y-auto",
            tab === "preview" ? "" : "hidden lg:block",
          ].join(" ")}
        >
          <div className="mx-auto max-w-[760px]">
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.32em] text-[#867968]">Preview</p>
            <h1 className="mt-4 text-center font-serif text-4xl tracking-[-0.03em] text-[#29251f] sm:text-5xl">{meta.title || "Untitled"}</h1>
            <p className="mt-3 text-center text-[12px] uppercase tracking-[0.14em] text-[#776f64]">{meta.date}</p>
            <div className="mt-10">
              <MarkdownRenderer content={previewBody} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

"use client";

// 列出 R2 上沒有任何文章、metadata 或程式碼引用的檔案，勾選後可以刪除

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "./api";
import { PageShell } from "./ui";

const formatSize = (bytes) => (bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`);
const isImage = (key) => /\.(webp|jpe?g|png|gif|avif)$/i.test(key);
const isVideo = (key) => /\.(mp4|webm|mov)$/i.test(key);

export default function UnusedFiles() {
  const [files, setFiles] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    setFiles(null);
    setSelected(new Set());
    api("unused")
      .then((data) => setFiles(data.files))
      .catch((err) => setError(err.message));
  };
  useEffect(load, []);

  const totalSize = useMemo(() => (files || []).filter((f) => selected.has(f.key)).reduce((sum, f) => sum + f.size, 0), [files, selected]);

  const toggle = (key) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const remove = async () => {
    if (!selected.size) return;
    if (!window.confirm(`確定要從 R2 永久刪除這 ${selected.size} 個檔案（${formatSize(totalSize)}）嗎？刪除後無法復原。`)) return;
    setStatus("刪除中…");
    try {
      const result = await api("unused", { method: "DELETE", body: { keys: [...selected] } });
      setStatus(`已刪除 ${result.deleted} 個檔案${result.skipped ? `，${result.skipped} 個因為又被引用而略過` : ""}`);
      load();
    } catch (err) {
      setStatus(`刪除失敗：${err.message}`);
    }
  };

  return (
    <PageShell wide>
      <Link href="/editor" className="text-sm text-[#817769] hover:text-[#29251f]">
        ← Editor
      </Link>
      <h1 className="mt-4 font-serif text-4xl text-[#29251f]">未使用的檔案</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b645a]">
        R2 上沒有被任何文章、metadata JSON 或程式碼引用的檔案。只會刪除你勾選的，刪除前會再檢查一次是否真的沒被用到。
      </p>

      {error && <p className="mt-6 text-sm text-red-700">{error}</p>}
      {!files && !error && <p className="mt-6 text-sm text-[#9a8f80]">掃描中…</p>}

      {files && (
        <>
          <div className="sticky top-[72px] z-10 mt-6 flex flex-wrap items-center gap-4 border-y border-[#786f63]/20 bg-[#f4efe6]/95 py-3 backdrop-blur">
            <span className="text-sm text-[#504a43]">{files.length} 個檔案沒被使用</span>
            <button type="button" onClick={() => setSelected(new Set(files.map((f) => f.key)))} className="text-sm text-[#456b9b]">
              全選
            </button>
            <button type="button" onClick={() => setSelected(new Set())} className="text-sm text-[#456b9b]">
              全不選
            </button>
            <span className="text-xs text-[#9a8f80]">{status}</span>
            <button type="button" onClick={remove} disabled={!selected.size} className="ml-auto bg-red-800 px-4 py-2 text-sm text-white disabled:opacity-30">
              刪除 {selected.size || ""} 個（{formatSize(totalSize)}）
            </button>
          </div>

          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-6">
            {files.map((file) => (
              <li key={file.key}>
                <label className={["block cursor-pointer bg-white/50 p-2 transition-shadow", selected.has(file.key) ? "ring-2 ring-red-700" : "hover:ring-1 hover:ring-[#786f63]/30"].join(" ")}>
                  <div className="aspect-[4/3] overflow-hidden bg-[#ddd5c8]">
                    {isImage(file.key) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={file.url} alt="" loading="lazy" className="h-full w-full object-cover" />
                    ) : isVideo(file.key) ? (
                      <video src={file.url} className="h-full w-full object-cover" muted preload="metadata" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-[#9a8f80]">檔案</div>
                    )}
                  </div>
                  <div className="mt-2 flex items-start gap-2">
                    <input type="checkbox" checked={selected.has(file.key)} onChange={() => toggle(file.key)} className="mt-0.5" />
                    <div className="min-w-0">
                      <p className="break-all font-mono text-[11px] leading-4 text-[#504a43]">{file.key}</p>
                      <p className="mt-1 text-[11px] text-[#9a8f80]">{formatSize(file.size)}</p>
                    </div>
                  </div>
                </label>
              </li>
            ))}
          </ul>
        </>
      )}
    </PageShell>
  );
}

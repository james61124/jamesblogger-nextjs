"use client";

// 照片集編輯區：直接照網站的排法畫出來，在上面調整。
//
// - 點一張照片選取：可以調大小（自動 / 中 / 滿版）、左右移動、從這張換排、刪除、寫圖說
// - 拖曳照片到另一張的左半邊或右半邊，插到它前面或後面
// - 兩排之間：合併成一排、插入分段、插入一段文字
// - 刪掉的照片會回到下面的「照片庫」，點一下就能再加回來
// - 鍵盤：← → 移動選取的照片、Delete 刪除、⌘Z 復原
//
// 一開始是自動排版；換排、合併這類調整會自動切成手動排版，之後排法就完全照你排的。
// 勾了「雜誌排版」就改用 MagazineBoard 照雜誌排版的樣子畫。

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { layoutRows, rowItemStyle } from "@/lib/photoLayout";
import { api } from "./api";
import { newBreakItem, newPhotoItem, newSectionItem, newTextItem } from "./essay";
import MagazineBoard from "./MagazineBoard";

const SIZE_OPTIONS = [
  { value: "auto", label: "自動", title: "跟其他照片並排" },
  { value: "medium", label: "中", title: "自己一排，窄一點" },
  { value: "full", label: "滿版", title: "自己一排，佔滿寬度" },
];

const chip = "px-2 py-1 text-[11px] leading-none transition-colors";

// 量照片或影片的長寬（從照片庫加回來的檔案沒有記錄尺寸）
function measure(url, kind) {
  return new Promise((resolve) => {
    if (kind === "video") {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => resolve({ width: video.videoWidth, height: video.videoHeight });
      video.onerror = () => resolve({ width: 1920, height: 1080 });
      video.src = url;
      return;
    }
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => resolve({ width: 3000, height: 2000 });
    image.src = url;
  });
}

// 清掉多餘的換排：開頭結尾、連續兩個、緊貼分段的
function tidy(items) {
  const result = [];
  for (const item of items) {
    if (item.type === "break") {
      const previous = result[result.length - 1];
      if (!previous || previous.type !== "photo") continue;
    }
    if ((item.type === "section" || item.type === "text") && result[result.length - 1]?.type === "break") result.pop();
    result.push(item);
  }
  while (result[result.length - 1]?.type === "break") result.pop();
  return result;
}

// 設成這段的主圖（滿版）；同一段原本的滿版照片改回一般，主圖才會是這張
function applyHero(list, id, on = true) {
  const index = list.findIndex((item) => item.id === id);
  if (index < 0) return list;
  let start = index;
  while (start > 0 && list[start - 1].type !== "section") start -= 1;
  let end = index;
  while (end < list.length - 1 && list[end + 1].type !== "section") end += 1;
  return list.map((item, position) => {
    if (item.id === id) return { ...item, size: on ? "full" : "auto" };
    if (on && position >= start && position <= end && item.type === "photo" && item.size === "full") return { ...item, size: "auto" };
    return item;
  });
}

// 把目前自動算出來的排法寫成明確的換排，切到手動排版時畫面不會跳
function materialize(items) {
  const rows = layoutRows(items, { manual: false });
  const result = [];
  rows.forEach((row, index) => {
    if (row.type !== "row") {
      result.push(row.item);
      return;
    }
    if (rows[index - 1]?.type === "row") result.push(newBreakItem());
    result.push(...row.items);
  });
  return result;
}

function Tile({ item, row, selected, dropSide, onSelect, onChange, onAction, dragProps }) {
  return (
    <figure className="m-0 min-w-0" style={rowItemStyle(row, item)}>
      <div
        {...dragProps}
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
        className={[
          "relative cursor-grab overflow-hidden bg-[#ddd5c8] active:cursor-grabbing",
          selected ? "outline outline-[3px] outline-offset-2 outline-[#c4896b]" : "hover:outline hover:outline-1 hover:outline-offset-2 hover:outline-[#786f63]/40",
        ].join(" ")}
        style={{ aspectRatio: String(item.ratio) }}
      >
        {item.kind === "video" ? (
          <video src={item.src} className="pointer-events-none h-full w-full object-cover" muted playsInline />
        ) : (
          // 編輯器只在本機用，縮圖直接用原圖
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.src} alt="" loading="lazy" draggable={false} className="pointer-events-none h-full w-full object-cover" />
        )}
        {dropSide && <span className={["absolute inset-y-0 w-1 bg-[#456b9b]", dropSide === "before" ? "left-0" : "right-0"].join(" ")} />}
        {item.size !== "auto" && (
          <span className="absolute left-1.5 top-1.5 bg-black/50 px-1.5 py-0.5 text-[10px] text-white">{item.size === "full" ? "滿版" : "中"}</span>
        )}
      </div>

      {selected && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5" onClick={(event) => event.stopPropagation()}>
          <div className="flex border border-[#786f63]/30">
            {SIZE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                title={option.title}
                onClick={() => onChange({ ...item, size: option.value })}
                className={[chip, item.size === option.value ? "bg-[#29251f] text-[#f4efe6]" : "bg-white/70 text-[#504a43] hover:bg-white"].join(" ")}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button type="button" title="往前移（←）" onClick={() => onAction("left")} className={`${chip} border border-[#786f63]/30 bg-white/70 hover:bg-white`}>
            ←
          </button>
          <button type="button" title="往後移（→）" onClick={() => onAction("right")} className={`${chip} border border-[#786f63]/30 bg-white/70 hover:bg-white`}>
            →
          </button>
          {row.items.length > 1 && row.items[0] !== item && (
            <button type="button" title="這張和後面的照片換到下一排" onClick={() => onAction("split")} className={`${chip} border border-[#786f63]/30 bg-white/70 hover:bg-white`}>
              ↵ 從這張換排
            </button>
          )}
          <button type="button" title="移到照片庫（Delete）" onClick={() => onAction("remove")} className={`${chip} ml-auto text-red-700 hover:bg-red-50`}>
            刪除
          </button>
        </div>
      )}
      {item.kind !== "video" && (
        <input
          value={item.caption}
          onChange={(event) => onChange({ ...item, caption: event.target.value })}
          onClick={(event) => event.stopPropagation()}
          placeholder="圖說"
          className="mt-1.5 w-full border-0 border-b border-transparent bg-transparent px-0 py-1 text-[12px] text-[#817769] outline-none placeholder:text-[#c2b8aa] hover:border-[#786f63]/20 focus:border-[#456b9b]"
        />
      )}
    </figure>
  );
}

// 兩排之間的縫：滑過去才出現按鈕
function Seam({ canMerge, onMerge, onAddSection, onAddText }) {
  return (
    <div className="group/seam relative flex h-7 items-center justify-center">
      <span className="absolute inset-x-0 top-1/2 h-px bg-[#456b9b] opacity-0 transition-opacity group-hover/seam:opacity-40" />
      <div className="relative flex gap-2 opacity-0 transition-opacity group-hover/seam:opacity-100">
        {canMerge && (
          <button type="button" onClick={onMerge} className="bg-[#f4efe6] px-2 py-0.5 text-[11px] text-[#456b9b] ring-1 ring-[#456b9b]/40 hover:bg-white">
            ⇡ 跟上一排合併
          </button>
        )}
        <button type="button" onClick={onAddSection} className="bg-[#f4efe6] px-2 py-0.5 text-[11px] text-[#456b9b] ring-1 ring-[#456b9b]/40 hover:bg-white">
          ＋ 分段
        </button>
        <button type="button" onClick={onAddText} className="bg-[#f4efe6] px-2 py-0.5 text-[11px] text-[#456b9b] ring-1 ring-[#456b9b]/40 hover:bg-white">
          ＋ 文字
        </button>
      </div>
    </div>
  );
}

export default function PhotoBoard({ essay, onChange, onAddFiles, category, slug }) {
  const { items, manual } = essay;
  const [selectedId, setSelectedId] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [drop, setDrop] = useState(null); // { id, side }
  const [fileOver, setFileOver] = useState(false);
  const [library, setLibrary] = useState([]);
  const [device, setDevice] = useState("desktop"); // 雜誌排版預覽：desktop 三欄、mobile 兩欄
  const history = useRef([]);

  const rows = useMemo(() => layoutRows(items, { manual }), [items, manual]);
  const used = useMemo(() => new Set(items.filter((item) => item.type === "photo").map((item) => item.src)), [items]);
  const spare = library.filter((file) => !used.has(file.url));

  // 每次改動都記下改之前的樣子，⌘Z 復原
  const commit = useCallback(
    (next) => {
      history.current = [...history.current.slice(-49), { items, manual }];
      onChange({ ...next, items: tidy(next.items) });
    },
    [items, manual, onChange]
  );

  const undo = useCallback(() => {
    const previous = history.current.pop();
    if (previous) onChange(previous);
  }, [onChange]);

  const loadLibrary = useCallback(() => {
    api(`library?category=${encodeURIComponent(category)}&slug=${encodeURIComponent(slug)}`)
      .then((data) => setLibrary(data.files))
      .catch(() => {});
  }, [category, slug]);

  useEffect(loadLibrary, [loadLibrary]);

  // 有新上傳的照片不在照片庫裡，就重新讀一次
  const known = useMemo(() => new Set(library.map((file) => file.url)), [library]);
  useEffect(() => {
    if ([...used].some((src) => !known.has(src))) loadLibrary();
  }, [used, known, loadLibrary]);

  const setItems = (nextItems, nextManual = manual) => commit({ items: nextItems, manual: nextManual });
  const replaceItem = (updated) => setItems(items.map((item) => (item.id === updated.id ? updated : item)));

  // 手動排版才能換排、合併；還在自動排版的話先把目前的排法固定下來
  const asManual = () => (manual ? items : materialize(items));

  const moveTo = (list, id, targetId, side) => {
    if (id === targetId) return list;
    const moving = list.find((item) => item.id === id);
    const rest = list.filter((item) => item.id !== id);
    const index = rest.findIndex((item) => item.id === targetId);
    if (!moving || index < 0) return list;
    rest.splice(side === "after" ? index + 1 : index, 0, moving);
    return rest;
  };

  const step = (id, direction) => {
    const photos = items.filter((item) => item.type === "photo");
    const index = photos.findIndex((item) => item.id === id);
    const target = photos[index + direction];
    if (!target) return;
    setItems(moveTo(items, id, target.id, direction > 0 ? "after" : "before"));
  };

  const remove = (id) => {
    setItems(items.filter((item) => item.id !== id));
    setSelectedId(null);
  };

  const split = (id) => {
    const list = asManual();
    const index = list.findIndex((item) => item.id === id);
    setItems([...list.slice(0, index), newBreakItem(), ...list.slice(index)], true);
  };

  const merge = (upper, lower) => {
    const list = asManual();
    const from = list.indexOf(upper.items[upper.items.length - 1]);
    const to = list.indexOf(lower.items[0]);
    const between = new Set(list.slice(from + 1, to).filter((item) => item.type === "break"));
    const plain = new Set([...upper.items, ...lower.items].filter((item) => item.size !== "auto"));
    setItems(list.filter((item) => !between.has(item)).map((item) => (plain.has(item) ? { ...item, size: "auto" } : item)), true);
  };

  const insertBefore = (firstItem, newItem) => {
    const list = [...items];
    const index = firstItem ? list.indexOf(firstItem) : list.length;
    list.splice(index, 0, newItem);
    setItems(list);
  };
  const seamProps = (firstItem) => ({
    onAddSection: () => insertBefore(firstItem, newSectionItem()),
    onAddText: () => insertBefore(firstItem, newTextItem()),
  });

  const addFromLibrary = async (file, targetId, side) => {
    const size = await measure(file.url, file.kind);
    const photo = newPhotoItem({ url: file.url, kind: file.kind, ...size });
    const list = [...items, photo];
    setItems(targetId ? moveTo(list, photo.id, targetId, side) : list);
  };

  const action = (id) => (name) => {
    if (name === "left") step(id, -1);
    if (name === "right") step(id, 1);
    if (name === "split") split(id);
    if (name === "remove") remove(id);
  };

  // 鍵盤操作：在輸入框裡打字時不攔
  useEffect(() => {
    const onKey = (event) => {
      const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName);
      if ((event.metaKey || event.ctrlKey) && event.key === "z" && !event.shiftKey && !typing) {
        event.preventDefault();
        undo();
        return;
      }
      if (typing || !selectedId) return;
      if (event.key === "ArrowLeft") step(selectedId, -1);
      else if (event.key === "ArrowRight") step(selectedId, 1);
      else if (event.key === "Delete" || event.key === "Backspace") remove(selectedId);
      else if (event.key === "Escape") setSelectedId(null);
      else return;
      event.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const hasFiles = (event) => [...(event.dataTransfer?.types || [])].includes("Files");

  const dragProps = (item, axis = "x") => ({
    draggable: true,
    onDragStart: (event) => {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", item.id);
      setDragId(item.id);
    },
    onDragOver: (event) => {
      if (hasFiles(event)) return;
      event.preventDefault();
      const box = event.currentTarget.getBoundingClientRect();
      const side = (axis === "y" ? event.clientY - box.top < box.height / 2 : event.clientX - box.left < box.width / 2) ? "before" : "after";
      if (drop?.id !== item.id || drop?.side !== side) setDrop({ id: item.id, side });
    },
    onDragLeave: () => setDrop((current) => (current?.id === item.id ? null : current)),
    onDrop: (event) => {
      if (hasFiles(event)) return;
      event.preventDefault();
      event.stopPropagation();
      const libraryUrl = event.dataTransfer.getData("application/x-library");
      const side = drop?.side || "before";
      if (libraryUrl) {
        const file = library.find((entry) => entry.url === libraryUrl);
        if (file) addFromLibrary(file, item.id, side);
      } else if (dragId) {
        setItems(moveTo(items, dragId, item.id, side));
      }
      setDragId(null);
      setDrop(null);
    },
    onDragEnd: () => {
      setDragId(null);
      setDrop(null);
    },
  });

  // 拖到主圖上：把拖過來的照片放到主圖前面，並設成主圖
  const dropOnHero = async (hero, event) => {
    const libraryUrl = event.dataTransfer.getData("application/x-library");
    if (libraryUrl) {
      const file = library.find((entry) => entry.url === libraryUrl);
      if (!file) return;
      const photo = newPhotoItem({ url: file.url, kind: file.kind, ...(await measure(file.url, file.kind)) });
      setItems(applyHero(moveTo([...items, photo], photo.id, hero.id, "before"), photo.id));
    } else if (dragId) {
      setItems(applyHero(moveTo(items, dragId, hero.id, "before"), dragId));
    }
    setDragId(null);
    setDrop(null);
  };

  let previousRow = null;

  return (
    <div
      onClick={() => setSelectedId(null)}
      onDragOver={(event) => {
        if (!hasFiles(event)) return;
        event.preventDefault();
        setFileOver(true);
      }}
      onDragLeave={() => setFileOver(false)}
      onDrop={(event) => {
        if (!hasFiles(event)) return;
        event.preventDefault();
        setFileOver(false);
        onAddFiles([...event.dataTransfer.files]);
      }}
      className={["border-2 border-dashed p-3 transition-colors", fileOver ? "border-[#456b9b] bg-[#456b9b]/5" : "border-transparent"].join(" ")}
    >
      <div className="sticky top-[72px] z-10 -mx-3 mb-4 flex flex-wrap items-center gap-3 border-b border-[#786f63]/15 bg-[#f4efe6]/95 px-3 py-2 backdrop-blur" onClick={(event) => event.stopPropagation()}>
        {!essay.magazine && (
        <div className="flex border border-[#786f63]/30">
          {[
            [false, "自動排版"],
            [true, "手動排版"],
          ].map(([value, label]) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                if (value === manual) return;
                if (value) setItems(materialize(items), true);
                else if (window.confirm("切回自動排版會清掉你手動調的換排，確定嗎？")) setItems(items.filter((item) => item.type !== "break"), false);
              }}
              className={[chip, "px-3 py-1.5", manual === value ? "bg-[#29251f] text-[#f4efe6]" : "bg-white/70 text-[#504a43] hover:bg-white"].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
        )}
        {!essay.magazine && <span className="text-[11px] text-[#9a8f80]">{manual ? "排法完全照你排的" : "照片順序和大小由你決定，換排自動算"}</span>}
        <label className="flex items-center gap-1.5 text-[12px] text-[#504a43]">
          <input type="checkbox" checked={Boolean(essay.magazine)} onChange={(event) => onChange({ magazine: event.target.checked })} />
          雜誌排版
        </label>
        {essay.magazine && (
          <div className="flex border border-[#786f63]/30">
            {[
              ["desktop", "電腦"],
              ["mobile", "手機"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setDevice(value)}
                className={[chip, "px-3 py-1.5", device === value ? "bg-[#29251f] text-[#f4efe6]" : "bg-white/70 text-[#504a43] hover:bg-white"].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <button type="button" onClick={undo} disabled={!history.current.length} className="ml-auto text-[11px] text-[#456b9b] disabled:opacity-30">
          ↶ 復原
        </button>
      </div>

      {items.length === 0 ? (
        <p className="py-16 text-center text-sm text-[#9a8f80]">把照片或影片拖進來，或按上方的「加入照片」</p>
      ) : essay.magazine ? (
        <div className={["mx-auto", device === "mobile" ? "max-w-[390px]" : "max-w-[760px]"].join(" ")}>
          <MagazineBoard
            items={items}
            columns={device === "mobile" ? 2 : 3}
            selectedId={selectedId}
            onSelect={setSelectedId}
            dragProps={dragProps}
            drop={drop}
            dragId={dragId}
            onChange={replaceItem}
            onAction={action}
            onSetHero={(item, on) => setItems(applyHero(items, item.id, on))}
            onDropOnHero={dropOnHero}
            insertBefore={insertBefore}
            newSectionItem={newSectionItem}
            newTextItem={newTextItem}
            remove={remove}
          />
        </div>
      ) : (
        <div className="mx-auto max-w-[760px]">
          {rows.map((row, index) => {
            const upper = previousRow;
            previousRow = row.type === "row" ? row : null;
            if (row.type === "text") {
              const block = row.item;
              return (
                <div key={block.id}>
                  <Seam canMerge={false} {...seamProps(block)} />
                  <div className="group relative mx-auto max-w-[34rem]" onClick={(event) => event.stopPropagation()}>
                    <textarea
                      value={block.text}
                      onChange={(event) => replaceItem({ ...block, text: event.target.value })}
                      rows={Math.max(2, block.text.split("\n").length + 1)}
                      placeholder="寫一段當時的故事…"
                      className="w-full resize-y border border-dashed border-[#786f63]/30 bg-white/40 p-3 font-serif text-[16px] leading-7 text-[#3f3a33] outline-none placeholder:text-[#c2b8aa] focus:border-[#456b9b] focus:bg-white"
                    />
                    <button type="button" onClick={() => remove(block.id)} className="absolute -right-16 top-2 text-xs text-[#9a8f80] opacity-0 hover:text-red-700 group-hover:opacity-100">
                      刪除文字
                    </button>
                  </div>
                </div>
              );
            }
            if (row.type === "section") {
              const section = row.item;
              return (
                <div key={section.id} className="mt-6">
                  {index > 0 && <Seam canMerge={false} {...seamProps(section)} />}
                  <div className="group flex items-end gap-3 border-t border-[#786f63]/25 pt-4" onClick={(event) => event.stopPropagation()}>
                    <input
                      value={section.title}
                      onChange={(event) => replaceItem({ ...section, title: event.target.value })}
                      placeholder="分段標題"
                      className="min-w-0 flex-1 border-0 bg-transparent font-serif text-[26px] leading-tight text-[#29251f] outline-none placeholder:text-[#c2b8aa]"
                    />
                    <button type="button" onClick={() => remove(section.id)} className="pb-1 text-xs text-[#9a8f80] opacity-0 hover:text-red-700 group-hover:opacity-100">
                      刪除分段
                    </button>
                  </div>
                </div>
              );
            }
            const canMerge = Boolean(upper) && upper.items.length + row.items.length <= 4;
            return (
              <div key={row.items[0].id}>
                {upper ? (
                  <Seam canMerge={canMerge} onMerge={() => merge(upper, row)} {...seamProps(row.items[0])} />
                ) : (
                  <div className="h-4" />
                )}
                <div className={["flex items-start gap-3", row.items.length === 1 ? "justify-center" : ""].join(" ")}>
                  {row.items.map((item) => (
                    <Tile
                      key={item.id}
                      item={item}
                      row={row}
                      selected={selectedId === item.id}
                      dropSide={drop?.id === item.id && dragId !== item.id ? drop.side : null}
                      onSelect={() => setSelectedId(item.id)}
                      onChange={replaceItem}
                      onAction={action(item.id)}
                      dragProps={dragProps(item)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
          <div className="mt-4">
            <Seam canMerge={false} {...seamProps(null)} />
          </div>
        </div>
      )}

      <div className="mt-10 border-t border-[#786f63]/20 pt-4" onClick={(event) => event.stopPropagation()}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#857968]">
          照片庫 · 還沒放進照片集的 {spare.length} 張
        </p>
        <p className="mt-1 text-xs text-[#9a8f80]">刪掉的照片會回到這裡。點一下加到最後，或拖到某張照片旁邊插進去。真的不要的檔案到「未使用的檔案」清掉。</p>
        {spare.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {spare.map((file) => (
              <button
                key={file.url}
                type="button"
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = "copy";
                  event.dataTransfer.setData("application/x-library", file.url);
                }}
                onClick={() => addFromLibrary(file)}
                className="h-20 w-24 overflow-hidden bg-[#ddd5c8] opacity-80 hover:opacity-100"
                title="加到照片集最後"
              >
                {file.kind === "video" ? (
                  <video src={file.url} className="h-full w-full object-cover" muted preload="metadata" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={file.url} alt="" loading="lazy" className="h-full w-full object-cover" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

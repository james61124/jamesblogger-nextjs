"use client";

// 照片集的編輯區：拖曳排序、加星號當重點、寫圖說、插入分段。排版交給 PhotoEssay 自動算。

import { useState } from "react";
import { inputClass } from "./ui";

function Tile({ item, onChange, onRemove, dragProps, dragging }) {
  if (item.type === "section") {
    return (
      <div {...dragProps} className={["col-span-full flex items-center gap-3 border border-dashed border-[#786f63]/35 bg-white/40 px-3 py-2", dragging ? "opacity-40" : ""].join(" ")}>
        <span className="cursor-grab select-none text-[#9a8f80]" aria-hidden>
          ⠿
        </span>
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#857968]">分段</span>
        <input
          value={item.title}
          onChange={(e) => onChange({ ...item, title: e.target.value })}
          placeholder="例如：少女峰 · Jungfraujoch"
          className={`${inputClass} flex-1 py-1`}
        />
        <button type="button" onClick={onRemove} className="px-2 text-[#9a8f80] hover:text-red-700" aria-label="移除分段">
          ✕
        </button>
      </div>
    );
  }

  const portrait = item.height > item.width;
  return (
    <div {...dragProps} className={["group relative flex flex-col bg-white/50", dragging ? "opacity-40" : ""].join(" ")}>
      <div className="relative aspect-square cursor-grab overflow-hidden bg-[#ddd5c8]">
        {item.kind === "video" ? (
          <video src={item.src} className="h-full w-full object-cover" muted playsInline />
        ) : (
          // 縮圖直接用原圖，編輯器只在本機用，不需要 next/image
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.src} alt="" loading="lazy" draggable={false} className="h-full w-full object-cover" />
        )}
        <button
          type="button"
          onClick={() => onChange({ ...item, feature: !item.feature })}
          aria-pressed={item.feature}
          title="重點照片：會放大，自己一行"
          className={[
            "absolute left-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full text-sm transition-colors",
            item.feature ? "bg-[#c4896b] text-white" : "bg-white/80 text-[#9a8f80] hover:text-[#c4896b]",
          ].join(" ")}
        >
          ★
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label="從照片集移除"
          className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-sm text-[#9a8f80] opacity-0 transition-opacity hover:text-red-700 group-hover:opacity-100"
        >
          ✕
        </button>
        <span className="absolute bottom-1.5 left-1.5 rounded bg-black/45 px-1.5 py-0.5 text-[10px] text-white">
          {item.kind === "video" ? "影片" : portrait ? "直" : "橫"}
        </span>
      </div>
      {item.kind !== "video" && (
        <input
          value={item.caption}
          onChange={(e) => onChange({ ...item, caption: e.target.value })}
          placeholder="圖說（可空白）"
          className="w-full border-0 border-t border-[#786f63]/15 bg-transparent px-2 py-1.5 text-xs text-[#504a43] outline-none focus:bg-white"
        />
      )}
    </div>
  );
}

export default function PhotoBoard({ items, onChange, onAddFiles, onAddSection }) {
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const [fileOver, setFileOver] = useState(false);

  const move = (from, to) => {
    if (from === to || from == null || to == null) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  const hasFiles = (event) => [...(event.dataTransfer?.types || [])].includes("Files");

  return (
    <div
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
      className={["min-h-48 border-2 border-dashed p-3 transition-colors", fileOver ? "border-[#456b9b] bg-[#456b9b]/5" : "border-transparent"].join(" ")}
    >
      {items.length === 0 ? (
        <p className="py-16 text-center text-sm text-[#9a8f80]">把照片或影片拖進來，或按上方的「加入照片」</p>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-5">
          {items.map((item, index) => (
            <Tile
              key={item.id}
              item={item}
              dragging={dragIndex === index}
              onChange={(updated) => onChange(items.map((current) => (current.id === item.id ? updated : current)))}
              onRemove={() => onChange(items.filter((current) => current.id !== item.id))}
              dragProps={{
                draggable: true,
                onDragStart: (event) => {
                  event.dataTransfer.effectAllowed = "move";
                  setDragIndex(index);
                },
                onDragOver: (event) => {
                  if (hasFiles(event)) return;
                  event.preventDefault();
                  if (overIndex !== index) setOverIndex(index);
                },
                onDrop: (event) => {
                  if (hasFiles(event)) return;
                  event.preventDefault();
                  move(dragIndex, index);
                  setDragIndex(null);
                  setOverIndex(null);
                },
                onDragEnd: () => {
                  setDragIndex(null);
                  setOverIndex(null);
                },
                style: overIndex === index && dragIndex !== index ? { outline: "2px solid #456b9b", outlineOffset: 2 } : undefined,
              }}
            />
          ))}
        </div>
      )}
      <button type="button" onClick={onAddSection} className="mt-3 text-xs uppercase tracking-[0.2em] text-[#817769] hover:text-[#29251f]">
        ＋ 加入分段
      </button>
    </div>
  );
}

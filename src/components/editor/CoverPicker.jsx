"use client";

// 封面設定：先選版型，再點預覽裡的格子、從下面的照片挑一張放進去。
// 第一格存在 image，其他格存在 coverImages，版型存在 coverLayout。

import { useState } from "react";
import CoverGrid from "@/components/CoverGrid";
import { COVER_LAYOUTS, SLOT_NAMES, resolveCover, slotCount } from "@/lib/cover";

function LayoutIcon({ layout }) {
  const config = COVER_LAYOUTS[layout];
  return (
    <span
      aria-hidden
      className="grid h-7 w-9 gap-[2px]"
      style={{ gridTemplateColumns: config.columns, gridTemplateRows: config.rows, gridTemplateAreas: config.areas.join(" ") }}
    >
      {SLOT_NAMES.slice(0, slotCount(layout)).map((slot) => (
        <span key={slot} style={{ gridArea: slot }} className="bg-current opacity-60" />
      ))}
    </span>
  );
}

export default function CoverPicker({ meta, images, isPhotos, onChange }) {
  const [activeSlot, setActiveSlot] = useState(0);
  const cover = resolveCover({ ...meta, photos: images, type: isPhotos ? "photos" : "article" });
  const layout = COVER_LAYOUTS[meta.coverLayout] ? meta.coverLayout : cover.layout;
  const slots = Array.from({ length: slotCount(layout) }, (_, index) => cover.images[index] || "");

  const save = (nextLayout, nextSlots) => {
    const [first, ...rest] = nextSlots;
    onChange({ image: first || "", coverLayout: nextLayout, coverImages: rest.filter(Boolean).join(",") });
  };

  const chooseLayout = (next) => {
    const fill = resolveCover({ ...meta, coverLayout: next, photos: images, type: "photos" });
    const nextSlots = Array.from({ length: slotCount(next) }, (_, index) => slots[index] || fill.images[index] || "");
    setActiveSlot(0);
    save(next, nextSlots);
  };

  const choosePhoto = (src) => {
    const nextSlots = [...slots];
    const existing = nextSlots.indexOf(src);
    if (existing >= 0) nextSlots[existing] = nextSlots[activeSlot]; // 已經在別格的照片就互換
    nextSlots[activeSlot] = src;
    save(layout, nextSlots);
    setActiveSlot((activeSlot + 1) % nextSlots.length);
  };

  if (!images.length) return <p className="text-sm text-[#9a8f80]">上傳照片後可以在這裡設定封面</p>;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(COVER_LAYOUTS).map(([key, config]) => (
          <button
            key={key}
            type="button"
            onClick={() => chooseLayout(key)}
            disabled={images.length < slotCount(key)}
            className={[
              "flex flex-col items-center gap-1 px-2 py-1.5 text-[10px] disabled:opacity-25",
              layout === key ? "bg-[#29251f] text-[#f4efe6]" : "text-[#6b645a] hover:bg-white",
            ].join(" ")}
          >
            <LayoutIcon layout={key} />
            {config.label}
          </button>
        ))}
      </div>

      <div className="relative aspect-[4/3] max-w-sm">
        <CoverGrid layout={layout} images={slots} sizes="400px" activeSlot={activeSlot} onSlotClick={setActiveSlot} />
      </div>
      {slots.length > 1 && <p className="text-xs text-[#9a8f80]">點上面的格子選要換哪一格（目前：第 {activeSlot + 1} 格），再點下面的照片。第一格也是文章頁的封面。</p>}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((src) => {
          const slot = slots.indexOf(src);
          return (
            <button
              key={src}
              type="button"
              onClick={() => choosePhoto(src)}
              className={["relative h-16 w-20 shrink-0 overflow-hidden", slot >= 0 ? "ring-2 ring-[#c4896b] ring-offset-2 ring-offset-[#f4efe6]" : "opacity-70 hover:opacity-100"].join(" ")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
              {slot >= 0 && slots.length > 1 && (
                <span className="absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#c4896b] text-[9px] text-white">{slot + 1}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

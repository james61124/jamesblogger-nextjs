"use client";

// 照版型把 1～3 張照片排進卡片的封面框。編輯器也用這個元件預覽，可以點格子選要換哪一格。

import Image from "next/image";
import { COVER_LAYOUTS, SLOT_NAMES } from "@/lib/cover";

export default function CoverGrid({ layout, images, title = "", eager = false, sizes, activeSlot, onSlotClick, className = "" }) {
  const config = COVER_LAYOUTS[layout] || COVER_LAYOUTS.single;
  return (
    <div
      className={`absolute inset-0 grid gap-[3px] bg-[#f4efe6] ${className}`}
      style={{ gridTemplateColumns: config.columns, gridTemplateRows: config.rows, gridTemplateAreas: config.areas.join(" ") }}
    >
      {images.map((src, index) => {
        const slot = SLOT_NAMES[index];
        const content = src ? (
          <Image
            src={src}
            alt={index === 0 ? title : ""}
            fill
            loading={eager ? "eager" : "lazy"}
            sizes={sizes || "(min-width: 1024px) 20vw, 100vw"}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-xs text-[#9a8f80]">選一張照片</span>
        );
        return onSlotClick ? (
          <button
            key={slot}
            type="button"
            onClick={() => onSlotClick(index)}
            style={{ gridArea: slot }}
            className={["relative overflow-hidden bg-[#ddd5c8]", activeSlot === index ? "z-10 outline outline-[3px] -outline-offset-[3px] outline-[#c4896b]" : ""].join(" ")}
          >
            {content}
          </button>
        ) : (
          <div key={slot} style={{ gridArea: slot }} className="relative overflow-hidden">
            {content}
          </div>
        );
      })}
    </div>
  );
}

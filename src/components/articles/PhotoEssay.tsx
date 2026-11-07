"use client";

// 照片集：照片的順序、大小、換排和分段都寫在 markdown 裡，排版演算法在 src/lib/photoLayout.js。
//
// <div class="photo-essay" data-layout="manual">        ← 沒有 data-layout 就自動排版
// <img src="…" width="3000" height="2000" alt="圖說" data-size="full" />
// <div class="photo-break"></div>                        ← 手動換排
// <div class="photo-section">少女峰 · Jungfraujoch</div>
// <div class="photo-text">那天早上下著雪…<br>第二行</div>  ← 照片之間的一段文字
// <video src="…" width="1080" height="1920"></video>
// </div>

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { layoutRows, rowItemStyle } from "@/lib/photoLayout";

type HastNode = {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
};

type Photo = {
  type: "photo";
  kind: "image" | "video";
  src: string;
  ratio: number;
  width: number;
  height: number;
  caption: string;
  size: "auto" | "medium" | "full";
};

type Item = Photo | { type: "section"; title: string } | { type: "text"; text: string } | { type: "break" };
type Row =
  | { type: "row"; items: Photo[]; size: string }
  | { type: "section"; item: { title: string } }
  | { type: "text"; item: { text: string } };

const prop = (node: HastNode, key: string) => {
  const value = node.properties?.[key];
  return Array.isArray(value) ? value.join(" ") : value == null ? "" : String(value);
};

const textOf = (node: HastNode): string =>
  node.tagName === "br" ? "\n" : typeof node.value === "string" ? node.value : (node.children || []).map(textOf).join("");

const SIZES = new Set(["medium", "full"]);

export function parseEssay(node: HastNode | undefined): Item[] {
  const items: Item[] = [];
  const visit = (current?: HastNode) => {
    if (!current) return;
    if (current.tagName === "img" || current.tagName === "video") {
      const src = prop(current, "src");
      if (!src) return;
      const width = Number(prop(current, "width")) || 3;
      const height = Number(prop(current, "height")) || 2;
      const size = prop(current, "dataSize");
      const feature = prop(current, "dataFeature");
      items.push({
        type: "photo",
        kind: current.tagName === "video" ? "video" : "image",
        src,
        width,
        height,
        ratio: width / height,
        caption: prop(current, "alt") || prop(current, "dataCaption"),
        size: SIZES.has(size) ? (size as Photo["size"]) : feature !== "" && feature !== "false" ? "full" : "auto",
      });
      return;
    }
    const classes = prop(current, "className").split(/\s+/);
    if (current.tagName === "div" && classes.includes("photo-section")) {
      items.push({ type: "section", title: textOf(current).trim() });
      return;
    }
    if (current.tagName === "div" && classes.includes("photo-text")) {
      items.push({ type: "text", text: textOf(current).trim() });
      return;
    }
    if (current.tagName === "div" && classes.includes("photo-break")) {
      items.push({ type: "break" });
      return;
    }
    current.children?.forEach(visit);
  };
  node?.children?.forEach(visit);
  return items;
}

function Media({ photo, sizes, onOpen }: { photo: Photo; sizes: string; onOpen: () => void }) {
  if (photo.kind === "video") {
    return <video src={photo.src} className="block h-full w-full object-cover" autoPlay muted loop playsInline />;
  }
  return (
    <button type="button" onClick={onOpen} className="group block h-full w-full cursor-zoom-in" aria-label={photo.caption || "放大照片"}>
      <Image
        src={photo.src}
        alt={photo.caption}
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        className="block h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-95"
      />
    </button>
  );
}

function Lightbox({ photos, index, onClose, onMove }: { photos: Photo[]; index: number; onClose: () => void; onMove: (step: number) => void }) {
  const photo = photos[index];
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onMove(1);
      if (event.key === "ArrowLeft") onMove(-1);
    };
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose, onMove]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col bg-[#1d1a16]/95 text-[#f4efe6]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-5 py-4 text-[11px] uppercase tracking-[0.26em] text-[#f4efe6]/60">
        <span className="tabular-nums">
          {index + 1} / {photos.length}
        </span>
        <button type="button" onClick={onClose} className="hover:text-[#f4efe6]">
          Close ✕
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-16" onClick={(event) => event.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.div
            key={photo.src}
            className="relative h-full w-full"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) onMove(1);
              if (info.offset.x > 60) onMove(-1);
            }}
          >
            <Image src={photo.src} alt={photo.caption} fill sizes="100vw" className="object-contain" />
          </motion.div>
        </AnimatePresence>
        <button type="button" onClick={() => onMove(-1)} aria-label="上一張" className="absolute left-2 top-1/2 hidden -translate-y-1/2 p-3 text-3xl text-[#f4efe6]/60 hover:text-[#f4efe6] sm:block">
          ‹
        </button>
        <button type="button" onClick={() => onMove(1)} aria-label="下一張" className="absolute right-2 top-1/2 hidden -translate-y-1/2 p-3 text-3xl text-[#f4efe6]/60 hover:text-[#f4efe6] sm:block">
          ›
        </button>
      </div>
      <p className="min-h-14 px-6 py-4 text-center font-serif text-[15px] italic text-[#f4efe6]/80">{photo.caption}</p>
    </motion.div>
  );
}

export default function PhotoEssay({ node }: { node: unknown }) {
  const items = useMemo(() => parseEssay(node as HastNode), [node]);
  const manual = prop(node as HastNode, "dataLayout") === "manual";
  const rows = useMemo(() => layoutRows(items, { manual }) as Row[], [items, manual]);
  const images = useMemo(() => items.filter((item): item is Photo => item.type === "photo" && item.kind === "image"), [items]);
  const [open, setOpen] = useState<number | null>(null);
  const move = useCallback((step: number) => setOpen((i) => (i === null ? i : (i + step + images.length) % images.length)), [images.length]);
  const close = useCallback(() => setOpen(null), []);

  let sectionNumber = 0;

  return (
    <div className="my-12">
      {rows.map((row, rowIndex) => {
        if (row.type === "text") {
          if (!row.item.text) return null;
          return (
            <p key={`text-${rowIndex}`} className="mx-auto my-12 max-w-[34rem] whitespace-pre-line font-serif text-[17px] leading-8 text-[#3f3a33] sm:my-16">
              {row.item.text}
            </p>
          );
        }
        if (row.type === "section") {
          sectionNumber += 1;
          return (
            <header key={`section-${rowIndex}`} className="mb-8 mt-24 border-t border-[#786f63]/25 pt-6 first:mt-0 sm:mb-10 sm:mt-32">
              <p className="text-[11px] font-semibold tabular-nums tracking-[0.3em] text-[#a0806a]">{String(sectionNumber).padStart(2, "0")}</p>
              <h3 className="mt-2 font-serif text-[28px] leading-tight text-[#29251f] sm:text-[34px]">{row.item.title}</h3>
            </header>
          );
        }
        const single = row.items.length === 1;
        const featured = single && row.size !== "auto";
        return (
          <div
            key={`row-${rowIndex}`}
            className={["flex items-start gap-3 sm:gap-5", single ? "justify-center" : "", featured ? "my-12 sm:my-16" : "my-5 sm:my-8"].join(" ")}
          >
            {row.items.map((photo) => (
              <figure key={photo.src} className="m-0 min-w-0" style={rowItemStyle(row, photo)}>
                <div className="overflow-hidden bg-[#ddd5c8]" style={{ aspectRatio: String(photo.ratio) }}>
                  <Media
                    photo={photo}
                    sizes={single ? "(min-width: 820px) 760px, 100vw" : `(min-width: 820px) ${Math.round(760 / row.items.length)}px, ${Math.round(100 / row.items.length)}vw`}
                    onOpen={() => setOpen(images.indexOf(photo))}
                  />
                </div>
                {photo.caption && (
                  <figcaption className={["mt-2 text-[12px] leading-5 tracking-[0.02em] text-[#817769] sm:text-[13px]", featured ? "text-center" : ""].join(" ")}>
                    {photo.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        );
      })}

      <AnimatePresence>{open !== null && images[open] && <Lightbox photos={images} index={open} onClose={close} onMove={move} />}</AnimatePresence>
    </div>
  );
}

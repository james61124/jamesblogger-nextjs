"use client";

// 照片集：照片的順序、哪張是重點、分段都寫在 markdown 裡，排版由這裡自動算。
//
// <div class="photo-essay">
// <img src="…" width="3000" height="2000" alt="圖說" data-feature="true" />
// <div class="photo-section">少女峰 · Jungfraujoch</div>
// <video src="…" width="1080" height="1920"></video>
// </div>
//
// 規則：
//   - 每一行等高、不裁切，寬度照長寬比分配
//   - 重點照片：橫的獨佔一行；直的也自己一行，但限制高度
//   - 一般照片每行 2～3 張，加起來夠寬就換行
//   - 連續兩行都是多張並排時，下一張橫的照片自己一行，讓節奏有變化
//   - 最後剩一張直的不要孤零零一行，併到上一行

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

type HastNode = {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
};

type Photo = {
  kind: "image" | "video";
  src: string;
  ratio: number;
  width: number;
  height: number;
  caption: string;
  feature: boolean;
};

type Item = { type: "photo"; photo: Photo } | { type: "section"; title: string };
type Row = { type: "row"; photos: Photo[] } | { type: "section"; title: string };

const ROW_TARGET = 2.6; // 一行的長寬比總和到這個值就換行
const MAX_PER_ROW = 3;

const prop = (node: HastNode, key: string) => {
  const value = node.properties?.[key];
  return Array.isArray(value) ? value.join(" ") : value == null ? "" : String(value);
};

const textOf = (node: HastNode): string =>
  typeof node.value === "string" ? node.value : (node.children || []).map(textOf).join("");

export function parseEssay(node: HastNode | undefined): Item[] {
  const items: Item[] = [];
  const visit = (current?: HastNode) => {
    if (!current) return;
    if (current.tagName === "img" || current.tagName === "video") {
      const src = prop(current, "src");
      if (!src) return;
      const width = Number(prop(current, "width")) || 3;
      const height = Number(prop(current, "height")) || 2;
      const feature = prop(current, "dataFeature");
      items.push({
        type: "photo",
        photo: {
          kind: current.tagName === "video" ? "video" : "image",
          src,
          width,
          height,
          ratio: width / height,
          caption: prop(current, "alt") || prop(current, "dataCaption"),
          feature: feature !== "" && feature !== "false",
        },
      });
      return;
    }
    const classes = prop(current, "className").split(/\s+/);
    if (current.tagName === "div" && classes.includes("photo-section")) {
      items.push({ type: "section", title: textOf(current).trim() });
      return;
    }
    current.children?.forEach(visit);
  };
  node?.children?.forEach(visit);
  return items;
}

function layout(items: Item[]): Row[] {
  const rows: Row[] = [];
  let current: Photo[] = [];
  let multiStreak = 0;

  const flush = () => {
    if (!current.length) return;
    rows.push({ type: "row", photos: current });
    multiStreak = current.length > 1 ? multiStreak + 1 : 0;
    current = [];
  };

  for (const item of items) {
    if (item.type === "section") {
      flush();
      multiStreak = 0;
      rows.push(item);
      continue;
    }
    const photo = item.photo;
    const wantsOwnRow = photo.feature || (multiStreak >= 2 && current.length === 0 && photo.ratio >= 1.3);
    if (wantsOwnRow) {
      flush();
      current = [photo];
      flush();
      continue;
    }
    current.push(photo);
    const total = current.reduce((sum, p) => sum + p.ratio, 0);
    if (current.length >= MAX_PER_ROW || (current.length >= 2 && total >= ROW_TARGET)) flush();
  }

  // 收尾：剩一張直的，就併到上一行（上一行還放得下的話）
  if (current.length === 1 && current[0].ratio < 1) {
    const last = rows[rows.length - 1];
    if (last?.type === "row" && last.photos.length < MAX_PER_ROW && !last.photos.some((p) => p.feature)) {
      last.photos.push(current[0]);
      current = [];
    }
  }
  flush();
  return rows;
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
  const rows = useMemo(() => layout(items), [items]);
  const images = useMemo(
    () => items.flatMap((item) => (item.type === "photo" && item.photo.kind === "image" ? [item.photo] : [])),
    [items]
  );
  const [open, setOpen] = useState<number | null>(null);
  const move = useCallback((step: number) => setOpen((i) => (i === null ? i : (i + step + images.length) % images.length)), [images.length]);
  const close = useCallback(() => setOpen(null), []);

  let sectionNumber = 0;

  return (
    <div className="my-12">
      {rows.map((row, rowIndex) => {
        if (row.type === "section") {
          sectionNumber += 1;
          return (
            <header key={`section-${rowIndex}`} className="mb-8 mt-24 border-t border-[#786f63]/25 pt-6 first:mt-0 sm:mb-10 sm:mt-32">
              <p className="text-[11px] font-semibold tabular-nums tracking-[0.3em] text-[#a0806a]">{String(sectionNumber).padStart(2, "0")}</p>
              <h3 className="mt-2 font-serif text-[28px] leading-tight text-[#29251f] sm:text-[34px]">{row.title}</h3>
            </header>
          );
        }
        const single = row.photos.length === 1;
        const portraitSingle = single && row.photos[0].ratio < 1;
        const featured = single && row.photos[0].feature;
        return (
          <div
            key={`row-${rowIndex}`}
            className={["flex items-start gap-3 sm:gap-5", portraitSingle ? "justify-center" : "", featured ? "my-12 sm:my-16" : "my-5 sm:my-8"].join(" ")}
          >
            {row.photos.map((photo) => (
              <figure
                key={photo.src}
                className="m-0 min-w-0"
                style={portraitSingle ? { width: `min(100%, calc(80vh * ${photo.ratio}))` } : { flex: `${photo.ratio} 1 0%` }}
              >
                <div className="overflow-hidden bg-[#ddd5c8]" style={{ aspectRatio: String(photo.ratio) }}>
                  <Media
                    photo={photo}
                    sizes={single ? "(min-width: 820px) 760px, 100vw" : `(min-width: 820px) ${Math.round(760 / row.photos.length)}px, ${Math.round(100 / row.photos.length)}vw`}
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

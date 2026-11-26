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
import { heroRatio, layoutRows, magazineChapters, masonryColumns, rowItemStyle } from "@/lib/photoLayout";

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
  audio: boolean;
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
        audio: prop(current, "dataAudio") === "true",
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

// 瀏覽器只允許靜音自動播放，有聲音的影片右下角多一個按鈕讓讀者自己開聲音
function SoundVideo({ src }: { src: string }) {
  const [muted, setMuted] = useState(true);
  return (
    <div className="relative h-full w-full">
      <video src={src} className="block h-full w-full object-cover" autoPlay muted={muted} loop playsInline />
      <button
        type="button"
        onClick={() => setMuted((value) => !value)}
        aria-label={muted ? "開啟聲音" : "關閉聲音"}
        className="absolute bottom-3 right-3 rounded-full bg-[#1d1a16]/60 px-3 py-1.5 text-[12px] tracking-[0.08em] text-[#f4efe6] backdrop-blur transition-colors hover:bg-[#1d1a16]/80"
      >
        {muted ? "🔇 開聲音" : "🔊 聲音開啟"}
      </button>
    </div>
  );
}

function Media({ photo, sizes, onOpen }: { photo: Photo; sizes: string; onOpen: () => void }) {
  if (photo.kind === "video") {
    if (photo.audio) return <SoundVideo src={photo.src} />;
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

// 雜誌排版（data-style="magazine"）：每段一張主圖、標題壓在主圖上，其他照片排成瀑布流
type Chapter = {
  title: string;
  hero: Photo | null;
  blocks: ({ type: "grid"; photos: Photo[] } | { type: "text"; item: { text: string } })[];
};

function MasonryPhoto({ photo, onOpen }: { photo: Photo; onOpen: (photo: Photo) => void }) {
  return (
    <figure className="group/fig m-0">
      <div className="relative overflow-hidden rounded-[3px] bg-[#ddd5c8]" style={{ aspectRatio: String(photo.ratio) }}>
        <Media photo={photo} sizes="(min-width: 820px) 260px, 50vw" onOpen={() => onOpen(photo)} />
        {photo.caption && (
          // 有滑鼠的裝置：滑上去才浮出來
          <p className="pointer-events-none absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-black/50 to-transparent px-3 pb-2 pt-8 text-[12px] text-white opacity-0 transition-opacity duration-300 group-hover/fig:opacity-100 [@media(hover:hover)]:block">
            {photo.caption}
          </p>
        )}
      </div>
      {photo.caption && (
        // 手機沒有 hover，圖說直接放在照片下面
        <figcaption className="mt-1 text-[11px] leading-4 text-[#817769] [@media(hover:hover)]:hidden">{photo.caption}</figcaption>
      )}
    </figure>
  );
}

function Masonry({ photos, onOpen }: { photos: Photo[]; onOpen: (photo: Photo) => void }) {
  if (photos.length === 1) {
    return (
      <div className="mx-auto mt-2 max-w-md sm:mt-3">
        <MasonryPhoto photo={photos[0]} onOpen={onOpen} />
      </div>
    );
  }
  // 手機兩欄、電腦三欄，兩種各排一份，用 CSS 切換
  const layouts: [number, string][] = [
    [2, "flex sm:hidden"],
    [Math.min(3, photos.length), "hidden sm:flex"],
  ];
  return (
    <>
      {layouts.map(([count, visibility]) => (
        <div key={count + visibility} className={["mt-2 items-start gap-2 sm:mt-3 sm:gap-3", visibility].join(" ")}>
          {(masonryColumns(photos, count) as Photo[][]).map((column, index) => (
            <div key={index} className="flex min-w-0 flex-1 flex-col gap-2 sm:gap-3">
              {column.map((photo) => (
                <MasonryPhoto key={photo.src} photo={photo} onOpen={onOpen} />
              ))}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

function MagazineEssay({ items, onOpen }: { items: Item[]; onOpen: (photo: Photo) => void }) {
  const chapters = useMemo(() => magazineChapters(items) as Chapter[], [items]);
  let number = 0;
  return (
    <>
      {chapters.map((chapter, index) => {
        if (chapter.title) number += 1;
        const { hero } = chapter;
        return (
          <section key={index} className={index === 0 ? "" : "mt-14 sm:mt-20"}>
            {hero ? (
              <figure className="relative m-0 overflow-hidden rounded-[3px] bg-[#ddd5c8]" style={{ aspectRatio: String(heroRatio(hero)) }}>
                <Media photo={hero} sizes="(min-width: 820px) 760px, 100vw" onOpen={() => onOpen(hero)} />
                {chapter.title && (
                  <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent px-5 pb-5 pt-20 text-white sm:px-7 sm:pb-7">
                    <p className="text-[11px] font-semibold tabular-nums tracking-[0.3em] text-white/75">{String(number).padStart(2, "0")}</p>
                    <h3 className="mt-1 font-serif text-[26px] leading-tight sm:text-[34px]">{chapter.title}</h3>
                  </figcaption>
                )}
              </figure>
            ) : (
              chapter.title && (
                <header className="mb-4">
                  <p className="text-[11px] font-semibold tabular-nums tracking-[0.3em] text-[#a0806a]">{String(number).padStart(2, "0")}</p>
                  <h3 className="mt-1 font-serif text-[26px] leading-tight text-[#29251f] sm:text-[34px]">{chapter.title}</h3>
                </header>
              )
            )}
            {chapter.blocks.map((block, blockIndex) =>
              block.type === "text" ? (
                block.item.text && (
                  <p key={blockIndex} className="mx-auto my-10 max-w-[34rem] whitespace-pre-line font-serif text-[17px] leading-8 text-[#3f3a33]">
                    {block.item.text}
                  </p>
                )
              ) : (
                <Masonry key={blockIndex} photos={block.photos} onOpen={onOpen} />
              ),
            )}
          </section>
        );
      })}
    </>
  );
}

export default function PhotoEssay({ node }: { node: unknown }) {
  const items = useMemo(() => parseEssay(node as HastNode), [node]);
  const manual = prop(node as HastNode, "dataLayout") === "manual";
  const magazine = prop(node as HastNode, "dataStyle") === "magazine";
  const rows = useMemo(() => layoutRows(items, { manual }) as Row[], [items, manual]);
  const images = useMemo(() => items.filter((item): item is Photo => item.type === "photo" && item.kind === "image"), [items]);
  const [open, setOpen] = useState<number | null>(null);
  const move = useCallback((step: number) => setOpen((i) => (i === null ? i : (i + step + images.length) % images.length)), [images.length]);
  const close = useCallback(() => setOpen(null), []);
  const lightbox = (
    <AnimatePresence>{open !== null && images[open] && <Lightbox photos={images} index={open} onClose={close} onMove={move} />}</AnimatePresence>
  );

  if (magazine) {
    return (
      <div className="my-12">
        <MagazineEssay items={items} onOpen={(photo) => setOpen(images.indexOf(photo))} />
        {lightbox}
      </div>
    );
  }

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

      {lightbox}
    </div>
  );
}

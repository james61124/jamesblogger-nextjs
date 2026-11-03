// 照片集在 markdown 裡的格式：
//
// <div class="photo-essay">
// <img src="…" width="3000" height="2000" alt="圖說" data-feature="true" />
// <div class="photo-section">少女峰</div>
// </div>
//
// 每一項一行，區塊用單獨一行的 </div> 結束，所以分段那行的 </div> 不會被誤認成結尾。

import { escapeAttr } from "./api";

const BLOCK = /<div class="photo-essay">\n([\s\S]*?)\n?<\/div>(?=\n|$)/;
const attr = (line, name) => line.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1]?.replace(/&quot;/g, '"').replace(/&amp;/g, "&") ?? "";

let nextId = 0;
const id = () => `item-${nextId++}`;

export function parseEssay(body) {
  const match = body.match(BLOCK);
  const intro = (match ? body.replace(match[0], "") : body).trim();
  const items = [];
  for (const line of (match?.[1] || "").split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("<img") || trimmed.startsWith("<video")) {
      items.push({
        id: id(),
        type: "photo",
        kind: trimmed.startsWith("<video") ? "video" : "image",
        src: attr(trimmed, "src"),
        width: Number(attr(trimmed, "width")) || 0,
        height: Number(attr(trimmed, "height")) || 0,
        caption: attr(trimmed, "alt"),
        feature: attr(trimmed, "data-feature") === "true",
      });
    } else if (trimmed.startsWith('<div class="photo-section">')) {
      items.push({ id: id(), type: "section", title: trimmed.replace(/<[^>]+>/g, "").trim() });
    }
  }
  return { intro, items };
}

export function photoLine({ kind = "image", src, width, height, caption = "", feature = false }) {
  const size = width && height ? ` width="${width}" height="${height}"` : "";
  if (kind === "video") return `<video src="${escapeAttr(src)}"${size}></video>`;
  return `<img src="${escapeAttr(src)}"${size} alt="${escapeAttr(caption)}"${feature ? ' data-feature="true"' : ""} />`;
}

export function essayBlock(items) {
  const lines = items.map((item) =>
    item.type === "section" ? `<div class="photo-section">${escapeAttr(item.title).replace(/&quot;/g, '"')}</div>` : photoLine(item)
  );
  return `<div class="photo-essay">\n${lines.join("\n")}\n</div>`;
}

export function serializeEssay(intro, items) {
  return [intro.trim(), items.length ? essayBlock(items) : ""].filter(Boolean).join("\n\n");
}

export const newPhotoItem = (upload) => ({
  id: id(),
  type: "photo",
  kind: upload.kind,
  src: upload.url,
  width: upload.width,
  height: upload.height,
  caption: "",
  feature: false,
});

export const newSectionItem = () => ({ id: id(), type: "section", title: "" });

// 文章裡所有的照片網址（給封面選擇用）
export function imagesIn(body) {
  const urls = [
    ...[...body.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1]),
    ...[...body.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)].map((m) => m[1]),
  ];
  return [...new Set(urls)];
}

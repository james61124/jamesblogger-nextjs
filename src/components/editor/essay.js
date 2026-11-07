// 照片集在 markdown 裡的格式：
//
// <div class="photo-essay" data-layout="manual">
// <img src="…" width="3000" height="2000" alt="圖說" data-size="full" />
// <div class="photo-break"></div>
// <div class="photo-section">少女峰</div>
// <div class="photo-text">那天早上下著雪…<br>第二行</div>
// </div>
//
// 每一項一行，區塊用單獨一行的 </div> 結束；分段和換排那行的 </div> 前面有內容，所以不會被誤認成結尾。

import { escapeAttr } from "./api";

const BLOCK = /<div class="photo-essay"([^>]*)>\n([\s\S]*?)\n<\/div>(?=\n|$)/;
const attr = (line, name) => line.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1]?.replace(/&quot;/g, '"').replace(/&amp;/g, "&") ?? "";

// 文字段落存成一行：換行寫成 <br>，< > & 要跳脫
const encodeText = (text) => text.trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
const decodeText = (html) => html.replace(/<br\s*\/?>/g, "\n").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

let nextId = 0;
const id = () => `item-${nextId++}`;

const SIZES = new Set(["medium", "full"]);

export function parseEssay(body) {
  const match = body.match(BLOCK);
  const intro = (match ? body.replace(match[0], "") : body).trim();
  const items = [];
  for (const line of (match?.[2] || "").split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("<img") || trimmed.startsWith("<video")) {
      const width = Number(attr(trimmed, "width")) || 0;
      const height = Number(attr(trimmed, "height")) || 0;
      const size = attr(trimmed, "data-size");
      items.push({
        id: id(),
        type: "photo",
        kind: trimmed.startsWith("<video") ? "video" : "image",
        src: attr(trimmed, "src"),
        width,
        height,
        ratio: width && height ? width / height : 1.5,
        caption: attr(trimmed, "alt"),
        size: SIZES.has(size) ? size : attr(trimmed, "data-feature") === "true" ? "full" : "auto",
      });
    } else if (trimmed.startsWith('<div class="photo-section">')) {
      items.push({ id: id(), type: "section", title: trimmed.replace(/<[^>]+>/g, "").trim() });
    } else if (trimmed.startsWith('<div class="photo-text">')) {
      items.push({ id: id(), type: "text", text: decodeText(trimmed.replace(/^<div class="photo-text">/, "").replace(/<\/div>$/, "")) });
    } else if (trimmed.startsWith('<div class="photo-break">')) {
      items.push({ id: id(), type: "break" });
    }
  }
  return { intro, items, manual: /data-layout="manual"/.test(match?.[1] || "") };
}

export function photoLine({ kind = "image", src, width, height, caption = "", size = "auto" }) {
  const dims = width && height ? ` width="${width}" height="${height}"` : "";
  const sizeAttr = SIZES.has(size) ? ` data-size="${size}"` : "";
  if (kind === "video") return `<video src="${escapeAttr(src)}"${dims}${sizeAttr}></video>`;
  return `<img src="${escapeAttr(src)}"${dims} alt="${escapeAttr(caption)}"${sizeAttr} />`;
}

export function essayBlock(items, manual = false) {
  const lines = items.map((item) => {
    if (item.type === "section") return `<div class="photo-section">${escapeAttr(item.title).replace(/&quot;/g, '"')}</div>`;
    if (item.type === "break") return '<div class="photo-break"></div>';
    if (item.type === "text") return `<div class="photo-text">${encodeText(item.text)}</div>`;
    return photoLine(item);
  });
  return `<div class="photo-essay"${manual ? ' data-layout="manual"' : ""}>\n${lines.join("\n")}\n</div>`;
}

export function serializeEssay(intro, items, manual = false) {
  return [intro.trim(), items.length ? essayBlock(items, manual) : ""].filter(Boolean).join("\n\n");
}

export const newPhotoItem = (upload) => ({
  id: id(),
  type: "photo",
  kind: upload.kind,
  src: upload.url,
  width: upload.width,
  height: upload.height,
  ratio: upload.width && upload.height ? upload.width / upload.height : 1.5,
  caption: "",
  size: "auto",
});

export const newSectionItem = (title = "") => ({ id: id(), type: "section", title });
export const newTextItem = () => ({ id: id(), type: "text", text: "" });
export const newBreakItem = () => ({ id: id(), type: "break" });

// 文章裡所有的照片網址（給封面選擇用）
export function imagesIn(body) {
  const urls = [
    ...[...body.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1]),
    ...[...body.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)].map((m) => m[1]),
  ];
  return [...new Set(urls)];
}

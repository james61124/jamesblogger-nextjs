// 文章卡片的封面版型。frontmatter 寫法：
//
// coverLayout: feature-left
// coverImages: 第一格網址,第二格網址,第三格網址
//
// 拼貼和文章頁最上面的大圖（image）分開設定；沒寫 coverImages 時第一格用 image。
// 沒寫 coverLayout 時：照片集用 feature-left，一般文章用 single。

export const COVER_LAYOUTS = {
  single: { label: "單張", columns: "1fr", rows: "1fr", areas: ['"a"'] },
  "feature-left": { label: "左大", columns: "2fr 1fr", rows: "1fr 1fr", areas: ['"a b"', '"a c"'] },
  "feature-right": { label: "右大", columns: "1fr 2fr", rows: "1fr 1fr", areas: ['"b a"', '"c a"'] },
  "feature-top": { label: "上大", columns: "1fr 1fr", rows: "2fr 1fr", areas: ['"a a"', '"b c"'] },
  duo: { label: "兩張", columns: "1fr 1fr", rows: "1fr", areas: ['"a b"'] },
  trio: { label: "三直", columns: "1fr 1fr 1fr", rows: "1fr", areas: ['"a b c"'] },
};

export const SLOT_NAMES = ["a", "b", "c"];

export const slotCount = (layout) => new Set(COVER_LAYOUTS[layout].areas.join(" ").match(/[a-c]/g)).size;

const splitList = (value) => (value ? String(value).split(",").map((item) => item.trim()).filter(Boolean) : []);

// 算出卡片實際要用的版型和每一格的照片；沒指定的格子用照片集裡還沒用到的照片補上
export function resolveCover({ coverLayout, coverImages, image, photos = [], type }) {
  const fallback = type === "photos" && photos.length >= 3 ? "feature-left" : "single";
  let layout = COVER_LAYOUTS[coverLayout] ? coverLayout : fallback;
  const listed = splitList(coverImages);
  const chosen = listed.length ? listed : [image || photos[0]].filter(Boolean);
  const spare = photos.filter((src) => !chosen.includes(src));
  const images = [];
  for (let index = 0; index < slotCount(layout); index += 1) {
    const src = chosen[index] || spare.shift();
    if (src) images.push(src);
  }
  if (images.length < slotCount(layout)) layout = "single";
  return { layout, images: images.slice(0, slotCount(layout)) };
}

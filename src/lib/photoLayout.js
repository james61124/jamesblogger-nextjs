// 照片集的排版演算法，網站（PhotoEssay）和編輯器（PhotoBoard）共用，兩邊看到的排法才會一樣。
//
// items 是照片集裡依序的項目：
//   { type: "photo", ratio, size }   size: "auto" | "medium"（自己一排、窄一點）| "full"（自己一排、滿版）
//   { type: "section", title }
//   { type: "text", text }            照片之間的一段文字
//   { type: "break" }                手動換排
//
// 自動排版（manual = false）：
//   - 每一排等高、不裁切，寬度照長寬比分配
//   - 一般照片每排 2～3 張，加起來夠寬就換排
//   - 連續兩排都是多張並排時，下一張橫的照片自己一排，讓節奏有變化
//   - 最後剩一張直的不要孤零零一排，併到上一排
// 手動排版（manual = true）：只在 break、分段和 medium / full 照片處換排，其他完全照你排的

export const ROW_TARGET = 2.6; // 一排的長寬比總和到這個值就換排
export const MAX_PER_ROW = 3;

const ownRow = (item) => item.size === "full" || item.size === "medium";

// 回傳 rows：{ type: "row", items, size }、{ type: "section", item } 或 { type: "text", item }，items 是原本的項目物件
export function layoutRows(items, { manual = false } = {}) {
  const rows = [];
  let current = [];
  let multiStreak = 0;

  const flush = () => {
    if (!current.length) return;
    const single = current.length === 1 ? current[0] : null;
    rows.push({ type: "row", items: current, size: single && ownRow(single) ? single.size : "auto" });
    multiStreak = current.length > 1 ? multiStreak + 1 : 0;
    current = [];
  };

  for (const item of items) {
    if (item.type === "section" || item.type === "text") {
      flush();
      multiStreak = 0;
      rows.push({ type: item.type, item });
      continue;
    }
    if (item.type === "break") {
      flush();
      continue;
    }
    const wantsOwnRow = ownRow(item) || (!manual && multiStreak >= 2 && current.length === 0 && item.ratio >= 1.3);
    if (wantsOwnRow) {
      flush();
      current = [item];
      flush();
      continue;
    }
    current.push(item);
    if (manual) continue;
    const total = current.reduce((sum, photo) => sum + photo.ratio, 0);
    if (current.length >= MAX_PER_ROW || (current.length >= 2 && total >= ROW_TARGET)) flush();
  }

  if (!manual && current.length === 1 && current[0].ratio < 1) {
    const last = rows[rows.length - 1];
    if (last?.type === "row" && last.items.length < MAX_PER_ROW && last.size === "auto") {
      last.items.push(current[0]);
      current = [];
    }
  }
  flush();
  return rows;
}

// 一排照片的樣式：單張直的限制高度、medium 縮窄置中，其他照長寬比分配寬度
export function rowItemStyle(row, item) {
  const single = row.items.length === 1;
  if (single && row.size === "medium") return { width: `min(100%, 66%, calc(70vh * ${item.ratio}))` };
  if (single && item.ratio < 1) return { width: `min(100%, calc(80vh * ${item.ratio}))` };
  return { flex: `${item.ratio} 1 0%` };
}

// 編輯器共用的小元件

export const inputClass =
  "w-full border border-[#786f63]/25 bg-white/70 px-3 py-2 text-[15px] text-[#29251f] outline-none transition-colors focus:border-[#456b9b] focus:bg-white";

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#857968]">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1 block text-xs text-[#9a8f80]">{hint}</span>}
    </label>
  );
}

export function PageShell({ children, wide = false }) {
  return (
    <main className="min-h-screen bg-[#f4efe6] px-5 pb-24 pt-28 sm:px-8">
      <div className={wide ? "mx-auto max-w-[1600px]" : "mx-auto max-w-4xl"}>{children}</div>
    </main>
  );
}

// 上傳進度：一行一個檔案
export function UploadProgress({ items }) {
  if (!items.length) return null;
  return (
    <ul className="space-y-1 text-xs text-[#6b645a]">
      {items.map((item) => (
        <li key={`${item.index}-${item.name}`} className="flex gap-2">
          <span className={item.status === "error" ? "text-red-700" : item.status === "done" ? "text-[#5b7f5a]" : "text-[#c4896b]"}>
            {item.status === "uploading" ? "轉檔上傳中…" : item.status === "done" ? "✓" : "✕"}
          </span>
          <span className="truncate">{item.name}</span>
          {item.error && <span className="text-red-700">{item.error}</span>}
        </li>
      ))}
    </ul>
  );
}

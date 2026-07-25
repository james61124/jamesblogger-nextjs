import type { ReactNode } from "react";
import type { EditorialTone } from "./types";

type CalloutProps = {
  children: ReactNode;
  title?: string;
  tone?: EditorialTone;
};

const toneStyles: Record<EditorialTone, string> = {
  blue: "border-[#5579a6]/25 bg-[#e8edf3]/55",
  green: "border-[#3f8a6b]/25 bg-[#e7efe9]/60",
  neutral: "border-[#8a7e70]/20 bg-[#eee5d8]/55",
};

export default function Callout({
  children,
  title,
  tone = "neutral",
}: CalloutProps) {
  return (
    <aside
      className={`my-10 rounded-xl border px-6 py-6 font-serif text-[1rem] leading-8 text-[#554e46] sm:px-8 ${toneStyles[tone]}`}
    >
      {title && (
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#72695f]">
          {title}
        </p>
      )}
      {children}
    </aside>
  );
}

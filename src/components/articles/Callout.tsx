import type { ReactNode } from "react";
import type { EditorialTone } from "./types";

type CalloutProps = {
  children: ReactNode;
  title?: string;
  tone?: EditorialTone;
};

const toneStyles: Record<EditorialTone, string> = {
  blue: "bg-[#eef3f7]",
  green: "bg-[#edf4ef]",
  neutral: "bg-[#f3eee6]",
};

export default function Callout({
  children,
  title,
  tone = "neutral",
}: CalloutProps) {
  return (
    <aside
      className="
        my-8
        flex
        items-center
        bg-[#ebe3d6]
        px-8
        py-5
        text-[#554e46]
        [&_p]:text-[0.95rem]
        [&_p]:leading-7
      "
    >
      <div className="w-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </aside>
  );
}

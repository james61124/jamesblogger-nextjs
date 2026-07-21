import type { ReactNode } from "react";

type SideNoteProps = {
  children: ReactNode;
  label?: string;
};

export default function SideNote({ children, label = "Note" }: SideNoteProps) {
  return (
    <aside className="my-10 border-l border-[#7d7366]/30 pl-5 font-serif text-sm italic leading-7 text-[#746c61] lg:relative lg:left-[calc(100%+3rem)] lg:-my-2 lg:w-52">
      <p className="mb-2 text-[10px] font-semibold not-italic uppercase tracking-[0.2em] text-[#958a7b]">
        {label}
      </p>
      {children}
    </aside>
  );
}

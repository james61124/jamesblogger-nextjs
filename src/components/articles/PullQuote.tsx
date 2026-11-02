import type { ReactNode } from "react";

type PullQuoteProps = {
  children: ReactNode;
};

export default function PullQuote({ children }: PullQuoteProps) {
  return (
    <aside className="my-24 sm:my-32">
      <span
        aria-hidden
        className="block text-center font-serif text-6xl leading-none text-[#8a7e70]/20 sm:text-7xl"
      >
        “
      </span>

      <div className="-mt-3 text-center font-serif text-[2.1rem] leading-[1.55] tracking-[-0.035em] text-[#332f2a] sm:text-[2.8rem] lg:text-[3.25rem]">
        {children}
      </div>
    </aside>
  );
}

import type { ReactNode } from "react";

type QuoteProps = {
  children: ReactNode;
  author?: string;
};

export default function Quote({ children, author }: QuoteProps) {
  return (
    <figure className="mx-auto my-20 max-w-3xl sm:my-24">
      <div className="mx-auto h-px w-16 bg-[#8a7e70]/30" />

      <blockquote className="mx-auto mt-8 text-center font-serif text-[1.75rem] font-normal leading-[1.7] tracking-[-0.02em] text-[#403a34] sm:text-[2.05rem]">
        {children}
      </blockquote>

      {author && (
        <figcaption className="mt-7 text-center font-serif text-sm italic text-[#7a7166]">
          — {author}
        </figcaption>
      )}

      <div className="mx-auto mt-8 h-px w-16 bg-[#8a7e70]/30" />
    </figure>
  );
}

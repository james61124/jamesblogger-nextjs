import Image from "next/image";
import type { ArticleImage } from "./types";

type ImageCompareProps = {
  before: ArticleImage;
  after: ArticleImage;
};

export default function ImageCompare({ before, after }: ImageCompareProps) {
  return (
    <figure className="relative left-1/2 my-14 w-[min(94vw,1100px)] -translate-x-1/2">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[["Before", before], ["After", after]].map(([label, image]) => {
          const item = image as ArticleImage;
          return (
            <div key={label as string}>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#867b6d]">
                {label as string}
              </p>
              <Image
                src={item.src}
                alt={item.alt || (label as string)}
                width={1400}
                height={1000}
                sizes="(max-width: 640px) 94vw, 47vw"
                className="h-auto w-full rounded-xl shadow-[0_12px_28px_rgba(60,48,31,0.09)]"
              />
            </div>
          );
        })}
      </div>
    </figure>
  );
}

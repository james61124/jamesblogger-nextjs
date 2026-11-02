"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import type { ArticleImage } from "./types";

type TwoImagesProps = {
  images: ArticleImage[];
  variant?: "default" | "portrait" | "mixed";
};

export default function TwoImages({ images, variant = "default" }: TwoImagesProps) {
  const visible = images.slice(0, 2);
  const [ratios, setRatios] = useState<number[]>([1, 1]);

  // 直橫混搭：依照片實際比例分配寬度，讓兩張等高、不裁切
  if (variant === "mixed") {
    return (
      <figure className="my-16">
        <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
          {visible.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              style={{ "--ratio": ratios[index] } as CSSProperties}
              className="min-w-0 sm:[flex:var(--ratio)_1_0%]"
            >
              <Image
                src={image.src}
                alt={image.alt || ""}
                width={1400}
                height={1000}
                sizes="(max-width: 640px) 94vw, 640px"
                onLoad={(event) => {
                  const { naturalWidth, naturalHeight } = event.currentTarget;
                  if (!naturalWidth || !naturalHeight) return;
                  setRatios((current) => {
                    const next = [...current];
                    next[index] = naturalWidth / naturalHeight;
                    return next;
                  });
                }}
                className="h-auto w-full rounded-xl shadow-[0_12px_28px_rgba(60,48,31,0.09)]"
              />
              {image.caption && (
                <p className="mt-3 text-center font-serif text-xs italic text-[#7d7468]">
                  {image.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </figure>
    );
  }

  // 直式照片：保留原始比例
  if (variant === "portrait") {
    return (
      <figure className="my-16">
        <div className="grid grid-cols-2 items-start gap-3 sm:gap-6">
          {visible.map((image, index) => (
            <div key={`${image.src}-${index}`}>
              <Image
                src={image.src}
                alt={image.alt || ""}
                width={1000}
                height={1333}
                sizes="(max-width: 640px) 47vw, 430px"
                className="h-auto w-full rounded-xl shadow-[0_12px_28px_rgba(60,48,31,0.09)]"
              />
              {image.caption && (
                <p className="mt-3 text-center font-serif text-xs italic text-[#7d7468]">
                  {image.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </figure>
    );
  }

  return (
    <figure className="my-14">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {visible.map((image, index) => (
          <div key={`${image.src}-${index}`}>
            <Image
              src={image.src}
              alt={image.alt || ""}
              width={1400}
              height={1000}
              sizes="(max-width: 640px) 94vw, 47vw"
              className="h-auto w-full rounded-xl shadow-[0_12px_28px_rgba(60,48,31,0.09)]"
            />
            {image.caption && (
              <p className="mt-2 text-center font-serif text-xs italic text-[#7d7468]">
                {image.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </figure>
  );
}

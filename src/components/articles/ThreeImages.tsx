import Image from "next/image";
import type { ArticleImage } from "./types";

type ThreeImagesProps = {
  images: ArticleImage[];
};

export default function ThreeImages({ images }: ThreeImagesProps) {
  const visible = images.slice(0, 3);

  return (
    <figure className="relative left-1/2 my-14 w-[min(94vw,1180px)] -translate-x-1/2">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {visible.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            className={index === 0 ? "sm:col-span-2" : ""}
          >
            <Image
              src={image.src}
              alt={image.alt || ""}
              width={1600}
              height={1100}
              sizes={
                index === 0
                  ? "(max-width: 640px) 94vw, 94vw"
                  : "(max-width: 640px) 94vw, 47vw"
              }
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

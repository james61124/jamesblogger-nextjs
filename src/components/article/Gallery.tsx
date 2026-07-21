import Image from "next/image";
import type { ArticleImage } from "./types";

type GalleryProps = {
  images: ArticleImage[];
};

export default function Gallery({ images }: GalleryProps) {
  return (
    <figure className="relative left-1/2 my-14 w-[min(94vw,1180px)] -translate-x-1/2">
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {images.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            className="mb-4 break-inside-avoid"
          >
            <Image
              src={image.src}
              alt={image.alt || ""}
              width={1400}
              height={1000}
              sizes="(max-width: 640px) 94vw, (max-width: 1024px) 47vw, 31vw"
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

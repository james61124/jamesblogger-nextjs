import Image from "next/image";
import type { ArticleImage } from "./types";

type TwoImagesProps = {
  images: ArticleImage[];
};

export default function TwoImages({ images }: TwoImagesProps) {
  const visible = images.slice(0, 2);

  return (
    <figure className="relative left-1/2 my-14 w-[min(94vw,1100px)] -translate-x-1/2">
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

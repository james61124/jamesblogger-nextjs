import Image from "next/image";
import type { ArticleImage } from "./types";

type EditorialImageProps = ArticleImage & {
  priority?: boolean;
  fullBleed?: boolean;
};

export default function EditorialImage({
  src,
  alt = "",
  caption,
  priority = false,
  fullBleed = false,
}: EditorialImageProps) {
  const isExternal = src.startsWith("http://") || src.startsWith("https://");
  return (
    <figure
      className={
        fullBleed
          ? "relative left-1/2 my-14 w-[min(94vw,1280px)] -translate-x-1/2"
          : "my-12"
      }
    >
      
      {isExternal ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          className="h-auto w-full rounded-xl shadow-[0_16px_38px_rgba(60,48,31,0.10)]"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={1800}
          height={1200}
          priority={priority}
          sizes={fullBleed ? "94vw" : "(max-width: 900px) 100vw, 900px"}
          className="h-auto w-full rounded-xl shadow-[0_16px_38px_rgba(60,48,31,0.10)]"
        />
      )}

      {(caption || alt) && (
        <figcaption className="mt-3 text-center font-serif text-sm italic leading-6 text-[#7d7468]">
          {caption || alt}
        </figcaption>
      )}
    </figure>
  );
}

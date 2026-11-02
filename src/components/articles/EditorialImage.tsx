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
  // R2 上的圖片在 next.config 的 remotePatterns 裡，可以照常經過 next/image 優化
  const isR2 = src.startsWith("https://pub-503a3f28f35c423785d131f4a589a3f0.r2.dev/");
  const isExternal = !isR2 && (src.startsWith("http://") || src.startsWith("https://"));
  return (
    <figure
      className={
        fullBleed
          ? "my-14"
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

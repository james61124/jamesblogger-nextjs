import Image from "next/image";

type HeroImageProps = {
  src: string;
  alt?: string;
  caption?: string;
};

export default function HeroImage({ src, alt = "", caption }: HeroImageProps) {
  return (
    <figure className="relative left-1/2 my-16 w-[min(94vw,1280px)] -translate-x-1/2">
      <Image
        src={src}
        alt={alt}
        width={2200}
        height={1400}
        sizes="94vw"
        className="h-auto w-full rounded-xl shadow-[0_20px_54px_rgba(60,48,31,0.12)]"
      />
      {(caption || alt) && (
        <figcaption className="mt-4 text-center font-serif text-sm italic text-[#7b7267]">
          {caption || alt}
        </figcaption>
      )}
    </figure>
  );
}

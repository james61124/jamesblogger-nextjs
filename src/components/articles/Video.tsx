type VideoProps = {
  src: string;
  caption?: string;
  poster?: string;
};

export default function Video({ src, caption, poster }: VideoProps) {
  return (
    <figure className="relative left-1/2 my-14 w-[min(94vw,1000px)] -translate-x-1/2">
      <video
        controls
        playsInline
        preload="metadata"
        poster={poster}
        className="h-auto w-full rounded-xl bg-black shadow-[0_16px_38px_rgba(60,48,31,0.12)]"
      >
        <source src={src} />
        Your browser does not support the video tag.
      </video>

      {caption && (
        <figcaption className="mt-3 text-center font-serif text-sm italic text-[#7d7468]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

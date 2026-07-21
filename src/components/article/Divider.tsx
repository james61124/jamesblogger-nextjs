type DividerProps = {
  variant?: "dots" | "line" | "star";
};

export default function Divider({ variant = "dots" }: DividerProps) {
  if (variant === "line") {
    return <div className="mx-auto my-16 h-px w-24 bg-[#7d7366]/25" />;
  }

  if (variant === "star") {
    return (
      <div className="my-16 flex items-center justify-center gap-4 text-[#8a7e70]/45">
        <span className="h-px w-16 bg-current" />
        <span aria-hidden className="font-serif text-sm">✦</span>
        <span className="h-px w-16 bg-current" />
      </div>
    );
  }

  return (
    <div className="my-16 flex justify-center gap-3">
      <span className="h-1 w-1 rounded-full bg-[#8a7e70]/45" />
      <span className="h-1 w-1 rounded-full bg-[#8a7e70]/45" />
      <span className="h-1 w-1 rounded-full bg-[#8a7e70]/45" />
    </div>
  );
}

export default function PaperTexture() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 opacity-25"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(70,61,49,0.12) 0.65px, transparent 0)",
        backgroundSize: "6px 6px",
      }}
    />
  );
}

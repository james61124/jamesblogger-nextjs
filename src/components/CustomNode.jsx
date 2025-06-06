// CustomNode.tsx
export function CustomNode({ data }) {
  return (
    <div
      className={`rounded-lg border px-4 py-2 text-sm shadow ${
        data.type === 'main'
          ? 'bg-yellow-300 font-bold'
          : data.type === 'sub'
          ? 'bg-yellow-100'
          : 'bg-white'
      }`}
    >
      {data.label}
    </div>
  );
}

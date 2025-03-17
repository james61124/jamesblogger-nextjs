"use client";

export function Button({ children, asChild = false, ...props }) {
  const Component = asChild ? "span" : "button";

  return (
    <Component
      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all"
      {...props}
    >
      {children}
    </Component>
  );
}
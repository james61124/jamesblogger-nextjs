// src/components/ui/button.jsx
export function Button({ children, asChild = false, ...props }) {
    const Component = asChild ? "span" : "button";
    return (
      <Component
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        {...props}
      >
        {children}
      </Component>
    );
  }
  
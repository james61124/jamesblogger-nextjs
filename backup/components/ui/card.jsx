// src/components/ui/card.jsx
export function Card({ children, className = "" }) {
    return (
      <div className={`bg-white shadow-md rounded-2xl ${className}`}>
        {children}
      </div>
    );
  }
  
  export function CardContent({ children, className = "" }) {
    return <div className={`p-6 ${className}`}>{children}</div>;
  }
  
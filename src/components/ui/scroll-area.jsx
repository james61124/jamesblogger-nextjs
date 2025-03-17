"use client";

import { cn } from "@/lib/utils";

export function ScrollArea({ children, className = "" }) {
  return (
    <div className={cn("overflow-y-auto", className)}>
      {children}
    </div>
  );
}
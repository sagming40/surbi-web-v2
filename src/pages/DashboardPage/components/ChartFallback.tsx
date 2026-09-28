import type { ReactNode } from "react";

interface ChartFallbackProps {
  message: string;
  children: ReactNode;
}

export function ChartFallback({ message, children }: ChartFallbackProps) {
  return (
    <div className="relative">
      <div className="blur-sm opacity-60 pointer-events-none select-none" aria-hidden>
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-title font-bold text-text">{message}</p>
      </div>
    </div>
  )
}


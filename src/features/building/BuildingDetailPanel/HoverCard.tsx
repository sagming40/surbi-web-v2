import type { ReactNode } from 'react';
import { useState } from 'react';

interface HoverCardProps {
  card: ReactNode;
  children: ReactNode;
  className?: string;
}

export function HoverCard({ card, children, className = '' }: HoverCardProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  return (
    <div
      className={className}
      onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
      onMouseLeave={() => setPos(null)}
      >
        {children}
      
        {pos && (
          <div
            className="pointer-events-none fixed z-50 w-[260px]
              rounded-lg border border-border bg-white p-3 shadow-lg"
            style={{ left: pos.x + 14, top: pos.y + 14 }}
          >
            {card}
          </div>
        )}
      </div>
  );
}

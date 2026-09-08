import type { HTMLAttributes, ReactNode } from 'react';

interface SurbiCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /* 패널처럼 그림자 강조가 필요할 때 */
  elevated?: boolean;
}

export function SurbiCard({ children, elevated = false, className = '', ...rest }: SurbiCardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-border ${elevated ? 'shadow-lg' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

import type { ReactNode } from 'react';

type BadgeVariant = 'info' | 'warning' | 'success' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  info: 'bg-blue/10 text-blue',
  warning: 'bg-warn-bg text-warn',
  success: 'bg-green/10 text-green',
  neutral: 'bg-surface text-sub',
};

export function Badge({ variant = 'neutral', children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-label font-bold ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}

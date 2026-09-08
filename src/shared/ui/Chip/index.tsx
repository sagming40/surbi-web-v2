import type { ReactNode } from 'react';

type ChipVariant = 'default' | 'active' | 'warning';

interface ChipProps {
  variant?: ChipVariant;
  children: ReactNode;
  /** 있으면 ✕ 버튼이 나타나고, 누르면 이 함수가 실행된다 */
  onRemove?: () => void;
}

const variantClasses: Record<ChipVariant, string> = {
  default: 'bg-white border border-border text-text',
  active: 'bg-blue border border-blue text-white',
  warning: 'bg-warn-bg border border-warn-line text-warn',
};

export function Chip({ variant = 'default', children, onRemove }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-caption font-medium ${variantClasses[variant]}`}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="leading-none opacity-70 hover:opacity-100"
          aria-label="제거"
        >
          ✕
        </button>
      )}
    </span>
  );
}

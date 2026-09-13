import type { CSSProperties, ReactNode } from 'react';

interface TooltipProps {
  /** 마우스를 올렸을 때 보여줄 문구 */
  label: string;
  /** 감쌀 내용. 없으면 이 요소 자체가 대상이 된다 (막대처럼) */
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Tooltip({ label, children, className = '', style }: TooltipProps) {
  return (
    <div className={`relative group ${className}`} style={style}>
      {children}

      {/* pointer-events-none: 말풍선이 마우스를 가로채 깜빡이는 것을 막는다 */}
      <div
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10
                   hidden group-hover:block whitespace-nowrap
                   rounded-lg bg-navy px-2.5 py-1.5 text-caption text-white shadow-lg"
      >
        {label}
      </div>
    </div>
  );
}

import type { ReactNode } from 'react';
import { SurbiCard } from '@/shared/ui/SurbiCard';

/**
 * 지도 우측 플로팅 메뉴의 도구 3종.
 *
 * 한 번에 하나만 열린다. 패널 두 개가 옆으로 나란히 펼쳐지면 지도를 너무 많이 가린다.
 */
export type MapTool = 'category' | 'trdar' | 'draw';

interface MapSideMenuProps {
  /** 지금 열려 있는 도구. null 이면 아무것도 안 열림 */
  active: MapTool | null;
  /** 같은 도구를 다시 누르면 닫는다 */
  onSelect: (tool: MapTool) => void;
  /** 선택된 업종 이름. 있으면 "업종 필터" 대신 이걸 보여준다 */
  categoryLabel?: string;
}

/** 목록·라벨·아이콘을 한곳에 묶어 둔다. 항목이 늘면 이 배열만 고치면 된다 */
const TOOLS: { key: MapTool; label: string; icon: ReactNode }[] = [
  {
    key: 'category',
    label: '업종 필터',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="2" y="2.5" width="12" height="11" rx="1.5" />
        <path d="M6 2.5v11" />
      </svg>
    ),
  },
  {
    key: 'trdar',
    label: '상권영역',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M8 2.2 13.8 8 8 13.8 2.2 8z" />
        <circle cx="8" cy="8" r="2" />
      </svg>
    ),
  },
  {
    key: 'draw',
    label: '범위 그리기',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M11.2 2.3 13.7 4.8 5.6 12.9l-3.2.7.7-3.2z" />
        <path d="M9.9 3.6l2.5 2.5" />
      </svg>
    ),
  },
];

export function MapSideMenu({ active, onSelect, categoryLabel }: MapSideMenuProps) {
  return (
    <SurbiCard elevated className="pointer-events-auto w-[150px] py-2">
      {TOOLS.map((tool) => {
        const on = active === tool.key;
        // 업종을 고르면 메뉴에 그 이름이 보이도록 라벨을 바꾼다
        const label = tool.key === 'category' ? (categoryLabel ?? tool.label) : tool.label;
        return (
          <button
            key={tool.key}
            type="button"
            aria-pressed={on}
            onClick={() => onSelect(tool.key)}
            className={`flex w-full items-center gap-2.5 px-4 py-3 text-left text-body transition-colors ${
              on ? 'bg-blue/10 font-bold text-blue' : 'text-text hover:bg-surface'
            }`}
          >
            <span className="h-4 w-4 shrink-0">{tool.icon}</span>
            <span className="truncate">{label}</span>
          </button>
        );
      })}
    </SurbiCard>
  );
}

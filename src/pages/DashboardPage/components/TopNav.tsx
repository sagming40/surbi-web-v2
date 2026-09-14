import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

interface TopNavProps {
  /** 셀렉터에 표시할 분기 목록 */
  quarters?: string[];
  currentQuarter?: string;
  onQuarterChange?: (quarter: string) => void;
}

const TABS = [
  { label: '대시보드', to: '/dashboard' },
  { label: '지도 탐색', to: '/map' },
  { label: '창업 계산', to: '/wizard' },
  { label: '지원 정책', to: '/policy' },
];

/** "2026Q1" → "2026년 1분기" */
const formatQuarter = (q: string) => `${q.slice(0, 4)}년 ${q.slice(5)}분기`;

/**
 * 전 페이지 공통 헤더. 목업 실측: 높이 64, 좌우 여백 28, 아바타 30x30.
 *
 * 지도 탐색 · 창업 계산 · 지원 정책 탭은 라우트 이동만 연결한다.
 * 해당 페이지는 각 담당자 작업 범위.
 */
export function TopNav({ quarters = [], currentQuarter, onQuarterChange }: TopNavProps) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // 바깥을 누르면 닫는다. 열려 있을 때만 리스너를 걸고, 닫히면 떼어낸다
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    }

    // click이 아니라 mousedown인 이유: click으로 하면 버튼을 누른 그 클릭이
    // "바깥 클릭"으로도 잡혀서 열자마자 닫힌다
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <header className="sticky top-0 z-30 h-16 px-7 flex items-center gap-7 bg-white border-b border-border">
      {/* 로고 */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-blue" />
        <span className="text-title font-bold text-navy">Surbi</span>
      </div>

      {/* 탭 — 라우트 이동만 */}
      <nav className="flex items-center gap-6">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              isActive ? 'text-body font-bold text-navy' : 'text-body text-sub'
            }
          >
            {t.label}
          </NavLink>
        ))}
      </nav>

      {/* 우측 밀어내기 */}
      <div className="flex-1" />

      {/* 분기 셀렉터 */}
      <div ref={boxRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="h-[31px] px-3 flex items-center gap-2 rounded-lg border border-border text-caption text-text hover:bg-surface"
        >
          {currentQuarter ? formatQuarter(currentQuarter) : '분기 선택'}
          <span className={`text-label text-sub transition-transform ${open ? 'rotate-180' : ''}`}>
            ▾
          </span>
        </button>

        {open && (
          <ul className="absolute right-0 top-full mt-1 w-36 py-1 z-20 rounded-lg border border-border bg-white shadow-lg">
            {quarters.map((q) => (
              <li key={q}>
                <button
                  type="button"
                  onClick={() => {
                    onQuarterChange?.(q);
                    setOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-caption hover:bg-surface ${
                    q === currentQuarter ? 'text-navy font-bold' : 'text-text'
                  }`}
                >
                  {formatQuarter(q)}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="w-[30px] h-[30px] rounded-full bg-border" />
    </header>
  );
}

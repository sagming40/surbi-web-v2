import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

const TABS = [
  { label: '대시보드', to: '/dashboard' },
  { label: '지도 탐색', to: '/map' },
  { label: '창업 계산', to: '/wizard' },
  { label: '지원 정책', to: '/policy' },
];

interface TopNavProps {
  /**
   * 우측 프로필 아이콘 왼쪽에 끼워 넣을 화면별 컨트롤.
   *
   * 분기 셀렉터처럼 특정 화면에서만 쓰는 것은 여기로 넘긴다.
   * 헤더 자체는 로고와 탭만 책임진다 — 지도 탐색처럼 분기가 필요 없는 화면도 있어서다.
   */
  children?: ReactNode;
}

/**
 * 전 페이지 공통 헤더.
 * 지도 탐색 · 창업 계산 · 지원 정책 탭은 라우트 이동만 연결한다.
 */
export function TopNav({ children }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-7 border-b border-border bg-white px-7">
      {/* 로고 */}
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 rounded-md bg-blue" />
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

      {children}

      <div className="h-[30px] w-[30px] rounded-full bg-border" />
    </header>
  );
}

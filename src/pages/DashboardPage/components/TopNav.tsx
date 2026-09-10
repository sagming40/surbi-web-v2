import { NavLink } from "react-router-dom";

const TABS = [
  { label: '대시보드', to: '/dashboard' },
  { label: '지도 탐색', to: '/map' },
  { label: '창업 계산', to: '/wizard' },
  { label: '지원 정책', to: '/policy' },
];
export function TopNav() {
  return (
    <header className="h-16 px-7 flex items-center gap-7 bg-white border-b border-border">
      {/* 로고 */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-blue" />
        <span className="text-title font-bold text-navy">Surbi</span>
      </div>

      {/* 탭 - 링크 */}
      <nav className="flex items-center gap-6">
        {TABS.map((t) => (
          <NavLink key={t.to} to={t.to} className={({ isActive }) =>
            isActive ? 'text-body font-bold text-navy' : 'text-body text-sub'
          }>
            {t.label}
          </NavLink>
        ))}
      </nav>

      {/* 우측 밀어내기 */}
      <div className="flex-1" />  

      {/* 분기 셀렉터 + 아바타 */}
      <button
        type="button"
        className="h-[31px] px-3 rounded-lg border border-border text-caption"
      >
        2026년 1분기
        <span className="text-label text-sub">▾</span>
      </button>
      <div className="w-[30px] h-[30px] rounded-full bg-border" />
    </header>
  )
}


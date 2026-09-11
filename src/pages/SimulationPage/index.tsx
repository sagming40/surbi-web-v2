import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/ui/Button';
import { RankTable } from '@/shared/ui/RankTable';
import { SurbiCard } from '@/shared/ui/SurbiCard';
import { KakaoMap } from './KakaoMap';
import { mockSimulationCandidates } from './simulation.mock';

export default function SimulationPage() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(mockSimulationCandidates[0].id);
  const [range, setRange] = useState(300);
  const [sortIndex, setSortIndex] = useState(0);
  const [isToolMenuOpen, setIsToolMenuOpen] = useState(false);
  const [excludeDenseArea, setExcludeDenseArea] = useState(false);
  const selectSpot = useCallback((id: string) => setSelectedId(id), []);
  const list = useMemo(() => [...mockSimulationCandidates].sort((a, b) => sortIndex === 0 ? (b.aiScore ?? 0) - (a.aiScore ?? 0) : (a.distanceM ?? 0) - (b.distanceM ?? 0)), [sortIndex]);

  return <main className="min-h-screen overflow-hidden bg-[#edf0ed] text-text">
    <header className="relative z-30 flex h-14 items-center border-b border-border bg-white px-5 shadow-sm">
      <button type="button" className="mr-6 text-headline font-extrabold tracking-tight text-navy" onClick={() => navigate('/report')}>Surbi</button>
      <nav className="hidden items-center gap-2 md:flex" aria-label="상단 내비게이션">
        <button type="button" className="inline-flex h-8 items-center gap-2 rounded-md border border-[#d9dee6] bg-white px-3 text-caption font-medium text-[#1e3a5f] shadow-sm">자치구 <span aria-hidden="true" className="text-label text-sub">⌄</span></button>
        <button type="button" className="inline-flex h-8 items-center gap-2 rounded-md border border-[#d9dee6] bg-white px-3 text-caption font-medium text-[#1e3a5f] shadow-sm">행정동 <span aria-hidden="true" className="text-label text-sub">⌄</span></button>
        <button type="button" className="inline-flex h-8 items-center gap-2 rounded-md bg-[#3b6ef3] px-3 text-caption font-semibold text-white shadow-sm">한식음식점 <span aria-hidden="true" className="text-label text-white/80">⌄</span></button>
        <button type="button" aria-expanded={isToolMenuOpen} className={`inline-flex h-8 items-center gap-2 rounded-md border px-3 text-caption font-medium shadow-sm ${isToolMenuOpen ? 'border-[#3b6ef3] bg-[#f1f5fe] text-[#1e3a5f]' : 'border-[#d9dee6] bg-white text-[#1e3a5f]'}`} onClick={() => setIsToolMenuOpen((open) => !open)}>상권 <span aria-hidden="true" className="text-label text-sub">⌄</span></button>
        <Button variant="outline" className="!h-8 !rounded-md !px-3 !py-0 !text-caption !font-semibold">범위 그리기</Button>
      </nav>
      <button type="button" className="ml-auto text-caption text-sub" onClick={() => { setSelectedId(mockSimulationCandidates[0].id); setRange(300); }}>초기화</button>
    </header>
    <section className="relative h-[calc(100vh-3.5rem)] min-h-[650px] overflow-hidden">
      <KakaoMap candidates={mockSimulationCandidates} rangeM={range} selectedId={selectedId} onSelect={selectSpot} />
      <SurbiCard className="absolute left-1 top-1 z-20 h-[543px] w-[404px] overflow-hidden rounded-[10px] p-0 shadow-lg">
        <div className="flex h-[70px] items-center px-[18px]">
          <div>
            <h1 className="text-body font-bold text-navy">창업 시뮬레이션</h1>
            <p className="mt-1 text-label text-sub">성수이로 53 · 한식음식점 기준</p>
          </div>
        </div>

        <div className="h-[119px] bg-[#f9fafc] px-[18px] pt-3">
          <div className="flex items-center justify-between text-caption text-sub">
            <span>탐색 반경</span>
            <strong className="font-semibold text-blue">{range}m</strong>
          </div>
          <input
            type="range"
            min="100"
            max="1000"
            step="100"
            value={range}
            onChange={(event) => setRange(Number(event.target.value))}
            className="mt-3 block h-[5px] w-full cursor-pointer accent-blue"
            aria-label="탐색 반경"
          />
          <div className="mt-2 flex justify-between text-label text-sub"><span>100m</span><span>300m</span><span>500m</span><span>1km</span></div>
          <button type="button" role="switch" aria-checked={excludeDenseArea} onClick={() => setExcludeDenseArea((value) => !value)} className="mt-3 flex w-full items-center justify-between text-left text-caption text-text">
            <span>반경 내 일정 업종이 있는 곳 제외</span>
            <span className={`relative h-[18px] w-8 rounded-full transition-colors ${excludeDenseArea ? 'bg-blue' : 'bg-[#d9dee6]'}`}><span className={`absolute top-0.5 h-[14px] w-[14px] rounded-full bg-white shadow-sm transition-transform ${excludeDenseArea ? 'translate-x-[14px]' : 'translate-x-0.5'}`} /></span>
          </button>
        </div>

        <div className="flex h-[40px] items-center justify-between bg-[#f1f5fe] px-[18px]">
          <p className="text-caption font-semibold text-[#1e3a5f]">조건을 만족하는 건물 24곳</p>
          <button type="button" onClick={() => setSortIndex((value) => value === 0 ? 1 : 0)} className="text-label font-semibold text-blue">{sortIndex === 0 ? '점수순' : '거리순'}⌄</button>
        </div>
        <div className="h-[272px] overflow-hidden">
          <RankTable
            rows={list.slice(0, 6)}
            onRowClick={(spot) => selectSpot(spot.id)}
            columns={[
              { header: '순위', width: 'w-8', render: (_, index) => <span className={`text-caption font-semibold ${index < 3 ? 'text-blue' : 'text-sub'}`}>{index + 1}</span> },
              { header: '건물', render: (spot) => <span className="block truncate text-caption font-medium text-text">{spot.name}</span> },
              { header: '최근접 경쟁', width: 'w-16', align: 'right', render: (spot) => <span className="text-label text-sub">{spot.distanceM ?? '-'}m</span> },
              { header: '점수', width: 'w-8', align: 'right', render: (spot, index) => <span className={`text-caption font-bold ${index < 2 ? 'text-[#00a875]' : 'text-[#1e3a5f]'}`}>{spot.aiScore ?? '-'}</span> },
            ]}
          />
        </div>
        <div className="flex h-[42px] items-center justify-between bg-[#f9fafc] px-[18px]">
          <p className="text-label text-sub">건물을 고르면 창업 준비 체크리스트로 이어집니다</p>
          <button type="button" className="text-body text-sub" aria-label="후보 건물 더 보기">→</button>
        </div>
      </SurbiCard>
      {isToolMenuOpen && <SurbiCard className="absolute right-3 top-3 z-20 hidden w-[92px] p-1 shadow-lg md:block">{['업종 필터', '상권영역', '범위 그리기', '창업계산', '즐겨찾기', '종합 대시보드'].map((label, index) => <button key={label} type="button" className="flex w-full items-center gap-1 rounded px-1 py-1.5 text-left text-label text-text hover:bg-surface"><span className="w-2 shrink-0 text-sub">{['◫', '◇', '✎', '□', '★', '▦'][index]}</span><span className="truncate">{label}</span></button>)}</SurbiCard>}
    </section>
  </main>;
}

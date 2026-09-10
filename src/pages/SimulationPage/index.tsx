import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/ui/Button';
import { SegmentToggle } from '@/shared/ui/SegmentToggle';
import { SurbiCard } from '@/shared/ui/SurbiCard';
import { KakaoMap } from './KakaoMap';

type Spot = {
  id: number; name: string; distance: string; score: number; sales: string; stores: number;
  isNew?: boolean; tone?: 'blue' | 'pink'; position: { left: string; top: string };
};

const spots: Spot[] = [
  { id: 1, name: '성수이로 77-3', distance: '512m', score: 86, sales: '5800만', stores: 2, isNew: true, position: { left: '30%', top: '31%' } },
  { id: 2, name: '성수동2가 315-4', distance: '438m', score: 82, sales: '8.1억', stores: 2, position: { left: '42%', top: '53%' } },
  { id: 3, name: '성수이로 115-2', distance: '671m', score: 79, sales: '7.2억', stores: 9, isNew: true, position: { left: '52%', top: '25%' } },
  { id: 4, name: '성수동2가 3-9', distance: '390m', score: 74, sales: '6600만', stores: 2, isNew: true, position: { left: '46%', top: '67%' } },
  { id: 5, name: '성수동2가 269', distance: '355m', score: 71, sales: '5.5억', stores: 2, position: { left: '72%', top: '76%' } },
  { id: 6, name: '성수동 688', distance: '318m', score: 68, sales: '24억', stores: 17, isNew: true, tone: 'pink', position: { left: '74%', top: '31%' } },
  { id: 7, name: '성수동1가 85-6', distance: '428m', score: 66, sales: '6100만', stores: 3, isNew: true, position: { left: '23%', top: '76%' } },
  { id: 8, name: '성수동2가 231', distance: '592m', score: 64, sales: '3400만', stores: 2, position: { left: '57%', top: '69%' } },
];

function Marker({ spot, selected, onClick }: { spot: Spot; selected: boolean; onClick: () => void }) {
  const color = spot.tone === 'pink' ? 'bg-red' : 'bg-blue';
  return (
    <button type="button" aria-label={`${spot.name} 후보지 선택`} onClick={onClick} style={spot.position}
      className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 text-left transition-transform hover:scale-105 ${selected ? 'scale-110' : ''}`}>
      {spot.isNew && <span className="mb-1 inline-flex rounded-full bg-[#6e2bf5] px-3 py-1 text-caption font-bold text-white shadow-sm">N 신규매장</span>}
      <span className={`relative block min-w-20 rounded-sm border-2 border-white ${color} px-2 py-1 text-center shadow-lg`}>
        <strong className="block text-headline leading-none text-white">{spot.sales}</strong>
        <span className="mt-1 block bg-white py-0.5 text-center text-body font-bold text-text">{spot.stores}개</span>
        <span className={`absolute -bottom-2 left-3 h-3 w-3 rotate-45 border-b-2 border-r-2 border-white ${color}`} />
      </span>
      {selected && <span className="absolute -inset-3 rounded-full border-2 border-dashed border-blue" />}
    </button>
  );
}

export default function SimulationPage() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(1);
  const [range, setRange] = useState(300);
  const [sortIndex, setSortIndex] = useState(0);
  const [isToolMenuOpen, setIsToolMenuOpen] = useState(true);
  const selected = spots.find((spot) => spot.id === selectedId) ?? spots[0];
  const list = [...spots].sort((a, b) => sortIndex === 0 ? b.score - a.score : a.distance.localeCompare(b.distance));

  return (
    <main className="min-h-screen overflow-hidden bg-[#edf0ed] text-text">
      <header className="relative z-30 flex h-14 items-center gap-3 border-b border-border bg-white px-5 shadow-sm">
        <button type="button" className="text-headline font-extrabold tracking-tight text-navy" onClick={() => navigate('/report')}>Surbi</button>
        <div className="hidden items-center gap-1 md:flex">
          <button type="button" className="rounded-md px-3 py-2 text-caption text-sub">자치구⌄</button>
          <button type="button" className="rounded-md px-3 py-2 text-caption text-sub">행정동⌄</button>
          <span className="rounded-md bg-blue px-3 py-2 text-caption font-bold text-white">창업 시뮬레이션</span>
          <button type="button" className="rounded-md px-3 py-2 text-caption text-sub" onClick={() => setIsToolMenuOpen((open) => !open)}>상권⌄</button>
          <Button variant="outline" className="!px-3 !py-1.5">범위 그리기</Button>
        </div>
        <button type="button" className="ml-auto text-caption text-sub" onClick={() => setSelectedId(1)}>초기화</button>
      </header>

      <section className="relative h-[calc(100vh-3.5rem)] min-h-[650px] overflow-hidden">
        <KakaoMap />
        <div className="absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-blue/75 bg-blue/5" />
        {spots.map((spot) => <Marker key={spot.id} spot={spot} selected={spot.id === selectedId} onClick={() => setSelectedId(spot.id)} />)}

        <SurbiCard className="absolute left-4 top-4 z-20 w-[290px] overflow-hidden shadow-lg sm:left-6 sm:w-[320px]">
          <div className="border-b border-border p-4">
            <h1 className="text-headline font-bold">창업 시뮬레이션</h1>
            <p className="mt-1 text-caption text-sub">성수동에서 조건에 맞는 후보지를 찾습니다.</p>
            <div className="mt-4 flex items-center justify-between text-caption text-sub"><span>탐색 반경</span><strong className="text-blue">{range}m</strong></div>
            <input type="range" min="100" max="1000" step="100" value={range} onChange={(e) => setRange(Number(e.target.value))} className="mt-2 w-full accent-blue" aria-label="탐색 반경" />
            <div className="flex justify-between text-label text-sub"><span>100m</span><span>500m</span><span>1km</span></div>
            <label className="mt-4 flex cursor-pointer items-center gap-2 text-caption"><input type="checkbox" className="accent-blue" />경쟁 매장 밀집 지역 제외</label>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between"><p className="text-caption font-bold text-sub">조건에 맞는 후보 26곳</p><SegmentToggle options={['점수순', '거리순']} onChange={setSortIndex} /></div>
            <div className="mt-3 divide-y divide-border">
              {list.slice(0, 6).map((spot) => <button key={spot.id} type="button" onClick={() => setSelectedId(spot.id)} className={`flex w-full items-center justify-between py-2 text-left ${spot.id === selectedId ? 'text-blue' : ''}`}><span><strong className="block text-caption">{spot.name}</strong><span className="text-label text-sub">최근접 경쟁 {spot.distance}</span></span><strong className="text-body">{spot.score}</strong></button>)}
            </div>
            <button type="button" className="mt-3 w-full text-caption text-sub">후보 20곳 더 보기 →</button>
          </div>
        </SurbiCard>

        {isToolMenuOpen && (
          <SurbiCard className="absolute right-6 top-4 z-20 hidden w-36 p-2 shadow-lg md:block">
            {['업종 필터', '상권영역', '범위 그리기', '창업계산', '즐겨찾기', '종합 대시보드'].map((label, index) => (
              <button key={label} type="button" className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-caption text-text hover:bg-surface">
                <span className="text-sub">{['◫', '◇', '✎', '□', '★', '▦'][index]}</span>{label}
              </button>
            ))}
          </SurbiCard>
        )}
        <SurbiCard className="absolute bottom-5 right-5 z-20 w-52 p-3 shadow-lg"><p className="text-label text-sub">선택한 후보지</p><strong className="mt-1 block text-body">{selected.name}</strong><p className="mt-1 text-caption text-sub">AI 점수 {selected.score} · 예상 매출 {selected.sales} · 경쟁 매장 {selected.stores}개</p></SurbiCard>
      </section>
    </main>
  );
}

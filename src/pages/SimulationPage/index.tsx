import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { SimulationCandidate } from '@/shared/types';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Chip } from '@/shared/ui/Chip';
import { SegmentToggle } from '@/shared/ui/SegmentToggle';
import { SurbiCard } from '@/shared/ui/SurbiCard';

type CandidateWithMapPosition = SimulationCandidate & {
  mapPosition: { left: string; top: string };
  address: string;
};

const candidates: CandidateWithMapPosition[] = [
  {
    buildingId: 'building-001',
    name: '성수동 2가 277-42',
    address: '서울 성동구 성수이로 18길',
    location: { lat: 37.5441, lng: 127.0559 },
    distanceM: 180,
    aiScore: 82.4,
    expectedMonthlySales: 54200000,
    closureRisk: 22.8,
    competitorCount: 86,
    estimatedRent: 6200000,
    mapPosition: { left: '62%', top: '38%' },
  },
  {
    buildingId: 'building-002',
    name: '성수동 1가 13-179',
    address: '서울 성동구 왕십리로 14길',
    location: { lat: 37.546, lng: 127.0481 },
    distanceM: 320,
    aiScore: 78.9,
    expectedMonthlySales: 49100000,
    closureRisk: 25.4,
    competitorCount: 104,
    estimatedRent: 5400000,
    mapPosition: { left: '45%', top: '55%' },
  },
  {
    buildingId: 'building-003',
    name: '성수동 2가 302-7',
    address: '서울 성동구 연무장길',
    location: { lat: 37.5418, lng: 127.0578 },
    distanceM: 410,
    aiScore: 75.6,
    expectedMonthlySales: 46800000,
    closureRisk: 29.1,
    competitorCount: 121,
    estimatedRent: 5100000,
    mapPosition: { left: '74%', top: '68%' },
  },
  {
    buildingId: 'building-004',
    name: '성수동 1가 656-108',
    address: '서울 성동구 뚝섬로',
    location: { lat: 37.5482, lng: 127.0452 },
    distanceM: 540,
    aiScore: 71.2,
    expectedMonthlySales: 43200000,
    closureRisk: 32.7,
    competitorCount: 137,
    estimatedRent: 4700000,
    mapPosition: { left: '28%', top: '28%' },
  },
];

function formatWon(value: number | null) {
  return value == null ? '-' : `${Math.round(value / 10000).toLocaleString()}만원`;
}

function CandidateCard({
  candidate,
  index,
  selected,
  onClick,
}: {
  candidate: CandidateWithMapPosition;
  index: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border p-4 text-left transition-colors ${
        selected ? 'border-blue bg-blue/5' : 'border-border bg-white hover:border-blue/50'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-caption text-sub">추천 후보 {index + 1}</p>
          <h3 className="mt-1 text-body font-bold text-text">{candidate.name}</h3>
          <p className="mt-1 text-caption text-sub">{candidate.address} · {candidate.distanceM}m</p>
        </div>
        <strong className="text-title text-blue">{candidate.aiScore}</strong>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3">
        <div>
          <p className="text-label text-sub">예상 월매출</p>
          <p className="mt-1 text-caption font-bold text-text">{formatWon(candidate.expectedMonthlySales)}</p>
        </div>
        <div>
          <p className="text-label text-sub">폐업 위험도</p>
          <p className="mt-1 text-caption font-bold text-text">{candidate.closureRisk}%</p>
        </div>
        <div>
          <p className="text-label text-sub">예상 임대료</p>
          <p className="mt-1 text-caption font-bold text-text">{formatWon(candidate.estimatedRent)}</p>
        </div>
      </div>
    </button>
  );
}

export default function SimulationPage() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(candidates[0].buildingId);
  const [sortIndex, setSortIndex] = useState(0);

  const sortedCandidates = useMemo(() => {
    const copied = [...candidates];

    if (sortIndex === 1) return copied.sort((a, b) => (b.expectedMonthlySales ?? 0) - (a.expectedMonthlySales ?? 0));
    if (sortIndex === 2) return copied.sort((a, b) => (a.estimatedRent ?? 0) - (b.estimatedRent ?? 0));
    return copied.sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0));
  }, [sortIndex]);

  const selectedCandidate = candidates.find((candidate) => candidate.buildingId === selectedId) ?? candidates[0];

  return (
    <main className="min-h-screen bg-surface p-4 text-text md:p-6">
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <button type="button" className="text-body text-sub" onClick={() => navigate('/report')}>
              ← AI 분석 보고서로 돌아가기
            </button>
            <h1 className="mt-2 text-title font-bold">창업 시뮬레이션</h1>
            <p className="mt-1 text-body text-sub">조건에 맞는 성수동 후보지를 비교해 보세요.</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/wizard')}>
            조건 다시 설정하기
          </Button>
        </header>

        <section className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-white p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="info">시뮬레이션 조건</Badge>
            {['성동구', '한식음식점', '반경 1km', '중형 상가'].map((condition) => (
              <Chip key={condition}>{condition}</Chip>
            ))}
          </div>
          <p className="text-caption text-sub">AI 점수와 상권 지표를 기준으로 후보지를 정렬했어요.</p>
        </section>

        <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-border bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-caption font-bold text-sub">추천 후보지</p>
                <h2 className="mt-1 text-headline font-bold">창업 추천 장소 4곳</h2>
              </div>
              <Badge variant="neutral">성수동</Badge>
            </div>
            <div className="mt-4">
              <SegmentToggle options={['AI 점수순', '매출 높은순', '임대료 낮은순']} onChange={setSortIndex} />
            </div>
            <div className="mt-4 space-y-3">
              {sortedCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate.buildingId}
                  candidate={candidate}
                  index={candidates.indexOf(candidate)}
                  selected={candidate.buildingId === selectedId}
                  onClick={() => setSelectedId(candidate.buildingId)}
                />
              ))}
            </div>
          </aside>

          <section className="relative min-h-[620px] overflow-hidden rounded-2xl border border-border bg-[#e8edf1]">
            <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(115deg,transparent_0%,transparent_42%,#ffffff_42%,#ffffff_45%,transparent_45%,transparent_100%),linear-gradient(20deg,transparent_0%,transparent_35%,#ffffff_35%,#ffffff_38%,transparent_38%,transparent_100%),linear-gradient(90deg,#d8e0e7_1px,transparent_1px),linear-gradient(#d8e0e7_1px,transparent_1px)] [background-size:auto,auto,92px_92px,92px_92px]" />
            <div className="absolute left-[8%] top-[12%] h-44 w-44 rounded-full border-[24px] border-green/25" />
            <div className="absolute bottom-[14%] right-[9%] h-52 w-52 rounded-full border-[28px] border-blue/15" />
            <div className="absolute left-[38%] top-[42%] h-16 w-64 -rotate-[18deg] rounded-full bg-white/85" />
            <div className="absolute left-[20%] top-[30%] text-caption font-bold text-sub">성수역</div>
            <div className="absolute right-[18%] top-[22%] text-caption font-bold text-sub">서울숲</div>
            <div className="absolute bottom-[20%] left-[40%] text-caption font-bold text-sub">성수동</div>

            <SurbiCard className="absolute left-4 top-4 z-10 w-[min(330px,calc(100%-2rem))] p-4 shadow-lg">
              <p className="text-caption font-bold text-blue">선택한 후보지</p>
              <div className="mt-1 flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-headline font-bold">{selectedCandidate.name}</h2>
                  <p className="mt-1 text-caption text-sub">{selectedCandidate.address}</p>
                </div>
                <strong className="text-display text-blue">{selectedCandidate.aiScore}</strong>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-surface p-2.5">
                  <p className="text-label text-sub">예상 월매출</p>
                  <p className="mt-1 text-body font-bold">{formatWon(selectedCandidate.expectedMonthlySales)}</p>
                </div>
                <div className="rounded-lg bg-surface p-2.5">
                  <p className="text-label text-sub">경쟁 매장</p>
                  <p className="mt-1 text-body font-bold">{selectedCandidate.competitorCount}개</p>
                </div>
              </div>
            </SurbiCard>

            {candidates.map((candidate, index) => {
              const isSelected = candidate.buildingId === selectedId;
              return (
                <button
                  key={candidate.buildingId}
                  type="button"
                  aria-label={`${candidate.name} 후보지 선택`}
                  onClick={() => setSelectedId(candidate.buildingId)}
                  style={candidate.mapPosition}
                  className={`absolute z-10 flex h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-caption font-bold shadow-md transition-transform hover:scale-110 ${
                    isSelected ? 'border-navy bg-navy text-white ring-4 ring-blue/25' : 'border-white bg-blue text-white'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}

            <div className="absolute bottom-4 right-4 z-10 rounded-lg border border-border bg-white px-3 py-2 text-caption text-sub shadow-sm">
              숫자 마커를 선택해 후보지를 비교하세요
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

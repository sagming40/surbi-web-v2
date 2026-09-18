import type { BuildingDetailMock } from './types';
import { SurbiCard } from '@/shared/ui/SurbiCard';
import { useEffect, useRef, useState } from 'react';
import { formatKrw } from '@/shared/lib/format';
import { HoverCard } from './HoverCard';

type SectionKey = 'building' | 'trdar';

const TABS = [
  { key: 'building', label: '건물' },
  { key: 'trdar', label: '주변 상권' },
] as const;

const formatYearMonth = (v: string) => `${v.slice(0, 4)}년 ${Number(v.slice(4, 6))}월`;

interface BuildingDetailPanelProps {
  data: BuildingDetailMock;
  onClose?: () => void; // 패널 닫기는 지도 쪽에서
  onAnalyzeTrdar?: (guCode: string) => void;
}

export function BuildingDetailPanel({ data, onAnalyzeTrdar }: BuildingDetailPanelProps) {
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState<SectionKey>('building');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');

  const storesRef = useRef<HTMLDivElement>(null);
  const trdarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(id);
  }, [copied]);

  async function handleCopyAddress() {
    if (!data.roadAddress) return;
    try {
      await navigator.clipboard.writeText(data.roadAddress);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  }

  function goTo(key: SectionKey) {
    setActive(key);
    const target = key === 'building' ? storesRef.current : trdarRef.current;
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const visibleStores = data.stores.filter((s) => {
    if (categoryFilter && s.categoryLargeCode !== categoryFilter) return false;
    if (!keyword.trim()) return true;
    const q = keyword.trim().toLowerCase();
    return s.name.toLowerCase().includes(q) || s.categoryName.toLowerCase().includes(q);
  });

  return (
    <SurbiCard className="flex flex-col h-full overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <p className="text-title font-bold text-navy">{data.buildingName}</p>

        <div className="flex items-center gap-2 mt-1">
          <p className="text-caption text-sub">{data.roadAddress}</p>
          {data.roadAddress && (
            <button
              type="button"
              onClick={handleCopyAddress}
              className="shrink-0 px-2 py-0.5 rounded-md border border-border text-label text-sub hover:bg-surface"
            >
              {copied ? '복사됨' : '복사'}
            </button>
          )}
        </div>
      </div>

      {/* 탭 */}
      <div className="flex border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => goTo(t.key)}
            className={`flex-1 py-3 text-body border-b-2 -mb-px transition-colors ${active === t.key
              ? 'border-blue text-navy font-bold'
              : 'border-transparent text-sub'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 본문 - 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {/* 안내 문구 - 건물 내 매장의 필터 사용시 안내문구가 스크롤바에 간섭이 생겨 내려앉는 이슈 있음 나중에 고칠것 */}
        <div className="border-l-2 border-blue pl-3 py-1">
          <p className="text-caption text-text font-bold leading-relaxed">
            Surbi는 건물·점포 단위 매출을 제공하지 않습니다.
            <br />
            공공데이터가 행정동 × 업종 단위로 집계되기 때문입니다.
          </p>
          <p className="text-label text-sub mt-1.5">
            대신 이 건물의 실제 영업중 업소 목록과, 건물이 속한 행정동의 상권 분석을 제공합니다
          </p>
        </div>

        {/* 건물 내 매장 */}
        <div ref={storesRef} className="scroll-mt-4 mt-6">
          <div className="flex items-center justify-between">
            <span className="text-headline font-bold text-navy">건물 내 매장</span>
            <span className="text-label text-sub">총 {data.stores.length}곳</span>
          </div>

          {/* 업종 대분류 필터 */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            <button
              type="button"
              onClick={() => setCategoryFilter(null)}
              className={`px-3 py-1.5 rounded-full text-caption font-medium ${categoryFilter === null ? 'bg-blue text-white' : 'bg-surface text-sub'
                }`}
            >
              전체 {data.stores.length}
            </button>

            {data.categoryCounts.map((c) => (
              <button
                key={c.categoryLargeCode}
                type="button"
                onClick={() => setCategoryFilter(c.categoryLargeCode)}
                className={`px-3 py-1.5 rounded-full text-caption font-medium ${categoryFilter === c.categoryLargeCode ? 'bg-blue text-white' : 'bg-surface text-sub'
                  }`}
              >
                {c.categoryLargeName} {c.count}
              </button>
            ))}
          </div>

          {/* 검색 */}
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="업종 또는 매장명 검색"
            className="w-full mt-3 px-3 py-2.5 rounded-lg bg-surface text-caption text-text placeholder:text-sub outline-none"
          />

          {/* 매장 목록 */}
          <ul className="mt-2">
            {visibleStores.map((s) => (
              <li key={s.storeId}>
                <HoverCard
                  card={
                    <>
                      <p className="text-caption font-bold text-navy">{s.name}</p>
                      <dl className="mt-2 space-y-1 text-caption">
                        <div className="flex gap-2">
                          <dt className="w-10 shrink-0 text-sub">업종</dt>
                          <dd className="text-text">{s.categoryName}</dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="w-10 shrink-0 text-sub">개업</dt>
                          <dd className="text-text">{formatYearMonth(s.openedDate)}</dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="w-10 shrink-0 text-sub">폐업</dt>
                          <dd className={s.closedDate ? 'text-red' : 'text-sub'}>
                            {s.closedDate ? formatYearMonth(s.closedDate) : '영업중'}
                          </dd>
                        </div>
                      </dl>
                    </>
                  }
                >
                  <button
                    type="button"
                    className="w-full flex items-center gap-2.5 py-3 border-b border-border text-left hover:bg-surface"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue shrink-0" />
                    <span className="flex-1">
                      <span className="block text-body font-bold text-text">{s.name}</span>
                      <span className="block text-label text-sub mt-0.5">
                        {s.categoryName} · {s.floor}층
                      </span>
                    </span>
                  </button>
                </HoverCard>
              </li>
            ))}

            {visibleStores.length === 0 && (
              <li className="py-8 text-center text-caption text-sub">조건에 맞는 매장이 없습니다</li>
            )}
          </ul>
        </div>

        {/* 이 건물이 속한 상권 */}
        <div ref={trdarRef} className="scroll-mt-4 mt-8">
          <p className="text-caption text-sub">이 건물이 속한 상권</p>

          {data.dongSummary && (
            <>
              <p className="text-title font-bold text-navy mt-1">
                {data.dongSummary.dongName}
              </p>

              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="p-3 rounded-lg bg-surface">
                  <p className="text-label text-sub">AI 창업 점수</p>
                  <p className="text-headline font-bold text-blue mt-1">
                    {data.dongSummary.aiScore === null ? '-' : `${data.dongSummary.aiScore}점`}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-surface">
                  <p className="text-label text-sub">분기 매출</p>
                  <p className="text-headline font-bold text-text mt-1">
                    {formatKrw(data.dongSummary.sales)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-surface">
                  <p className="text-label text-sub">경쟁 업체</p>
                  <p className="text-headline font-bold text-red mt-1">
                    {data.dongSummary.competitorCount.toLocaleString()}곳
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!data.dongSummary) return;
                  onAnalyzeTrdar?.(data.dongSummary.dongCode.slice(0, 5)); // 시군구 코드
                }}
                className="w-full mt-4 py-3 rounded-xl bg-blue text-white text-body font-bold hover:opacity-90"
              >
                {data.dongSummary.dongName} 상권 분석 보기
              </button>
            </>
          )}
        </div>
      </div>
    </SurbiCard>
  );
}
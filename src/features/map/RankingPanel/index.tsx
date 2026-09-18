import { useState } from 'react';
import type { RankingMetrics, RankingMetricKey, RankingSort } from '@/shared/types/common';
import { SurbiCard } from '@/shared/ui/SurbiCard';
import { SegmentToggle } from '@/shared/ui/SegmentToggle';
import { DropdownSelect } from '@/shared/ui/DropdownSelect';
import { RankTable } from '@/shared/ui/RankTable';
import { formatKrw } from '@/shared/lib/format';

/**
 * 랭킹 한 행.
 *
 * 01(자치구 25개)과 01b(자치구 내 행정동)은 식별자 이름만 다르고 지표 구조가 같다.
 * 부르는 쪽에서 guCode/dongCode 를 code 로, guName/dongName 을 name 으로 맞춰 넘긴다.
 */
export interface RankingRow extends RankingMetrics {
  code: string;
  name: string;
}

/**
 * 지표 토글 4종.
 *
 * 순서와 키는 RankingMetricKey 를 그대로 따른다. 표시 형식이 지표마다 달라
 * 라벨·포맷터를 여기 한 곳에 묶어 뒀다 — 지표가 늘면 이 배열만 고치면 된다.
 */
const METRICS: { key: RankingMetricKey; label: string; format: (v: number) => string }[] = [
  { key: 'storeCount', label: '점포수', format: (v) => `${v.toLocaleString()}곳` },
  { key: 'sales', label: '매출', format: formatKrw },
  { key: 'flowPopulation', label: '유동인구', format: (v) => `${Math.round(v / 10000).toLocaleString()}만명` },
  { key: 'residentPopulation', label: '주거인구', format: (v) => `${v.toLocaleString()}명` },
];

/**
 * 정렬 기준 2종.
 * 'rank' 라벨은 선택된 지표를 따라간다 — 매출을 보는 중이면 "매출순".
 */
const SORTS: { key: RankingSort; label: (metricLabel: string) => string }[] = [
  { key: 'rank', label: (m) => `${m}순` },
  { key: 'growth', label: () => '증감률순' },
];

/** 처음에 보여줄 행 수. "더보기"를 누르면 전부 */
const PREVIEW_COUNT = 10;

/** "2026Q1" → "2026년 1분기" */
const formatQuarter = (q: string) => `${q.slice(0, 4)}년 ${q.slice(5)}분기`;

interface RankingPanelProps {
  /** 패널 제목. "서울시 전체" 또는 자치구명 */
  title: string;
  quarter: string;
  /** 행의 단위. "자치구" 또는 "행정동" — 부제·더보기 문구에 쓴다 */
  unitLabel: string;
  rows: RankingRow[];
  onRowClick?: (code: string) => void;
  /** 지도에서 선택된 행을 강조한다 */
  highlightedCode?: string | null;

  // ── 필터 ──
  guOptions: { value: string; label: string }[];
  selectedGuCode: string | null;
  onSelectGu: (guCode: string | null) => void;
  /** 자치구를 고르기 전에는 비어 있다 */
  dongOptions?: { value: string; label: string }[];
  selectedDongCode?: string | null;
  onSelectDong?: (dongCode: string | null) => void;
}

export function RankingPanel({
  title,
  quarter,
  unitLabel,
  rows: allRows,
  onRowClick,
  highlightedCode,
  guOptions,
  selectedGuCode,
  onSelectGu,
  dongOptions = [],
  selectedDongCode = null,
  onSelectDong,
}: RankingPanelProps) {
  const [metricIndex, setMetricIndex] = useState(1); // 기본값 매출
  const [sort, setSort] = useState<RankingSort>('rank');
  const [expanded, setExpanded] = useState(false);

  const metric = METRICS[metricIndex];

  // 정렬은 전부 프론트에서 한다. rank 는 서버가 지표별로 매겨 보내주므로
  // 지표를 바꿔도 API 를 다시 부르지 않는다.
  const sorted = [...allRows].sort((a, b) => {
    const x = a[metric.key];
    const y = b[metric.key];
    if (sort === 'growth') {
      // 증감률이 없는 행(null)은 항상 뒤로
      return (y.changeRate ?? -Infinity) - (x.changeRate ?? -Infinity);
    }
    return (x.rank ?? Infinity) - (y.rank ?? Infinity);
  });

  const rows = expanded ? sorted : sorted.slice(0, PREVIEW_COUNT);

  return (
    <SurbiCard
      elevated
      className="pointer-events-auto flex max-h-full w-[340px] flex-col overflow-hidden"
    >
      {/* 제목 + 필터 */}
      <div className="flex shrink-0 items-start justify-between gap-2 px-4 pt-4 pb-3">
        <div className="min-w-0">
          <h2 className="text-headline font-bold text-navy">{title}</h2>
          <p className="mt-0.5 text-caption text-sub">
            {formatQuarter(quarter)} 기준 · {allRows.length}개 {unitLabel}
          </p>
        </div>

        {/* 행정동은 자치구를 골라야 열린다 */}
        <div className="flex shrink-0 gap-1.5">
          <DropdownSelect
            label="자치구"
            clearLabel="전체"
            options={guOptions}
            value={selectedGuCode}
            onChange={onSelectGu}
          />
          <DropdownSelect
            label="행정동"
            clearLabel="전체"
            options={dongOptions}
            value={selectedDongCode}
            onChange={(v) => onSelectDong?.(v)}
            disabled={!selectedGuCode}
          />
        </div>
      </div>

      {/* 지표 · 정렬 토글 */}
      <div className="flex shrink-0 flex-col gap-2 px-4 pb-3">
        <span className="text-label text-sub">지표</span>
        <SegmentToggle
          options={METRICS.map((m) => m.label)}
          defaultIndex={metricIndex}
          onChange={setMetricIndex}
        />

        {/* 정렬 토글은 지표 토글과 모양이 다르다 — 선택된 것만 파란 알약 */}
        <div className="flex items-center gap-1">
          {SORTS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSort(s.key)}
              className={`rounded-full px-3 py-1 text-caption transition-colors ${
                sort === s.key ? 'bg-blue font-bold text-white' : 'text-sub hover:bg-surface'
              }`}
            >
              {s.label(metric.label)}
            </button>
          ))}
        </div>
      </div>

      {/* 랭킹 표 — 여기만 스크롤된다.
          min-h-0 이 없으면 flex 아이템이 내용 높이 아래로 안 줄어들어 스크롤이 안 생긴다 */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <RankTable<RankingRow>
          rows={rows}
          onRowClick={(row) => onRowClick?.(row.code)}
          isHighlighted={(row) => row.code === highlightedCode}
          columns={[
            {
              header: '순위',
              width: 'w-8',
              // 증감률순으로 보면 서버가 준 지표 순위는 의미가 없다.
              // 정렬된 자리를 그대로 순위로 쓴다.
              render: (row, index) => (
                <span className="text-caption font-bold text-navy">
                  {sort === 'growth' ? index + 1 : (row[metric.key].rank ?? '-')}
                </span>
              ),
            },
            {
              header: unitLabel,
              render: (row) => <span className="text-caption text-text">{row.name}</span>,
            },
            {
              header: metric.label,
              align: 'right',
              render: (row) => {
                const v = row[metric.key].value;
                return (
                  <span className="text-caption font-bold text-text">
                    {v === null ? '-' : metric.format(v)}
                  </span>
                );
              },
            },
            {
              header: '증감률',
              width: 'w-14',
              align: 'right',
              render: (row) => {
                const r = row[metric.key].changeRate;
                if (r === null) return <span className="text-caption text-sub">-</span>;
                return (
                  <span className={`text-caption ${r >= 0 ? 'text-blue' : 'text-red'}`}>
                    {r >= 0 ? '+' : ''}
                    {r.toFixed(1)}%
                  </span>
                );
              },
            },
          ]}
        />
      </div>

      {/* 더보기 — 스크롤 영역 밖이라 항상 보인다 */}
      {allRows.length > PREVIEW_COUNT && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="w-full shrink-0 border-t border-border py-2.5 text-label text-sub hover:bg-surface"
        >
          {expanded
            ? '접기 ▴'
            : `${allRows.length}개 ${unitLabel} 중 ${PREVIEW_COUNT}개 표시 · 더보기 ▾`}
        </button>
      )}
    </SurbiCard>
  );
}

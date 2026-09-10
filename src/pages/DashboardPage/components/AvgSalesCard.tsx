import { SurbiCard } from '@/shared/ui/SurbiCard';
import { Badge } from '@/shared/ui/Badge';

interface AvgSalesCardProps {
  /** 점포당 평균 매출액(원). 데이터가 없으면 null */
  value: number | null;
  /** 전분기 대비 증감률(%) */
  changeRate: number;
  /** 각주에 표시할 집계 대상 행정동 수 */
  dongCount: number;
  /** 상단 셀렉터에 표시할 지역명 */
  regionName?: string;
}

/**
 * 좌측 카드 ① 점포당 평균 매출액.
 * 목업 실측: 카드 400x172, 안쪽 여백 좌우 22 / 위아래 20, 요소 간격 10.
 */
export function AvgSalesCard({
  value,
  changeRate,
  dongCount,
  regionName = '서울특별시 전체',
}: AvgSalesCardProps) {
  const isUp = changeRate >= 0;

  return (
    <SurbiCard className="px-[22px] py-5 flex flex-col gap-2.5">
      {/* 지역 셀렉터 — 목업 116x31. 필터 동작은 API 확정 후 붙인다 */}
      <button
        type="button"
        className="self-start flex items-center gap-2 h-[31px] px-3 rounded-lg bg-surface border border-border text-body font-bold text-text"
      >
        {regionName}
        <span className="text-label text-sub">▾</span>
      </button>

      <p className="text-caption text-sub">점포당 평균 매출액</p>

      {/* 값 42px 높이, 뱃지는 세로 가운데 정렬 (목업 y=9.5 → 중앙) */}
      <div className="flex items-center gap-2.5">
        <p className="text-display font-bold text-navy leading-none">
          {value === null ? '—' : `${(value / 10_000).toLocaleString()}만원`}
        </p>
        <Badge variant={isUp ? 'info' : 'warning'}>
          {isUp ? '▲' : '▼'} {Math.abs(changeRate)}%
        </Badge>
      </div>

      <p className="text-label text-sub">
        전분기 대비 · 서울 {dongCount}개 행정동 기준
      </p>
    </SurbiCard>
  );
}

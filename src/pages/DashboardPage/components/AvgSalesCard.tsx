import { Badge } from '@/shared/ui/Badge';

interface AvgSalesCardProps {
  /** 점포당 평균 매출액(원). 데이터가 없으면 null */
  value: number | null;
  /** 전분기 대비 증감률(%) */
  changeRate: number | null;
  /** 각주에 표시할 집계 대상 행정동 수 */
  dongCount: number;
  /** 상단 셀렉터에 표시할 지역명 */
  regionName?: string;
}

/**
 * 좌측 ① 점포당 평균 매출액.
 * 카드 테두리와 안쪽 여백은 부모(좌측 패널)가 한 번만 씌운다.
 */
export function AvgSalesCard({
  value,
  changeRate,
  dongCount,
  regionName = '서울특별시 전체',
}: AvgSalesCardProps) {

  return (
    <div className="flex flex-col gap-4">
      {/* 지역 셀렉터 — 목업 116x31. 필터 동작은 API 확정 후 붙인다 */}
      <button
        type="button"
        className="self-start flex items-center gap-2 h-[46px] px-4 rounded-xl bg-surface border border-border text-headline font-bold text-text"
      >
        {regionName}
        <span className="text-caption text-sub">▾</span>
      </button>

      <p className="text-headline text-sub">점포당 평균 매출액</p>

      {/* 값 42px 높이, 뱃지는 세로 가운데 정렬 (목업 y=9.5 → 중앙) */}
      <div className="flex items-center gap-4">
        <p className="text-[45px] font-bold text-navy leading-none">
          {value === null ? '—' : `${Math.round(value / 10_000).toLocaleString()}만원`}
        </p>
        {changeRate === null ? (
          <Badge variant="info">-</Badge>
        ) : (
          <Badge variant={changeRate >= 0 ? 'info' : 'warning'}>
            {changeRate >= 0 ? '▲' : '▼'} {Math.abs(changeRate).toFixed(1)}%
          </Badge>
        )}
      </div>

      <p className="text-caption text-sub">
        전분기 대비 · 서울 {dongCount}개 행정동 기준
      </p>
    </div>
  );
}

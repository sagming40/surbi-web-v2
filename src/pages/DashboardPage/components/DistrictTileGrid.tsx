import type { DistrictHeatmapItem } from '@/shared/types';
import { SurbiCard } from '@/shared/ui/SurbiCard';

interface DistrictTileGridProps {
  items: DistrictHeatmapItem[];
}

/** 매출 5분위별 타일 색. Tailwind가 소스를 문자열로 훑으므로 조립하지 말고 그대로 적어둔다 */
const LEVEL_CLASS = [
  'bg-blue/10',
  'bg-blue/25',
  'bg-blue/45',
  'bg-blue/70',
  'bg-blue',
];

/** 3글자 이상이면 끝 '구'를 뗀다. 중구처럼 2글자는 그대로 */
const shortName = (name: string) => (name.length > 2 ? name.slice(0, -1) : name);

/**
 * 좌측 카드 ② 자치구별 매출 분포.
 * 목업 실측: 카드 400x352, 타일 66x41 간격 5, 범례 칩 28x8 간격 6, 요소 간격 12.
 */
export function DistrictTileGrid({ items }: DistrictTileGridProps) {
  // 매출 내림차순 순위를 5등분. 강남구가 압도적이라 값 비율로 나누면 색이 안 퍼진다
  const step = Math.max(1, Math.ceil(items.length / 5));
  const levelByGu = new Map(
    [...items]
      .sort((a, b) => b.sales - a.sales)
      .map((d, i) => [d.guCode, Math.max(0, 4 - Math.floor(i / step))] as const),
  );

  return (
    <SurbiCard className="px-[22px] py-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-headline font-bold text-navy">자치구별 매출 분포</span>
        <span className="text-label text-sub">{items.length}개 구</span>
      </div>

      <div className="grid grid-cols-5 gap-[5px]">
        {items.map((d) => {
          const level = levelByGu.get(d.guCode) ?? 0;
          return (
            <div
              key={d.guCode}
              title={`${d.guName} ${(d.sales / 100_000_000).toLocaleString()}억`}
              className={`h-[41px] rounded-lg flex items-center justify-center text-caption font-medium ${
                LEVEL_CLASS[level]
              } ${level >= 3 ? 'text-white' : 'text-text'}`}
            >
              {shortName(d.guName)}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-1.5 text-label text-sub">
        <span>낮음</span>
        {LEVEL_CLASS.map((c) => (
          <span key={c} className={`w-7 h-2 rounded-sm border border-border ${c}`} />
        ))}
        <span>높음</span>
      </div>

      <p className="text-label text-sub">※ 지리적 실제 위치가 아닌 타일 배열(격자)</p>
    </SurbiCard>
  );
}

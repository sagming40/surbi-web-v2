import type { DistrictHeatmapItem } from '@/shared/types';
import { formatKrw } from './format';
import { Tooltip } from './Tooltip';

interface DistrictTileGridProps {
  items: DistrictHeatmapItem[];
}

/** 매출 5분위별 타일 색. */
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
 * 좌측 ② 자치구별 매출 분포.
 * 좌측 패널 1.5배 확대: 타일 높이 62 간격 8, 범례 칩 42x12, 요소 간격 18.
 * 카드 테두리와 안쪽 여백은 부모(좌측 패널)가 한 번만 씌운다.
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
    <div className="flex flex-col gap-[18px]">
      <div className="flex items-center justify-between">
        <span className="text-[22px] font-bold text-navy">자치구별 매출 분포</span>
        <span className="text-caption text-sub">{items.length}개 구</span>
      </div>

      <div className="grid grid-cols-5 gap-[8px]">
        {items.map((d) => {
          const level = levelByGu.get(d.guCode) ?? 0;
          return (
            <Tooltip
              key={d.guCode}
              label={`${d.guName} ${formatKrw(d.sales)}`}
              className={`h-[62px] rounded-xl flex items-center justify-center text-headline font-medium ${
                LEVEL_CLASS[level]
              } ${level >= 3 ? 'text-white' : 'text-text'}`}
            >
              {shortName(d.guName)}
            </Tooltip>
          );
        })}
      </div>

      <div className="flex items-center gap-2 text-caption text-sub">
        <span>낮음</span>
        {LEVEL_CLASS.map((c) => (
          <span key={c} className={`w-[42px] h-3 rounded border border-border ${c}`} />
        ))}
        <span>높음</span>
      </div>

      <p className="text-caption text-sub">※ 지리적 실제 위치가 아닌 타일 배열(격자)</p>
    </div>
  );
}

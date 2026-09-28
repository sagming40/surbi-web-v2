import type { CategorySalesCompare } from '@/shared/types';
import { Tooltip } from './Tooltip';
import { formatKrw } from '@/shared/lib/format';

interface CategoryCompareProps {
  items: CategorySalesCompare[];
  currentLabel: string;
  previousLabel: string;
}

const HEADROOM = 0.15;

/** 금액(원) → 툴팁 문자열. null이면 '데이터 없음'. 단위를 바꿀 땐 이 함수만 고친다 */
const formatAmount = (v: number | null) => (v === null ? '데이터 없음' : formatKrw(v));

export function CategoryCompare({
  items,
  currentLabel,
  previousLabel,
}: CategoryCompareProps) {

  const peaks = items
    .map((d) => Math.max(d.sales ?? 0, d.previousSales ?? 0))
    .sort((a, b) => b - a);
  const BREAK_RATIO = 2; // 1등이 2등보다 2배 이상 크면 자르기
  const [first = 0, second = 0] = peaks;
  const isBroken = second > 0 && first > second * BREAK_RATIO;
  const axisMax = (isBroken ? second : first) * (1 + HEADROOM);
  const CAP = 0.9;
  const isOver = (v: number) => isBroken && v / axisMax > CAP;
  const barHeight = (v: number, pairMax: number) => {
    if (isOver(v)) return `${(v / pairMax) * CAP * 100}%`;
    return `${Math.min(v / axisMax, CAP) * 100}%`;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[22px] font-bold text-navy">업종별 매출액</span>

        <div className="flex items-center gap-4 text-caption text-sub">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue/40" />
            {previousLabel}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue" />
            {currentLabel}
          </span>
        </div>
      </div>

      <div className="relative h-[515px]">
        <div
          className="absolute inset-x-0 bottom-8 flex flex-col justify-between"
          style={{ top: `${HEADROOM * 100}%` }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-px bg-border" />
          ))}
        </div>

        <div className="relative h-full flex items-stretch">
          {items.map((d) => {
            // 막대 높이용. null은 높이 0으로 그린다 (툴팁은 formatAmount가 '데이터 없음' 처리)
            const prev = d.previousSales ?? 0;
            const cur = d.sales ?? 0;
            const pairMax = Math.max(prev, cur);

            return (
              <div key={d.groupCode} className="flex-1 flex flex-col">
                <div className="relative flex-1 flex items-end justify-center gap-1.5">
                  <Tooltip
                    label={`${d.groupName} ${previousLabel} · ${formatAmount(d.previousSales)}`}
                    className="w-[24%] rounded-t-md bg-blue/40"
                    style={{ height: barHeight(prev, pairMax) }}
                  />
                  <Tooltip
                    label={`${d.groupName} ${currentLabel} · ${formatAmount(d.sales)}`}
                    className="w-[24%] rounded-t-md bg-blue"
                    style={{ height: barHeight(cur, pairMax) }}
                  />
                  {(isOver(prev) || isOver(cur)) && (
                    <span
                      className="absolute left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap text-caption font-bold text-navy"
                      style={{ bottom: barHeight(pairMax, pairMax) }}
                    >
                      {formatAmount(d.sales)}
                      {d.changeRate !== null && ` ${d.changeRate >= 0 ? '▲' : '▼'}${Math.abs(d.changeRate).toFixed(1)}%`}
                    </span>
                  )}
                  {(isOver(prev) || isOver(cur)) && <BreakMark />}
                </div>

                <span className="h-8 flex items-center justify-center text-caption text-sub">
                  {d.groupName}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BreakMark() {
  return (
    <svg className="absolute inset-x-0 bottom-[60%] h-3 w-full" viewBox="0 0 20 8" preserveAspectRatio="none">
      <path d="M0 3 Q2.5 0 5 3 T10 3 T15 3 T20 3 M0 6 Q2.5 3 5 6 T10 6 T15 6 T20 6"
        stroke="white" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
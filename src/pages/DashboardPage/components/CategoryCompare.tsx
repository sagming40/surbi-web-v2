import type { CategoryAvgSales } from '@/shared/types';
import { Tooltip } from './Tooltip';

interface CategoryCompareProps {
  current: CategoryAvgSales[];
  previous: CategoryAvgSales[];
  currentLabel: string;
  previousLabel: string;
}

const HEADROOM = 0.15;

export function CategoryCompare({
  current,
  previous,
  currentLabel,
  previousLabel,
}: CategoryCompareProps) {
  const prevByCode = new Map(previous.map((d) => [d.groupCode, d.avgSalesPerStore]));

  const max = Math.max(
    ...current.map((d) => d.avgSalesPerStore),
    ...previous.map((d) => d.avgSalesPerStore),
  );
  const axisMax = max * (1 + HEADROOM);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[22px] font-bold text-navy">업종 대분류별 점포당 평균 매출액</span>

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

      <div className="relative h-[420px]">
        <div 
          className="absolute inset-x-0 bottom-8 flex flex-col justify-between"
          style={{ top: `${HEADROOM * 100}%` }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-px bg-border" />
          ))}
        </div>

        <div className="relative h-full flex items-stretch">
          {current.map((d) => {
            const prev = prevByCode.get(d.groupCode) ?? 0;
            return (
              <div key={d.groupCode} className="flex-1 flex flex-col">
                <div className="flex-1 flex items-end justify-center gap-1.5">
                  <Tooltip
                    label={`${d.groupName} ${previousLabel} · ${(prev / 10_000).toLocaleString()}만원`}
                    className="w-[24%] rounded-t-md bg-blue/40"
                    style={{ height: `${(prev / axisMax) * 100}%` }}
                  />
                  <Tooltip
                    label={`${d.groupName} ${currentLabel} · ${(d.avgSalesPerStore / 10_000).toLocaleString()}만원`}
                    className="w-[24%] rounded-t-md bg-blue"
                    style={{ height: `${(d.avgSalesPerStore / axisMax) * 100}%` }}
                  />
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
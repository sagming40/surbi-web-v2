import type { DashboardTrendPoint } from '@/shared/types';
import { Tooltip } from './Tooltip';

interface QuarterlyTrendProps {
  items: DashboardTrendPoint[];
}

const HEADROOM = 0.15;

/** "2026Q1" → "26/1Q" */
const shortQuarter = (q: string) => `${q.slice(2, 4)}/${q.slice(5)}Q`;

export function QuarterlyTrend({ items }: QuarterlyTrendProps) {
  const max = Math.max(...items.map((d) => d.sales ?? 0));
  const axisMax = max * (1 + HEADROOM);
  const last = items.length - 1;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[22px] font-bold text-navy">분기별 점포당 평균 매출액</span>
        <span className="text-caption text-sub">단위 : 만원</span>
      </div>

      <div className="relative h-[429px]">
        <div
          className="absolute inset-x-0 bottom-8 flex flex-col justify-between"
          style={{ top: `${HEADROOM * 100}%` }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-px bg-border" />
          ))}
        </div>

        <div className="relative h-full flex items-stretch">
          {items.map((d, i) => (
            <div key={d.quarter} className="flex-1 flex flex-col">
              <div className="flex-1 flex flex-col justify-end items-center">
                <span
                  className={`text-caption mb-1 ${i === last ? 'text-blue font-bold' : 'text-sub'}`}
                >
                  {d.sales === null ? '데이터 없음' : Math.round(d.sales / 10_000).toLocaleString()}
                </span>
                <Tooltip
                  label={`${shortQuarter(d.quarter)} · ${d.sales === null ? '데이터 없음' : `${Math.round(d.sales / 10_000).toLocaleString()}만원`}`}
                  className={`w-[56%] rounded-t-md ${i === last ? 'bg-blue' : 'bg-blue/30'}`}
                  style={{ height: `${((d.sales ?? 0) / axisMax) * 100}%` }}
                />
              </div>

              <span
                className={`h-8 flex items-center justify-center text-caption ${
                  i === last ? 'text-text font-bold' : 'text-sub'
                }`}
              >
                {shortQuarter(d.quarter)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

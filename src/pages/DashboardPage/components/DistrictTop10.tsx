import type { DistrictTop10Item } from '@/shared/types';
import { formatKrw } from '@/shared/lib/format';
import { Tooltip } from './Tooltip';

interface DistrictTop10Props {
  items: DistrictTop10Item[];
}

export function DistrictTop10({ items }: DistrictTop10Props) {
  const max = items[0]?.sales ?? 1;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[22px] font-bold text-navy">자치구 매출 TOP 10</span>
        <span className="text-body text-sub">전체 보기</span>
      </div>

      {items.map((d) => (
        <div key={d.guCode} className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="w-6 text-body text-sub">{d.rank}</span>
            <span className="flex-1 text-headline text-text">{d.guName}</span>
            <span className="text-headline font-bold text-text">{formatKrw(d.sales)}</span>
          </div>
          
          <Tooltip
            className="h-[8px] rounded-full bg-surface"
            label={`${d.guName} ${formatKrw(d.sales)}${
              d.changeRate !== null ? ` · 전분기 대비 ${d.changeRate > 0 ? '+' : ''}${d.changeRate}%` : ''
            }`}
          >
             <div
              className="h-full rounded-full bg-blue"
              style={{ width: `${(d.sales / max) * 100}%` }}
            />
          </Tooltip>
        </div>
      ))}
      </div>
  );
}
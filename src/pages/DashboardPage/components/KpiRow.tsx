import type {DashboardKpi} from '@/shared/types';
import { formatKrw } from '@/shared/lib/format';

interface KpiRowProps {
  kpi: DashboardKpi;
  changeRate: Record<keyof DashboardKpi, number | null>;
}

const ITEMS: {
  key: keyof DashboardKpi;
  label: string;
  format: (v: number) => string;
}[] = [
  { key: 'totalSales', label: '서울 전체 분기 매출', format: formatKrw },
  { key: 'totalStores', label: '등록 점포 수', format: (v) => `${v.toLocaleString()}곳` },
  { key: 'newStores', label: '분기 신규 매장', format: (v) => `${v.toLocaleString()}개` },
  { key: 'closureRate', label: '평균 폐업 위험도', format: (v) => `${v}%` },
];

export function KpiRow({ kpi, changeRate }: KpiRowProps) {
  return (
    <div className="grid grid-cols-4 gap-7">
      {ITEMS.map(({ key, label, format }) => {
        const value = kpi[key];
        const rate = changeRate[key];
            
        return(
          <div key={key} className="flex flex-col gap-2">
            <span className="text-title text-sub">{label}</span>

            <span className="text-display font-bold text-text">
              {value === null ? '-' : format(value)}
            </span>

            {rate !== null && (
              <div className="text-headline">
                <span className={rate >= 0 ? 'text-blue' : 'text-red'}>
                  {rate >= 0 ? '+' : ''}{rate.toFixed(1)}%
                </span>
                <span className="text-sub"> 전분기 대비</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

import { GU_NAME_BY_CODE, GU_TILES } from '../guTiles';
import { SurbiCard } from '@/shared/ui/SurbiCard';
import { AvgSalesCard } from './AvgSalesCard';
import { DistrictTileGrid } from './DistrictTileGrid';
import { DistrictTop10 } from './DistrictTop10';
import { KpiRow } from './KpiRow';
import { PLACEHOLDER_CATEGORY, PLACEHOLDER_TREND } from '../placeholders';
import { QuarterlyTrend } from './QuarterlyTrend';
import type { DashboardResponse } from '@/shared/types/dashboard';
import { CategoryCompare } from './CategoryCompare';
import { ChartFallback } from './ChartFallback';
import { formatQuarter } from '@/shared/lib/format';

interface DashboardBodyProps {
  data: DashboardResponse;
}

export function DashboardBody({ data }: DashboardBodyProps) {
  const salesByGu = new Map(data.districtHeatmap.map((d) => [d.guCode, d.sales]));

  const tiles = GU_TILES.map((g) => ({
    guCode: g.guCode,
    guName: g.guName,
    sales: salesByGu.get(g.guCode) ?? null,
  }));

  const top10 = data.districtTop10.map((d) => ({
    ...d,
    guName: GU_NAME_BY_CODE.get(d.guCode) ?? d.guCode,
  }));

  const hasTrend = data.salesTrend.some((d) => d.sales !== null);
  const hasCategory = data.categorySales.some((d) => d.sales !== null || d.previousSales !== null);

  const currentLabel = formatQuarter(data.quarter);
  const prevQuarter = data.salesTrend.at(-2)?.quarter;
  const previousLabel = prevQuarter ? formatQuarter(prevQuarter) : '직전 분기';

  return (
    <div className="grid grid-cols-[480px_1fr] gap-12 px-10 py-6">

      {/* 좌측 — 자치구 계열을 카드 하나에 담는다 */}
      <SurbiCard className="px-[26px] py-6 flex flex-col gap-7 self-start">
        <AvgSalesCard
          value={data.avgSalesPerStore}
          changeRate={data.avgSalesPerStoreChangeRate}
          dongCount={data.dongCount}
        />

        {/* 카드 안쪽 여백을 상쇄해 선이 카드 끝까지 닿게 한다 */}
        <div className="h-px bg-border -mx-[26px] -my-1.5" />

        <DistrictTileGrid items={tiles} />

        <div className="h-px bg-border -mx-[26px] -my-1.5" />

        <DistrictTop10 items={top10} />
      </SurbiCard>

      <main className="flex flex-col gap-20 self-start">
        <KpiRow kpi={data.kpi} changeRate={data.kpiChangeRate} />
        {hasTrend
          ? <QuarterlyTrend items={data.salesTrend} />
          : <ChartFallback message="점포당 평균 추정매출 추이 데이터가 없습니다">
            <QuarterlyTrend items={PLACEHOLDER_TREND} />
          </ChartFallback>
        }
        {hasCategory
          ? <CategoryCompare
            items={data.categorySales}
            currentLabel={currentLabel}
            previousLabel={previousLabel}
            />
          : <ChartFallback message="업종별 매출액 데이터가 없습니다">
            <CategoryCompare
              items={PLACEHOLDER_CATEGORY}
              currentLabel={currentLabel}
              previousLabel={previousLabel}
            />
          </ChartFallback>
        }
      </main>

    </div>
  )
}


import { GU_NAME_BY_CODE, GU_TILES } from '../guTiles';
import { SurbiCard } from '@/shared/ui/SurbiCard';
import { AvgSalesCard } from './AvgSalesCard';
import { DistrictTileGrid } from './DistrictTileGrid';
import { DistrictTop10 } from './DistrictTop10';
import { KpiRow } from './KpiRow';
import { PLACEHOLDER_CATEGORY, PLACEHOLDER_CATEGORY_PREV, PLACEHOLDER_TREND } from '../placeholders';
import { QuarterlyTrend } from './QuarterlyTrend';
import type { DashboardResponse } from '@/shared/types/dashboard';
import { CategoryCompare } from './CategoryCompare';

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

        <div className="relative">
          <div className="blur-sm opacity-60 pointer-events-none select-none" aria-hidden>
            <QuarterlyTrend items={PLACEHOLDER_TREND} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-title font-bold text-text">분기별 매출 추이 데이터가 없습니다</p>
          </div>
        </div>
        <div className="relative">
          <div className="blur-sm opacity-60 pointer-events-none select-none" aria-hidden>
            <CategoryCompare
            current={PLACEHOLDER_CATEGORY}
            previous={PLACEHOLDER_CATEGORY_PREV}
            currentLabel="2026년 1분기"
            previousLabel="2025년 4분기"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-title font-bold text-text">분기별 매출 추이 데이터가 없습니다</p>
          </div>
        </div>
      </main>

    </div>
  )
}


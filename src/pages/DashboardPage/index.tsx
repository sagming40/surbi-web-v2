import { dashboardMock } from './mock';
import { SurbiCard } from '@/shared/ui/SurbiCard';
import { AvgSalesCard } from './components/AvgSalesCard';
import { DistrictTileGrid } from './components/DistrictTileGrid';
import { TopNav } from './components/TopNav';
import { KpiRow } from './components/KpiRow';
import { QuarterlyTrend } from './components/QuarterlyTrend';
import { CategoryCompare } from './components/CategoryCompare';
import { DistrictTop10 } from './components/DistrictTop10';

/**
 * 03 종합 대시보드.
 * 목업 실측(1440 기준): 좌우 여백 28, 컬럼 간격 20. 좌측 컬럼은 목업 400 → 600 (1.5배).
 * 헤더는 화면 끝까지 닿아야 하므로 여백은 바깥이 아니라 본문 grid에만 준다.
 */
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      <TopNav />

      <div className="grid grid-cols-[600px_1fr] gap-12 px-12 py-6">

        {/* 좌측 — 두 블록을 카드 하나에 담는다 (목업은 분리형이지만 합치기로 결정) */}
        <SurbiCard className="px-[33px] py-[30px] flex flex-col gap-10 self-start">
          <AvgSalesCard
            value={dashboardMock.avgSalesPerStore}
            changeRate={dashboardMock.avgSalesPerStoreChangeRate}
            dongCount={427}
          />

          {/* 카드 안쪽 여백을 상쇄해 선이 카드 끝까지 닿게 한다 */}
          <div className="h-px bg-border -mx-[33px] -my-2" />

          <DistrictTileGrid items={dashboardMock.districtHeatmap} />
        </SurbiCard>

        <main className="flex flex-col gap-10">
          {/* KPI 4개 · 분기별 추이 · 하단 2열 */}
          <KpiRow kpi={dashboardMock.kpi} changeRate={dashboardMock.kpiChangeRate} />

          <QuarterlyTrend items={dashboardMock.salesTrend} />

          

          <div className="grid grid-cols-3 gap-12">
            <div className="col-span-2">
              <CategoryCompare
                current={dashboardMock.categoryAvgSales}
                previous={dashboardMock.categoryAvgSalesPrev}
                currentLabel="2026년 1분기"
                previousLabel="2025년 4분기"
              />
            </div>
            
            <DistrictTop10 items={dashboardMock.districtTop10} />
          </div>
        </main>

      </div>
    </div>
  );
}

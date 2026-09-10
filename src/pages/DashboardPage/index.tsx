import { dashboardMock } from './mock';
import { AvgSalesCard } from './components/AvgSalesCard';
import { DistrictTileGrid } from './components/DistrictTileGrid';
import { TopNav } from './components/TopNav';

/**
 * 03 종합 대시보드.
 * 목업 실측(1440 기준): 좌우 여백 28, 좌측 컬럼 400, 컬럼 간격 20, 카드 세로 간격 20.
 */
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-surface font-sans px-7 py-6">
      <TopNav />
      <div className="grid grid-cols-[400px_1fr] gap-5">

        <aside className="flex flex-col gap-5">
          <AvgSalesCard
            value={dashboardMock.avgSalesPerStore}
            changeRate={dashboardMock.avgSalesPerStoreChangeRate}
            dongCount={427}
          />
          <DistrictTileGrid items={dashboardMock.districtHeatmap} />
        </aside>

        <main className="flex flex-col gap-5">
          {/* KPI 4개 · 분기별 추이 · 하단 2열 */}
        </main>

      </div>
    </div>
  );
}

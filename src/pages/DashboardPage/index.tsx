import { useState } from 'react';
import { getDashboardMock } from './mock';
import { MOCK_QUARTERS } from '@/shared/mock/quarters';
import { SurbiCard } from '@/shared/ui/SurbiCard';
import { AvgSalesCard } from './components/AvgSalesCard';
import { DistrictTileGrid } from './components/DistrictTileGrid';
import { TopNav } from '@/shared/ui/TopNav';
import { DropdownSelect } from '@/shared/ui/DropdownSelect';
import { formatQuarter } from '@/shared/lib/format';
import { KpiRow } from './components/KpiRow';
import { QuarterlyTrend } from './components/QuarterlyTrend';
import { CategoryCompare } from './components/CategoryCompare';
import { DistrictTop10 } from './components/DistrictTop10';
import { useBootstrap } from '@/shared/api/useBootstrap';
import type { Quarter } from '@/shared/types/common';

/**
 * 03 종합 대시보드.
 *
 * 좌측 컬럼에 자치구 계열(분포 격자 + TOP 10)을 모으고, 우측은 전체 지표와 업종 비교를 둔다.
 * 목업은 TOP 10이 우측 하단이지만, 같은 자치구 데이터를 붙여두는 편이 비교하기 좋다는 의견을 반영했다.
 * 타일 격자는 TOP 10 자리를 내주려고 목업 크기(타일 41px)로 되돌렸다.
 *
 * 헤더는 화면 끝까지 닿아야 하므로 여백은 바깥이 아니라 본문 grid에만 준다.
 */
export default function DashboardPage() {
  const { data: bootstrap } = useBootstrap();

  const [picked, setPicked] = useState<Quarter | null>(null);
  const quarters = bootstrap?.availableQuarters ?? MOCK_QUARTERS;
  const quarter = picked ?? bootstrap?.latestQuarter ?? MOCK_QUARTERS[0];
  const data = getDashboardMock(quarter);

  // 업종 차트 범례에 쓸 분기 표기
  const prevQuarter = data.salesTrend[data.salesTrend.length - 2]?.quarter ?? '';
  const label = (q: string) => (q ? `${q.slice(0, 4)}년 ${q.slice(5)}분기` : '');

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* 분기 셀렉터는 대시보드에서만 쓴다. 헤더 자체는 로고·탭만 책임진다 */}
      <TopNav>
        <DropdownSelect
          label="분기 선택"
          options={quarters.map((q) => ({ value: q, label: formatQuarter(q) }))}
          value={quarter}
          onChange={(q) => q && setPicked(q)}
        />
      </TopNav>

      <div className="grid grid-cols-[480px_1fr] gap-12 px-10 py-6">

        {/* 좌측 — 자치구 계열을 카드 하나에 담는다 */}
        <SurbiCard className="px-[26px] py-6 flex flex-col gap-7 self-start">
          <AvgSalesCard
            value={data.avgSalesPerStore}
            changeRate={data.avgSalesPerStoreChangeRate}
            dongCount={427}
          />

          {/* 카드 안쪽 여백을 상쇄해 선이 카드 끝까지 닿게 한다 */}
          <div className="h-px bg-border -mx-[26px] -my-1.5" />

          <DistrictTileGrid items={data.districtHeatmap} />

          <div className="h-px bg-border -mx-[26px] -my-1.5" />

          <DistrictTop10 items={data.districtTop10} />
        </SurbiCard>

        <main className="flex flex-col gap-20 self-start">
          <KpiRow kpi={data.kpi} changeRate={data.kpiChangeRate} />

          <QuarterlyTrend items={data.salesTrend} />

          <CategoryCompare
            current={data.categoryAvgSales}
            previous={data.categoryAvgSalesPrev}
            currentLabel={label(data.quarter)}
            previousLabel={label(prevQuarter)}
          />
        </main>

      </div>
    </div>
  );
}

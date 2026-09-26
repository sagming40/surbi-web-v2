import type { DashboardResponseDto } from '../dto/dashboard';
import type { DashboardResponse } from '@/shared/types';
import { calcChangeRate, pickMetric, toQuarter } from '../convert';

export function toDashboard(dto: DashboardResponseDto): DashboardResponse {
  if (!dto.meta.period) throw new Error('dashboard 응답에 기준 분기(meta.period)가 없습니다');

  const prevSales = pickMetric(dto.previous_sales);
  const prevStores = pickMetric(dto.previous_store_count);
  const prevAvg =
    prevSales === null || prevStores === null || prevStores === 0
      ? null
      : prevSales / prevStores;
  const avgSales = pickMetric(dto.average_sales_per_store);

  return {
    quarter: toQuarter(dto.meta.period),
    availableQuarters: [],
    kpi: {
      totalSales: pickMetric(dto.sales),
      totalStores: pickMetric(dto.store_count),
      newStores: pickMetric(dto.new_store_count),
      closureRate: pickMetric(dto.actual_closure_rate),
    },
    kpiChangeRate: {
      totalSales: dto.sales_change_rate,
      totalStores: dto.store_count_change_rate,
      newStores: null,
      closureRate: null,
    },
    avgSalesPerStore: avgSales,
    avgSalesPerStoreChangeRate: calcChangeRate(avgSales, prevAvg),
    dongCount: dto.dong_count,
    districtHeatmap: dto.gu_sales_distribution.map((item) => ({
      guCode: item.area.code,
      guName: item.area.name,
      sales: item.sales,
    })),
    districtTop10: dto.top_gu_by_sales.flatMap((item) => {
      if (item.rank === null || item.sales === null) return [];
      return{
        rank: item.rank,
        guCode: item.area.code,
        guName: item.area.name,
        sales: item.sales,
        changeRate: item.change_rate,
      };
    }),
    salesTrend: [],
    categoryAvgSales: [],
  };
}

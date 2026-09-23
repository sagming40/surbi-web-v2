import type { DashboardAreaRankingDto, DashboardResponseDto } from '../dto/dashboard';
import type { DashboardResponse, DistrictHeatmapItem, DistrictTop10Item } from '@/shared/types';
import { calcChangeRate, pickMetric, toQuarter } from '../convert';

export function toDashboard(dto: DashboardResponseDto): DashboardResponse {
  if (!dto.meta.period) throw new Error('dashboard 응답에 기준 분기(meta.period)가 없습니다');

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
    avgSalesPerStore: pickMetric(dto.average_sales_per_store),
    avgSalesPerStoreChangeRate: null, // 추후 계산 필요
    dongCount: dto.dong_count,
    districtHeatmap: [],
    districtTop10: [],
    salesTrend: [],
    categoryAvgSales: [],
  };
}

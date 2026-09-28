import type {
  ApiMetaDto,
  AreaRefDto,
  CapabilityStateDto,
  IndustryRefDto,
  NumericMetricDto,
  NumericValueDto,
  PeriodRefDto,
} from './common'

// surbi/backend/app/schemas/report.py — PeriodMetric
export interface PeriodMetricDto {
  period: PeriodRefDto;
  value: NumericValueDto | null;
}

// surbi/backend/app/schemas/report.py — IndustryMetricItem
export interface IndustryMetricItemDto {
  industry: IndustryRefDto;
  sales: NumericValueDto | null;
  sales_share: number | null;
  store_count: NumericValueDto | null;
  store_share: number | null;
  opened_store_count: NumericValueDto | null;
  closed_store_count: NumericValueDto | null;
}

// surbi/backend/app/schemas/dashboard.py — DashboardAreaRanking
export interface DashboardAreaRankingDto {
  rank: number | null;
  area: AreaRefDto;
  sales: NumericValueDto | null;
  change_rate: number | null;
}

// surbi/backend/app/schemas/dashboard.py — DashboardResponse
export interface DashboardResponseDto {
  meta: ApiMetaDto;
  sales: NumericMetricDto;
  previous_sales: NumericMetricDto;
  sales_change_rate: number | null;
  store_count: NumericMetricDto;
  previous_store_count: NumericMetricDto;
  store_count_change_rate: number | null;
  average_sales_per_store: NumericMetricDto;
  new_store_count: NumericMetricDto;
  actual_closure_rate: NumericMetricDto;
  dong_count: number;
  sales_trend: PeriodMetricDto[];
  gu_sales_distribution: DashboardAreaRankingDto[];
  top_gu_by_sales: DashboardAreaRankingDto[];
  top_industries_by_sales: DashboardIndustryMetricItemDto[];
  commercial_change_available: boolean;
  ml_closure_risk: CapabilityStateDto;
  previous_average_sales_per_store: NumericMetricDto;
  average_sales_per_store_change_rate: number | null;
  average_sales_per_store_trend: DashboardAverageSalesPerStoreTrendItemDto[];
}

// surbi/backend/app/schemas/dashboard.py — DashboardAverageSalesPerStoreTrendItem
// 분기별 매출·점포 수와 점포당 평균매출. 선택 분기까지 최근 최대 8개 분기, 오래된 분기부터 정렬
export interface DashboardAverageSalesPerStoreTrendItemDto {
  period: PeriodRefDto;
  sales: NumericValueDto | null;
  store_count: NumericValueDto | null;
  average_sales_per_store: NumericValueDto | null;
}

// surbi/backend/app/schemas/dashboard.py — DashboardIndustryMetricItem
// 외식업 10종(CS100001~CS100010)의 현재·직전 분기 매출. 직전 분기 점포 수는 제공하지 않음
export interface DashboardIndustryMetricItemDto {
  industry: IndustryRefDto;
  sales: NumericValueDto | null;
  sales_share: number | null;
  store_count: NumericValueDto | null;
  store_share: number | null;
  previous_sales: NumericValueDto | null;
  sales_change_rate: number | null;
}

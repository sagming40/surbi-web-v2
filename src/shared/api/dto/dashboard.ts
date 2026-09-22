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
    top_industries_by_sales: IndustryMetricItemDto[];
    commercial_change_available: boolean;
    ml_closure_risk: CapabilityStateDto;
}

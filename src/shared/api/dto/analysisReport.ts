import type { ApiMetaDto, AreaRefDto, NumericMetricDto } from './common';

/** POST /analysis-reports 응답의 백엔드 원본 형식(snake_case)이다. */
export interface AnalysisReportResponseDto {
  meta: ApiMetaDto;
  status: 'READY' | 'PARTIAL' | 'NOT_READY';
  area: AreaRefDto | null;
  industry_code: string | null;
  market_context: {
    available: boolean;
    overview: {
      sales: {
        amount: number | null;
        previous_amount: number | null;
        change_rate: number | null;
        rank: number | null;
        rank_total: number | null;
      } | null;
      store_count: NumericMetricDto;
      peak_sales_time: {
        from_hour: number | null;
        to_hour: number | null;
      } | null;
      dominant_customer: {
        days: string[];
        age_groups: string[];
        gender: 'MALE' | 'FEMALE' | null;
      } | null;
    } | null;
    population: {
      available: boolean;
      floating_population: NumericMetricDto;
      resident_population: NumericMetricDto;
      working_population: NumericMetricDto;
    } | null;
    context: {
      commercial_area_type: string | null;
      commercial_change: {
        name: string | null;
        index: NumericMetricDto;
        average_open_duration_months: NumericMetricDto;
        average_close_duration_months: NumericMetricDto;
      };
    } | null;
  };
  ml: {
    available: boolean;
    score: number | null;
    grade: string | null;
    expected_monthly_sales: number | null;
    closure_risk: number | null;
    factors: string[] | null;
  };
  summary: {
    available: boolean;
    location: string | null;
    strengths: string[] | null;
    risks: string[] | null;
  };
  missing_capabilities: string[];
}

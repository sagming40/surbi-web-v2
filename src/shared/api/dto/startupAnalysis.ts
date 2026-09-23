import type { ApiMetaDto, AreaRefDto, NumericMetricDto } from './common';

/** POST /startup-analysis 요청의 백엔드 형식(snake_case)이다. */
export interface StartupAnalysisRequestDto {
  area: {
    unit: 'GU';
    code: string;
  };
  industry_code: string;
  store: {
    size_m2: number;
    floor: number;
  };
  employment: {
    employee_count: number;
    weekly_hours_ge_15: boolean;
  };
}

export interface StartupAnalysisSalesDto {
  amount: number | null;
  previous_amount: number | null;
  change_rate: number | null;
  rank: number | null;
  rank_total: number | null;
  rank_scope: string | null;
}

export interface StartupAnalysisResponseDto {
  meta: ApiMetaDto;
  status: 'READY' | 'PARTIAL' | 'NOT_READY';
  area?: AreaRefDto | null;
  industry_code?: string | null;
  market_context: {
    available: boolean;
    overview: {
      sales: StartupAnalysisSalesDto | null;
      store_count: NumericMetricDto | null;
      peak_sales_time: {
        from_hour: number | null;
        to_hour: number | null;
      } | null;
    } | null;
  };
  rent: {
    available: boolean;
    value: number | null;
  };
  support_policies: {
    available: boolean;
    items: string[] | null;
  };
  missing_capabilities: string[];
}

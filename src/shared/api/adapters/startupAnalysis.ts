import { pickMetric, toQuarter } from '../convert';
import type { StartupAnalysisRequestDto, StartupAnalysisResponseDto } from '../dto/startupAnalysis';
import type { StartupAnalysisRequest, StartupAnalysisResponse } from '@/shared/types';

/** 화면의 camelCase 입력을 백엔드가 요구하는 snake_case 요청으로 바꾼다. */
export function toStartupAnalysisRequestDto(request: StartupAnalysisRequest): StartupAnalysisRequestDto {
  return {
    area: request.area,
    industry_code: request.industryCode,
    store: {
      size_m2: request.store.sizeM2,
      floor: request.store.floor,
    },
    employment: {
      employee_count: request.employment.employeeCount,
      weekly_hours_ge_15: request.employment.weeklyHoursGe15,
    },
  };
}

/** 백엔드 응답을 화면에서 사용할 camelCase 구조로 바꾼다. */
export function toStartupAnalysis(dto: StartupAnalysisResponseDto): StartupAnalysisResponse {
  return {
    meta: {
      quarter: dto.meta.period ? toQuarter(dto.meta.period) : null,
      generatedAt: dto.meta.generated_at,
      partial: dto.meta.partial,
    },
    status: dto.status,
    area: dto.area ?? null,
    industryCode: dto.industry_code ?? null,
    marketContext: {
      available: dto.market_context.available,
      overview: dto.market_context.overview
        ? {
            sales: dto.market_context.overview.sales
              ? {
                  amount: dto.market_context.overview.sales.amount,
                  previousAmount: dto.market_context.overview.sales.previous_amount,
                  changeRate: dto.market_context.overview.sales.change_rate,
                  rank: dto.market_context.overview.sales.rank,
                  rankTotal: dto.market_context.overview.sales.rank_total,
                  rankScope: dto.market_context.overview.sales.rank_scope,
                }
              : null,
            storeCount: pickMetric(dto.market_context.overview.store_count),
            peakSalesTime: dto.market_context.overview.peak_sales_time
              ? {
                  fromHour: dto.market_context.overview.peak_sales_time.from_hour,
                  toHour: dto.market_context.overview.peak_sales_time.to_hour,
                }
              : null,
          }
        : null,
    },
    rent: {
      available: dto.rent.available,
      value: dto.rent.available ? dto.rent.value : null,
    },
    supportPolicies: {
      available: dto.support_policies.available,
      items: dto.support_policies.available ? dto.support_policies.items : null,
    },
    missingCapabilities: dto.missing_capabilities,
  };
}

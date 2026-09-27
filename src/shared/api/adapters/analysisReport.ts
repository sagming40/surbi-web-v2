import { pickMetric, toQuarter } from '../convert';
import type { AnalysisReportResponseDto } from '../dto/analysisReport';
import type { AnalysisReportResponse } from '@/shared/types';

/** 백엔드의 snake_case 보고서 응답을 화면 전용 camelCase 구조로 바꾼다. */
export function toAnalysisReport(dto: AnalysisReportResponseDto): AnalysisReportResponse {
  const overview = dto.market_context.overview;
  const population = dto.market_context.population;
  const context = dto.market_context.context;

  return {
    meta: {
      quarter: dto.meta.period ? toQuarter(dto.meta.period) : null,
      generatedAt: dto.meta.generated_at,
      partial: dto.meta.partial,
    },
    status: dto.status,
    area: dto.area,
    industryCode: dto.industry_code,
    marketContext: {
      available: dto.market_context.available,
      overview: overview
        ? {
            sales: overview.sales
              ? {
                  amount: overview.sales.amount,
                  previousAmount: overview.sales.previous_amount,
                  changeRate: overview.sales.change_rate,
                  rank: overview.sales.rank,
                  rankTotal: overview.sales.rank_total,
                }
              : null,
            storeCount: pickMetric(overview.store_count),
            peakSalesTime: overview.peak_sales_time
              ? {
                  fromHour: overview.peak_sales_time.from_hour,
                  toHour: overview.peak_sales_time.to_hour,
                }
              : null,
            dominantCustomer: overview.dominant_customer
              ? {
                  days: overview.dominant_customer.days,
                  ageGroups: overview.dominant_customer.age_groups,
                  gender: overview.dominant_customer.gender,
                }
              : null,
          }
        : null,
      population: population
        ? {
            available: population.available,
            floatingPopulation: pickMetric(population.floating_population),
            residentPopulation: pickMetric(population.resident_population),
            workingPopulation: pickMetric(population.working_population),
          }
        : null,
      context: context
        ? {
            commercialAreaType: context.commercial_area_type,
            commercialChange: {
              name: context.commercial_change.name,
              index: pickMetric(context.commercial_change.index),
              averageOpenDurationMonths: pickMetric(context.commercial_change.average_open_duration_months),
              averageCloseDurationMonths: pickMetric(context.commercial_change.average_close_duration_months),
            },
          }
        : null,
    },
    ml: {
      available: dto.ml.available,
      score: dto.ml.available ? dto.ml.score : null,
      grade: dto.ml.available ? dto.ml.grade : null,
      expectedMonthlySales: dto.ml.available ? dto.ml.expected_monthly_sales : null,
      closureRisk: dto.ml.available ? dto.ml.closure_risk : null,
      factors: dto.ml.available ? dto.ml.factors : null,
    },
    summary: {
      available: dto.summary.available,
      location: dto.summary.available ? dto.summary.location : null,
      strengths: dto.summary.available ? dto.summary.strengths : null,
      risks: dto.summary.available ? dto.summary.risks : null,
    },
    missingCapabilities: dto.missing_capabilities,
  };
}

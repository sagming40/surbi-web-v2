import type { ExploreMetricValueDto, ExploreOverviewResponseDto } from '../dto/explore';
import type { SeoulMapResponse, MetricValue } from '@/shared/types';
import { toQuarter } from '../convert';

function toMetricValue(m: ExploreMetricValueDto): MetricValue {
  if (!m.available) {
    return {
      value: null,
      changeRate: null,
      rank: null,
    };
  }
  return {
    value: m.current,
    changeRate: m.change_rate,
    rank: m.rank,
  };
}

export function toSeoulMap(dto: ExploreOverviewResponseDto): SeoulMapResponse {
  if (!dto.meta.period) throw new Error('explore 응답에 기준 분기(meta.period)가 없습니다');

  const industryCode = dto.selection.industry_code;

  return {
    quarter: toQuarter(dto.meta.period),
    category: {
      code: industryCode,
      name: industryCode === null ? '전체 업종' : industryCode,
    },
    districtRanking: dto.items.map((item) => ({
      guCode: item.area.code,
      guName: item.area.name,
      sales: toMetricValue(item.sales),
      storeCount: toMetricValue(item.store_count),
      flowPopulation: toMetricValue(item.floating_population),
      residentPopulation: toMetricValue(item.resident_population),
    }))
  };
}

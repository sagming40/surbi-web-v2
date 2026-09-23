import type { NumericMetricDto } from './dto/common'
import type { Quarter } from '@/shared/types'      
import type { MetricCodeDto } from './dto/common'
import type { RankingMetricKey } from '@/shared/types'

export function pickMetric(m: NumericMetricDto | null | undefined): number | null {
  if (!m || !m.available) return null;
  return m.value;
}

export function toQuarter(periodCode: string): Quarter {
  const year = periodCode.slice(0, 4);
  const quarter = periodCode.slice(4);
  
  return `${year}Q${quarter}`;
}

export function toPeriodCode(quarterNum: Quarter): string {
  const year = quarterNum.slice(0, 4);
  const quarter = quarterNum.slice(5);
  return `${year}${quarter}`;
}

const METRIC_KEY: Record<MetricCodeDto, RankingMetricKey> = {
  sales: 'sales',
  store_count: 'storeCount',
  floating_population: 'flowPopulation',
  resident_population: 'residentPopulation',
};

export function toMetricKey(code: MetricCodeDto): RankingMetricKey {
  return METRIC_KEY[code];
}

export function calcChangeRate(current: number | null, previous: number | null): number | null {
  if (current === null || previous === null || previous === 0)
    return null;
  
  const rate = (current - previous) / previous * 100;
  return Math.round(rate * 10000) / 10000; // 소수점 4자리까지 반올림
}

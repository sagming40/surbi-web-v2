import type { CapabilitySetDto, IndustryRefDto, MetricCodeDto, PeriodRefDto } from './common'

export interface BootstrapResponseDto {
    latest_period: PeriodRefDto | null;
    previous_period: PeriodRefDto | null;
    periods: PeriodRefDto[];
    industries: IndustryRefDto[];
    commercial_area_types: string[];
    ranking_metrics: MetricCodeDto[];
    capabilities: CapabilitySetDto;
    canonical_counts: Record<string, number>;
}

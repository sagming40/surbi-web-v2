import type { ApiMetaDto, AreaRefDto, AreaUnitDto, MetricCodeDto, NumericValueDto } from '@/shared/api/dto/common';

export interface ExploreSelectionDto {
  level: AreaUnitDto;
  parent_code: string | null;
  industry_code: string | null;
  commercial_area_type: string | null;
}

export interface MetricMetadataDto {
  code: MetricCodeDto;
  label: string;
  unit: string;
  industry_filter_applied: boolean;
}

export interface Wgs84PositionDto {
  latitude: number | null;
  longitude: number | null;
  available: boolean;
}

export interface ExploreMetricValueDto {
  current: NumericValueDto | null;
  previous: NumericValueDto | null;
  change_rate: number | null;
  rank: number | null;
  available: boolean;
}

export interface ExploreOverviewItemDto {
  area: AreaRefDto;
  position: Wgs84PositionDto;
  sales: ExploreMetricValueDto;
  store_count: ExploreMetricValueDto;
  floating_population: ExploreMetricValueDto;
  resident_population: ExploreMetricValueDto;
}

export interface ExploreOverviewResponseDto {
  meta: ApiMetaDto;
  selection: ExploreSelectionDto;
  metrics: MetricMetadataDto[];
  total: number;
  items: ExploreOverviewItemDto[];
}

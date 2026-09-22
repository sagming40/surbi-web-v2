export type AreaUnitDto = 'SEOUL' | 'GU' | 'DONG' | 'COMMERCIAL_AREA' | 'COMMERCIAL_HINTERLAND';
export type CapabilityStateDto = 'READY' | 'PARTIAL' | 'NOT_READY';
export type MetricCodeDto = 'sales' | 'store_count' | 'floating_population' | 'resident_population';
export type NumericValueDto = number;

export interface ApiMetaDto { 
  period: string | null;
  generated_at: string;
  partial: boolean;
}

export interface AreaRefDto {
  unit: AreaUnitDto;
  code: string;
  name: string;
}

export type ParentAreaRefDto = AreaRefDto;

export interface PeriodRefDto {
  code: string;
  year: number;
  quarter: number;
}

export interface IndustryRefDto {
  code: string;
  name: string;
}

export interface NumericMetricDto {
  value: NumericValueDto;
  available: boolean;
}

export interface CapabilitySetDto {
  building_detail: CapabilityStateDto;
  startup_analysis: CapabilityStateDto;
  ml_analysis: CapabilityStateDto;
  favorites: CapabilityStateDto;
  auth: CapabilityStateDto;
}

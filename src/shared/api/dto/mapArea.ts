import type { AreaUnitDto } from './common';
import type { GeoJsonGeometry } from '@/shared/types';

/** GET /map/areas 응답의 Feature 속성 (backend: schemas/spatial.py MapAreaProperties) */
export interface MapAreaPropertiesDto {
  unit: AreaUnitDto;
  code: string;
  /** C-009 재적재 전에는 code와 같은 값이 올 수 있다 */
  name: string;
  category_name: string | null;
  type: string | null;
  signgu_code: string | null;
  dong_code: string | null;
  center: { latitude: number | null; longitude: number | null; available: boolean };
}

/** 영역 하나. geometry는 GeoJSON 표준이라 프론트 타입을 그대로 쓴다 */
export interface MapAreaFeatureDto {
  type: 'Feature';
  properties: MapAreaPropertiesDto;
  geometry: GeoJsonGeometry;
}

/** GET /map/areas?unit=GU | DONG&parent_code= | SEOUL */
export interface MapAreaFeatureCollectionDto {
  type: 'FeatureCollection';
  features: MapAreaFeatureDto[];
}


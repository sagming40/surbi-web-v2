import { apiClient } from './client';
import { toDistrictGeos, toDongGeos, toSeoulOutline } from './adapters/mapArea';
import type { MapAreaFeatureCollectionDto } from './dto/mapArea';
import type { DistrictGeo, DongGeo, GeoJsonGeometry } from '@/shared/types';

/** 자치구 경계 25개. 원본 좌표라 응답이 크다(약 1.5MB) — 훅에서 한 번만 받는다 */
export async function getDistrictGeos(): Promise<DistrictGeo[]> {
  const response = await apiClient.get<MapAreaFeatureCollectionDto>('/map/areas', {
    params: { unit: 'GU' },
  });
  return toDistrictGeos(response.data);
}

/** 서울 외곽선 1개 */
export async function getSeoulOutline(): Promise<GeoJsonGeometry> {
  const response = await apiClient.get<MapAreaFeatureCollectionDto>('/map/areas', {
    params: { unit: 'SEOUL' },
  });
  return toSeoulOutline(response.data);
}

export async function getDongGeos(guCode: string): Promise<DongGeo[]> {
  const response = await apiClient.get<MapAreaFeatureCollectionDto>('/map/areas', {
    params: { unit: 'DONG', parent_code: guCode },
  });
  return toDongGeos(response.data);
}


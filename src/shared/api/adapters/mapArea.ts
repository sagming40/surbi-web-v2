import type { MapAreaFeatureCollectionDto, MapAreaPropertiesDto } from '../dto/mapArea';
import type { DistrictGeo, DongGeo, GeoJsonGeometry, LatLng, TrdarGeo } from '@/shared/types';

/** GET /map/areas?unit=GU → 자치구 경계 25개 */
export function toDistrictGeos(dto: MapAreaFeatureCollectionDto): DistrictGeo[] {
  return dto.features.map((f) => ({
    guCode: f.properties.code,
    guName: f.properties.name,
    geometry: f.geometry,
  }));
}

/** GET /map/areas?unit=SEOUL → 서울 외곽선 1개 */
export function toSeoulOutline(dto: MapAreaFeatureCollectionDto): GeoJsonGeometry {
  const seoul = dto.features[0];
  if (!seoul) throw new Error('map/areas 응답에 서울 외곽선(unit=SEOUL)이 없습니다');
  return seoul.geometry;
}

function toLatLng(c: MapAreaPropertiesDto['center']): LatLng | null {
  if (c.available && c.latitude !== null && c.longitude !== null) {
    return { lat: c.latitude, lng: c.longitude };
  }
  return null;
}

/** GET /map/areas?unit=DONG → 행정동 경계 목록 */
export function toDongGeos(dto: MapAreaFeatureCollectionDto): DongGeo[] {
  return dto.features.map((f) => ({
    dongCode: f.properties.code,
    dongName: f.properties.name,
    geometry: f.geometry,
    center: toLatLng(f.properties.center),
  }));
}

export function toTrdarGeos(dto: MapAreaFeatureCollectionDto): TrdarGeo[] {
  return dto.features.map((f) => ({
    trdarCode: f.properties.code,
    trdarName: f.properties.name,
    trdarTypeName: f.properties.category_name ?? '',
    trdarTypeCode: f.properties.type ?? '',
    geometry: f.geometry,
    center: toLatLng(f.properties.center),
  }));
}
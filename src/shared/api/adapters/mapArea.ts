import type { MapAreaFeatureCollectionDto } from '../dto/mapArea';
import type { DistrictGeo, GeoJsonGeometry } from '@/shared/types';

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

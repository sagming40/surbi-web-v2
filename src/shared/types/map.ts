/**
 * 지도 · 랭킹 타입
 *
 * 대상 API
 *   GET /api/geo/districts        자치구 목록·영역
 *   GET /api/geo/dongs            행정동 목록·영역
 *   GET /api/geo/trdars           상권 목록·영역
 *   GET /api/map/seoul            서울 전체 지도 탐색 (01)
 *   GET /api/map/districts/{gu}   자치구 내 행정동 랭킹 (01b)
 */

import type {
  GuCode, DongCode, TrdarCode,
  AppliedCategory, GeoJsonGeometry, LatLng,
  QuarterScoped, QuarterParam, CategoryParam, RankingMetrics,
} from './common';

// ─────────────────────────────────────────────
// 영역(GeoJSON) — 자주 안 바뀌므로 최초 조회 후 프론트 캐시
// ─────────────────────────────────────────────

/** GET /api/geo/districts — 파라미터 없음 */
export interface DistrictGeoListResponse {
  districts: DistrictGeo[];
}

export interface DistrictGeo {
  guCode: GuCode;
  guName: string;
  geometry: GeoJsonGeometry;
}

/** GET /api/geo/dongs?guCode= */
export interface DongGeoListRequest {
  guCode: GuCode;
}

export interface DongGeoListResponse {
  guCode: GuCode;
  guName: string;
  dongs: DongGeo[];
}

export interface DongGeo {
  dongCode: DongCode;
  dongName: string;
  geometry: GeoJsonGeometry;
  /** 지도 라벨·이동용 중심좌표 */
  center: LatLng;
}

/** GET /api/geo/trdars?guCode= */
export interface TrdarGeoListRequest {
  guCode: GuCode;
}

export interface TrdarGeoListResponse {
  guCode: GuCode;
  guName: string;
  trdars: TrdarGeo[];
}

/**
 * 상권 구분.
 * 코드와 표시명이 분리되어 오므로, 화면 로직은 Code를 기준으로 판단하고
 * 사용자에게 보여줄 때는 Name을 쓴다.
 */
export interface TrdarGeo {
  trdarCode: TrdarCode;
  trdarName: string;
  /** 상권 구분 코드 (예: "A") */
  trdarTypeCode: string;
  /** 상권 구분명 (골목상권 / 발달상권 / 전통시장 / 관광특구) */
  trdarTypeName: string;
  geometry: GeoJsonGeometry;
  center: LatLng;
}

// ─────────────────────────────────────────────
// 01 · 서울 전체 지도 탐색
// ─────────────────────────────────────────────

/** GET /api/map/seoul */
export interface SeoulMapRequest extends QuarterParam, CategoryParam {}

export interface SeoulMapResponse extends QuarterScoped {
  category: AppliedCategory;
  /** 자치구 25개. 지표 4종을 한 번에 담아 토글 시 재호출하지 않는다 */
  districtRanking: DistrictRankingItem[];
}

export interface DistrictRankingItem extends RankingMetrics {
  guCode: GuCode;
  guName: string;
}

// ─────────────────────────────────────────────
// 01b · 자치구 내 행정동 랭킹
// ─────────────────────────────────────────────

/** GET /api/map/districts/{guCode} */
export interface DistrictMapRequest extends QuarterParam, CategoryParam {
  guCode: GuCode;
}

export interface DistrictMapResponse extends QuarterScoped {
  guCode: GuCode;
  guName: string;
  /** 패널 부제 "17개 행정동" 표시에 사용 */
  dongCount: number;
  category: AppliedCategory;
  dongRanking: DongRankingItem[];
}

export interface DongRankingItem extends RankingMetrics {
  dongCode: DongCode;
  dongName: string;
}

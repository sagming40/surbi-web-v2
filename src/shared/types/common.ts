/**
 * 공통 타입
 *
 * 여러 API 응답에서 반복되는 기본 단위를 모아둔다.
 * 새 타입을 만들기 전에 여기 이미 있는지 먼저 확인할 것.
 */

// ─────────────────────────────────────────────
// 코드 별칭
// ─────────────────────────────────────────────
// 전부 문자열이지만 체계가 서로 다르다. 이름을 붙여두면
// 함수 시그니처만 봐도 무엇을 넣어야 하는지 드러난다.

/** 자치구 코드 (예: "11200") */
export type GuCode = string;

/** 행정동 코드 (예: "1120054000") */
export type DongCode = string;

/** 상권 코드 (예: "2110001") — 행정동과 별도 체계, 조인 불가 */
export type TrdarCode = string;

/** 서비스 업종 코드 (예: "CS100001") */
export type CategoryCode = string;

/** 건물 식별자 (예: "BLD_11200_000182") */
export type BuildingId = string;

/** 분석 결과 식별자 (예: "anl_2026q2_11200_cs100001_a91f") */
export type AnalysisId = string;

/** 기준 분기 (예: "2026Q2") */
export type Quarter = string;

// ─────────────────────────────────────────────
// 업종
// ─────────────────────────────────────────────

/**
 * 응답에 실려 오는 "현재 적용 업종".
 * 전체 업종으로 조회한 경우 code가 null이다.
 */
export interface AppliedCategory {
  code: CategoryCode | null;
  name: string;
}

/** GET /api/meta/categories */
export interface CategoryListResponse {
  categories: CategoryGroup[];
}

export interface CategoryGroup {
  groupCode: string;
  groupName: string;
  items: CategoryItem[];
}

export interface CategoryItem {
  categoryCode: CategoryCode;
  categoryName: string;
}

// ─────────────────────────────────────────────
// 랭킹 지표
// ─────────────────────────────────────────────

/** 좌측 랭킹 패널(S0)의 지표 토글 4종 */
export type RankingMetricKey =
  | 'storeCount'
  | 'sales'
  | 'flowPopulation'
  | 'residentPopulation';

/** 랭킹 정렬 기준 2종 — 프론트에서만 처리, API 재호출 없음 */
export type RankingSort = 'rank' | 'growth';

/**
 * 지표 공통 구조.
 * 01(서울 전체)·01b(자치구 내) 랭킹에서 4개 지표가 모두 이 형태다.
 *
 * rank는 서버가 계산해서 내려준다 — 프론트에서 정렬 순위를 다시 매길 필요 없음.
 */
export interface MetricValue {
  /** 현재분기 값. 데이터가 없으면 null */
  value: number | null;
  /** 직전분기 대비 증감률(%). 직전분기가 0이거나 비교 불가면 null */
  changeRate: number | null;
  /** 해당 범위(서울 25개 구 / 자치구 내 행정동) 내 순위. 값 없으면 null */
  rank: number | null;
}

/** 랭킹 한 행이 담는 지표 4종 세트 */
export interface RankingMetrics {
  storeCount: MetricValue;
  sales: MetricValue;
  /** 업종 필터의 영향을 받지 않는다 */
  flowPopulation: MetricValue;
  /** 업종 필터의 영향을 받지 않는다 */
  residentPopulation: MetricValue;
}

// ─────────────────────────────────────────────
// 지리 · 좌표
// ─────────────────────────────────────────────

export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * 지도 표시용 GeoJSON.
 * 원천은 서울시 SHP이지만 API는 GeoJSON으로 변환해 반환한다.
 */
export interface GeoJsonGeometry {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: number[][][] | number[][][][];
}

/** 남서·북동 두 꼭짓점으로 표현하는 사각 범위 */
export interface LatLngBounds {
  sw: LatLng;
  ne: LatLng;
}

// ─────────────────────────────────────────────
// 요청 파라미터 공통
// ─────────────────────────────────────────────

/** 분기를 선택적으로 지정. 미지정 시 서버가 최신 분기 사용 */
export interface QuarterParam {
  quarter?: Quarter;
}

/** 업종 필터가 선택적으로 걸리는 요청 파라미터 */
export interface CategoryParam {
  /** 미지정 시 전체 업종 */
  categoryCode?: CategoryCode;
}

// ─────────────────────────────────────────────
// 응답 공통
// ─────────────────────────────────────────────

/**
 * 조회 응답에 공통으로 실리는 기준분기.
 * 화면의 "OO년 O분기 기준" 문구를 이 값으로 렌더링한다.
 */
export interface QuarterScoped {
  /** 서버가 실제로 적용한 기준 분기 */
  quarter: Quarter;
}

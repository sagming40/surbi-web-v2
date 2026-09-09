/**
 * 대시보드 · 건물 상세 타입
 *
 * 대상 API
 *   GET /api/dashboard              종합 대시보드 (03)
 *   GET /api/buildings/{buildingId} 건물 상세 (08)
 */

import type {
  GuCode, DongCode, BuildingId, CategoryCode,
  Quarter, QuarterScoped, QuarterParam, CategoryParam, LatLng,
} from './common';

// ─────────────────────────────────────────────
// 03 · 종합 대시보드
// ─────────────────────────────────────────────

/** GET /api/dashboard */
export interface DashboardRequest extends QuarterParam {}

export interface DashboardResponse extends QuarterScoped {
  /** 분기 셀렉터를 채울 조회 가능 분기 목록 */
  availableQuarters: Quarter[];
  kpi: DashboardKpi;
  /** 점포당 평균 추정매출 */
  avgSalesPerStore: number | null;
  /** 최근 8개 분기 매출 추이 */
  salesTrend: DashboardTrendPoint[];
  districtHeatmap: DistrictHeatmapItem[];
  categoryAvgSales: CategoryAvgSales[];
  districtTop10: DistrictTop10Item[];
}

export interface DashboardKpi {
  totalSales: number;
  totalStores: number;
  newStores: number;
  /**
   * 해당 분기 전체 폐업률(%).
   * 실제 개·폐업 통계이며 ML 예측값 closureRisk와 구분한다.
   */
  closureRate: number | null;
}

export interface DashboardTrendPoint {
  quarter: Quarter;
  sales: number;
}

/** /api/geo/districts 폴리곤과 guCode로 조인해서 지도에 칠한다 */
export interface DistrictHeatmapItem {
  guCode: GuCode;
  guName: string;
  sales: number;
}

export interface CategoryAvgSales {
  groupCode: string;
  groupName: string;
  avgSalesPerStore: number;
}

export interface DistrictTop10Item {
  rank: number;
  guCode: GuCode;
  guName: string;
  sales: number;
  changeRate: number | null;
}

// ─────────────────────────────────────────────
// 08 · 건물 상세
// ─────────────────────────────────────────────

/** GET /api/buildings/{buildingId} */
export interface BuildingDetailRequest extends QuarterParam, CategoryParam {
  buildingId: BuildingId;
}

export interface BuildingDetailResponse {
  buildingId: BuildingId;
  buildingName: string | null;
  roadAddress: string | null;
  lotAddress: string | null;
  location: LatLng | null;
  /** 건물 내 영업중 매장 목록 */
  stores: BuildingStore[];
  /** 업종 대분류별 매장 수 — 업종 탭 카운트에 사용 */
  categoryCounts: BuildingCategoryCount[];
  /**
   * 소속 행정동 기준 요약.
   * 건물 단위 매출은 카드사 결제 데이터가 없어 산출 불가하므로,
   * 행정동 단위 지표를 참고값으로 제공한다.
   */
  dongSummary: BuildingDongSummary | null;
}

export interface BuildingStore {
  storeId: string;
  name: string;
  categoryLargeCode: string;
  categoryLargeName: string;
  categoryCode: CategoryCode;
  categoryName: string;
  /** 층 정보 (예: "1", "B1") */
  floor: string;
}

export interface BuildingCategoryCount {
  categoryLargeCode: string;
  categoryLargeName: string;
  count: number;
}

export interface BuildingDongSummary {
  quarter: Quarter;
  dongCode: DongCode;
  dongName: string;
  sales: number;
  competitorCount: number;
  /** categoryCode 없이 조회하면 null (전체 업종 기준으로는 의미 없는 값) */
  aiScore: number | null;
}

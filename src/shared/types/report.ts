/**
 * 분석 리포트 타입 (S1 패널)
 *
 * 대상 API
 *   GET /api/dongs/{dongCode}/report    행정동 분석 리포트 (01c)
 *   GET /api/trdars/{trdarCode}/report  상권 분석 리포트 (01d)
 *
 * 두 응답은 식별 정보만 다르고 본문(summary/industry/sales/population/region)
 * 구조가 동일하므로 BaseReport로 공유한다.
 *
 * 탭 전환은 프론트에서 처리하며 API를 다시 호출하지 않는다.
 */

import type {
  DongCode, GuCode, TrdarCode, CategoryCode,
  AppliedCategory, QuarterScoped, QuarterParam, CategoryParam,
} from './common';

// ─────────────────────────────────────────────
// 공통 구성 요소
// ─────────────────────────────────────────────

/** 라벨 + 금액 쌍 (요일별·성별·연령대별 매출) */
export interface LabeledAmount {
  label: string;
  amount: number;
}

/** 라벨 + 값 + 비율 (연령대별·성별 인구 구성) */
export interface LabeledComposition {
  label: string;
  value: number;
  /** 구성 비율(%) */
  ratio: number;
}

/** 시간대 6구간 매출 */
export interface HourlySales {
  /** 시간대 구간 (예: "11-14") */
  timeRange: string;
  amount: number;
}

/** 분기별 매출 추이 한 점 */
export interface QuarterSales {
  quarter: string;
  amount: number;
}

// ─────────────────────────────────────────────
// 탭 1 · 요약
// ─────────────────────────────────────────────

export interface ReportSummary {
  /** 해당 분기 추정매출 */
  sales: number;
  /** 직전분기 대비 증감률(%). 비교 데이터 없거나 직전분기가 0이면 null */
  salesChangeRate: number | null;
  guRank: GuRank;
  hourlySales: HourlySales[];
  dayGenderAgeSales: DayGenderAgeSales;
  /** 업종 미선택이거나 모델 산출 불가 시 null */
  aiScorePreview: number | null;
}

export interface GuRank {
  rank: number;
  /** 자치구 내 전체 행정동 수(01c) 또는 전체 상권 수(01d) */
  total: number;
}

export interface DayGenderAgeSales {
  daily: LabeledAmount[];
  gender: LabeledAmount[];
  age: LabeledAmount[];
}

// ─────────────────────────────────────────────
// 탭 2 · 업종 (industry)
// ─────────────────────────────────────────────

export interface ReportIndustry {
  totalStores: number;
  categoryComposition: CategoryComposition[];
  categorySales: CategorySales[];
  newStores: number;
  closedStores: number;
}

export interface CategoryComposition {
  categoryCode: CategoryCode;
  categoryName: string;
  storeCount: number;
  /** 점포 비율(%) */
  ratio: number;
}

export interface CategorySales {
  categoryCode: CategoryCode;
  categoryName: string;
  amount: number;
  /** 매출 비율(%) */
  ratio: number;
}

// ─────────────────────────────────────────────
// 탭 3 · 매출
// ─────────────────────────────────────────────

export interface ReportSales {
  /** 최근 8개 분기 매출 추이 */
  trend: QuarterSales[];
  hourly: HourlySales[];
  daily: LabeledAmount[];
  /** 매출금액 ÷ 매출건수. 매출건수가 0이거나 없으면 null */
  averageOrderValue: number | null;
}

// ─────────────────────────────────────────────
// 탭 4 · 인구 (업종 필터 영향 없음)
// ─────────────────────────────────────────────

export interface ReportPopulation {
  /** 총 유동인구 */
  flow: number;
  /** 총 직장인구 */
  worker: number;
  /** 총 상주인구 */
  resident: number;
  ageComposition: LabeledComposition[];
  genderComposition: LabeledComposition[];
  weekdayWeekend: WeekdayWeekend;
}

export interface WeekdayWeekend {
  weekday: number;
  weekend: number;
}

// ─────────────────────────────────────────────
// 탭 5 · 지역 (region, 업종 필터 영향 없음)
// ─────────────────────────────────────────────

export interface ReportRegion {
  areaProfile: AreaProfile;
  nearestSubway: NearestSubway | null;
  nearbyTrdars: NearbyTrdar[];
  /** 면적(㎡) */
  areaM2: number;
  /** 1㎢당 점포수 */
  storeDensity: number;
}

/**
 * 유동·직장·주거 비중 기반 지역 성격.
 * type은 서울시 원본 분류가 아니라 Surbi 내부 산출값이다.
 */
export interface AreaProfile {
  /** 유입형 / 직장형 / 주거형 등 */
  type: string;
  flowRatio: number;
  workerRatio: number;
  residentRatio: number;
}

/**
 * 가장 가까운 지하철역.
 * 경로탐색 기능이 없으므로 도보시간이 아닌 직선거리(m)로 표현한다.
 */
export interface NearestSubway {
  stationName: string;
  distanceM: number;
  boarding: number | null;
  alighting: number | null;
}

export interface NearbyTrdar {
  trdarCode: TrdarCode;
  trdarName: string;
  distanceM: number;
}

// ─────────────────────────────────────────────
// 리포트 공통 본문
// ─────────────────────────────────────────────

/**
 * 01c와 01d가 공유하는 본문.
 * 탭이 추가되면 여기 한 곳만 고치면 양쪽에 반영된다.
 */
export interface BaseReport extends QuarterScoped {
  category: AppliedCategory;
  summary: ReportSummary;
  industry: ReportIndustry;
  sales: ReportSales;
  population: ReportPopulation;
  region: ReportRegion;
}

// ─────────────────────────────────────────────
// 01c · 행정동 리포트
// ─────────────────────────────────────────────

/** GET /api/dongs/{dongCode}/report */
export interface DongReportRequest extends QuarterParam, CategoryParam {
  dongCode: DongCode;
}

export interface DongReportResponse extends BaseReport {
  dongCode: DongCode;
  dongName: string;
  guCode: GuCode;
  guName: string;
}

// ─────────────────────────────────────────────
// 01d · 상권 리포트
// ─────────────────────────────────────────────

/** GET /api/trdars/{trdarCode}/report */
export interface TrdarReportRequest extends QuarterParam, CategoryParam {
  trdarCode: TrdarCode;
}

export interface TrdarReportResponse extends BaseReport {
  trdarCode: TrdarCode;
  trdarName: string;
  trdarTypeCode: string;
  trdarTypeName: string;
  guCode: GuCode;
  guName: string;
}

/** 두 리포트를 한 컴포넌트에서 다룰 때 사용 */
export type ReportResponse = DongReportResponse | TrdarReportResponse;

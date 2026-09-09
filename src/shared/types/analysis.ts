/**
 * 분석 · 계산 계열 타입
 *
 * 대상 API
 *   POST /api/areas/custom     직접 범위 분석 (01e)
 *   POST /api/wizard/result    창업 계산 결과 생성 (05)
 *   POST /api/report           AI 분석 보고서 생성 (07)
 *   POST /api/simulations      창업 시뮬레이션 실행 (12)
 *
 * 좌표·입력값을 보내거나 ML이 그때그때 계산하는 요청이라 전부 POST다.
 */

import type {
  GuCode, DongCode, TrdarCode, CategoryCode, BuildingId, AnalysisId,
  AppliedCategory, LatLng, LatLngBounds, Quarter, QuarterScoped,
} from './common';

// ─────────────────────────────────────────────
// 01e · 직접 범위 분석
// ─────────────────────────────────────────────

/**
 * POST /api/areas/custom
 *
 * 프론트는 사용자가 그린 좌표만 전달하고, 공간 교차 계산은 서버가 수행한다.
 */
export interface CustomAreaRequest {
  shape: 'circle' | 'rectangle';
  /** shape가 circle일 때 필수 */
  center?: LatLng | null;
  /** shape가 circle일 때 필수 */
  radiusM?: number | null;
  /** shape가 rectangle일 때 필수 */
  bounds?: LatLngBounds | null;
  categoryCode?: CategoryCode | null;
  quarter?: Quarter;
}

export interface CustomAreaResponse extends QuarterScoped {
  category: AppliedCategory;
  /** 사용자 지정 범위 면적(㎡) */
  areaM2: number;
  includedDongs: IncludedDong[];
  /**
   * 행정동 매출을 교차 면적 비율로 가중한 **추정값**.
   * 실제 도형 내부 매출로 단정해서 표시하지 않는다.
   */
  estimatedSales: number | null;
  /** 범위 내부 실제 점포 좌표 기준 (면적 비율 배분 아님) */
  storeCount: number;
  competitorCount: number;
  /** storeCount / (areaM2 / 1,000,000) */
  storeDensity: number;
}

export interface IncludedDong {
  dongCode: DongCode;
  dongName: string;
  /** 해당 행정동 면적 중 사용자 범위와 겹치는 비율 (0~1) */
  overlapRatio: number;
}

// ─────────────────────────────────────────────
// 05 · 창업 계산 결과 생성
// ─────────────────────────────────────────────

/** POST /api/wizard/result */
export interface WizardResultRequest {
  guCode: GuCode;
  categoryCode: CategoryCode;
  /** 예상 매장 면적(㎡) */
  storeSizeM2: number;
  floor: number;
  staffCount: number;
  /** 주 15시간 이상 근무 예상 직원 수. staffCount보다 클 수 없다 */
  staff15hPlusCount: number;
  quarter?: Quarter;
}

export interface WizardResultResponse extends QuarterScoped {
  /** 07 상세 보고서에서 동일 계산 결과를 재사용하기 위한 식별자 */
  analysisId: AnalysisId;
  region: RegionInfo;
  category: AppliedCategory;
  rent: RentEstimate;
  aiScore: number;
  /** 동일 업종 기준 서울 25개 자치구 중 순위. 비교 불가 시 null */
  seoulRank: SeoulRank | null;
  expectedMonthlySales: number | null;
  /** ML 예측값. 대시보드의 실제 통계 closureRate와 다른 값이다 */
  closureRisk: number | null;
  competitorCount: number;
  policies: SupportPolicy[];
}

export interface RegionInfo {
  guCode: GuCode;
  guName: string;
}

export interface SeoulRank {
  rank: number;
  total: number;
}

/** 한국부동산원 기준. 추정치임을 UI에 표시할 것 */
export interface RentEstimate {
  /** 입력 면적 기준 월 임대료 추정액 */
  estimatedMonthlyRent: number | null;
  rentPerM2: number | null;
  referenceByScale: {
    small: number;
    medium: number;
    large: number;
  };
}

export interface SupportPolicy {
  policyId: string;
  title: string;
  organization: string;
  /** ISO 날짜 (예: "2026-09-01") */
  startDate: string;
  endDate: string;
  supportUrl: string;
}

// ─────────────────────────────────────────────
// 07 · AI 분석 보고서
// ─────────────────────────────────────────────

/** 분석 대상 유형 */
export type AnalysisTargetType = 'gu' | 'dong' | 'trdar';

/**
 * POST /api/report
 *
 * 두 진입 경로가 같은 화면에 도착하므로 요청 타입을 하나로 통일했다.
 *   위저드 경로 → analysisId만 전달 (05에서 만든 ML 결과 재사용)
 *   지도 경로   → targetType + targetId + categoryCode 전달
 */
export interface AiReportRequest {
  /** 위저드 경로일 때 사용 */
  analysisId?: AnalysisId | null;
  /** 지도 경로일 때 "dong" 또는 "trdar" */
  targetType?: Extract<AnalysisTargetType, 'dong' | 'trdar'> | null;
  /** 행정동 코드 또는 상권 코드 */
  targetId?: DongCode | TrdarCode | null;
  categoryCode?: CategoryCode | null;
  quarter?: Quarter;
}

export interface AiReportResponse extends QuarterScoped {
  analysisId: AnalysisId;
  target: AnalysisTarget;
  category: AppliedCategory;
  score: number;
  /** 점수 구간 기반 등급 (예: "B+") */
  grade: string;
  expectedMonthlySales: number | null;
  closureRisk: number | null;
  competitorCount: number;
  contributionFactors: ContributionFactor[];
  calculationSteps: CalculationStep[];
  /** 예측값을 확정적 사실처럼 표현하지 않는 자연어 요약 */
  llmSummary: string;
}

export interface AnalysisTarget {
  /** 위저드 경로에서는 입력 단위인 "gu"가 될 수 있다 */
  type: AnalysisTargetType;
  id: string;
  name: string;
}

/**
 * 모델 피처별 기여 정보.
 *
 * shapValue(원값)와 importanceRatio(표시용 정규화값)는 별개다.
 * SHAP 원값을 그대로 퍼센트로 표현하지 말 것.
 */
export interface ContributionFactor {
  /** 피처 키 (예: "flowPopulation") */
  feature: string;
  /** 화면 표시명 (예: "유동인구") */
  label: string;
  /** 분석에 사용된 실제 입력값 */
  value: number | null;
  /** 모델 출력에 대한 SHAP 기여값 (부호 있음) */
  shapValue: number | null;
  /** 절대 SHAP값을 정규화한 화면 표시용 중요도(%) */
  importanceRatio: number | null;
  direction: 'positive' | 'negative' | 'neutral';
}

export interface CalculationStep {
  /** 1~4 */
  step: number;
  title: string;
  description: string;
}

// ─────────────────────────────────────────────
// 12 · 창업 시뮬레이션
// ─────────────────────────────────────────────

/**
 * POST /api/simulations
 *
 * guCode와 center 중 하나 이상 필수.
 * center를 쓸 경우 radiusM도 함께 보내야 한다.
 */
export interface SimulationRequest {
  categoryCode: CategoryCode;
  guCode?: GuCode | null;
  center?: LatLng | null;
  radiusM?: number | null;
  quarter?: Quarter;
}

export interface SimulationResponse extends QuarterScoped {
  simulationId: string;
  category: AppliedCategory;
  /** 기본 정렬은 AI 점수 내림차순 */
  candidates: SimulationCandidate[];
}

export interface SimulationCandidate {
  /** 건물 상세로 이동 가능한 후보는 반드시 이 값을 갖는다 */
  buildingId: BuildingId | null;
  name: string;
  location: LatLng;
  /** 기준좌표와의 직선거리(m). 실제 도보거리가 아니다 */
  distanceM: number | null;
  aiScore: number | null;
  expectedMonthlySales: number | null;
  closureRisk: number | null;
  competitorCount: number;
  estimatedRent: number | null;
}

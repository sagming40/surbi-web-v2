/**
 * 인증 · 즐겨찾기 타입
 *
 * 대상 API
 *   GET    /api/auth/oauth/{provider}  소셜 로그인 시작 (09a)
 *   GET    /api/favorites              즐겨찾기 목록 (09b)
 *   POST   /api/favorites              즐겨찾기 추가 (07·09b)
 *   DELETE /api/favorites/{favoriteId} 즐겨찾기 삭제 (09b)
 *   POST   /api/favorites/compare      즐겨찾기 비교 (15)
 */

import type {
  CategoryCode, AnalysisId, AppliedCategory,
  Quarter, QuarterScoped,
} from './common';

// ─────────────────────────────────────────────
// 09a · 소셜 로그인
// ─────────────────────────────────────────────

export type OAuthProvider = 'kakao' | 'naver';

/** GET /api/auth/oauth/{provider} */
export interface OAuthStartRequest {
  provider: OAuthProvider;
  /** 로그인 완료 후 복귀할 프론트 경로. 사전 등록된 경로만 허용 */
  redirectUri?: string;
}

export interface OAuthStartResponse {
  provider: OAuthProvider;
  /** 사용자를 이동시킬 제공자 인증 URL */
  authorizationUrl: string;
  /** CSRF 방지용 상태값. 서버가 검증한다 */
  state: string;
}

// "로그인 없이 둘러보기"는 클라이언트 상태 전환이라 별도 API가 없다.

// ─────────────────────────────────────────────
// 즐겨찾기 공통
// ─────────────────────────────────────────────

/**
 * 즐겨찾기 저장 성격.
 *   location — 장소 자체를 저장. 조회 시점 기준으로 매번 재조회한다
 *   analysis — 특정 시점 분석 결과(스냅샷)를 저장. 저장 당시 값을 유지한다
 */
export type FavoriteType = 'location' | 'analysis';

/** 저장 대상의 공간 단위 */
export type FavoriteTargetType = 'dong' | 'trdar' | 'building';

// ─────────────────────────────────────────────
// 09b · 즐겨찾기 목록
// ─────────────────────────────────────────────

/** GET /api/favorites */
export interface FavoriteListRequest {
  /** 미지정 시 전체 */
  type?: FavoriteType;
}

export interface FavoriteListResponse {
  /** 기본 최신 저장순 */
  favorites: FavoriteItem[];
}

export interface FavoriteItem {
  favoriteId: string;
  type: FavoriteType;
  targetType: FavoriteTargetType | null;
  targetId: string | null;
  /** 화면 표시명 */
  name: string;
  category: AppliedCategory | null;
  /** type이 analysis일 때만 값이 있다 */
  analysisId: AnalysisId | null;
  /** ISO 8601 (예: "2026-09-08T21:30:00+09:00") */
  savedAt: string;
}

// ─────────────────────────────────────────────
// 즐겨찾기 추가 · 삭제
// ─────────────────────────────────────────────

/**
 * POST /api/favorites
 *
 * location 저장 → targetType + targetId 필수
 * analysis 저장 → analysisId 필수
 */
export interface FavoriteCreateRequest {
  type: FavoriteType;
  targetType?: FavoriteTargetType | null;
  targetId?: string | null;
  categoryCode?: CategoryCode | null;
  analysisId?: AnalysisId | null;
}

export interface FavoriteCreateResponse {
  favoriteId: string;
  savedAt: string;
}

/** DELETE /api/favorites/{favoriteId} */
export interface FavoriteDeleteRequest {
  favoriteId: string;
}

export interface FavoriteDeleteResponse {
  deleted: boolean;
  favoriteId: string;
}

// ─────────────────────────────────────────────
// 15 · 즐겨찾기 비교
// ─────────────────────────────────────────────

/** POST /api/favorites/compare */
export interface FavoriteCompareRequest {
  /** 최대 3개 */
  favoriteIds: string[];
  quarter?: Quarter;
}

export interface FavoriteCompareResponse extends QuarterScoped {
  category: AppliedCategory | null;
  items: FavoriteCompareItem[];
}

/**
 * 비교표 한 열(column).
 *
 * 최고값·최저값 강조는 서버가 판단하지 않고 프론트에서 계산한다.
 * 지표마다 우위 방향이 다르기 때문이다 —
 * 매출·점수는 높을수록, 폐업위험도는 낮을수록 우위.
 *
 * 서로 다른 targetType을 섞어 비교하는 경우, 비교 불가능한 지표는 null로 온다.
 */
export interface FavoriteCompareItem {
  favoriteId: string;
  targetType: FavoriteTargetType;
  targetId: string;
  name: string;
  sales: number | null;
  storeCount: number | null;
  flowPopulation: number | null;
  residentPopulation: number | null;
  competitorCount: number | null;
  aiScore: number | null;
  expectedMonthlySales: number | null;
  /** ML 예측값. 실제 폐업률과 구분 */
  closureRisk: number | null;
}

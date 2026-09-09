/**
 * 타입 배럴(barrel) 파일
 *
 * 사용하는 쪽에서는 세부 파일 경로를 몰라도 된다.
 *   import type { DongReportResponse } from '@/shared/types';
 *
 * 새 타입 파일을 추가하면 여기에도 export를 한 줄 추가할 것.
 *
 * ─────────────────────────────────────────────
 * 파일 구성
 *   common.ts     코드 별칭 · 지표 공통 구조 · GeoJSON · 업종
 *   map.ts        geo 3종 · 01 서울 랭킹 · 01b 자치구 내 랭킹
 *   report.ts     01c 행정동 리포트 · 01d 상권 리포트 (탭 5개)
 *   analysis.ts   01e 직접범위 · 05 위저드 · 07 AI보고서 · 12 시뮬레이션
 *   dashboard.ts  03 종합 대시보드 · 08 건물 상세
 *   favorite.ts   09a 로그인 · 09b 즐겨찾기 · 15 비교
 */

export * from './common';
export * from './map';
export * from './report';
export * from './analysis';
export * from './dashboard';
export * from './favorite';

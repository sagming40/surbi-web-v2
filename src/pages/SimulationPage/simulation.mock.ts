import type { SimulationCandidate } from '@/shared/types';

import type { MapCandidate } from './KakaoMap';

/**
 * 실제 시뮬레이션 API가 연결되기 전의 임시 응답이다.
 * 연결 시에는 SimulationResponse.candidates를 이 배열 자리에 주입한다.
 */
export type SimulationCandidateRow = SimulationCandidate & MapCandidate;

export const mockSimulationCandidates: SimulationCandidateRow[] = [
  { id: 'seongsu-77-3', name: '성수동2가 273-1', location: { lat: 37.5466, lng: 127.0519 }, distanceM: 512, aiScore: 86, expectedMonthlySales: 5800, closureRisk: 29, competitorCount: 2, estimatedRent: 320, buildingId: null, isNew: true },
  { id: 'seongsu-315-4', name: '성수동2가 315-4', location: { lat: 37.5439, lng: 127.0552 }, distanceM: 438, aiScore: 82, expectedMonthlySales: 81000, closureRisk: 31, competitorCount: 2, estimatedRent: 350, buildingId: null },
  { id: 'seongsu-115-2', name: '성수동1가 12-9', location: { lat: 37.5473, lng: 127.0595 }, distanceM: 671, aiScore: 79, expectedMonthlySales: 72000, closureRisk: 33, competitorCount: 9, estimatedRent: 410, buildingId: null, isNew: true },
  { id: 'seongsu-3-9', name: '행당동 44-2', location: { lat: 37.5418, lng: 127.0571 }, distanceM: 390, aiScore: 74, expectedMonthlySales: 6600, closureRisk: 37, competitorCount: 2, estimatedRent: 290, buildingId: null, isNew: true },
  { id: 'seongsu-269', name: '성수동2가 289', location: { lat: 37.5408, lng: 127.0613 }, distanceM: 355, aiScore: 71, expectedMonthlySales: 55000, closureRisk: 39, competitorCount: 2, estimatedRent: 310, buildingId: null },
  { id: 'seongsu-688', name: '행당동 128-6', location: { lat: 37.5468, lng: 127.0629 }, distanceM: 318, aiScore: 68, expectedMonthlySales: 240000, closureRisk: 42, competitorCount: 17, estimatedRent: 480, buildingId: null, isNew: true, tone: 'red' },
  { id: 'seongsu-85-6', name: '성수동1가 85-6', location: { lat: 37.5401, lng: 127.0506 }, distanceM: 428, aiScore: 66, expectedMonthlySales: 6100, closureRisk: 41, competitorCount: 3, estimatedRent: 260, buildingId: null, isNew: true },
  { id: 'seongsu-231', name: '성수동2가 231', location: { lat: 37.5411, lng: 127.0597 }, distanceM: 592, aiScore: 64, expectedMonthlySales: 3400, closureRisk: 46, competitorCount: 2, estimatedRent: 240, buildingId: null },
];

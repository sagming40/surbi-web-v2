import type { SimulationRequest, SimulationResponse } from '@/shared/types';

import type { MapCandidate } from './KakaoMap';

/** 실제 API가 연결되기 전, POST /api/simulations 응답 형태를 흉내 내는 임시 데이터다. */
export type SimulationCandidateRow = SimulationResponse['candidates'][number] & MapCandidate;
export type SimulationMockResponse = SimulationResponse & { candidates: SimulationCandidateRow[] };

export const simulationFilterOptions = {
  gu: [
    { code: '11200', label: '성동구' },
    { code: '11170', label: '용산구' },
    { code: '11680', label: '강남구' },
  ],
  dong: [
    { code: '1120054000', label: '성수2가3동' },
    { code: '1120055000', label: '성수1가2동' },
    { code: '1120056000', label: '행당1동' },
  ],
  category: [
    { code: 'CS100001', label: '한식음식점' },
    { code: 'CS100002', label: '중식음식점' },
    { code: 'CS100003', label: '일식음식점' },
  ],
  trdar: [
    { code: '2110001', label: '성수역 상권' },
    { code: '2110002', label: '서울숲 상권' },
    { code: '2110003', label: '뚝섬역 상권' },
  ],
} as const;

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

const CENTER = { lat: 37.5446, lng: 127.0561 };

function distanceFromCenterM(candidate: SimulationCandidateRow) {
  const latitudeM = (candidate.location.lat - CENTER.lat) * 111_000;
  const longitudeM = (candidate.location.lng - CENTER.lng) * 88_000;
  return Math.sqrt(latitudeM ** 2 + longitudeM ** 2);
}

/**
 * 서버 연결 전의 임시 호출. 나중에는 이 함수 내부만 실제 API 요청으로 교체한다.
 * UI는 언제나 SimulationResponse.candidates만 읽는다.
 */
export async function getMockSimulation(
  request: SimulationRequest,
  options: { excludeDenseArea: boolean },
): Promise<SimulationMockResponse> {
  await new Promise((resolve) => window.setTimeout(resolve, 180));

  const radiusM = request.radiusM ?? 300;
  const candidates = mockSimulationCandidates.filter((candidate) => (
    distanceFromCenterM(candidate) <= radiusM
    && (!options.excludeDenseArea || candidate.competitorCount < 10)
  ));

  return {
    simulationId: 'mock-seongsu-2026q2',
    quarter: request.quarter ?? '2026Q2',
    category: {
      code: request.categoryCode,
      name: simulationFilterOptions.category.find((item) => item.code === request.categoryCode)?.label ?? '한식음식점',
    },
    candidates,
  };
}

import type { DongReportResponse } from '@/shared/types';

/**
 * GET /api/dongs/{dongCode}/report 의 임시 응답을 만든다.
 *
 * 실제 API가 붙으면 이 파일은 제거하고, 화면은 DongReportResponse 타입을
 * 그대로 받으므로 드로어 컴포넌트는 수정할 필요가 없다.
 */
export function createDongReportMock(
  dongCode: string,
  dongName: string,
  guCode: string,
  guName: string,
): DongReportResponse {
  /**
   * 목 데이터에서도 행정동을 바꿨을 때 같은 숫자가 반복되지 않게 한다.
   * 실제 API 전환 뒤에는 이 보정값이 사라지고 서버 응답값이 그대로 사용된다.
   */
  const codeSeed = [...dongCode].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  const adjustment = (codeSeed % 9) - 4;
  const scaleAmount = (value: number) => Math.round(value * (1 + adjustment / 100));
  const scaleCount = (value: number) => Math.max(1, Math.round(value * (1 + adjustment / 100)));

  return {
    dongCode,
    dongName,
    guCode,
    guName,
    quarter: '2026Q1',
    category: { code: null, name: '전체 업종' },
    summary: {
      sales: scaleAmount(48_500_000_000),
      salesChangeRate: Number((12.4 + adjustment * 0.4).toFixed(1)),
      guRank: { rank: 1, total: 17 },
      hourlySales: [
        { timeRange: '06-09', amount: scaleAmount(4_600_000_000) },
        { timeRange: '09-12', amount: scaleAmount(6_200_000_000) },
        { timeRange: '12-15', amount: scaleAmount(10_800_000_000) },
        { timeRange: '15-18', amount: scaleAmount(9_100_000_000) },
        { timeRange: '18-21', amount: scaleAmount(11_200_000_000) },
        { timeRange: '21-24', amount: scaleAmount(6_600_000_000) },
      ],
      dayGenderAgeSales: {
        daily: [{ label: '주중', amount: 32_100_000_000 }, { label: '주말', amount: 16_400_000_000 }],
        gender: [{ label: '여성', amount: 27_800_000_000 }, { label: '남성', amount: 20_700_000_000 }],
        age: [{ label: '20-30대', amount: 30_600_000_000 }, { label: '40대 이상', amount: 17_900_000_000 }],
      },
      aiScorePreview: 78,
    },
    industry: {
      totalStores: scaleCount(1_248),
      categoryComposition: [
        { categoryCode: 'CS100001', categoryName: '음식점업', storeCount: 4_127, ratio: 38 },
        { categoryCode: 'CS100010', categoryName: '소매업', storeCount: 2_649, ratio: 24 },
        { categoryCode: 'CS100009', categoryName: '서비스업', storeCount: 2_105, ratio: 19 },
        { categoryCode: 'CS100004', categoryName: '부동산·임대', storeCount: 1_329, ratio: 12 },
        { categoryCode: 'CS100002', categoryName: '기타', storeCount: 827, ratio: 7 },
      ],
      categorySales: [
        { categoryCode: 'CS100001', categoryName: '음식점업', amount: 15_000_000_000, ratio: 31 },
        { categoryCode: 'CS100010', categoryName: '음식점', amount: 13_100_000_000, ratio: 27 },
        { categoryCode: 'CS100009', categoryName: '소매업', amount: 10_700_000_000, ratio: 22 },
        { categoryCode: 'CS100004', categoryName: '서비스업', amount: 6_800_000_000, ratio: 14 },
        { categoryCode: 'CS100002', categoryName: '기타', amount: 2_900_000_000, ratio: 6 },
      ],
      newStores: scaleCount(48),
      closedStores: scaleCount(31),
    },
    sales: {
      trend: [
        { quarter: '2024Q2', amount: scaleAmount(37_800_000_000) }, { quarter: '2024Q3', amount: scaleAmount(40_100_000_000) },
        { quarter: '2024Q4', amount: scaleAmount(39_000_000_000) }, { quarter: '2025Q1', amount: scaleAmount(41_300_000_000) },
        { quarter: '2025Q2', amount: scaleAmount(42_200_000_000) }, { quarter: '2025Q3', amount: scaleAmount(44_100_000_000) },
        { quarter: '2025Q4', amount: scaleAmount(43_100_000_000) }, { quarter: '2026Q1', amount: scaleAmount(48_500_000_000) },
      ],
      hourly: [
        { timeRange: '06-09', amount: 4_600_000_000 }, { timeRange: '09-12', amount: 6_200_000_000 },
        { timeRange: '12-15', amount: 10_800_000_000 }, { timeRange: '15-18', amount: 9_100_000_000 },
        { timeRange: '18-21', amount: 11_200_000_000 }, { timeRange: '21-24', amount: 6_600_000_000 },
      ],
      daily: [{ label: '월', amount: 6_200_000_000 }, { label: '화', amount: 6_700_000_000 }, { label: '수', amount: 7_000_000_000 }, { label: '목', amount: 7_200_000_000 }, { label: '금', amount: 8_000_000_000 }, { label: '토', amount: 8_300_000_000 }, { label: '일', amount: 6_400_000_000 }],
      averageOrderValue: scaleCount(24_300),
    },
    population: {
      flow: scaleCount(148_000),
      worker: scaleCount(41_000),
      resident: scaleCount(18_000),
      ageComposition: [{ label: '20대', value: 50_320, ratio: 34 }, { label: '30대', value: 40_700, ratio: 27 }, { label: '40대', value: 26_640, ratio: 18 }, { label: '50대', value: 19_240, ratio: 13 }, { label: '60대+', value: 11_100, ratio: 8 }],
      genderComposition: [{ label: '여성', value: 79_180, ratio: 57 }, { label: '남성', value: 68_820, ratio: 43 }],
      weekdayWeekend: { weekday: scaleCount(96_000), weekend: scaleCount(52_000) },
    },
    region: {
      areaProfile: { type: '유입형 상권', flowRatio: 58, workerRatio: 26, residentRatio: 16 },
      nearestSubway: { stationName: '성수역', distanceM: 280, boarding: 51_000, alighting: 49_000 },
      nearbyTrdars: [{ trdarCode: '2110001', trdarName: '성수역 상권', distanceM: 120 }, { trdarCode: '2110002', trdarName: '서울숲 상권', distanceM: 740 }],
      areaM2: 1_040_000,
      storeDensity: scaleCount(1_200),
    },
  };
}

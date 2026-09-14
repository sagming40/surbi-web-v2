/*
 * 03 종합 대시보드 목업 데이터
 */
import type { 
    DashboardResponse, 
    DashboardKpi, 
    CategoryAvgSales 
} from '@/shared/types';

/**
 * 목업에는 있는데 정식 타입에 아직 없는 필드. 팀 확인 대기 중.
 * `shared/types`를 직접 고치지 않고 여기서 확장했다가, 반영되면 이 블록만 지운다.
 */
interface DashboardMockExtra {
    kpiChangeRate: Record<keyof DashboardKpi, number | null>;
    avgSalesPerStoreChangeRate: number;
    categoryAvgSalesPrev: CategoryAvgSales[];
}

export type DashboardMock = DashboardResponse & DashboardMockExtra;

export const dashboardMock: DashboardMock = { 
    quarter: '2026Q1',
    availableQuarters: ['2026Q1', '2025Q4', '2025Q3', '2025Q2', '2025Q1'],
    kpi : {
        totalSales : 24_812_000_000_000,
        totalStores : 537_488,
        newStores : 2_104,
        closureRate : 31.7
    },
    avgSalesPerStore: 52_640_000,
    districtHeatmap: [
        // 1행
        { guCode: '11380', guName: '은평구', sales: 187_400_000_000 },
        { guCode: '11320', guName: '도봉구', sales: 151_900_000_000 },
        { guCode: '11305', guName: '강북구', sales: 164_200_000_000 },
        { guCode: '11350', guName: '노원구', sales: 205_600_000_000 },
        { guCode: '11260', guName: '중랑구', sales: 198_300_000_000 },
        // 2행
        { guCode: '11110', guName: '종로구', sales: 268_100_000_000 },
        { guCode: '11290', guName: '성북구', sales: 212_500_000_000 },
        { guCode: '11230', guName: '동대문구', sales: 226_700_000_000 },
        { guCode: '11200', guName: '성동구', sales: 241_800_000_000 },
        { guCode: '11215', guName: '광진구', sales: 233_400_000_000 },
        // 3행
        { guCode: '11440', guName: '마포구', sales: 368_200_000_000 },
        { guCode: '11140', guName: '중구', sales: 586_100_000_000 },
        { guCode: '11170', guName: '용산구', sales: 312_500_000_000 },
        { guCode: '11740', guName: '강동구', sales: 258_500_000_000 },
        { guCode: '11710', guName: '송파구', sales: 683_000_000_000 },
        // 4행
        { guCode: '11410', guName: '서대문구', sales: 179_800_000_000 },
        { guCode: '11560', guName: '영등포구', sales: 476_700_000_000 },
        { guCode: '11590', guName: '동작구', sales: 172_400_000_000 },
        { guCode: '11650', guName: '서초구', sales: 715_600_000_000 },
        { guCode: '11680', guName: '강남구', sales: 1_000_000_000_000 },
        // 5행
        { guCode: '11500', guName: '강서구', sales: 406_100_000_000 },
        { guCode: '11470', guName: '양천구', sales: 193_100_000_000 },
        { guCode: '11530', guName: '구로구', sales: 221_300_000_000 },
        { guCode: '11545', guName: '금천구', sales: 158_600_000_000 },
        { guCode: '11620', guName: '관악구', sales: 209_700_000_000 },
    ],
    categoryAvgSales: [
        { groupCode: 'CS3', groupName: '소매',   avgSalesPerStore: 62_000_000 },
        { groupCode: 'CS1', groupName: '음식',   avgSalesPerStore: 54_000_000 },
        { groupCode: 'CS2', groupName: '서비스', avgSalesPerStore: 41_000_000 },
        { groupCode: 'CS4', groupName: '교육',   avgSalesPerStore: 43_000_000 },
        { groupCode: 'CS5', groupName: '오락',   avgSalesPerStore: 38_000_000 },
        { groupCode: 'CS6', groupName: '숙박',   avgSalesPerStore: 33_000_000 },
    ],
    districtTop10: [
        { rank: 1, guCode: '11680', guName: '강남구', sales: 1_000_000_000_000, changeRate: 6.2 },
        { rank: 2, guCode: '11650', guName: '서초구', sales: 715_600_000_000, changeRate: 4.8 },
        { rank: 3, guCode: '11710', guName: '송파구', sales: 683_000_000_000, changeRate: 3.1 },
        { rank: 4, guCode: '11140', guName: '중구', sales: 586_100_000_000, changeRate: -1.4 },
        { rank: 5, guCode: '11560', guName: '영등포구', sales: 476_700_000_000, changeRate: 2.7 },
        { rank: 6, guCode: '11500', guName: '강서구', sales: 406_100_000_000, changeRate: 1.9 },
        { rank: 7, guCode: '11440', guName: '마포구', sales: 368_200_000_000, changeRate: -0.6 },
        { rank: 8, guCode: '11170', guName: '용산구', sales: 312_500_000_000, changeRate: 5.5 },
        { rank: 9, guCode: '11110', guName: '종로구', sales: 268_100_000_000, changeRate: -2.3 },
        { rank: 10, guCode: '11740', guName: '강동구', sales: 258_500_000_000, changeRate: 0.8 },
    ],
    salesTrend: [
        { quarter: '2024Q2', sales: 43_100_000 },
        { quarter: '2024Q3', sales: 45_200_000 },
        { quarter: '2024Q4', sales: 47_800_000 },
        { quarter: '2025Q1', sales: 45_900_000 },
        { quarter: '2025Q2', sales: 46_100_000 },
        { quarter: '2025Q3', sales: 49_500_000 },
        { quarter: '2025Q4', sales: 49_700_000 },
        { quarter: '2026Q1', sales: 52_640_000 },
    ],
    kpiChangeRate: {
        totalSales:     5.4,
        totalStores:    1.2,
        newStores:      -3.8,
        closureRate:    -0.9
    },
    avgSalesPerStoreChangeRate: 7.1,
    categoryAvgSalesPrev: [
        { groupCode: 'CS3', groupName: '소매',   avgSalesPerStore: 58_000_000 },
        { groupCode: 'CS1', groupName: '음식',   avgSalesPerStore: 50_000_000 },
        { groupCode: 'CS2', groupName: '서비스', avgSalesPerStore: 38_000_000 },
        { groupCode: 'CS4', groupName: '교육',   avgSalesPerStore: 40_000_000 },
        { groupCode: 'CS5', groupName: '오락',   avgSalesPerStore: 35_000_000 },
        { groupCode: 'CS6', groupName: '숙박',   avgSalesPerStore: 30_000_000 },
    ]
};




// ─────────────────────────────────────────────
// 분기 전환용 목업
// ─────────────────────────────────────────────

/**
 * 직전분기 목업을 만든다.
 * 값을 일정 비율로 낮추는 방식 — 분기 셀렉터가 실제로 동작하는지 확인하는 용도라
 * 숫자의 사실성보다 "바뀐다"는 게 중요하다. API가 붙으면 이 블록은 전부 삭제.
 */
function makePrevQuarter(base: DashboardMock, quarter: string, factor: number): DashboardMock {
  const scale = (v: number) => Math.round(v * factor);

  return {
    ...base,
    quarter,
    kpi: {
      totalSales: scale(base.kpi.totalSales),
      totalStores: scale(base.kpi.totalStores),
      newStores: scale(base.kpi.newStores),
      closureRate:
        base.kpi.closureRate === null ? null : Number((base.kpi.closureRate * 1.04).toFixed(1)),
    },
    kpiChangeRate: {
      totalSales: 2.1,
      totalStores: 0.7,
      newStores: 1.5,
      closureRate: 0.6,
    },
    avgSalesPerStore: base.avgSalesPerStore === null ? null : scale(base.avgSalesPerStore),
    avgSalesPerStoreChangeRate: 3.2,
    // 마지막 분기를 떼어내 한 칸 앞선 구간으로 만든다
    salesTrend: base.salesTrend.slice(0, -1),
    districtHeatmap: base.districtHeatmap.map((d) => ({ ...d, sales: scale(d.sales) })),
    // 2025Q4의 "당분기"가 곧 2026Q1 입장의 "직전분기"라 한 칸씩 밀린다
    categoryAvgSales: base.categoryAvgSalesPrev,
    categoryAvgSalesPrev: base.categoryAvgSalesPrev.map((d) => ({
      ...d,
      avgSalesPerStore: scale(d.avgSalesPerStore),
    })),
    districtTop10: base.districtTop10.map((d) => ({ ...d, sales: scale(d.sales) })),
  };
}

const MOCK_BY_QUARTER: Record<string, DashboardMock> = {
  '2026Q1': dashboardMock,
  '2025Q4': makePrevQuarter(dashboardMock, '2025Q4', 0.94),
};

/** 셀렉터에 노출할 분기. 목업이 있는 것만 넣는다 */
export const MOCK_QUARTERS = ['2026Q1', '2025Q4'];

/** 분기 코드로 목업을 꺼낸다. 없는 분기는 최신 분기로 대체 */
export function getDashboardMock(quarter: string): DashboardMock {
  return MOCK_BY_QUARTER[quarter] ?? dashboardMock;
}

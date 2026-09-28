/** 준비 중인 차트를 블러로 깔 때 쓰는 가짜 데이터. 실제 값이 아니다. */
import type { DashboardTrendPoint, CategorySalesCompare } from '@/shared/types';

export const PLACEHOLDER_TREND: DashboardTrendPoint[] = [
  { quarter: '2024Q3', sales: 43_100_000 },
  { quarter: '2024Q4', sales: 45_200_000 },
  { quarter: '2025Q1', sales: 42_800_000 },
  { quarter: '2025Q2', sales: 44_600_000 },
  { quarter: '2025Q3', sales: 46_900_000 },
  { quarter: '2025Q4', sales: 48_300_000 },
  { quarter: '2026Q1', sales: 44_850_000 },
  { quarter: '2026Q2', sales: 45_840_000 },
];

/** 업종별 현재·직전 분기 총매출 비교용 가짜 데이터 (외식업 10종). 값은 억원 단위로 적어 원으로 환산 */
export const PLACEHOLDER_CATEGORY: CategorySalesCompare[] = [
  { groupCode: 'CS100001', groupName: '한식음식점', sales: 31_200 * 1e8, previousSales: 29_800 * 1e8, changeRate: 4.7 },
  { groupCode: 'CS100002', groupName: '중식음식점', sales: 6_400 * 1e8, previousSales: 6_150 * 1e8, changeRate: 4.1 },
  { groupCode: 'CS100003', groupName: '일식음식점', sales: 7_900 * 1e8, previousSales: 7_300 * 1e8, changeRate: 8.2 },
  { groupCode: 'CS100004', groupName: '양식음식점', sales: 9_800 * 1e8, previousSales: 9_950 * 1e8, changeRate: -1.5 },
  { groupCode: 'CS100005', groupName: '제과점', sales: 3_600 * 1e8, previousSales: 3_450 * 1e8, changeRate: 4.3 },
  { groupCode: 'CS100006', groupName: '패스트푸드점', sales: 4_700 * 1e8, previousSales: 4_500 * 1e8, changeRate: 4.4 },
  { groupCode: 'CS100007', groupName: '치킨전문점', sales: 5_300 * 1e8, previousSales: 5_600 * 1e8, changeRate: -5.4 },
  { groupCode: 'CS100008', groupName: '분식전문점', sales: 3_900 * 1e8, previousSales: 3_750 * 1e8, changeRate: 4.0 },
  { groupCode: 'CS100009', groupName: '호프-간이주점', sales: 8_600 * 1e8, previousSales: 8_900 * 1e8, changeRate: -3.4 },
  { groupCode: 'CS100010', groupName: '커피-음료', sales: 11_400 * 1e8, previousSales: 10_700 * 1e8, changeRate: 6.5 },
];

/** 준비 중인 차트를 블러로 깔 때 쓰는 가짜 데이터. 실제 값이 아니다. */
import type { DashboardTrendPoint, CategoryAvgSales } from '@/shared/types';

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

export const PLACEHOLDER_CATEGORY: CategoryAvgSales[] = [
  { groupCode: 'CS100001', groupName: '한식음식점', avgSalesPerStore: 62_000_000 },
  { groupCode: 'CS100002', groupName: '중식음식점', avgSalesPerStore: 54_000_000 },
  { groupCode: 'CS100003', groupName: '일식음식점', avgSalesPerStore: 58_000_000 },
  { groupCode: 'CS100004', groupName: '양식음식점', avgSalesPerStore: 51_000_000 },
  { groupCode: 'CS100008', groupName: '커피-음료', avgSalesPerStore: 33_000_000 },
  { groupCode: 'CS100009', groupName: '호프-간이주점', avgSalesPerStore: 38_000_000 },
];

export const PLACEHOLDER_CATEGORY_PREV: CategoryAvgSales[] = [
  { groupCode: 'CS100001', groupName: '한식음식점', avgSalesPerStore: 58_500_000 },
  { groupCode: 'CS100002', groupName: '중식음식점', avgSalesPerStore: 52_100_000 },
  { groupCode: 'CS100003', groupName: '일식음식점', avgSalesPerStore: 54_700_000 },
  { groupCode: 'CS100004', groupName: '양식음식점', avgSalesPerStore: 49_300_000 },
  { groupCode: 'CS100008', groupName: '커피-음료', avgSalesPerStore: 31_200_000 },
  { groupCode: 'CS100009', groupName: '호프-간이주점', avgSalesPerStore: 36_400_000 },
];
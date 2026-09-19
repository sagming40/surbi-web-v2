import type { CategoryCode } from '@/shared/types/common';

/**
 * 외식업 업종 10종. 서비스 범위가 외식업이라 여기서 고정된다.
 * ⚠️ 이름은 확정, code 는 임시값. /api/meta/categories 가 붙으면 삭제
 */
export interface FoodCategory {
  code: CategoryCode;
  name: string;
}

export const FOOD_CATEGORIES: FoodCategory[] = [
  { code: 'CS100001', name: '한식음식점' },
  { code: 'CS100002', name: '중식음식점' },
  { code: 'CS100003', name: '일식음식점' },
  { code: 'CS100004', name: '양식음식점' },
  { code: 'CS100005', name: '제과점' },
  { code: 'CS100006', name: '패스트푸드점' },
  { code: 'CS100007', name: '치킨전문점' },
  { code: 'CS100008', name: '분식전문점' },
  { code: 'CS100009', name: '호프·간이주점' },
  { code: 'CS100010', name: '커피·음료' },
];

export function findCategory(code: string | null): FoodCategory | undefined {
  return FOOD_CATEGORIES.find((c) => c.code === code);
}

/** 상권 구분 3종. ⚠️ 이름은 확정, code(TRDAR_SE_CD)는 임시값 */
export interface TrdarType {
  code: string;
  name: string;
}

export const TRDAR_TYPES: TrdarType[] = [
  { code: 'D', name: '발달상권' },
  { code: 'A', name: '골목상권' },
  { code: 'R', name: '전통시장' },
];

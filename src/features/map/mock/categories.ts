import type { CategoryCode } from '@/shared/types/common';

/**
 * 외식업 업종 10종.
 *
 * Surbi 는 외식업 창업 지원 서비스라 업종이 이 범위로 고정된다.
 * 소매·서비스 같은 다른 대분류는 다루지 않는다.
 *
 * ⚠️ `code` 는 임시값이다. 실제 서비스업종 코드(CS1xxxxx)는 상권분석서비스
 * 점포·매출 데이터에서 확인해야 한다. 이름은 확정, 코드는 미확정.
 * 서버가 GET /api/meta/categories 로 내려주면 이 파일은 지운다.
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

/**
 * 상권 구분 3종.
 *
 * ⚠️ `code` 는 임시값이다. 실제 상권 구분 코드(TRDAR_SE_CD)는
 * 상권분석서비스 영역-상권 데이터에서 확인해야 한다. 이름은 확정, 코드는 미확정.
 */
export interface TrdarType {
  code: string;
  name: string;
}

export const TRDAR_TYPES: TrdarType[] = [
  { code: 'D', name: '발달상권' },
  { code: 'A', name: '골목상권' },
  { code: 'R', name: '전통시장' },
];

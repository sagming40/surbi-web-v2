import type { CategoryListResponse, DistrictGeoListResponse, WizardResultResponse } from '@/shared/types';
import type { WizardFloorResponse, WizardStaffingResponse, WizardStoreSizeResponse } from './wizard.types';

/**
 * GET /api/geo/districts의 임시 응답.
 * geometry도 포함한 이유는 나중에 지도 화면이 같은 응답을 재사용할 수 있기 때문이다.
 */
export const mockDistrictGeoListResponse: DistrictGeoListResponse = {
  districts: [
    { guCode: '11200', guName: '성동구', geometry: { type: 'Polygon', coordinates: [[[127.02, 37.55], [127.08, 37.55], [127.08, 37.50], [127.02, 37.50], [127.02, 37.55]]] } },
    { guCode: '41130', guName: '성남시', geometry: { type: 'Polygon', coordinates: [[[127.08, 37.45], [127.18, 37.45], [127.18, 37.40], [127.08, 37.40], [127.08, 37.45]]] } },
    { guCode: '47250', guName: '상주시', geometry: { type: 'Polygon', coordinates: [[[128.00, 36.40], [128.10, 36.40], [128.10, 36.35], [128.00, 36.35], [128.00, 36.40]]] } },
    { guCode: '44230', guName: '논산시', geometry: { type: 'Polygon', coordinates: [[[127.00, 36.25], [127.10, 36.25], [127.10, 36.20], [127.00, 36.20], [127.00, 36.25]]] } },
    { guCode: '27260', guName: '수성구', geometry: { type: 'Polygon', coordinates: [[[128.60, 35.85], [128.70, 35.85], [128.70, 35.80], [128.60, 35.80], [128.60, 35.85]]] } },
  ],
};

/** GET /api/meta/categories의 임시 응답. 다음 단계에서 업종 코드까지 함께 보관한다. */
export const mockCategoryListResponse: CategoryListResponse = {
  categories: [
    {
      groupCode: 'CS1',
      groupName: '외식업',
      items: [
        { categoryCode: 'CS100001', categoryName: '한식음식점' },
        { categoryCode: 'CS100002', categoryName: '중식음식점' },
        { categoryCode: 'CS100003', categoryName: '일식음식점' },
        { categoryCode: 'CS100004', categoryName: '양식음식점' },
        { categoryCode: 'CS100005', categoryName: '제과점' },
        { categoryCode: 'CS100006', categoryName: '패스트푸드점' },
      ],
    },
  ],
};

/** GET /api/meta/store-sizes?categoryCode= 의 임시 응답이다. */
export const mockStoreSizeResponse: WizardStoreSizeResponse = {
  categoryCode: 'CS100004',
  description: '앞서 선택하신 업종 매장들의\n유형별 평균 크기입니다.',
  defaultSizeCode: 'medium',
  sizes: [
    { code: 'small', label: '소형', areaM2: 54, pyeong: 16 },
    { code: 'medium', label: '중형', areaM2: 86, pyeong: 26 },
    { code: 'large', label: '대형', areaM2: 119, pyeong: 36 },
  ],
};

/** GET /api/meta/store-floors?categoryCode= 의 임시 응답이다. */
export const mockFloorResponse: WizardFloorResponse = {
  categoryCode: 'CS100004',
  defaultFloorCode: 'ground',
  floors: [
    { code: 'basement', label: '지하 1층' },
    { code: 'ground', label: '1층' },
    { code: 'upper', label: '2층' },
  ],
};

/** GET /api/meta/staffing-options?categoryCode= 의 임시 응답이다. */
export const mockStaffingResponse: WizardStaffingResponse = {
  categoryCode: 'CS100004',
  defaultStaffCode: 'oneToFour',
  minimumMonthlyHours: 60,
  staffOptions: [
    { code: 'none', label: '고용 없음', description: '1인 운영' },
    { code: 'oneToFour', label: '1~4명' },
    { code: 'fivePlus', label: '5명 이상' },
  ],
};

/** POST /api/wizard/result의 임시 응답이다. 결과 페이지 연결 전에도 실제 응답 타입을 유지한다. */
export const mockWizardResultResponse: WizardResultResponse = {
  analysisId: 'anl_mock_11200_CS100004',
  quarter: '2026Q2',
  region: { guCode: '11200', guName: '성동구' },
  category: { code: 'CS100004', name: '양식음식점' },
  rent: {
    estimatedMonthlyRent: 584800,
    rentPerM2: 6800,
    referenceByScale: { small: 5300, medium: 6800, large: 3900 },
  },
  aiScore: 68.4,
  seoulRank: { rank: 6, total: 25 },
  expectedMonthlySales: 41800000,
  closureRisk: 38.6,
  competitorCount: 213,
  policies: [],
};

import type { CategoryCode, CategoryListResponse, DistrictGeoListResponse, WizardResultRequest, WizardResultResponse } from '@/shared/types';

import { mockCategoryListResponse, mockDistrictGeoListResponse, mockFloorResponse, mockStaffingResponse, mockStoreSizeResponse, mockWizardResultResponse } from './wizard.mock';
import type { WizardFloorResponse, WizardStaffingResponse, WizardStoreSizeResponse } from './wizard.types';

/**
 * GET /api/geo/districts
 *
 * 실제 백엔드 연결 시 이 함수의 return 문장만 fetch 또는 axios 호출로 교체한다.
 * 화면 컴포넌트는 응답 타입과 호출 방식이 바뀌지 않는다.
 */
export async function getDistricts(): Promise<DistrictGeoListResponse> {
  // ── 실제 백엔드 연결 시 아래 mock 두 줄을 지우고 이 블록을 사용한다. ──
  // const response = await fetch('/api/geo/districts');
  // if (!response.ok) throw new Error('자치구 목록을 불러오지 못했습니다.');
  // return response.json() as Promise<DistrictGeoListResponse>;

  // 현재는 서버 응답 시간을 흉내 내고, 실제 API와 동일한 타입의 mock 데이터를 반환한다.
  await new Promise((resolve) => window.setTimeout(resolve, 180));
  return mockDistrictGeoListResponse;
}

/** GET /api/meta/categories — 위저드 2단계의 업종 목록 조회 */
export async function getCategories(): Promise<CategoryListResponse> {
  // ── 실제 백엔드 연결 시 아래 mock 두 줄을 지우고 이 블록을 사용한다. ──
  // const response = await fetch('/api/meta/categories');
  // if (!response.ok) throw new Error('업종 목록을 불러오지 못했습니다.');
  // return response.json() as Promise<CategoryListResponse>;

  await new Promise((resolve) => window.setTimeout(resolve, 180));
  return mockCategoryListResponse;
}

/**
 * GET /api/meta/store-sizes?categoryCode=
 *
 * 공식 공용 명세가 생기기 전까지 위저드 내부에서만 쓰는 제안 API다.
 * DB의 업종별 매장 면적 통계를 받아 카드 문구와 기본 선택값을 만들도록 설계했다.
 */
export async function getStoreSizes(categoryCode: CategoryCode): Promise<WizardStoreSizeResponse> {
  // ── 실제 백엔드 연결 시 아래 mock 두 줄을 지우고 이 블록을 사용한다. ──
  // const response = await fetch(`/api/meta/store-sizes?categoryCode=${encodeURIComponent(categoryCode)}`);
  // if (!response.ok) throw new Error('매장 크기 정보를 불러오지 못했습니다.');
  // return response.json() as Promise<WizardStoreSizeResponse>;

  await new Promise((resolve) => window.setTimeout(resolve, 180));
  // mock에서도 요청한 업종 코드를 그대로 돌려 실제 호출과 같은 흐름을 유지한다.
  return { ...mockStoreSizeResponse, categoryCode };
}

/** GET /api/meta/store-floors?categoryCode= — 매장 층수 선택지 조회 */
export async function getStoreFloors(categoryCode: CategoryCode): Promise<WizardFloorResponse> {
  // ── 실제 백엔드 연결 시 아래 mock 두 줄을 지우고 이 블록을 사용한다. ──
  // const response = await fetch(`/api/meta/store-floors?categoryCode=${encodeURIComponent(categoryCode)}`);
  // if (!response.ok) throw new Error('층수 선택지를 불러오지 못했습니다.');
  // return response.json() as Promise<WizardFloorResponse>;

  await new Promise((resolve) => window.setTimeout(resolve, 180));
  return { ...mockFloorResponse, categoryCode };
}

/** GET /api/meta/staffing-options?categoryCode= — 직원 수·근무시간 기준 조회 */
export async function getStaffingOptions(categoryCode: CategoryCode): Promise<WizardStaffingResponse> {
  // ── 실제 백엔드 연결 시 아래 mock 두 줄을 지우고 이 블록을 사용한다. ──
  // const response = await fetch(`/api/meta/staffing-options?categoryCode=${encodeURIComponent(categoryCode)}`);
  // if (!response.ok) throw new Error('직원 수 선택지를 불러오지 못했습니다.');
  // return response.json() as Promise<WizardStaffingResponse>;

  await new Promise((resolve) => window.setTimeout(resolve, 180));
  return { ...mockStaffingResponse, categoryCode };
}

/**
 * POST /api/wizard/result — 마지막 확인 후 입력 조건으로 분석 결과를 만든다.
 * 현재 결과 페이지가 이미 존재하므로, 성공 응답은 라우트 상태로 넘겨 다음 단계에서 사용할 수 있게 한다.
 */
export async function createWizardResult(request: WizardResultRequest): Promise<WizardResultResponse> {
  // ── 실제 백엔드 연결 시 아래 mock 두 줄을 지우고 이 블록을 사용한다. ──
  // const response = await fetch('/api/wizard/result', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request) });
  // if (!response.ok) throw new Error('창업 분석 결과를 만들지 못했습니다.');
  // return response.json() as Promise<WizardResultResponse>;

  await new Promise((resolve) => window.setTimeout(resolve, 260));
  // 요청값을 실제로 받도록 인자를 유지한다. mock 단계에서는 결과 화면이 보는 공통 응답을 반환한다.
  void request;
  return mockWizardResultResponse;
}

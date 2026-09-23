import type { CategoryCode, StartupAnalysisRequest, StartupAnalysisResponse } from '@/shared/types';

/** 아직 공용 명세에 없는 GET /api/meta/store-sizes의 제안 응답 타입이다. */
export interface WizardStoreSizeOption {
  code: 'small' | 'medium' | 'large';
  label: string;
  areaM2: number;
  pyeong: number;
}

export interface WizardStoreSizeResponse {
  categoryCode: CategoryCode;
  description: string;
  defaultSizeCode: WizardStoreSizeOption['code'];
  sizes: WizardStoreSizeOption[];
}

/** GET /api/meta/store-floors?categoryCode= 의 제안 응답 타입이다. */
export interface WizardFloorOption {
  code: 'basement' | 'ground' | 'upper';
  label: string;
}

export interface WizardFloorResponse {
  categoryCode: CategoryCode;
  defaultFloorCode: WizardFloorOption['code'];
  floors: WizardFloorOption[];
}

/** GET /api/meta/staffing-options?categoryCode= 의 제안 응답 타입이다. */
export interface WizardStaffOption {
  code: 'none' | 'oneToFour' | 'fivePlus';
  label: string;
  description?: string;
}

export interface WizardStaffingResponse {
  categoryCode: CategoryCode;
  defaultStaffCode: WizardStaffOption['code'];
  minimumMonthlyHours: number;
  staffOptions: WizardStaffOption[];
}

/** 결과·보고서 화면이 API를 다시 요청하지 않고 선택 문구를 재사용하기 위한 스냅샷이다. */
export interface WizardSelectionSnapshot {
  area: {
    code: string;
    name: string;
  };
  industry: {
    code: CategoryCode;
    name: string;
  };
  storeSize: WizardStoreSizeOption;
  floor: WizardFloorOption;
  staff: WizardStaffOption;
  works15Hours: boolean;
  preferredFactors: string[];
}

/** 04 → 05 → 07 흐름에서 한 번 생성한 분석 결과를 전달하는 화면 전용 상태다. */
export interface WizardResultNavigationState {
  selection: WizardSelectionSnapshot;
  request: StartupAnalysisRequest;
  result: StartupAnalysisResponse;
}

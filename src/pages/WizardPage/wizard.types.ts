import type { CategoryCode } from '@/shared/types';

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

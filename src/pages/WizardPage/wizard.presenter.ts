import type { DistrictGeo, WizardResultRequest } from '@/shared/types';

import type { WizardFloorOption, WizardStaffOption, WizardStoreSizeOption } from './wizard.types';

/** API의 guCode를 화면 문구로 바꾸는 표현 전용 규칙이다. */
const districtDisplayNames: Record<string, string> = {
  '11200': '서울시 성동구',
  '41130': '경기 성남시',
  '47250': '경북 상주시',
  '44230': '충남 논산시',
  '27260': '대구시 수성구',
};

/** API 데이터는 바꾸지 않고, Figma에 필요한 화면 문구만 만든다. */
export function getDistrictDisplayName(district: DistrictGeo) {
  return districtDisplayNames[district.guCode] ?? district.guName;
}

/** UI의 선택 객체를 공용 API 요청 형식으로 변환하는 곳이다. */
export function createWizardResultRequest(
  region: DistrictGeo,
  categoryCode: string,
  storeSize: WizardStoreSizeOption,
  floor: WizardFloorOption,
  staff: WizardStaffOption,
  works15Hours: boolean,
): WizardResultRequest {
  // 범위형 직원 수는 분석에 쓸 보수적 대표값으로 변환한다. 실제 API가 정확한 인원 입력을 받으면 여기만 바꾼다.
  const staffCountByRange = { none: 0, oneToFour: 2, fivePlus: 5 } as const;
  const floorByCode = { basement: -1, ground: 1, upper: 2 } as const;
  const staffCount = staffCountByRange[staff.code];

  return {
    guCode: region.guCode,
    categoryCode,
    storeSizeM2: storeSize.areaM2,
    floor: floorByCode[floor.code],
    staffCount,
    staff15hPlusCount: works15Hours ? staffCount : 0,
  };
}

export function createStartupAnalysisRequest(
  region: DistrictGeo,
  categoryCode: string,
  storeSize: WizardStoreSizeOption,
  floor: WizardFloorOption,
  staff: WizardStaffOption,
  works15Hours: boolean,
) {
  const staffCountByRange = {
    none: 0,
    oneToFour: 2,
    fivePlus: 5,
  } as const;

  const floorByCode = {
    basement: -1,
    ground: 1,
    upper: 2,
  } as const;

  return {
    area: {
      unit: 'GU',
      code: region.guCode,
    },
    industry_code: categoryCode,
    store: {
      size_m2: storeSize.areaM2,
      floor: floorByCode[floor.code],
    },
    employment: {
      employee_count: staffCountByRange[staff.code],
      weekly_hours_ge_15: works15Hours,
    },
  };
}
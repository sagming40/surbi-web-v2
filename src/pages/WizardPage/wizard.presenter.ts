import type { DistrictGeo, StartupAnalysisRequest } from '@/shared/types';

import type { WizardFloorOption, WizardStaffOption, WizardStoreSizeOption } from './wizard.types';

/** API의 guCode를 화면 문구로 바꾸는 표현 전용 규칙이다. */
const districtDisplayNames: Record<string, string> = {
  '11110': '서울시 종로구',
  '11140': '서울시 중구',
  '11170': '서울시 용산구',
  '11200': '서울시 성동구',
  '11215': '서울시 광진구',
};

/** API 데이터는 바꾸지 않고, Figma에 필요한 화면 문구만 만든다. */
export function getDistrictDisplayName(district: DistrictGeo) {
  return districtDisplayNames[district.guCode] ?? district.guName;
}

/** UI 선택값을 공용 API가 사용하는 camelCase 요청으로 바꾸는 화면 전용 규칙이다. */
export function createStartupAnalysisRequest(
  region: DistrictGeo,
  categoryCode: string,
  storeSize: WizardStoreSizeOption,
  floor: WizardFloorOption,
  staff: WizardStaffOption,
  works15Hours: boolean,
): StartupAnalysisRequest {
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
    industryCode: categoryCode,
    store: {
      sizeM2: storeSize.areaM2,
      floor: floorByCode[floor.code],
    },
    employment: {
      employeeCount: staffCountByRange[staff.code],
      weeklyHoursGe15: works15Hours,
    },
  };
}

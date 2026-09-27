/** 지도·위저드 등 선택 UI가 공통으로 쓰는 공개 공간 식별자다. */
export interface AreaSelectionItem {
  unit: 'SEOUL' | 'GU' | 'DONG' | 'COMMERCIAL_AREA' | 'COMMERCIAL_HINTERLAND';
  code: string;
  name: string;
  parent: {
    unit: string;
    code: string;
    name: string;
  } | null;
}

/** 상권 필터에 필요한 상권 이름·유형·소속 행정구역 정보다. */
export interface CommercialAreaSelectionItem {
  unit: 'COMMERCIAL_AREA';
  code: string;
  name: string;
  type: string | null;
  gu: {
    unit: string;
    code: string;
    name: string;
  } | null;
  dong: {
    unit: string;
    code: string;
    name: string;
  } | null;
  hasHinterland: boolean;
}

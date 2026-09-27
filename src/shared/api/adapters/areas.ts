import type { AreaSelectionResponseDto, CommercialAreaListResponseDto } from '../dto/areas';
import type { AreaSelectionItem, CommercialAreaSelectionItem } from '@/shared/types';

/** 백엔드 지역 선택 목록을 화면의 camelCase 형태로 바꾼다. */
export function toAreaSelectionItems(dto: AreaSelectionResponseDto): AreaSelectionItem[] {
  return dto.items.map((item) => ({
    unit: item.unit,
    code: item.code,
    name: item.name,
    parent: item.parent,
  }));
}

/** 백엔드 상권 목록을 화면의 camelCase 형태로 바꾼다. */
export function toCommercialAreaSelectionItems(
  dto: CommercialAreaListResponseDto,
): CommercialAreaSelectionItem[] {
  return dto.items.map((item) => ({
    unit: 'COMMERCIAL_AREA',
    code: item.code,
    name: item.name,
    type: item.type,
    gu: item.gu,
    dong: item.dong,
    hasHinterland: item.has_hinterland,
  }));
}

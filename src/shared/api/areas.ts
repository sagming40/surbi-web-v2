import { toAreaSelectionItems, toCommercialAreaSelectionItems } from './adapters/areas';
import { apiClient } from './client';
import type { AreaSelectionResponseDto, CommercialAreaListResponseDto } from './dto/areas';
import type { AreaSelectionItem, CommercialAreaSelectionItem } from '@/shared/types';

type AreaUnit = AreaSelectionItem['unit'];

/** 자치구·행정동 선택에 필요한 공개 코드와 이름을 조회한다. */
export async function getAreaSelections(
  unit: AreaUnit,
  parentCode?: string,
): Promise<AreaSelectionItem[]> {
  const response = await apiClient.get<AreaSelectionResponseDto>('/areas', {
    params: { unit, parent_code: parentCode, format: 'selection' },
  });
  return toAreaSelectionItems(response.data);
}

/** 선택한 자치구·행정동에 속한 상권 목록을 조회한다. */
export async function getCommercialAreaSelections(params: {
  guCode?: string;
  dongCode?: string;
}): Promise<CommercialAreaSelectionItem[]> {
  const response = await apiClient.get<CommercialAreaListResponseDto>('/commercial-areas', {
    params: { gu_code: params.guCode, dong_code: params.dongCode },
  });
  return toCommercialAreaSelectionItems(response.data);
}

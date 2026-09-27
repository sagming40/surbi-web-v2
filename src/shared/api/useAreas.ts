import { useQuery } from '@tanstack/react-query';
import { getAreaSelections, getCommercialAreaSelections } from './areas';
import type { AreaSelectionItem } from '@/shared/types';

/** 지역 선택 목록은 자주 바뀌지 않아 React Query 캐시를 재사용한다. */
export function useAreaSelections(unit: AreaSelectionItem['unit'], parentCode?: string) {
  return useQuery({
    queryKey: ['areas', unit, parentCode ?? null],
    queryFn: () => getAreaSelections(unit, parentCode),
    staleTime: Infinity,
  });
}

/** 상위 행정구역이 선택된 뒤에만 해당 상권 목록을 조회한다. */
export function useCommercialAreaSelections(guCode?: string, dongCode?: string) {
  return useQuery({
    queryKey: ['commercial-areas', guCode ?? null, dongCode ?? null],
    queryFn: () => getCommercialAreaSelections({ guCode, dongCode }),
    enabled: Boolean(guCode),
    staleTime: Infinity,
  });
}

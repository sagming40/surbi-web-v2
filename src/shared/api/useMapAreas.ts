import { useQuery } from '@tanstack/react-query';
import { getDistrictGeos, getDongGeos, getSeoulOutline } from './mapArea';

// 경계선은 통계와 달리 거의 바뀌지 않아서 앱 실행 중 한 번만 받는다
export function useDistrictGeos() {
  return useQuery({
    queryKey: ['mapAreas', 'GU'],
    queryFn: getDistrictGeos,
    staleTime: Infinity,
  });
}

export function useSeoulOutline() {
  return useQuery({
    queryKey: ['mapAreas', 'SEOUL'],
    queryFn: getSeoulOutline,
    staleTime: Infinity,
  });
}

export function useDongGeos(guCode: string | null) {
  return useQuery({
    queryKey: ['mapAreas', 'DONG', guCode],
    queryFn: () => getDongGeos(guCode!),
    enabled: guCode !== null,
    staleTime: Infinity,
  });
}

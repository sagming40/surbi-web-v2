import { useQuery } from '@tanstack/react-query';
import { getDistrictMap } from '@/shared/api/explore';

export function useDistrictMap(guCode: string | null, guName: string | undefined) {

  return useQuery({
    queryKey: ['districtMap', guCode],
    queryFn: () => getDistrictMap(guCode!, guName ?? ''),
    enabled: guCode !== null,
    staleTime: 1000 * 60 * 10, // 10분
  });
}


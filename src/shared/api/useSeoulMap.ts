import { useQuery } from '@tanstack/react-query';
import { getSeoulMap } from '@/shared/api/explore';

export function useSeoulMap() {
  return useQuery({
    queryKey: ['seoulMap'],
    queryFn: getSeoulMap,
    staleTime: 1000 * 60 * 10, // 10분 동안 캐시 유지
  });
}

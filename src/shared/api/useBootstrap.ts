import { useQuery } from '@tanstack/react-query';
import { getBootstrap } from './bootstrap';

export function useBootstrap() {
  return useQuery({
    queryKey: ['bootstrap'],
    queryFn: getBootstrap,
    staleTime: Infinity, // 부트스트랩 데이터는 앱 실행 중 변경되지 않으므로 무한대로 설정
  });
}


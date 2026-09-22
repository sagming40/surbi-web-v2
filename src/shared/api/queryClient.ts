import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      retry: 1, // 실패 시 재시도 횟수
      refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 여부
    },
  },
});


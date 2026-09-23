import { useMutation } from '@tanstack/react-query';
import { createStartupAnalysis } from './startupAnalysis';

/** 버튼 클릭으로 실행되는 창업 분석 POST 요청을 관리한다. */
export function useStartupAnalysis() {
  return useMutation({
    mutationFn: createStartupAnalysis,
  });
}

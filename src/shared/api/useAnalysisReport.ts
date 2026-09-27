import { useMutation } from '@tanstack/react-query';
import { createAnalysisReport } from './analysisReport';

/** 보고서 화면 진입 시 실행되는 POST 분석 요청의 로딩·오류 상태를 관리한다. */
export function useAnalysisReport() {
  return useMutation({
    mutationFn: createAnalysisReport,
  });
}

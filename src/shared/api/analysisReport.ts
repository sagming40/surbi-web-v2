import { toStartupAnalysisRequestDto } from './adapters/startupAnalysis';
import { toAnalysisReport } from './adapters/analysisReport';
import { apiClient } from './client';
import type { AnalysisReportResponseDto } from './dto/analysisReport';
import type { AnalysisReportRequest, AnalysisReportResponse } from '@/shared/types';

/** 위저드에서 고른 조건으로 AI 분석 보고서의 실제 시장 통계를 조회한다. */
export async function createAnalysisReport(
  request: AnalysisReportRequest,
): Promise<AnalysisReportResponse> {
  const response = await apiClient.post<AnalysisReportResponseDto>(
    '/analysis-reports',
    toStartupAnalysisRequestDto(request),
  );

  return toAnalysisReport(response.data);
}

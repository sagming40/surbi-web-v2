import { toStartupAnalysis, toStartupAnalysisRequestDto } from './adapters/startupAnalysis';
import { apiClient } from './client';
import type { StartupAnalysisResponseDto } from './dto/startupAnalysis';
import type { StartupAnalysisRequest, StartupAnalysisResponse } from '@/shared/types';

/** 사용자의 위저드 입력으로 창업 분석 결과를 생성한다. */
export async function createStartupAnalysis(
  request: StartupAnalysisRequest,
): Promise<StartupAnalysisResponse> {
  const response = await apiClient.post<StartupAnalysisResponseDto>(
    '/startup-analysis',
    toStartupAnalysisRequestDto(request),
  );

  return toStartupAnalysis(response.data);
}

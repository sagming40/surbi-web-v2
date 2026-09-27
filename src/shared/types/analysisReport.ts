import type { CategoryCode } from './common';
import type { AnalysisMeta, AnalysisStatus, StartupAnalysisRequest } from './analysis';

/**
 * POST /api/v1/analysis-reports의 요청은 창업 분석 요청과 동일하다.
 * 화면은 이 별칭을 사용해 "보고서 생성 요청"이라는 목적을 드러낸다.
 */
export type AnalysisReportRequest = StartupAnalysisRequest;

/** 백엔드가 실제로 계산한 값과 아직 준비되지 않은 ML 결과를 함께 담는 보고서 응답이다. */
export interface AnalysisReportResponse {
  meta: AnalysisMeta;
  status: AnalysisStatus;
  area: {
    unit: string;
    code: string;
    name: string;
  } | null;
  industryCode: CategoryCode | null;
  marketContext: {
    available: boolean;
    overview: {
      sales: {
        amount: number | null;
        previousAmount: number | null;
        changeRate: number | null;
        rank: number | null;
        rankTotal: number | null;
      } | null;
      storeCount: number | null;
      peakSalesTime: {
        fromHour: number | null;
        toHour: number | null;
      } | null;
      dominantCustomer: {
        days: string[];
        ageGroups: string[];
        gender: 'MALE' | 'FEMALE' | null;
      } | null;
    } | null;
    population: {
      available: boolean;
      floatingPopulation: number | null;
      residentPopulation: number | null;
      workingPopulation: number | null;
    } | null;
    context: {
      commercialAreaType: string | null;
      commercialChange: {
        name: string | null;
        index: number | null;
        averageOpenDurationMonths: number | null;
        averageCloseDurationMonths: number | null;
      };
    } | null;
  };
  ml: {
    available: boolean;
    score: number | null;
    grade: string | null;
    expectedMonthlySales: number | null;
    closureRisk: number | null;
    factors: string[] | null;
  };
  summary: {
    available: boolean;
    location: string | null;
    strengths: string[] | null;
    risks: string[] | null;
  };
  missingCapabilities: string[];
}

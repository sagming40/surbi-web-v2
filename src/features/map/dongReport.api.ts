import type { DongReportResponse } from '@/shared/types';

import { createDongReportMock } from './mock/dongReportMock';

interface GetDongReportParams {
  dongCode: string;
  dongName: string;
  guCode: string;
  guName: string;
}

/**
 * GET /api/dongs/{dongCode}/report
 *
 * 현재는 실제 응답 타입과 같은 목 데이터를 반환한다. 백엔드가 준비되면 아래의
 * 주석 처리된 fetch만 사용하면 되며, 드로어·탭 컴포넌트는 바뀌지 않는다.
 */
export async function getDongReport(params: GetDongReportParams): Promise<DongReportResponse> {
  // const response = await fetch(`/api/dongs/${params.dongCode}/report`);
  // if (!response.ok) throw new Error('행정동 분석 데이터를 불러오지 못했습니다.');
  // return response.json() as Promise<DongReportResponse>;

  await new Promise((resolve) => window.setTimeout(resolve, 180));
  return createDongReportMock(params.dongCode, params.dongName, params.guCode, params.guName);
}

import { useEffect, useRef } from 'react';
import { isAxiosError } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAnalysisReport } from '@/shared/api/useAnalysisReport';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Chip } from '@/shared/ui/Chip';
import { DataStatusNotice } from '@/shared/ui/DataStatusNotice';
import { SurbiCard } from '@/shared/ui/SurbiCard';
import { BarChart } from '@/shared/ui/charts/BarChart';
import { getWizardResultNavigationState } from '../WizardPage/wizard.navigation';
import type { WizardResultNavigationState } from '../WizardPage/wizard.types';

/**
 * 07 AI 분석 보고서.
 *
 * 04에서 만든 입력 조건을 같은 브라우저 탭의 navigation state 또는 sessionStorage에서 읽는다.
 * 이 화면은 입력값을 새로 만들지 않고, 그 조건으로 /analysis-reports만 요청한다.
 */
export default function ReportPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationState = (location.state as WizardResultNavigationState | null)
    ?? getWizardResultNavigationState();
  const request = navigationState?.request;
  const selection = navigationState?.selection;
  const { data: report, mutate: createReport, isPending, isError, error } = useAnalysisReport();
  const hasRequestedRef = useRef(false);

  // 개발 환경 StrictMode에서도 같은 보고서 요청을 두 번 보내지 않도록 한 번만 실행한다.
  useEffect(() => {
    if (!request || hasRequestedRef.current) return;

    hasRequestedRef.current = true;
    createReport(request);
  }, [createReport, request]);

  const overview = report?.marketContext.overview;
  const population = report?.marketContext.population;
  const context = report?.marketContext.context;
  const selectedConditions = selection
    ? [
        selection.area.name,
        selection.industry.name,
        `${selection.storeSize.label} ${selection.storeSize.areaM2}㎡`,
        selection.floor.label,
      ]
    : [];
  const populationBars = population
    ? [
        { label: '유동인구', value: population.floatingPopulation ?? 0, displayValue: formatNumber(population.floatingPopulation) },
        { label: '상주인구', value: population.residentPopulation ?? 0, displayValue: formatNumber(population.residentPopulation) },
        { label: '직장인구', value: population.workingPopulation ?? 0, displayValue: formatNumber(population.workingPopulation) },
      ]
    : [];
  const hasPopulationData = populationBars.some((item) => item.value > 0);

  return (
    <main className="min-h-screen bg-bg py-8 text-text">
      <div className="mx-auto w-full max-w-[400px] px-5">
        <button
          type="button"
          className="mb-5 text-body font-medium text-sub"
          onClick={() => navigate('/wizard/result', { state: navigationState })}
        >
          ← 계산 결과로 돌아가기
        </button>

        <header>
          <Badge variant={report?.status === 'READY' ? 'success' : 'info'}>AI 분석 보고서</Badge>
          <h1 className="mt-3 text-title font-bold">
            {selection ? `${selection.area.name} ${selection.industry.name} 창업 분석` : '창업 분석 보고서'}
          </h1>
          <p className="mt-2 text-body leading-6 text-sub">
            입력 조건과 백엔드에서 제공하는 실제 상권 통계를 바탕으로 작성한 보고서예요.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedConditions.map((condition) => <Chip key={condition} variant="active">{condition}</Chip>)}
          </div>
        </header>

        {!request && (
          <DataStatusNotice status="unavailable" className="mt-6">
            분석 조건을 찾을 수 없습니다. 위저드에서 조건을 선택한 뒤 분석 결과를 다시 생성해 주세요.
          </DataStatusNotice>
        )}

        {isPending && (
          <DataStatusNotice status="temporary" className="mt-6">
            선택한 조건의 시장 통계를 불러오는 중입니다.
          </DataStatusNotice>
        )}

        {isError && (
          <DataStatusNotice status="unavailable" className="mt-6">
            {getReportErrorMessage(error)}
          </DataStatusNotice>
        )}

        {report && (
          <>
            <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-white">
              <div className="bg-blue px-5 py-6 text-white">
                <p className="text-body font-medium text-blue-100">AI 창업 적합도</p>
                {report.ml.available && report.ml.score !== null ? (
                  <div className="mt-2 flex items-end justify-between">
                    <div>
                      <strong className="text-[48px] font-bold leading-none">{report.ml.score}</strong>
                      <span className="ml-1 text-lg">점</span>
                    </div>
                    {report.ml.grade && <span className="rounded-full bg-white/20 px-3 py-1 text-caption font-bold">{report.ml.grade} 등급</span>}
                  </div>
                ) : (
                  <p className="mt-2 text-headline font-bold">AI 모델 결과 준비 중</p>
                )}
              </div>
              {report.ml.available ? (
                <p className="px-5 py-4 text-body leading-6 text-sub">
                  모델이 계산한 적합도 결과입니다. 시장 통계와 함께 창업 조건을 검토해 주세요.
                </p>
              ) : (
                <DataStatusNotice status="unavailable" className="m-4">
                  현재 백엔드는 실제 시장 통계만 제공합니다. AI 점수·예상 매출·폐업 위험도는 모델 연결 후 제공됩니다.
                </DataStatusNotice>
              )}
            </section>

            <section className="mt-4 grid grid-cols-3 gap-2">
              <Metric label="분기 매출" value={formatWon(overview?.sales?.amount)} description="선택 업종 기준" />
              <Metric label="점포 수" value={formatCount(overview?.storeCount, '곳')} description="선택 업종 기준" />
              <Metric label="유동인구" value={formatCount(population?.floatingPopulation, '명')} description="현재 제공 분기" />
            </section>

            <section className="mt-7">
              <h2 className="text-headline font-bold">인구 구성</h2>
              <p className="mt-1 text-body text-sub">백엔드에서 조회한 실제 인구 통계예요.</p>
              {hasPopulationData ? (
                <SurbiCard className="mt-3 p-5">
                  <BarChart data={populationBars} />
                </SurbiCard>
              ) : (
                <DataStatusNotice status="unavailable" className="mt-3">
                  현재 선택 조건에서 인구 통계를 제공하지 않습니다.
                </DataStatusNotice>
              )}
            </section>

            <section className="mt-7">
              <h2 className="text-headline font-bold">시장 요약</h2>
              <SurbiCard className="mt-3 divide-y divide-border p-0">
                <SummaryRow label="매출 증감률" value={formatPercent(overview?.sales?.changeRate)} />
                <SummaryRow label="매출 순위" value={formatRank(overview?.sales?.rank, overview?.sales?.rankTotal)} />
                <SummaryRow label="피크 매출 시간" value={formatTimeRange(overview?.peakSalesTime)} />
                <SummaryRow label="주요 고객" value={formatDominantCustomer(overview?.dominantCustomer)} />
                <SummaryRow label="상권 유형" value={context?.commercialAreaType ?? '데이터 없음'} />
              </SurbiCard>
            </section>

            <section className="mt-7">
              <h2 className="text-headline font-bold">AI 분석 요약</h2>
              {report.summary.available ? (
                <SurbiCard className="mt-3 p-5">
                  <p className="text-body leading-7 text-sub">{report.summary.strengths?.join(' ')}</p>
                </SurbiCard>
              ) : (
                <DataStatusNotice status="unavailable" className="mt-3">
                  자연어 분석 요약은 AI 모델 및 특징 생성 과정이 준비된 뒤 제공됩니다.
                </DataStatusNotice>
              )}
            </section>

            <section className="mt-7">
              <h2 className="text-headline font-bold">계산 기준</h2>
              <SurbiCard className="mt-3 divide-y divide-border p-0">
                <SummaryRow label="상권 데이터" value="매출·점포 수·인구 통계" />
                <SummaryRow label="입력 조건" value="지역·업종·매장 조건" />
                <SummaryRow label="AI 분석" value={report.ml.available ? '모델 결과 반영' : '모델 준비 중'} />
              </SurbiCard>
            </section>
          </>
        )}

        <div className="mt-8 space-y-3 pb-4">
          <Button className="w-full" variant="outline" onClick={() => window.print()}>
            보고서 저장하기
          </Button>
          <Button className="w-full !bg-blue" onClick={() => navigate('/simulation', { state: navigationState })} disabled={!navigationState}>
            창업 시뮬레이션 보기
          </Button>
        </div>
      </div>
    </main>
  );
}

/** 값이 없을 때 0으로 보이지 않도록 숫자 표기를 한곳에서 처리한다. */
function formatNumber(value: number | null | undefined) {
  return value === null || value === undefined ? '—' : value.toLocaleString();
}

function formatWon(value: number | null | undefined) {
  return value === null || value === undefined ? '데이터 없음' : `${value.toLocaleString()}원`;
}

function formatCount(value: number | null | undefined, unit: string) {
  return value === null || value === undefined ? '데이터 없음' : `${value.toLocaleString()}${unit}`;
}

function formatPercent(value: number | null | undefined) {
  return value === null || value === undefined ? '데이터 없음' : `${value.toFixed(1)}%`;
}

function formatRank(rank: number | null | undefined, total: number | null | undefined) {
  return rank === null || rank === undefined || total === null || total === undefined ? '데이터 없음' : `${rank}위 / ${total}개`;
}

function formatTimeRange(value: { fromHour: number | null; toHour: number | null } | null | undefined) {
  return value?.fromHour === null || value?.fromHour === undefined || value.toHour === null || value.toHour === undefined
    ? '데이터 없음'
    : `${value.fromHour}시~${value.toHour}시`;
}

function formatDominantCustomer(
  value: { days: string[]; ageGroups: string[]; gender: 'MALE' | 'FEMALE' | null } | null | undefined,
) {
  if (!value) return '데이터 없음';

  const gender = value.gender === 'MALE' ? '남성' : value.gender === 'FEMALE' ? '여성' : null;
  return [value.days.join('·'), value.ageGroups.join('·'), gender].filter(Boolean).join(' / ') || '데이터 없음';
}

function getReportErrorMessage(error: unknown) {
  if (isAxiosError(error)) {
    if (error.response?.status === 404) return '선택한 지역 또는 업종의 보고서 데이터가 없습니다.';
    if (!error.response) return '분석 서버에 연결하지 못했습니다. 백엔드가 8000번 포트에서 실행 중인지 확인해 주세요.';
  }

  return 'AI 분석 보고서를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';
}

function Metric({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <SurbiCard className="p-3">
      <p className="text-label text-sub">{label}</p>
      <strong className="mt-1 block break-all text-body text-text">{value}</strong>
      <p className="mt-1 text-caption text-sub">{description}</p>
    </SurbiCard>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <p className="text-body text-sub">{label}</p>
      <strong className="text-right text-body text-text">{value}</strong>
    </div>
  );
}

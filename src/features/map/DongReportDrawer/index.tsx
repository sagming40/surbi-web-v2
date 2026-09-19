import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import type { DongReportResponse } from '@/shared/types';
import { BarChart } from '@/shared/ui/charts/BarChart';
import { ColumnChart } from '@/shared/ui/charts/ColumnChart';
import { Button } from '@/shared/ui/Button';
import { InsightCard } from '@/shared/ui/InsightCard';
import { SurbiCard } from '@/shared/ui/SurbiCard';
import { Tabs } from '@/shared/ui/Tabs';
import { formatKrw, formatQuarter } from '@/shared/lib/format';

import { getDongReport } from '../dongReport.api';

interface DongReportDrawerProps {
  dongCode: string;
  dongName: string;
  guCode: string;
  guName: string;
  onClose: () => void;
}

/**
 * 01c 행정동 분석 드로어.
 *
 * 좌측 RankingPanel은 지도 탐색·순위 비교를 맡고, 이 컴포넌트는 선택된 행정동의
 * 상세 분석만 우측에서 보여 준다. 서로 다른 목적의 패널이라 상태와 UI를 분리했다.
 */
export function DongReportDrawer({ dongCode, dongName, guCode, guName, onClose }: DongReportDrawerProps) {
  const [report, setReport] = useState<DongReportResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    getDongReport({ dongCode, dongName, guCode, guName })
      .then((response) => {
        if (!cancelled) setReport(response);
      })
      .catch(() => {
        if (!cancelled) setError('분석 정보를 불러오지 못했습니다.');
      });

    return () => { cancelled = true; };
  }, [dongCode, dongName, guCode, guName]);

  return (
    <aside aria-label={`${dongName} 분석 리포트`} className="pointer-events-auto absolute top-4 right-4 bottom-4 z-20 w-[380px] max-w-[calc(100vw-2rem)]">
      <SurbiCard elevated className="flex h-full flex-col overflow-hidden">
        <header className="flex shrink-0 items-start justify-between px-5 pt-5 pb-3">
          <div>
            <p className="text-title font-bold text-navy">{dongName}</p>
            <p className="mt-1 text-caption text-sub">{guName} · {report ? formatQuarter(report.quarter) : '분석 정보 로딩 중'} · 전체 업종</p>
          </div>
          <button type="button" onClick={onClose} aria-label="분석 드로어 닫기" className="grid h-7 w-7 place-items-center rounded-full text-title text-sub transition-colors hover:bg-surface hover:text-text">×</button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
          {error && <p role="alert" className="py-10 text-center text-body text-red">{error}</p>}
          {!report && !error && <p className="py-10 text-center text-body text-sub">분석 정보를 불러오는 중입니다.</p>}
          {report && <ReportTabs key={report.dongCode} report={report} />}
        </div>
      </SurbiCard>
    </aside>
  );
}

function ReportTabs({ report }: { report: DongReportResponse }) {
  return (
    <Tabs
      tabs={[
        { label: '요약', content: <SummaryTab report={report} /> },
        { label: '업종', content: <IndustryTab report={report} /> },
        { label: '매출', content: <SalesTab report={report} /> },
        { label: '인구', content: <PopulationTab report={report} /> },
        { label: '지역', content: <RegionTab report={report} /> },
      ]}
    />
  );
}

function SummaryTab({ report }: { report: DongReportResponse }) {
  const navigate = useNavigate();
  const { summary } = report;
  const topHour = getLargestItem(summary.hourlySales, (item) => item.amount);
  const topAge = [...summary.dayGenderAgeSales.age].sort((a, b) => b.amount - a.amount)[0];

  return (
    <div className="space-y-3">
      <InsightCard label="분기 매출" headline={`${formatKrw(summary.sales)} · 전분기 대비 ${summary.salesChangeRate ?? 0}%`} />
      <InsightCard label="시간대별 매출" headline={`${formatTimeRange(topHour.timeRange)}에 결제가 가장 많습니다`} />
      <InsightCard label="요일·성별·연령별" headline={`${topAge.label} 여성 비중이 높습니다`} />
      <SurbiCard className="border-blue/30 bg-blue/5 p-4">
        <p className="text-label font-bold text-blue">AI 창업 점수 (예비보기)</p>
        <p className="mt-1 text-display font-bold text-navy">{summary.aiScorePreview ?? '-'}<span className="ml-1 text-caption font-medium text-sub">/ 100 · B등급</span></p>
        <p className="mt-2 rounded-md border border-warn-line bg-warn-bg px-2 py-1.5 text-label text-warn">업종을 선택하면 정확한 점수와 AI 보고서를 볼 수 있습니다.</p>
      </SurbiCard>
      {/* 01c 요약의 마지막 행동은 07 AI 분석 보고서 화면으로 이어진다. */}
      <Button
        className="w-full"
        onClick={() => navigate('/report', { state: { dongCode: report.dongCode, guCode: report.guCode } })}
      >
        AI 분석 보고서 전문 보기
      </Button>
    </div>
  );
}

function IndustryTab({ report }: { report: DongReportResponse }) {
  const { industry } = report;
  const topComposition = getLargestItem(industry.categoryComposition, (item) => item.ratio);
  const topSalesCategory = getLargestItem(industry.categorySales, (item) => item.ratio);
  const netStoreChange = industry.newStores - industry.closedStores;

  return (
    <div className="space-y-2">
      <ReportSectionCard
        label="업종 구성"
        title={`${topComposition.categoryName} ${topComposition.ratio}%로 가장 많습니다`}
        note={`총 ${industry.totalStores.toLocaleString()}개 점포`}
      >
        <BarChart
          data={industry.categoryComposition.map((item) => ({
            label: item.categoryName,
            value: item.ratio,
            displayValue: `${item.ratio}%`,
          }))}
          maxValue={100}
        />
      </ReportSectionCard>
      <ReportSectionCard
        label="업종별 매출 비중"
        title={`${topSalesCategory.categoryName}이 매출 1위입니다`}
        note={`${report.dongName} 전체 매출 비율 · 매출액 기준`}
      >
        <BarChart
          data={industry.categorySales.map((item) => ({
            label: item.categoryName,
            value: item.ratio,
            displayValue: `${item.ratio}%`,
          }))}
          maxValue={100}
        />
      </ReportSectionCard>
      <ReportSectionCard
        label="신규 · 폐업"
        title={`최근 1년 신규 ${industry.newStores}곳 · 폐업 ${industry.closedStores}곳`}
        note={`순증 ${formatSignedNumber(netStoreChange)}곳`}
      />
    </div>
  );
}

function SalesTab({ report }: { report: DongReportResponse }) {
  const { sales } = report;
  const topHour = getLargestItem(sales.hourly, (item) => item.amount);
  const topDays = sales.daily
    .slice()
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 2)
    .map((item) => item.label)
    .join('·');
  const consecutiveRiseCount = countConsecutiveRise(sales.trend);
  const comparisonQuarter = sales.trend.at(-4);
  const comparisonRate = comparisonQuarter
    ? ((report.summary.sales - comparisonQuarter.amount) / comparisonQuarter.amount) * 100
    : null;

  return (
    <div className="space-y-2">
      <ReportSectionCard
        label="분기 매출 추이"
        title={`${formatKrw(report.summary.sales)} · ${consecutiveRiseCount}분기 연속 상승`}
        note={comparisonQuarter && comparisonRate !== null ? `${formatQuarter(comparisonQuarter.quarter)} 대비 ${formatSignedPercent(comparisonRate)}` : undefined}
      />
      <ReportSectionCard label="시간대별 매출" title={`${formatTimeRange(topHour.timeRange)}에 결제가 가장 몰립니다`}>
        <ColumnChart
          data={sales.hourly.map((item) => ({
            label: item.timeRange,
            value: item.amount,
            highlighted: item.timeRange === '18-21',
          }))}
          height={112}
        />
      </ReportSectionCard>
      <ReportSectionCard label="요일별 결제" title={`${topDays}에 집중됩니다`}>
        <ColumnChart
          data={sales.daily.map((item) => ({
            label: item.label,
            value: item.amount,
            highlighted: item.label === '금' || item.label === '토',
          }))}
          height={92}
        />
      </ReportSectionCard>
      <ReportSectionCard
        label="객단가"
        title={sales.averageOrderValue ? `평균 ${sales.averageOrderValue.toLocaleString()}원` : '-'}
        note={`${report.guName} 상권 평균 기준`}
      />
    </div>
  );
}

function PopulationTab({ report }: { report: DongReportResponse }) {
  const { population } = report;
  const age2030Ratio = population.ageComposition
    .filter((item) => item.label === '20대' || item.label === '30대')
    .reduce((sum, item) => sum + item.ratio, 0);
  const femaleRatio = population.genderComposition.find((item) => item.label === '여성')?.ratio ?? 0;
  const maleRatio = population.genderComposition.find((item) => item.label === '남성')?.ratio ?? 0;
  const flowToResident = population.resident > 0 ? population.flow / population.resident : null;
  const weekendToWeekday = population.weekdayWeekend.weekday > 0
    ? population.weekdayWeekend.weekend / population.weekdayWeekend.weekday
    : null;

  return (
    <div className="space-y-2">
      <ReportSectionCard
        label="인구 구성"
        title={flowToResident ? `유동인구가 주거인구의 ${flowToResident.toFixed(1)}배입니다` : '인구 데이터를 확인해 주세요'}
        note={`${report.guName} 일평균 인구 기준`}
      >
        <BarChart
          data={[
            { label: '유동인구', value: population.flow, displayValue: `${population.flow.toLocaleString()}명` },
            { label: '직장인구', value: population.worker, displayValue: `${population.worker.toLocaleString()}명` },
            { label: '주거인구', value: population.resident, displayValue: `${population.resident.toLocaleString()}명` },
          ]}
        />
      </ReportSectionCard>
      <ReportSectionCard label="연령별 비중" title={`20~30대가 ${age2030Ratio}%를 차지합니다`}>
        <BarChart
          data={population.ageComposition.map((item) => ({
            label: item.label,
            value: item.ratio,
            displayValue: `${item.ratio}%`,
          }))}
          maxValue={100}
        />
      </ReportSectionCard>
      <ReportSectionCard label="성별 비중" title={`여성 ${femaleRatio}% · 남성 ${maleRatio}%`} />
      <ReportSectionCard
        label="주중 · 주말"
        title={weekendToWeekday ? `주말 유동인구가 주중의 ${weekendToWeekday.toFixed(1)}배입니다` : '주중·주말 데이터를 확인해 주세요'}
        note={`주중 ${population.weekdayWeekend.weekday.toLocaleString()}명 · 주말 ${population.weekdayWeekend.weekend.toLocaleString()}명`}
      />
    </div>
  );
}

function RegionTab({ report }: { report: DongReportResponse }) {
  const { region } = report;
  const nearestTrdar = region.nearbyTrdars
    .slice()
    .sort((a, b) => a.distanceM - b.distanceM)
    .at(0);

  return (
    <div className="space-y-2">
      <p className="rounded-md border border-warn-line bg-warn-bg px-3 py-2 text-label text-warn">⚠️ 행정구역 데이터와 실제 구역은 일부 차이 있을 수 있습니다</p>
      <ReportSectionCard label="배후지 유형" title={`${region.areaProfile.type} 성격이 강합니다`}>
        <BarChart
          data={[
            { label: '유입형', value: region.areaProfile.flowRatio, displayValue: `${region.areaProfile.flowRatio}%` },
            { label: '직장형', value: region.areaProfile.workerRatio, displayValue: `${region.areaProfile.workerRatio}%` },
            { label: '주거형', value: region.areaProfile.residentRatio, displayValue: `${region.areaProfile.residentRatio}%` },
          ]}
          maxValue={100}
        />
      </ReportSectionCard>
      {region.nearestSubway && (
        <ReportSectionCard label="교통" title={`지하철 2호선 ${region.nearestSubway.stationName} 도보 ${Math.ceil(region.nearestSubway.distanceM / 80)}분`} note={`일 승하차 ${((region.nearestSubway.boarding ?? 0) + (region.nearestSubway.alighting ?? 0)).toLocaleString()}명`} />
      )}
      <ReportSectionCard
        label="인프라"
        title={nearestTrdar ? `${nearestTrdar.trdarName}과 인접` : '인접 상권 정보를 확인해 주세요'}
        note={nearestTrdar ? `직선거리 ${nearestTrdar.distanceM.toLocaleString()}m` : undefined}
      />
      <ReportSectionCard label="면적 · 밀도" title={`${formatAreaKm2(region.areaM2)} · 점포 밀도 ${region.storeDensity.toLocaleString()}곳/㎢`} />
    </div>
  );
}

/** 응답 배열에서 가장 큰 값을 가진 항목을 찾아 탭 문구와 강조 막대에 공통으로 쓴다. */
function getLargestItem<T>(items: T[], getValue: (item: T) => number): T {
  return items.reduce((largest, item) => (getValue(item) > getValue(largest) ? item : largest));
}

/** 최신 분기부터 연속으로 상승한 구간의 길이를 계산한다. */
function countConsecutiveRise(trend: DongReportResponse['sales']['trend']): number {
  if (trend.length < 2) return trend.length;

  let count = 1;
  for (let index = trend.length - 1; index > 0; index -= 1) {
    if (trend[index].amount <= trend[index - 1].amount) break;
    count += 1;
  }
  return count;
}

function formatTimeRange(timeRange: string) {
  const [start, end] = timeRange.split('-').map(Number);
  const startLabel = start >= 12 ? `오후 ${start === 12 ? 12 : start - 12}시` : `오전 ${start}시`;
  const endLabel = end >= 12 ? `오후 ${end === 12 ? 12 : end - 12}시` : `오전 ${end}시`;
  return `${startLabel}~${endLabel}`;
}

function formatSignedNumber(value: number) {
  return `${value > 0 ? '+' : ''}${value.toLocaleString()}`;
}

function formatSignedPercent(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

function formatAreaKm2(areaM2: number) {
  return `${(areaM2 / 1_000_000).toFixed(2)}㎢`;
}

/** 피그마의 탭별 정보 블록을 공통 카드 형태로 유지한다. */
function ReportSectionCard({
  label,
  title,
  note,
  children,
}: {
  label: string;
  title: string;
  note?: string;
  children?: ReactNode;
}) {
  return (
    <SurbiCard className="bg-surface p-3">
      <p className="text-label text-sub">{label}</p>
      <p className="mt-1 text-body font-bold text-navy">{title}</p>
      {note && <p className="mt-1 text-label text-sub">{note}</p>}
      {children && <div className="mt-2.5">{children}</div>}
    </SurbiCard>
  );
}

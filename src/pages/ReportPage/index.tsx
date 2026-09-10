import { useNavigate } from 'react-router-dom';

import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Chip } from '@/shared/ui/Chip';
import { SurbiCard } from '@/shared/ui/SurbiCard';
import { BarChart } from '@/shared/ui/charts/BarChart';

const selectedConditions = ['성동구', '한식음식점', '중형 86㎡', '1층'];

const contributionFactors = [
  { label: '유동인구', value: 82, displayValue: '긍정적' },
  { label: '매출 규모', value: 74, displayValue: '긍정적' },
  { label: '경쟁 강도', value: 58, displayValue: '보통' },
  { label: '임대료 부담', value: 44, displayValue: '주의' },
];

const recommendations = [
  '점심 시간대 직장인 수요를 겨냥한 빠른 회전 메뉴를 준비해 보세요.',
  '반경 500m 안의 한식 경쟁 매장을 살펴보고 차별화 메뉴를 정해 보세요.',
  '초기 고정비를 낮추기 위해 직원 수와 배달 운영 여부를 함께 검토해 보세요.',
];

function Metric({ label, value, description }: { label: string; value: string; description: string }) {
  return (
    <SurbiCard className="p-3">
      <p className="text-label text-sub">{label}</p>
      <strong className="mt-1 block text-body text-text">{value}</strong>
      <p className="mt-1 text-caption text-sub">{description}</p>
    </SurbiCard>
  );
}

export default function ReportPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-bg py-8 text-text">
      <div className="mx-auto w-full max-w-[400px] px-5">
        <button
          type="button"
          className="mb-5 text-body font-medium text-sub"
          onClick={() => navigate('/wizard/result')}
        >
          ← 계산 결과로 돌아가기
        </button>

        <header>
          <Badge variant="info">AI 분석 보고서</Badge>
          <h1 className="mt-3 text-title font-bold">성동구 한식 창업 분석</h1>
          <p className="mt-2 text-body leading-6 text-sub">
            입력한 창업 조건과 상권 데이터를 바탕으로 AI가 사업 가능성을 분석했어요.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedConditions.map((condition) => (
              <Chip key={condition} variant="active">
                {condition}
              </Chip>
            ))}
          </div>
        </header>

        <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-white">
          <div className="bg-blue px-5 py-6 text-white">
            <p className="text-body font-medium text-blue-100">AI 창업 적합도</p>
            <div className="mt-2 flex items-end justify-between">
              <div>
                <strong className="text-[48px] font-bold leading-none">72.5</strong>
                <span className="ml-1 text-lg">점</span>
              </div>
              <span className="rounded-full bg-white/20 px-3 py-1 text-caption font-bold">B+ 등급</span>
            </div>
            <div className="mt-5 h-2 rounded-full bg-white/30">
              <div className="h-2 w-[72.5%] rounded-full bg-white" />
            </div>
          </div>
          <p className="px-5 py-4 text-body leading-6 text-sub">
            해당 조건은 안정적으로 창업을 검토할 수 있는 수준이에요. 임대료와 경쟁 매장 수를 함께 확인하면 더 좋은 결정을 내릴 수 있어요.
          </p>
        </section>

        <section className="mt-4 grid grid-cols-3 gap-2">
          <Metric label="예상 월매출" value="4,180만원" description="상권 평균 기준" />
          <Metric label="폐업 위험도" value="34.2%" description="보통 수준" />
          <Metric label="경쟁 매장" value="213개" description="반경 500m" />
        </section>

        <section className="mt-7">
          <h2 className="text-headline font-bold">점수에 영향을 준 요인</h2>
          <p className="mt-1 text-body text-sub">창업 적합도에 반영된 상권 핵심 지표예요.</p>
          <SurbiCard className="mt-3 p-5">
            <BarChart data={contributionFactors} />
          </SurbiCard>
        </section>

        <section className="mt-7">
          <h2 className="text-headline font-bold">AI 분석 요약</h2>
          <SurbiCard className="mt-3 p-5">
            <p className="text-body leading-7 text-sub">
              성동구는 평일 점심과 저녁 시간에 유동인구가 꾸준한 지역이에요. 한식 업종의 매출 잠재력은 높지만, 유사 업종 경쟁이 있어 메뉴와 가격 전략을 명확하게 세우는 것이 좋아요.
            </p>
          </SurbiCard>
        </section>

        <section className="mt-7">
          <h2 className="text-headline font-bold">창업 전 체크해 보세요</h2>
          <div className="mt-3 space-y-2">
            {recommendations.map((recommendation, index) => (
              <SurbiCard key={recommendation} className="flex gap-3 p-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-caption font-bold text-blue">
                  {index + 1}
                </span>
                <p className="text-body leading-6 text-sub">{recommendation}</p>
              </SurbiCard>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <h2 className="text-headline font-bold">계산 기준</h2>
          <SurbiCard className="mt-3 divide-y divide-border p-0">
            {[
              ['상권 데이터', '유동인구, 매출, 경쟁 매장, 임대료 데이터를 반영했어요.'],
              ['입력 조건', '업종, 규모, 층수, 직원 수 등 선택한 조건을 반영했어요.'],
              ['AI 분석', '각 지표의 영향도를 종합해 창업 적합도를 계산했어요.'],
            ].map(([title, description]) => (
              <div key={title} className="px-5 py-4">
                <h3 className="text-body font-bold">{title}</h3>
                <p className="mt-1 text-body leading-6 text-sub">{description}</p>
              </div>
            ))}
          </SurbiCard>
        </section>

        <div className="mt-8 space-y-3 pb-4">
          <Button className="w-full" variant="outline" onClick={() => window.print()}>
            보고서 저장하기
          </Button>
          <Button className="w-full !bg-blue" onClick={() => navigate('/simulation')}>
            창업 시뮬레이션 보기
          </Button>
        </div>
      </div>
    </main>
  );
}

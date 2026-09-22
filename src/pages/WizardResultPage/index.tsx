import { useNavigate } from 'react-router-dom';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Chip } from '@/shared/ui/Chip';
import { SurbiCard } from '@/shared/ui/SurbiCard';

const selectedConditions = ['성동구', '한식음식점', '중형 86㎡', '1층', '직원 1~4명'];

const rentOptions = [
  { label: '소규모 상가', rent: '5,300원' },
  { label: '중대형 상가', rent: '6,800원', selected: true },
  { label: '전환 상가', rent: '3,900원' },
];

const policies = [
  { title: '소상공인 창업 초기자금 융자', organization: '중소벤처기업부', period: 'D-12' },
  { title: '서울시 청년 창업 공간 지원사업', organization: '서울특별시', period: 'D-27' },
  { title: '외식업 위생등급 지정 지원', organization: '식품의약품안전처', period: 'D-41' },
];

export default function WizardResultPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-surface font-sans text-text sm:py-8">
      <section className="mx-auto min-h-screen w-full max-w-[400px] bg-white shadow-sm sm:min-h-[1100px] sm:rounded-2xl sm:border sm:border-border sm:overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-border px-6">
          <button type="button" aria-label="위저드로 돌아가기" onClick={() => navigate('/wizard')} className="text-xl leading-none text-text">←</button>
          <p className="text-headline font-bold text-text">창업 분석 결과</p>
          <button type="button" aria-label="처음으로" onClick={() => navigate('/wizard')} className="text-caption font-bold text-blue">다시 계산</button>
        </header>

        <div className="px-6 pb-6 pt-5">
          <div className="flex flex-wrap gap-1.5">
            {selectedConditions.map((condition) => <Chip key={condition}>{condition}</Chip>)}
          </div>

          <section className="mt-6">
            <p className="text-caption font-bold text-sub">① 상가 유형 임대료</p>
            <h1 className="mt-2 text-headline font-bold text-text">성동구 · 1층 기준 상가 유형별 임대료</h1>
            <div className="mt-3 grid gap-2">
              {rentOptions.map((option) => (
                <button
                  type="button"
                  key={option.label}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left ${option.selected ? 'border-2 border-blue bg-blue/10' : 'border-border bg-white'}`}
                >
                  <span className={`text-body font-bold ${option.selected ? 'text-blue' : 'text-text'}`}>{option.label}</span>
                  <span className="text-right">
                    <span className="block text-label text-sub">월당 임대료</span>
                    <strong className="text-headline text-text">{option.rent}</strong>
                  </span>
                </button>
              ))}
            </div>
            <SurbiCard className="mt-3 bg-surface p-4">
              <h2 className="text-body font-bold text-text">상가 유형에 대한 설명</h2>
              <p className="mt-2 text-caption leading-5 text-sub">소규모 상가는 주거 밀집 지역과 소형 점포에서 상대적으로 많이 확인됩니다. 중대형 상가는 유동인구가 많고 상권이 형성된 지역의 1층 점포 기준 추정치입니다.</p>
            </SurbiCard>
            <p className="mt-2 text-label leading-4 text-sub">※ 한국부동산원 상가 임대동향조사 기준 · 실제 계약 조건에 따라 달라질 수 있습니다.</p>
          </section>

          <section className="mt-7 border-t border-border pt-6">
            <div className="flex items-center justify-between">
              <p className="text-caption font-bold text-sub">② Surbi AI 창업 점수</p>
              <Badge variant="info">성동구 6위 / 17개 동</Badge>
            </div>
            <div className="mt-2 flex items-end gap-2">
              <strong className="text-display leading-none text-blue">68.4</strong>
              <span className="pb-0.5 text-caption font-bold text-sub">점 / 100</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
              <div className="h-full w-[68.4%] rounded-full bg-blue" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Metric label="예상 월 매출" value="4,180만원" />
              <Metric label="폐업 위험도" value="38.6%" warning />
              <Metric label="경쟁업체" value="213곳" />
            </div>
            <p className="mt-3 text-label leading-4 text-sub">※ AI 모델 예측값이며, 실제 매출이나 폐업 여부를 보장하지 않습니다.</p>
          </section>

          <section className="mt-7 border-t border-border pt-6">
            <p className="text-caption font-bold text-sub">③ 모집 중인 지원 정책</p>
            <h2 className="mt-2 text-headline font-bold text-text">신청 가능한 공고 3건</h2>
            <div className="mt-3 grid gap-2">
              {policies.map((policy) => (
                <SurbiCard key={policy.title} className="flex items-center justify-between p-3">
                  <div>
                    <p className="text-body font-bold text-text">{policy.title}</p>
                    <p className="mt-1 text-caption text-sub">{policy.organization}</p>
                  </div>
                  <Badge variant="neutral">{policy.period}</Badge>
                </SurbiCard>
              ))}
            </div>
          </section>

          <Button className="mt-7 w-full !bg-blue" onClick={() => navigate('/report')}>
            AI 분석 보고서 전문 보기
          </Button>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value, warning = false }: { label: string; value: string; warning?: boolean }) {
  return (
    <SurbiCard className="p-3">
      <p className="text-label text-sub">{label}</p>
      <p className={`mt-1 text-body font-bold ${warning ? 'text-red' : 'text-text'}`}>{value}</p>
    </SurbiCard>
  );
}

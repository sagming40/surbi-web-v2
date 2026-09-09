import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { Chip } from '@/shared/ui/Chip';

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;
type StoreSize = 'small' | 'medium' | 'large';
type StaffRange = 'none' | 'oneToFour' | 'fivePlus';

const stepCount = 6;

const categories = ['한식음식점', '중식음식점', '일식음식점', '양식음식점', '제과점', '패스트푸드점'];
const scoreFactors = ['유동인구', '직장인구', '주거인구', '경쟁업체수', '임대료'];

const storeSizes: Record<StoreSize, { label: string; detail: string }> = {
  small: { label: '소형', detail: '54㎡\n(16평)' },
  medium: { label: '중형', detail: '86㎡\n(26평)' },
  large: { label: '대형', detail: '119㎡\n(36평)' },
};

const staffOptions: Record<StaffRange, { label: string; detail: string }> = {
  none: { label: '고용 없음', detail: '1인 운영' },
  oneToFour: { label: '1~4명', detail: '' },
  fivePlus: { label: '5명 이상', detail: '' },
};

export default function WizardPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<WizardStep>(1);
  const [regionQuery, setRegionQuery] = useState('성동');
  const [region, setRegion] = useState('서울시 성동구');
  const [category, setCategory] = useState('한식음식점');
  const [selectedFactors, setSelectedFactors] = useState(['유동인구', '경쟁업체수']);
  const [storeSize, setStoreSize] = useState<StoreSize>('medium');
  const [floor, setFloor] = useState(1);
  const [staffRange, setStaffRange] = useState<StaffRange>('oneToFour');
  const [works15Hours, setWorks15Hours] = useState(true);

  const goNext = () => setStep((current) => Math.min(current + 1, stepCount) as WizardStep);
  const goBack = () => setStep((current) => Math.max(current - 1, 1) as WizardStep);

  function toggleFactor(factor: string) {
    setSelectedFactors((current) => (
      current.includes(factor)
        ? current.filter((item) => item !== factor)
        : [...current, factor]
    ));
  }

  return (
    <main className="min-h-screen bg-surface font-sans text-text sm:py-8">
      <section className="mx-auto min-h-screen w-full max-w-[400px] bg-white shadow-sm sm:min-h-[760px] sm:rounded-2xl sm:border sm:border-border sm:overflow-hidden">
        <WizardHeader step={step} onBack={goBack} onClose={() => navigate(-1)} />

        <div className="h-1 bg-border">
          <div
            className="h-full bg-blue transition-all duration-300"
            style={{ width: `${(step / stepCount) * 100}%` }}
          />
        </div>

        <div className="flex min-h-[calc(100vh-57px)] flex-col px-6 pb-6 pt-7 sm:min-h-[700px]">
          <div className="flex-1">
            {step === 1 && (
              <RegionStep
                query={regionQuery}
                region={region}
                onQueryChange={setRegionQuery}
                onRegionChange={setRegion}
              />
            )}
            {step === 2 && (
              <CategoryStep
                category={category}
                selectedFactors={selectedFactors}
                onCategoryChange={setCategory}
                onToggleFactor={toggleFactor}
              />
            )}
            {step === 3 && <StoreSizeStep value={storeSize} onChange={setStoreSize} />}
            {step === 4 && <FloorStep value={floor} onChange={setFloor} />}
            {step === 5 && (
              <StaffStep
                range={staffRange}
                works15Hours={works15Hours}
                onRangeChange={setStaffRange}
                onWorks15HoursChange={setWorks15Hours}
              />
            )}
            {step === 6 && (
              <ReviewStep
                region={region}
                category={category}
                storeSize={storeSizes[storeSize]}
                floor={floor}
                staffRange={staffOptions[staffRange]}
                works15Hours={works15Hours}
              />
            )}
          </div>

          {step < stepCount ? (
            <Button className="mt-8 w-full !bg-blue" onClick={goNext}>
              다음
            </Button>
          ) : (
            <Button className="mt-8 w-full !bg-blue" onClick={() => navigate('/wizard/result')}>
              분석 결과 보기
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}

function WizardHeader({ step, onBack, onClose }: { step: WizardStep; onBack: () => void; onClose: () => void }) {
  return (
    <header className="flex h-14 items-center justify-between px-6">
      <button
        type="button"
        aria-label="이전 단계"
        onClick={onBack}
        className={`text-xl leading-none text-text ${step === 1 ? 'invisible' : ''}`}
      >
        ←
      </button>
      <p className="text-headline font-bold text-text">외식업 창업 계산기</p>
      <button type="button" aria-label="닫기" onClick={onClose} className="text-2xl font-light leading-none text-sub">
        ×
      </button>
    </header>
  );
}

function StepTitle({ accent, children, description }: { accent: string; children: string; description?: string }) {
  return (
    <>
      <h1 className="whitespace-pre-line text-[28px] font-bold leading-[1.35] tracking-[-0.04em] text-text">
        <span className="text-blue">{accent}</span>{children}
      </h1>
      {description && <p className="mt-5 whitespace-pre-line text-body leading-5 text-sub">{description}</p>}
    </>
  );
}

function RegionStep({ query, region, onQueryChange, onRegionChange }: {
  query: string;
  region: string;
  onQueryChange: (value: string) => void;
  onRegionChange: (value: string) => void;
}) {
  const regions = ['서울시 성동구', '경기 성남시', '경북 상주시', '충남 논산시', '대구시 수성구'];

  return (
    <>
      <StepTitle accent={'어느 지역구에서\n'}>창업하시는지 알려주세요.</StepTitle>
      <label className="mt-7 flex h-14 items-center gap-3 rounded-xl border border-border px-4 text-sub focus-within:border-blue">
        <span aria-hidden="true">⌕</span>
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-body font-medium text-text outline-none"
          aria-label="창업 지역 검색"
        />
        <button type="button" aria-label="검색어 지우기" onClick={() => onQueryChange('')} className="text-xl leading-none">×</button>
      </label>
      <div className="mt-5">
        {regions.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onRegionChange(item)}
            className={`block w-full border-b border-border py-6 text-left text-headline font-medium ${region === item ? 'text-blue font-bold' : 'text-text'}`}
          >
            {item}
          </button>
        ))}
      </div>
      <p className="mt-4 text-body text-sub">또는 지금 위치 <button type="button" className="font-bold text-blue">인천시 미추홀구에서 시작</button></p>
    </>
  );
}

function CategoryStep({ category, selectedFactors, onCategoryChange, onToggleFactor }: {
  category: string;
  selectedFactors: string[];
  onCategoryChange: (value: string) => void;
  onToggleFactor: (value: string) => void;
}) {
  return (
    <>
      <StepTitle accent={'어떤 업종으로\n'} description="서울시 상권분석서비스 외식업 10종 기준">창업하시는지 알려주세요.</StepTitle>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {categories.map((item) => <SelectionCard key={item} label={item} selected={category === item} onClick={() => onCategoryChange(item)} />)}
      </div>
      <div className="mt-5 rounded-xl bg-surface p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-headline font-bold text-navy">점수에 반영할 조건</h2>
          <span className="text-caption text-sub">선택 사항</span>
        </div>
        <p className="mt-2 text-caption leading-4 text-sub">AI 창업 점수는 아래 지표들로 계산됩니다. 중요한 항목을 고르면 가중치가 조정됩니다.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {scoreFactors.map((factor) => (
            <button key={factor} type="button" onClick={() => onToggleFactor(factor)}>
              <Chip variant={selectedFactors.includes(factor) ? 'active' : 'default'}>
                {selectedFactors.includes(factor) ? '✓ ' : '+ '}{factor}
              </Chip>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function StoreSizeStep({ value, onChange }: { value: StoreSize; onChange: (value: StoreSize) => void }) {
  return (
    <>
      <StepTitle accent={'어떤 크기의 매장을\n'} description={'앞서 선택하신 한식음식점 매장들의\n유형별 평균 크기입니다.'}>생각하시는지 알려주세요.</StepTitle>
      <div className="mt-8 grid grid-cols-3 gap-3">
        {(Object.keys(storeSizes) as StoreSize[]).map((key) => {
          const item = storeSizes[key];
          return <SelectionCard key={key} label={item.label} detail={item.detail} selected={value === key} onClick={() => onChange(key)} />;
        })}
      </div>
    </>
  );
}

function FloorStep({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const floors = [{ value: -1, label: '지하 1층' }, { value: 1, label: '1층' }, { value: 2, label: '2층' }];
  return (
    <>
      <StepTitle accent={'매장이 어떤 층에 있는 걸\n'}>생각하시는지 알려주세요.</StepTitle>
      <div className="mt-8 grid grid-cols-3 gap-3">
        {floors.map((item) => <SelectionCard key={item.value} label={item.label} selected={value === item.value} onClick={() => onChange(item.value)} />)}
      </div>
    </>
  );
}

function StaffStep({ range, works15Hours, onRangeChange, onWorks15HoursChange }: {
  range: StaffRange;
  works15Hours: boolean;
  onRangeChange: (value: StaffRange) => void;
  onWorks15HoursChange: (value: boolean) => void;
}) {
  return (
    <>
      <StepTitle accent={'직원을 몇 명 고용하실\n'}>예정인지 알려주세요.</StepTitle>
      <p className="mt-4 inline-block rounded bg-blue/10 px-2 py-1 text-caption font-bold text-blue">Surbi 추가 단계 · 법적 의무 판정용</p>
      <div className="mt-6 grid gap-3">
        {(Object.keys(staffOptions) as StaffRange[]).map((key) => {
          const item = staffOptions[key];
          return <SelectionCard key={key} label={item.label} detail={item.detail} selected={range === key} onClick={() => onRangeChange(key)} wide />;
        })}
      </div>
      <label className="mt-6 flex items-center justify-between rounded-xl bg-surface px-4 py-5 text-headline font-bold text-text">
        주 15시간(월 60시간) 이상 근무
        <input type="checkbox" checked={works15Hours} onChange={(event) => onWorks15HoursChange(event.target.checked)} className="h-5 w-10 accent-blue" />
      </label>
      <p className="mt-3 text-caption text-sub">국민연금 · 건강보험 가입 의무 판정에 사용됩니다</p>
    </>
  );
}

function ReviewStep({ region, category, storeSize, floor, staffRange, works15Hours }: {
  region: string;
  category: string;
  storeSize: { label: string; detail: string };
  floor: number;
  staffRange: { label: string };
  works15Hours: boolean;
}) {
  const rows = [
    ['지역', region],
    ['업종', category],
    ['매장 크기', `${storeSize.label} ${storeSize.detail.replace('\n', ' ')}`],
    ['층수', floor === -1 ? '지하 1층' : `${floor}층`],
    ['직원 수', `${staffRange.label}${works15Hours ? ' (주 15시간 이상)' : ''}`],
  ];

  return (
    <>
      <StepTitle accent={'입력한 조건을\n'}>확인해 주세요.</StepTitle>
      <dl className="mt-8 overflow-hidden rounded-2xl border border-border">
        {rows.map(([label, value], index) => (
          <div key={label} className={`grid grid-cols-[116px_1fr] px-5 py-6 ${index % 2 === 0 ? 'bg-surface' : 'bg-white'}`}>
            <dt className="text-headline text-sub">{label}</dt>
            <dd className="text-headline font-bold text-text">{value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

function SelectionCard({ label, detail, selected, onClick, wide = false }: {
  label: string;
  detail?: string;
  selected: boolean;
  onClick: () => void;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-24 flex-col items-center justify-center rounded-xl border p-3 text-center transition-colors ${
        selected ? 'border-2 border-blue bg-blue/10 text-blue' : 'border-border bg-white text-text hover:border-blue/50'
      } ${wide ? 'min-h-[110px]' : ''}`}
    >
      <span className={`mb-2 h-5 w-5 rounded-md ${selected ? 'bg-blue' : 'bg-[#dfe4eb]'}`} />
      <span className="text-headline font-bold">{label}</span>
      {detail && <span className="mt-1 whitespace-pre-line text-body font-medium text-sub">{detail}</span>}
    </button>
  );
}

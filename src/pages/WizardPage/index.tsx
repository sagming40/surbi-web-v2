import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CategoryItem, DistrictGeo } from '@/shared/types';
import { Button } from '@/shared/ui/Button';
import { RegionStep } from './RegionStep';
import { CategoryStep } from './CategoryStep';
import { StoreSizeStep } from './StoreSizeStep';
import { FloorStep } from './FloorStep';
import { StaffStep } from './StaffStep';
import { ReviewStep } from './ReviewStep';
import { createWizardResult } from './wizard.api';
import { createWizardResultRequest, getDistrictDisplayName } from './wizard.presenter';
import type { WizardFloorOption, WizardStaffOption, WizardStoreSizeOption } from './wizard.types';

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;
// 진행률 계산과 다음/이전 이동의 상한값에 함께 쓰는 위저드 전체 단계 수다.
const stepCount = 6;

export default function WizardPage() {
  const navigate = useNavigate();

  // 모든 단계가 공유해야 하는 입력값은 이 부모 컴포넌트에서 한 번만 관리한다.
  const [step, setStep] = useState<WizardStep>(1);
  const [regionQuery, setRegionQuery] = useState('성동');
  // 문자열 대신 API 원본 객체를 보관해 이후 guCode가 필요한 요청에도 재사용할 수 있다.
  const [region, setRegion] = useState<DistrictGeo | null>(null);
  // API 원본 객체를 저장해 결과 생성 요청에 categoryCode를 그대로 보낼 수 있다.
  const [category, setCategory] = useState<CategoryItem | null>(null);
  const [selectedFactors, setSelectedFactors] = useState(['유동인구', '경쟁업체수']);
  // 면적·평수·코드를 함께 가진 API 응답 객체를 보관한다.
  const [storeSize, setStoreSize] = useState<WizardStoreSizeOption | null>(null);
  // 4·5단계도 API의 원본 선택 객체를 보관해 결과 요청에 code를 그대로 전달할 수 있다.
  const [floor, setFloor] = useState<WizardFloorOption | null>(null);
  const [staffRange, setStaffRange] = useState<WizardStaffOption | null>(null);
  const [works15Hours, setWorks15Hours] = useState(true);
  // 마지막 버튼을 연속으로 눌러 같은 분석 요청이 여러 번 생기는 일을 막는다.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // 단계 값이 1~6 범위를 벗어나지 않도록 제한한다.
  const goNext = () => setStep((current) => Math.min(current + 1, stepCount) as WizardStep);
  const goBack = () => setStep((current) => Math.max(current - 1, 1) as WizardStep);

  // 같은 조건을 다시 누르면 해제하고, 없으면 추가한다.
  function toggleFactor(factor: string) {
    setSelectedFactors((current) => (
      current.includes(factor)
        ? current.filter((item) => item !== factor)
        : [...current, factor]
    ));
  }

  /** 확인 화면의 선택값을 API 요청으로 바꾼 뒤, 성공한 결과를 다음 화면에 전달한다. */
  async function handleResultSubmit() {
    if (!region || !category || !storeSize || !floor || !staffRange || isSubmitting) {
      setSubmitError('입력 조건을 모두 선택한 뒤 다시 시도해 주세요.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const request = createWizardResultRequest(region, category.categoryCode, storeSize, floor, staffRange, works15Hours);
      const result = await createWizardResult(request);
      // WizardResultPage가 API 응답을 연결할 때 사용할 수 있도록 결과를 라우트 상태에 보관한다.
      navigate('/wizard/result', { state: { wizardResult: result } });
    } catch {
      setSubmitError('분석 결과를 만들지 못했습니다. 잠시 후 다시 시도해 주세요.');
      setIsSubmitting(false);
    }
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
            {/* 각 단계 UI는 부모 상태와 필요한 변경 함수만 전달받는다. */}
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
            {step === 3 && <StoreSizeStep category={category} value={storeSize} onChange={setStoreSize} />}
            {step === 4 && <FloorStep category={category} value={floor} onChange={setFloor} />}
            {step === 5 && (
              <StaffStep
                category={category}
                value={staffRange}
                works15Hours={works15Hours}
                onChange={setStaffRange}
                onWorks15HoursChange={setWorks15Hours}
              />
            )}
            {step === 6 && (
              <ReviewStep
                region={region ? getDistrictDisplayName(region) : '지역 선택 전'}
                category={category?.categoryName ?? '업종 선택 전'}
                storeSize={storeSize ? { label: storeSize.label, detail: `${storeSize.areaM2}㎡ (${storeSize.pyeong}평)` } : { label: '매장 크기 선택 전', detail: '' }}
                floor={floor?.label ?? '층수 선택 전'}
                staffRange={staffRange ?? { label: '직원 수 선택 전' }}
                works15Hours={works15Hours}
              />
            )}
          </div>

          {/* 마지막 단계 전에는 다음, 마지막 단계에서는 결과 페이지로 이동한다. */}
          {step < stepCount ? (
            <Button className="mt-8 w-full !bg-blue" onClick={goNext}>
              다음
            </Button>
          ) : (
            <Button className="mt-8 w-full !bg-blue" onClick={handleResultSubmit} disabled={isSubmitting}>
              {isSubmitting ? '분석 결과를 만드는 중...' : '분석 결과 보기'}
            </Button>
          )}
          {submitError && <p role="alert" className="mt-3 text-center text-caption text-red">{submitError}</p>}
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

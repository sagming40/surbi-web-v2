import { useState } from 'react';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import type { CategoryItem, DistrictGeo } from '@/shared/types';
import { useStartupAnalysis } from '@/shared/api/useStartupAnalysis';
import { Button } from '@/shared/ui/Button';
import { RegionStep } from './RegionStep';
import { CategoryStep } from './CategoryStep';
import { StoreSizeStep } from './StoreSizeStep';
import { FloorStep } from './FloorStep';
import { StaffStep } from './StaffStep';
import { ReviewStep } from './ReviewStep';
import { createStartupAnalysisRequest, getDistrictDisplayName } from './wizard.presenter';
import { saveWizardResultNavigationState } from './wizard.navigation';
import type { WizardFloorOption, WizardResultNavigationState, WizardStaffOption, WizardStoreSizeOption } from './wizard.types';

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;
// 진행률 계산과 다음/이전 이동의 상한값에 함께 쓰는 위저드 전체 단계 수다.
const stepCount = 6;

export default function WizardPage() {
  const navigate = useNavigate();
  const { mutateAsync: createStartupAnalysis, isPending: isSubmitting } = useStartupAnalysis();

  // 모든 단계가 공유해야 하는 입력값은 이 부모 컴포넌트에서 한 번만 관리한다.
  const [step, setStep] = useState<WizardStep>(1);
  const [regionQuery, setRegionQuery] = useState('');
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

    setSubmitError('');
    try {
      const request = createStartupAnalysisRequest(region, category.categoryCode, storeSize, floor, staffRange, works15Hours);
      const result = await createStartupAnalysis(request);
      // 05·07 화면은 같은 분석을 다시 요청하지 않고 이 스냅샷을 재사용한다.
      const navigationState: WizardResultNavigationState = {
        selection: {
          area: {
            code: region.guCode,
            name: getDistrictDisplayName(region),
          },
          industry: {
            code: category.categoryCode,
            name: category.categoryName,
          },
          storeSize,
          floor,
          staff: staffRange,
          works15Hours,
          preferredFactors: selectedFactors,
        },
        request,
        result,
      };
      saveWizardResultNavigationState(navigationState);
      navigate('/wizard/result', { state: navigationState });
    } catch (error) {
      setSubmitError(getAnalysisErrorMessage(error));
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

/** 서버 상태에 따라 사용자가 다음 조치를 알 수 있는 오류 문구를 만든다. */
function getAnalysisErrorMessage(error: unknown) {
  if (isAxiosError(error)) {
    if (error.response?.status === 404) {
      return '선택한 지역 또는 업종의 분석 데이터가 없습니다. 서울 자치구와 제공 업종을 선택해 주세요.';
    }

    if (!error.response) {
      return '분석 서버에 연결하지 못했습니다. 백엔드가 8000번 포트에서 실행 중인지 확인해 주세요.';
    }
  }

  return '분석 결과를 만들지 못했습니다. 잠시 후 다시 시도해 주세요.';
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

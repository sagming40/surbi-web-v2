import { useEffect, useRef, useState } from 'react';

import type { CategoryItem } from '@/shared/types';
import { DataStatusNotice } from '@/shared/ui/DataStatusNotice';

import { getStoreSizes } from './wizard.api';
import { wizardStoreSizeStyles } from './wizard.styles';
import type { WizardStoreSizeOption } from './wizard.types';

interface StoreSizeStepProps {
  category: CategoryItem | null;
  value: WizardStoreSizeOption | null;
  onChange: (value: WizardStoreSizeOption) => void;
}

export function StoreSizeStep({ category, value, onChange }: StoreSizeStepProps) {
  // API로 받은 카드 데이터와 로딩 상태는 이 단계 안에서만 관리한다.
  const [sizes, setSizes] = useState<WizardStoreSizeOption[]>([]);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const selectedSizeRef = useRef(value);

  useEffect(() => { selectedSizeRef.current = value; }, [value]);

  useEffect(() => {
    let cancelled = false;
    // 업종을 고르지 않고 빠르게 다음을 누른 경우에도 Figma 기본 업종으로 안전하게 조회한다.
    const categoryCode = category?.categoryCode ?? 'CS100004';

    getStoreSizes(categoryCode).then((response) => {
      if (cancelled) return;
      setSizes(response.sizes);
      setDescription(response.description);
      setIsLoading(false);

      // 사용자가 이미 크기를 골랐다면 유지하고, 처음일 때만 API 기본값을 적용한다.
      const defaultSize = response.sizes.find((size) => size.code === response.defaultSizeCode);
      if (!selectedSizeRef.current && defaultSize) onChange(defaultSize);
    });
    return () => { cancelled = true; };
  }, [category?.categoryCode, onChange]);

  return <>
    <StepTitle accent={'어떤 크기의 매장을\n'}>생각하시는지 알려주세요.</StepTitle>
    <p className="mt-5 whitespace-pre-line text-body leading-5 text-sub">{description || '매장 크기 정보를 불러오는 중입니다.'}</p>
    <div className="mt-10 grid grid-cols-3 gap-3" aria-live="polite">
      {isLoading && <p className="col-span-3 py-10 text-center text-body text-sub">매장 크기 정보를 불러오는 중입니다.</p>}
      {sizes.map((size) => {
        const selected = value?.code === size.code;
        return <button key={size.code} type="button" onClick={() => onChange(size)} className={`${wizardStoreSizeStyles.card} ${selected ? wizardStoreSizeStyles.cardSelected : wizardStoreSizeStyles.cardDefault}`}>
          <span aria-hidden="true" className={`${wizardStoreSizeStyles.icon} ${selected ? 'bg-blue' : 'bg-[#dfe4eb]'}`} />
          <span className="text-headline font-bold">{size.label}</span>
          <span className="mt-2 text-body leading-5 text-sub">{size.areaM2}㎡<br />({size.pyeong}평)</span>
        </button>;
      })}
    </div>
    <DataStatusNotice status="temporary" className="mt-4">매장 크기 선택지는 임시 데이터입니다. 선택값은 분석 요청에 전달되지만 현재 서버 계산에는 반영되지 않습니다.</DataStatusNotice>
  </>;
}

function StepTitle({ accent, children }: { accent: string; children: string }) {
  return <h1 className="whitespace-pre-line text-[28px] font-bold leading-[1.35] tracking-[-0.04em] text-text"><span className="text-blue">{accent}</span>{children}</h1>;
}

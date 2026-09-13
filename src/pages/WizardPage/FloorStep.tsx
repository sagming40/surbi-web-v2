import { useEffect, useRef, useState } from 'react';

import type { CategoryItem } from '@/shared/types';

import { getStoreFloors } from './wizard.api';
import { wizardFloorStyles } from './wizard.styles';
import type { WizardFloorOption } from './wizard.types';

interface FloorStepProps {
  category: CategoryItem | null;
  value: WizardFloorOption | null;
  onChange: (value: WizardFloorOption) => void;
}

export function FloorStep({ category, value, onChange }: FloorStepProps) {
  // 선택지 목록은 API 응답으로, 선택한 항목은 부모 위저드 상태로 분리한다.
  const [floors, setFloors] = useState<WizardFloorOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const selectedFloorRef = useRef(value);

  // 응답이 늦게 도착해도 사용자가 먼저 고른 값을 기본값으로 덮어쓰지 않게 한다.
  useEffect(() => { selectedFloorRef.current = value; }, [value]);

  useEffect(() => {
    let cancelled = false;
    // 업종을 아직 고르지 않았을 때도 Figma 기본 업종을 사용해 화면을 유지한다.
    const categoryCode = category?.categoryCode ?? 'CS100004';
    getStoreFloors(categoryCode).then((response) => {
      if (cancelled) return;
      setFloors(response.floors);
      setIsLoading(false);
      const defaultFloor = response.floors.find((floor) => floor.code === response.defaultFloorCode);
      // 첫 진입에서만 서버가 준 기본 층수를 선택한다.
      if (!selectedFloorRef.current && defaultFloor) onChange(defaultFloor);
    });
    return () => { cancelled = true; };
  }, [category?.categoryCode, onChange]);

  return <>
    <StepTitle accent={'매장이 어떤 층에 있는 걸\n'}>생각하시는지 알려주세요.</StepTitle>
    <div className="mt-8 grid grid-cols-3 gap-3" aria-live="polite">
      {isLoading && <p className="col-span-3 py-10 text-center text-body text-sub">층수 선택지를 불러오는 중입니다.</p>}
      {floors.map((floor) => {
        const selected = value?.code === floor.code;
        return <button key={floor.code} type="button" onClick={() => onChange(floor)} className={`${wizardFloorStyles.card} ${selected ? wizardFloorStyles.cardSelected : wizardFloorStyles.cardDefault}`}><span aria-hidden="true" className={`${wizardFloorStyles.icon} ${selected ? 'bg-blue' : 'bg-[#dfe4eb]'}`} /><span className="text-headline font-bold">{floor.label}</span></button>;
      })}
    </div>
  </>;
}

function StepTitle({ accent, children }: { accent: string; children: string }) {
  return <h1 className="whitespace-pre-line text-[28px] font-bold leading-[1.35] tracking-[-0.04em] text-text"><span className="text-blue">{accent}</span>{children}</h1>;
}

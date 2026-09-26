import { useEffect, useRef, useState } from 'react';

import type { CategoryItem } from '@/shared/types';

import { getStaffingOptions } from './wizard.api';
import { wizardStaffStyles } from './wizard.styles';
import type { WizardStaffOption } from './wizard.types';

interface StaffStepProps {
  category: CategoryItem | null;
  value: WizardStaffOption | null;
  works15Hours: boolean;
  onChange: (value: WizardStaffOption) => void;
  onWorks15HoursChange: (value: boolean) => void;
}

export function StaffStep({ category, value, works15Hours, onChange, onWorks15HoursChange }: StaffStepProps) {
  // 직원 수 목록·법정 근무시간 기준은 API 응답으로 관리한다.
  const [staffOptions, setStaffOptions] = useState<WizardStaffOption[]>([]);
  const [minimumMonthlyHours, setMinimumMonthlyHours] = useState(60);
  const [isLoading, setIsLoading] = useState(true);
  const selectedStaffRef = useRef(value);

  // 비동기 응답이 기존 선택값을 덮어쓰지 않도록 최신 선택값을 보관한다.
  useEffect(() => { selectedStaffRef.current = value; }, [value]);

  useEffect(() => {
    let cancelled = false;
    // 빠르게 단계를 넘긴 경우에도 기본 업종으로 안전하게 조회한다.
    const categoryCode = category?.categoryCode ?? 'CS100004';
    getStaffingOptions(categoryCode).then((response) => {
      if (cancelled) return;
      setStaffOptions(response.staffOptions);
      setMinimumMonthlyHours(response.minimumMonthlyHours);
      setIsLoading(false);
      const defaultStaff = response.staffOptions.find((staff) => staff.code === response.defaultStaffCode);
      // 처음 열린 경우에만 API의 기본 선택값을 적용한다.
      if (!selectedStaffRef.current && defaultStaff) onChange(defaultStaff);
    });
    return () => { cancelled = true; };
  }, [category?.categoryCode, onChange]);

  return <>
    <StepTitle accent={'직원을 몇 명 고용하실\n'}>예정인지 알려주세요.</StepTitle>
    <p className={wizardStaffStyles.legalBadge}>Surbi 추가 단계 · 법적 의무 판정용</p>
    <div className="mt-5 grid gap-3" aria-live="polite">
      {isLoading && <p className="py-10 text-center text-body text-sub">직원 수 선택지를 불러오는 중입니다.</p>}
      {staffOptions.map((staff) => {
        const selected = value?.code === staff.code;
        return <button key={staff.code} type="button" onClick={() => onChange(staff)} className={`${wizardStaffStyles.card} ${selected ? wizardStaffStyles.cardSelected : wizardStaffStyles.cardDefault}`}><span aria-hidden="true" className={`${wizardStaffStyles.icon} ${selected ? 'bg-blue' : 'bg-[#dfe4eb]'}`} /><span className="text-headline font-bold">{staff.label}</span>{staff.description && <span className="mt-2 text-body text-sub">{staff.description}</span>}</button>;
      })}
    </div>
    <label className={wizardStaffStyles.hoursSwitch}>주 15시간(월 {minimumMonthlyHours}시간) 이상 근무<button type="button" role="switch" aria-checked={works15Hours} onClick={() => onWorks15HoursChange(!works15Hours)} className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${works15Hours ? 'bg-blue' : 'bg-[#dfe4eb]'}`}><span className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${works15Hours ? 'translate-x-5' : 'translate-x-0'}`} /></button></label>
    <p className="mt-4 text-caption text-sub">국민연금 · 건강보험 가입 의무 판정에 사용됩니다</p>
  </>;
}

function StepTitle({ accent, children }: { accent: string; children: string }) {
  return <h1 className="whitespace-pre-line text-[28px] font-bold leading-[1.35] tracking-[-0.04em] text-text"><span className="text-blue">{accent}</span>{children}</h1>;
}

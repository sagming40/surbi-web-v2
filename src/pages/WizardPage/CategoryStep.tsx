import { useEffect, useMemo } from 'react';
import { useBootstrap } from '@/shared/api/useBootstrap';

import type { CategoryItem } from '@/shared/types';
import { Chip } from '@/shared/ui/Chip';
import { DataStatusNotice } from '@/shared/ui/DataStatusNotice';

import { wizardCategoryStyles } from './wizard.styles';

const scoreFactors = ['유동인구', '직장인구', '주거인구', '경쟁업체수', '임대료'];

interface CategoryStepProps {
  category: CategoryItem | null;
  selectedFactors: string[];
  onCategoryChange: (value: CategoryItem) => void;
  onToggleFactor: (value: string) => void;
}

export function CategoryStep({ category, selectedFactors, onCategoryChange, onToggleFactor }: CategoryStepProps) {
  // Bootstrap은 앱 전체에서 한 번만 요청되고 React Query 캐시를 모든 화면이 공유한다.
  const { data: bootstrap, isLoading, isError } = useBootstrap();

  const categories = useMemo(
    () => bootstrap?.categoryGroups
      .find((group) => group.groupCode === 'CS1')
      ?.items ?? [],
    [bootstrap],
  );

  useEffect(() => {
    const defaultCategory =
      categories.find((item) => item.categoryCode === 'CS100004')
      ?? categories[0];

    if (!category && defaultCategory) {
      onCategoryChange(defaultCategory);
    }
  }, [categories, category, onCategoryChange]);

  const selectedCategoryCode = category?.categoryCode;
  const hasCategories = useMemo(() => categories.length > 0, [categories.length]);

  return <>
    <StepTitle accent={'어떤 업종으로\n'}>창업하시는지 알려주세요.</StepTitle>
    <p className="mt-5 text-body leading-5 text-sub">서울시 상권분석서비스 외식업 10종 기준</p>
    <div className="mt-8 grid grid-cols-2 gap-3" aria-live="polite">
      {isLoading && <p className="col-span-2 py-10 text-center text-body text-sub">업종 목록을 불러오는 중입니다.</p>}
      {isError && <p className="col-span-2 py-10 text-center text-body text-sub">업종 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>}
      {!isLoading && !isError && !hasCategories && <p className="col-span-2 py-10 text-center text-body text-sub">표시할 업종이 없습니다.</p>}
      {categories.map((item) => {
        const selected = item.categoryCode === selectedCategoryCode;
        return <button key={item.categoryCode} type="button" onClick={() => onCategoryChange(item)} className={`${wizardCategoryStyles.card} ${selected ? wizardCategoryStyles.cardSelected : wizardCategoryStyles.cardDefault}`}>
          <span aria-hidden="true" className={`${wizardCategoryStyles.icon} ${selected ? 'bg-blue' : 'bg-[#dfe4eb]'}`} />
          <span className="text-headline font-bold">{item.categoryName}</span>
        </button>;
      })}
    </div>
    <section className={wizardCategoryStyles.factorPanel} aria-labelledby="score-factor-title">
      <div className="flex items-center justify-between"><h2 id="score-factor-title" className="text-headline font-bold text-navy">점수에 반영할 조건</h2><span className="text-caption text-sub">선택 사항</span></div>
      <p className="mt-3 text-caption leading-4 text-sub">창업 분석에서 중요하게 보고 싶은 항목을 선택해 주세요.</p>
      <div className="mt-4 flex flex-wrap gap-2">{scoreFactors.map((factor) => <button key={factor} type="button" onClick={() => onToggleFactor(factor)}><Chip variant={selectedFactors.includes(factor) ? 'active' : 'default'}>{selectedFactors.includes(factor) ? '✓ ' : '+ '}{factor}</Chip></button>)}</div>
      <DataStatusNotice status="unavailable" className="mt-4">선호 조건은 현재 분석 계산에 반영되지 않으며, 분석 근거 기능이 준비되면 연결됩니다.</DataStatusNotice>
    </section>
  </>;
}

function StepTitle({ accent, children }: { accent: string; children: string }) {
  return <h1 className="whitespace-pre-line text-[28px] font-bold leading-[1.35] tracking-[-0.04em] text-text"><span className="text-blue">{accent}</span>{children}</h1>;
}

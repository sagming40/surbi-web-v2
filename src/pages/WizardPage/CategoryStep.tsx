import { useEffect, useMemo, useRef, useState } from 'react';

import type { CategoryItem } from '@/shared/types';
import { Chip } from '@/shared/ui/Chip';

import { getCategories } from './wizard.api';
import { wizardCategoryStyles } from './wizard.styles';

const scoreFactors = ['유동인구', '직장인구', '주거인구', '경쟁업체수', '임대료'];

interface CategoryStepProps {
  category: CategoryItem | null;
  selectedFactors: string[];
  onCategoryChange: (value: CategoryItem) => void;
  onToggleFactor: (value: string) => void;
}

export function CategoryStep({ category, selectedFactors, onCategoryChange, onToggleFactor }: CategoryStepProps) {
  // 이 단계에서만 필요한 API 응답과 로딩 상태다. 선택값은 부모가 관리한다.
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const categoryRef = useRef(category);

  // 비동기 응답이 도착할 때 최신 선택값을 참조할 수 있게 effect에서 갱신한다.
  useEffect(() => { categoryRef.current = category; }, [category]);

  useEffect(() => {
    let cancelled = false;
    getCategories().then((response) => {
      if (cancelled) return;
      // 외식업 그룹만 현재 위저드 화면의 카드 목록으로 사용한다.
      const foodCategories = response.categories.find((group) => group.groupCode === 'CS1')?.items ?? [];
      setCategories(foodCategories);
      setIsLoading(false);
      // 최초 진입 시 Figma 시안과 같은 양식음식점을 기본 선택한다.
      const defaultCategory = foodCategories.find((item) => item.categoryCode === 'CS100004') ?? foodCategories[0];
      if (!categoryRef.current && defaultCategory) onCategoryChange(defaultCategory);
    });
    return () => { cancelled = true; };
  // ref로 최신 선택값을 읽어 기본값 설정 뒤의 중복 조회를 막는다.
  // 이 단계로 다시 돌아오면 컴포넌트가 새로 생성되고, 현재 선택값을 기준으로 기본값을 건너뛴다.
  }, [onCategoryChange]);

  const selectedCategoryCode = category?.categoryCode;
  const hasCategories = useMemo(() => categories.length > 0, [categories.length]);

  return <>
    <StepTitle accent={'어떤 업종으로\n'}>창업하시는지 알려주세요.</StepTitle>
    <p className="mt-5 text-body leading-5 text-sub">서울시 상권분석서비스 외식업 10종 기준</p>
    <div className="mt-8 grid grid-cols-2 gap-3" aria-live="polite">
      {isLoading && <p className="col-span-2 py-10 text-center text-body text-sub">업종 목록을 불러오는 중입니다.</p>}
      {!isLoading && !hasCategories && <p className="col-span-2 py-10 text-center text-body text-sub">표시할 업종이 없습니다.</p>}
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
      <p className="mt-3 text-caption leading-4 text-sub">AI 창업 점수는 아래 지표들로 계산됩니다. 중요한 항목을 고르면 가중치가 조정됩니다.</p>
      <div className="mt-4 flex flex-wrap gap-2">{scoreFactors.map((factor) => <button key={factor} type="button" onClick={() => onToggleFactor(factor)}><Chip variant={selectedFactors.includes(factor) ? 'active' : 'default'}>{selectedFactors.includes(factor) ? '✓ ' : '+ '}{factor}</Chip></button>)}</div>
    </section>
  </>;
}

function StepTitle({ accent, children }: { accent: string; children: string }) {
  return <h1 className="whitespace-pre-line text-[28px] font-bold leading-[1.35] tracking-[-0.04em] text-text"><span className="text-blue">{accent}</span>{children}</h1>;
}

import type { CategoryCode } from '@/shared/types/common';
import { SurbiCard } from '@/shared/ui/SurbiCard';
import { FOOD_CATEGORIES } from '../mock/categories';

interface CategoryFilterProps {
  /** null 이면 전체 업종 */
  value: CategoryCode | null;
  onChange: (code: CategoryCode | null) => void;
  onClose: () => void;
}

/** 업종 선택 패널. SeoulMapRequest 의 categoryCode 가 하나뿐이라 단일 선택 */
export function CategoryFilter({ value, onChange, onClose }: CategoryFilterProps) {
  return (
    <SurbiCard elevated className="pointer-events-auto w-[168px] py-2">
      <div className="flex items-center justify-between px-4 pt-1 pb-2">
        <span className="text-label text-sub">업종</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="text-caption text-sub hover:text-text"
        >
          ✕
        </button>
      </div>

      <button
        type="button"
        onClick={() => onChange(null)}
        className={`w-full px-4 py-2 text-left text-caption ${
          value === null ? 'bg-blue/10 font-bold text-blue' : 'text-text hover:bg-surface'
        }`}
      >
        전체 업종
      </button>

      <div className="my-1 h-px bg-border" />

      {FOOD_CATEGORIES.map((c) => (
        <button
          key={c.code}
          type="button"
          onClick={() => onChange(c.code)}
          className={`w-full px-4 py-2 text-left text-caption ${
            value === c.code ? 'bg-blue/10 font-bold text-blue' : 'text-text hover:bg-surface'
          }`}
        >
          {c.name}
        </button>
      ))}
    </SurbiCard>
  );
}

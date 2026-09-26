import { SurbiCard } from '@/shared/ui/SurbiCard';
import { TRDAR_TYPES } from '../mock/categories';

interface TrdarFilterProps {
  /** 지도에 표시할 상권 구분 코드들 */
  value: string[];
  onChange: (codes: string[]) => void;
  onClose: () => void;
}

/** 상권영역 표시 설정. 레이어 스위치라 업종과 달리 다중 선택 */
export function TrdarFilter({ value, onChange, onClose }: TrdarFilterProps) {
  const toggle = (code: string) =>
    onChange(value.includes(code) ? value.filter((c) => c !== code) : [...value, code]);

  return (
    <SurbiCard elevated className="pointer-events-auto w-[168px] py-2">
      <div className="flex items-center justify-between px-4 pt-1 pb-2">
        <span className="text-label text-sub">상권 구분</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="text-caption text-sub hover:text-text"
        >
          ✕
        </button>
      </div>

      {TRDAR_TYPES.map((t) => {
        const on = value.includes(t.code);
        return (
          <button
            key={t.code}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(t.code)}
            className={`flex w-full items-center gap-2 px-4 py-2 text-left text-caption ${
              on ? 'font-bold text-blue' : 'text-sub hover:bg-surface'
            }`}
          >
            <span
              className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded border text-[9px] ${
                on ? 'border-blue bg-blue text-white' : 'border-border'
              }`}
            >
              {on ? '✓' : ''}
            </span>
            {t.name}
          </button>
        );
      })}
    </SurbiCard>
  );
}

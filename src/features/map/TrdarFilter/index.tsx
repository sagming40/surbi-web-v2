import { SurbiCard } from '@/shared/ui/SurbiCard';

interface TrdarFilterProps {
  /** 지도에 표시할 상권 구분 코드들 */
  value: string[];
  onChange: (codes: string[]) => void;
  onClose: () => void;
  types: string[];
  needsGu: boolean;
}

/** 상권영역 표시 설정. 레이어 스위치라 업종과 달리 다중 선택 */
export function TrdarFilter({ value, onChange, onClose, types, needsGu }: TrdarFilterProps) {
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
      {needsGu && <p className="px-4 pb-1 text-caption text-sub">자치구를 먼저 선택해주세요</p>}

      {types.map((type) => {
        const on = value.includes(type);
        return (
          <button
            key={type}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(type)}
            className={`flex w-full items-center gap-2 px-4 py-2 text-left text-caption ${on ? 'font-bold text-blue' : 'text-sub hover:bg-surface'
              }`}
          >
            <span
              className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded border text-[9px] ${on ? 'border-blue bg-blue text-white' : 'border-border'
                }`}
            >
              {on ? '✓' : ''}
            </span>
            {type}
          </button>
        );
      })}
    </SurbiCard>
  );
}

import { useEffect, useRef, useState } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownSelectProps {
  /** 아무것도 안 골랐을 때 버튼에 보이는 이름 (예: "자치구") */
  label: string;
  options: DropdownOption[];
  /** null 이면 미선택 */
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
  /** 해제 항목의 라벨 (예: "전체"). 없으면 해제 항목을 안 그린다 */
  clearLabel?: string;
  emptyMessage?: string;
}

/** 소형 드롭다운. 선택 상태는 부모가 들고 있는다 (controlled) */
export function DropdownSelect({
  label,
  options,
  value,
  onChange,
  disabled = false,
  clearLabel,
  emptyMessage = '선택할 항목이 없습니다',
}: DropdownSelectProps) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭으로 닫기. click 이면 여는 클릭이 바깥 클릭으로도 잡혀서 mousedown 을 쓴다
  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open]);

  // 비활성으로 바뀌면 열려 있던 메뉴도 닫는다
  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  const selected = options.find((o) => o.value === value);

  function pick(next: string | null) {
    onChange(next);
    setOpen(false);
  }

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-[26px] items-center gap-1 rounded-lg border border-border px-2.5 text-caption ${
          disabled
            ? 'cursor-not-allowed text-sub opacity-50'
            : selected
              ? 'bg-white font-bold text-navy hover:bg-surface'
              : 'bg-white text-text hover:bg-surface'
        }`}
      >
        {selected?.label ?? label}
        <span className={`text-label text-sub transition-transform ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      {open && (
        <ul className="absolute right-0 top-full z-20 mt-1 max-h-60 w-32 overflow-y-auto rounded-lg border border-border bg-white py-1 shadow-lg">
          {clearLabel && (
            <li>
              <button
                type="button"
                onClick={() => pick(null)}
                className={`w-full px-3 py-1.5 text-left text-caption hover:bg-surface ${
                  value === null ? 'font-bold text-navy' : 'text-text'
                }`}
              >
                {clearLabel}
              </button>
            </li>
          )}

          {options.length === 0 && (
            <li className="px-3 py-1.5 text-caption text-sub">{emptyMessage}</li>
          )}

          {options.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                onClick={() => pick(o.value)}
                className={`w-full px-3 py-1.5 text-left text-caption hover:bg-surface ${
                  o.value === value ? 'font-bold text-navy' : 'text-text'
                }`}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

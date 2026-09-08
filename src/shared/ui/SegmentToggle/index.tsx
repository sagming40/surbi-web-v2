import { useState } from 'react';

interface SegmentToggleProps {
  options: string[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
}

export function SegmentToggle({ options, defaultIndex = 0, onChange }: SegmentToggleProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  function handleClick(index: number) {
    setActiveIndex(index);
    onChange?.(index);
  }

  return (
    <div className="inline-flex p-0.5 bg-surface rounded-lg">
      {options.map((label, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={label}
            type="button"
            onClick={() => handleClick(index)}
            className={`px-3 py-1.5 text-caption rounded-md transition-colors ${
              isActive ? 'bg-white text-navy font-bold shadow-sm' : 'text-sub font-medium'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

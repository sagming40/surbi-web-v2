import { useState } from 'react';
import type { ReactNode } from 'react';

interface Tab {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  /** 처음에 몇 번째 탭을 보여줄지, 기본 0(첫 번째) */
  defaultIndex?: number;
}

export function Tabs({ tabs, defaultIndex = 0 }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  return (
    <div>
      <div className="flex border-b border-border">
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`flex-1 py-2.5 text-caption font-medium border-b-2 -mb-px transition-colors ${
                isActive
                  ? 'border-navy text-navy font-bold'
                  : 'border-transparent text-sub'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="pt-3.5">{tabs[activeIndex].content}</div>
    </div>
  );
}

interface BarChartItem {
  label: string;
  value: number;
  /** 표시할 텍스트 (예: "38%", "124,000명"). 없으면 value 그대로 표시 */
  displayValue?: string;
}

interface BarChartProps {
  data: BarChartItem[];
  /** 막대 길이 계산 기준값. 없으면 data 중 최댓값 사용 */
  maxValue?: number;
}

export function BarChart({ data, maxValue }: BarChartProps) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value));

  return (
    <div className="flex flex-col gap-3">
      {data.map((item) => (
        <div key={item.label} className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-caption text-text font-medium">{item.label}</span>
            <span className="text-caption text-blue font-bold">
              {item.displayValue ?? item.value}
            </span>
          </div>
          <div className="h-1.5 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-blue rounded-full"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

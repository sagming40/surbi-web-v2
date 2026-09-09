import { PieChart, Pie, Cell } from 'recharts';

interface GaugeChartProps {
  /** 0~100 */
  score: number;
  size?: number;
}

export function GaugeChart({ score, size = 140 }: GaugeChartProps) {
  const data = [
    { value: score },
    { value: 100 - score },
  ];

  const color = score >= 80 ? 'var(--color-green)' : score >= 50 ? 'var(--color-blue)' : 'var(--color-red)';

  return (
    <div className="relative" style={{ width: size, height: size * 0.62 }}>
      <PieChart width={size} height={size}>
        <Pie
          data={data}
          startAngle={180}
          endAngle={0}
          innerRadius={size * 0.32}
          outerRadius={size * 0.42}
          dataKey="value"
          stroke="none"
        >
          <Cell fill={color} />
          <Cell fill="var(--color-border)" />
        </Pie>
      </PieChart>
      <div className="absolute inset-x-0 top-0 flex flex-col items-center pt-8">
        <span className="text-display font-bold text-navy leading-none">{score}</span>
        <span className="text-label text-sub mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

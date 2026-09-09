import { PieChart as RPieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

interface PieChartItem {
  label: string;
  value: number;
}

interface PieChartProps {
  data: PieChartItem[];
  size?: number;
  showLegend?: boolean;
}

const COLORS = ['var(--color-blue)', 'var(--color-green)', 'var(--color-navy)', 'var(--color-warn)'];

export function PieChart({ data, size = 140, showLegend = false }: PieChartProps) {
  const legendSpace = showLegend ? 28 : 0;

  return (
    <RPieChart width={size} height={size + legendSpace}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="label"
        cx="50%"
        cy={size / 2}
        innerRadius={0}
        outerRadius={size * 0.4}
        stroke="var(--color-white)"
        strokeWidth={2}
      >
        {data.map((_, index) => (
          <Cell key={index} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid var(--color-border)' }} />
      {showLegend && (
        <Legend
          verticalAlign="bottom"
          height={legendSpace}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11 }}
        />
      )}
    </RPieChart>
  );
}

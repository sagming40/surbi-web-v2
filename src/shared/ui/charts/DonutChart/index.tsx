import { PieChart, Pie, Cell, Legend, Label, Tooltip } from 'recharts';

interface DonutChartItem {
  label: string;
  value: number;
}

interface DonutChartProps {
  data: DonutChartItem[];
  size?: number;
  showLegend?: boolean;
  centerLabel?: string;
}

const COLORS = ['var(--color-blue)', 'var(--color-green)', 'var(--color-navy)', 'var(--color-warn)'];

export function DonutChart({ data, size = 140, showLegend = false, centerLabel }: DonutChartProps) {
  const legendSpace = showLegend ? 28 : 0;

  return (
    <PieChart width={size} height={size + legendSpace}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="label"
        cx="50%"
        cy={size / 2}
        innerRadius={size * 0.28}
        outerRadius={size * 0.4}
        stroke="var(--color-white)"
        strokeWidth={2}
      >
        {data.map((_, index) => (
          <Cell key={index} fill={COLORS[index % COLORS.length]} />
        ))}
        {centerLabel && (
          <Label
            value={centerLabel}
            position="center"
            style={{ fontSize: 13, fontWeight: 700, fill: 'var(--color-navy)' }}
          />
        )}
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
    </PieChart>
  );
}

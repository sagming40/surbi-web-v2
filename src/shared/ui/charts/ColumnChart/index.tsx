import { BarChart as RBarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';

interface ColumnChartItem {
  label: string;
  value: number;
  /** 이 막대를 강조할지 (예: 가장 높은 시간대) */
  highlighted?: boolean;
}

interface ColumnChartProps {
  data: ColumnChartItem[];
  height?: number;
}

export function ColumnChart({ data, height = 120 }: ColumnChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RBarChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 9, fill: 'var(--color-sub)' }}
        />
        <Bar dataKey="value" radius={[3, 3, 0, 0]}>
          {data.map((item, index) => (
            <Cell
              key={index}
              fill={item.highlighted ? 'var(--color-navy)' : 'var(--color-blue)'}
              fillOpacity={item.highlighted ? 1 : 0.35}
            />
          ))}
        </Bar>
      </RBarChart>
    </ResponsiveContainer>
  );
}

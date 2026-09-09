import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';

interface TrendChartItem {
  label: string;
  value: number;
}

interface TrendChartProps {
  data: TrendChartItem[];
  height?: number;
  /** true면 선 아래를 옅게 채운다 (면적 차트) */
  filled?: boolean;
}

export function TrendChart({ data, height = 140, filled = false }: TrendChartProps) {
  const Chart = filled ? AreaChart : LineChart;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <Chart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 9, fill: 'var(--color-sub)' }}
        />
        <YAxis hide />
        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid var(--color-border)' }} />
        {filled ? (
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--color-blue)"
            strokeWidth={2}
            fill="var(--color-blue)"
            fillOpacity={0.12}
          />
        ) : (
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-blue)"
            strokeWidth={2}
            dot={{ r: 3, fill: 'var(--color-blue)' }}
          />
        )}
      </Chart>
    </ResponsiveContainer>
  );
}

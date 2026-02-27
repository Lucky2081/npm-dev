'use client';

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart as RechartsRadarChart, ResponsiveContainer } from 'recharts';
import { Metrics } from '@/lib/types';

interface RadarChartProps {
  metrics: Metrics;
  size?: number;
  showLabels?: boolean;
}

const data = [
  { subject: 'Quality', fullMark: 100 },
  { subject: 'Efficiency', fullMark: 100 },
  { subject: 'Cost', fullMark: 100 },
  { subject: 'Trust', fullMark: 100 },
];

export function RadarChart({ metrics, size = 120, showLabels = false }: RadarChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    value: metrics[item.subject.toLowerCase() as keyof Metrics] || 0,
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width={size} height={size}>
      <RechartsRadarChart data={chartData}>
        <PolarGrid stroke="#E2E8F0" strokeWidth={1} />
        {showLabels && (
          <>
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#64748B', fontSize: 10 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#64748B', fontSize: 8 }}
              tickCount={3}
            />
          </>
        )}
        <Radar
          name="Metrics"
          dataKey="value"
          stroke="#155EEF"
          fill="#155EEF"
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}

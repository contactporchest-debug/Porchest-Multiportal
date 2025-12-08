"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";

interface SparklineProps {
  data: any[];
  dataKey: string;
  color?: string;
  height?: number;
}

export function Sparkline({ data, dataKey, color = "#10b981", height = 40 }: SparklineProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="w-full flex items-center justify-center text-xs text-muted-foreground"
        style={{ height }}
      >
        No data
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

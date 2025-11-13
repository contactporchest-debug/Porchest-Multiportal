"use client"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

type Slice = { name: string; value: number }
export function SentimentPie({ data }: { data: Slice[] }) {
  // Use design tokens for a 3-color palette
  const fills = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--muted))"]
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} innerRadius={40} paddingAngle={4}>
            {data.map((_, idx) => (
              <Cell key={idx} fill={fills[idx % fills.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

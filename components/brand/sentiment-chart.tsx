// Uses Recharts per guidelines
"use client"

import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

type Point = { t: number; engagement: number; positive: number }

export function SentimentChart() {
  const { data } = useSWR<Point[]>("/api/dummy/sentiment", fetcher)
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Sentiment & Engagement</CardTitle>
      </CardHeader>
      <CardContent style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
            <XAxis dataKey="t" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip />
            <Line type="monotone" dataKey="engagement" stroke="#ff7a00" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="positive" stroke="#FF6B6B" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

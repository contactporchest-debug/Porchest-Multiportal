import { NextResponse } from "next/server"

export async function GET() {
  const series = Array.from({ length: 10 }).map((_, i) => ({
    t: i,
    engagement: Math.round(50 + Math.sin(i / 2) * 20),
    positive: Math.round(60 + Math.cos(i / 3) * 15),
  }))
  return NextResponse.json(series)
}

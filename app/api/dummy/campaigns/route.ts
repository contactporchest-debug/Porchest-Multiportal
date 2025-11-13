import { NextResponse } from "next/server"

export async function GET() {
  const data = [
    { id: "camp_1", title: "Fall Launch", status: "Active", influencers: 3, budget: 4500 },
    { id: "camp_2", title: "Holiday Push", status: "Planned", influencers: 5, budget: 10000 },
  ]
  return NextResponse.json(data)
}

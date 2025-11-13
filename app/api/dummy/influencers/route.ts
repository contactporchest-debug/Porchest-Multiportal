import { NextResponse } from "next/server"

export async function GET() {
  const data = [
    { id: "inf_1", name: "Aisha Khan", niche: "Tech", platform: "YouTube", followers: 240000, estRoi: 2.4 },
    { id: "inf_2", name: "Rahul Mehra", niche: "Fitness", platform: "Instagram", followers: 180000, estRoi: 1.9 },
    { id: "inf_3", name: "Sara Malik", niche: "Beauty", platform: "TikTok", followers: 320000, estRoi: 2.8 },
  ]
  return NextResponse.json(data)
}

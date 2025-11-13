"use client"

import dynamic from "next/dynamic"
import { PortalLayout } from "@/components/portal-layout"
import { BrandSidebar } from "@/components/brand-sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { mockCampaigns, mockAnalytics } from "@/lib/mock-data"
import { TrendingUp, Users, Target, DollarSign } from "lucide-react"

// ✅ Safe dynamic imports for Recharts (client-only)
// ✅ Safe, TS-compliant dynamic imports for Recharts
const ResponsiveContainer = dynamic<any>(
  () => import("recharts").then((m) => m.ResponsiveContainer || m.default),
  { ssr: false }
)
const LineChart = dynamic<any>(
  () => import("recharts").then((m) => m.LineChart || m.default),
  { ssr: false }
)
const CartesianGrid = dynamic<any>(
  () => import("recharts").then((m) => m.CartesianGrid || m.default),
  { ssr: false }
)
const XAxis = dynamic<any>(
  () => import("recharts").then((m) => m.XAxis || m.default),
  { ssr: false }
)
const YAxis = dynamic<any>(
  () => import("recharts").then((m) => m.YAxis || m.default),
  { ssr: false }
)
const Tooltip = dynamic<any>(
  () => import("recharts").then((m) => m.Tooltip || m.default),
  { ssr: false }
)
const Line = dynamic<any>(
  () => import("recharts").then((m) => m.Line || m.default),
  { ssr: false }
)


// 📊 Demo analytics chart data
const chartData = [
  { name: "Jan", reach: 120000, engagement: 4500 },
  { name: "Feb", reach: 150000, engagement: 5200 },
  { name: "Mar", reach: 180000, engagement: 6100 },
  { name: "Apr", reach: 220000, engagement: 7800 },
  { name: "May", reach: 280000, engagement: 9200 },
  { name: "Jun", reach: 320000, engagement: 11500 },
]

export default function BrandPortal() {
  return (
    <PortalLayout
      sidebar={<BrandSidebar />}
      title="Brand Dashboard"
      userRole="Brand Manager"
      breadcrumbs={[{ label: "Dashboard" }]}
    >
      {/* 📊 Top Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Reach */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2M</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        {/* Campaigns */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Campaigns
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAnalytics.activeCampaigns}
            </div>
            <p className="text-xs text-muted-foreground">3 ending this month</p>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${mockAnalytics.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        {/* Engagement */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAnalytics.engagementRate}%
            </div>
            <p className="text-xs text-muted-foreground">+0.3% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* 📉 Charts & Campaign List */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>
              Reach and engagement over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="reach"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="engagement"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Active Campaigns List */}
        <Card>
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
            <CardDescription>
              Overview of current campaign progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockCampaigns
              .filter((c) => c.status === "Active")
              .map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{campaign.name}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{campaign.status}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {campaign.influencers} influencers
                      </span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">
                      ${campaign.spent.toLocaleString()} / $
                      {campaign.budget.toLocaleString()}
                    </p>
                    <Progress
                      value={(campaign.spent / campaign.budget) * 100}
                      className="w-20"
                    />
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}

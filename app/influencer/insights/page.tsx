"use client"

import dynamic from "next/dynamic"
import { PortalLayout } from "@/components/portal-layout"
import { InfluencerSidebar } from "@/components/influencer-sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MapPin,
  Users,
  TrendingUp,
  Eye,
  DollarSign,
  CheckCircle,
  XCircle,
  Instagram,
  Youtube,
  Twitter,
  Target,
} from "lucide-react"

// Dynamically import Recharts components with SSR disabled
const LineChart = dynamic<any>(
  () => import("recharts").then((m) => m.LineChart),
  { ssr: false }
)
const Line = dynamic<any>(
  () => import("recharts").then((m) => m.Line),
  { ssr: false }
)
const BarChart = dynamic<any>(
  () => import("recharts").then((m) => m.BarChart),
  { ssr: false }
)
const Bar = dynamic<any>(
  () => import("recharts").then((m) => m.Bar),
  { ssr: false }
)
const PieChart = dynamic<any>(
  () => import("recharts").then((m) => m.PieChart),
  { ssr: false }
)
const Pie = dynamic<any>(
  () => import("recharts").then((m) => m.Pie),
  { ssr: false }
)
const Cell = dynamic<any>(
  () => import("recharts").then((m) => m.Cell),
  { ssr: false }
)
const XAxis = dynamic<any>(
  () => import("recharts").then((m) => m.XAxis),
  { ssr: false }
)
const YAxis = dynamic<any>(
  () => import("recharts").then((m) => m.YAxis),
  { ssr: false }
)
const CartesianGrid = dynamic<any>(
  () => import("recharts").then((m) => m.CartesianGrid),
  { ssr: false }
)
const Tooltip = dynamic<any>(
  () => import("recharts").then((m) => m.Tooltip),
  { ssr: false }
)
const Legend = dynamic<any>(
  () => import("recharts").then((m) => m.Legend),
  { ssr: false }
)
const ResponsiveContainer = dynamic<any>(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false }
)

// Influencer Profile Data
const influencerProfile = {
  name: "Sarah Johnson",
  avatar: "/placeholder.svg",
  niche: "Fashion & Lifestyle",
  location: "New York, NY",
  followers: 155000,
  avgEngagementRate: 5.8,
  avgViews: 125000,
  estimatedCostPerPost: 2500,
  predictedROI: { min: 350, max: 480 },
  platforms: [
    { name: "Instagram", followers: 125000, verified: true, icon: Instagram },
    { name: "YouTube", followers: 45000, verified: true, icon: Youtube },
    { name: "TikTok", followers: 85000, verified: false, icon: Target },
  ],
}

// Follower Growth Data
const followerGrowthData = [
  { month: "Jan", followers: 95000 },
  { month: "Feb", followers: 102000 },
  { month: "Mar", followers: 110000 },
  { month: "Apr", followers: 122000 },
  { month: "May", followers: 138000 },
  { month: "Jun", followers: 155000 },
]

// Engagement Breakdown Data
const engagementBreakdownData = [
  { type: "Likes", count: 8500 },
  { type: "Comments", count: 420 },
  { type: "Shares", count: 180 },
  { type: "Saves", count: 950 },
]

// Audience Demographics Data
const audienceDemographicsData = [
  { demographic: "18-24", value: 28, color: "#3b82f6" },
  { demographic: "25-34", value: 42, color: "#8b5cf6" },
  { demographic: "35-44", value: 20, color: "#ec4899" },
  { demographic: "45+", value: 10, color: "#f97316" },
]

// Engagement Rate Trend Data
const engagementTrendData = [
  { month: "Jan", rate: 4.8 },
  { month: "Feb", rate: 5.2 },
  { month: "Mar", rate: 5.5 },
  { month: "Apr", rate: 5.9 },
  { month: "May", rate: 5.7 },
  { month: "Jun", rate: 5.8 },
]

// ROI/EMV Data
const roiData = [
  { month: "Jan", roi: 320, emv: 15000 },
  { month: "Feb", roi: 350, emv: 16500 },
  { month: "Mar", roi: 380, emv: 18000 },
  { month: "Apr", roi: 400, emv: 19500 },
  { month: "May", roi: 420, emv: 21000 },
  { month: "Jun", roi: 450, emv: 22500 },
]

export default function InsightsDashboard() {
  const totalFollowers = influencerProfile.platforms.reduce((sum, platform) => sum + platform.followers, 0)

  return (
    <PortalLayout
      sidebar={<InfluencerSidebar />}
      title="Insights Dashboard"
      userRole="Influencer"
      breadcrumbs={[{ label: "Dashboard", href: "/influencer" }, { label: "Insights Dashboard" }]}
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Influencer Profile Card */}
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardHeader>
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24 border-4 border-white">
                <AvatarImage src={influencerProfile.avatar} alt={influencerProfile.name} />
                <AvatarFallback>
                  {influencerProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">{influencerProfile.name}</h2>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    {influencerProfile.niche}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{influencerProfile.location}</span>
                  </div>
                </div>

                {/* Platform Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {influencerProfile.platforms.map((platform) => (
                    <div key={platform.name} className="flex items-center gap-2">
                      <platform.icon className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-semibold">{(platform.followers / 1000).toFixed(0)}K</p>
                        <p className="text-xs opacity-80 flex items-center gap-1">
                          {platform.name}
                          {platform.verified ? (
                            <CheckCircle className="h-3 w-3 text-green-400" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-400" />
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{(totalFollowers / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-muted-foreground">Total Followers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{influencerProfile.avgEngagementRate}%</p>
                  <p className="text-sm text-muted-foreground">Avg Engagement</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{(influencerProfile.avgViews / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-muted-foreground">Avg Views</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${(influencerProfile.estimatedCostPerPost / 1000).toFixed(1)}K</p>
                  <p className="text-sm text-muted-foreground">Cost Per Post</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ROI Prediction Card */}
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Predicted ROI Range</h3>
                <p className="text-sm text-muted-foreground">Based on historical campaign performance</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600">
                  {influencerProfile.predictedROI.min}% - {influencerProfile.predictedROI.max}%
                </p>
                <p className="text-sm text-muted-foreground">Expected ROI</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Verification Status */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Verification Status</CardTitle>
            <CardDescription>Your verification status across platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {influencerProfile.platforms.map((platform) => (
                <div key={platform.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <platform.icon className="h-8 w-8" />
                    <div>
                      <p className="font-semibold">{platform.name}</p>
                      <p className="text-sm text-muted-foreground">{(platform.followers / 1000).toFixed(0)}K followers</p>
                    </div>
                  </div>
                  {platform.verified ? (
                    <Badge className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <XCircle className="h-3 w-3 mr-1" />
                      Unverified
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Follower Growth Graph */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <CardTitle>Follower Growth</CardTitle>
            </div>
            <CardDescription>Track your follower growth over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={followerGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="followers" stroke="#3b82f6" strokeWidth={2} name="Followers" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Engagement Breakdown Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Breakdown</CardTitle>
              <CardDescription>Average engagement by type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={engagementBreakdownData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Audience Demographics Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Audience Demographics</CardTitle>
              <CardDescription>Age distribution of your audience</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={audienceDemographicsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ demographic, value }) => `${demographic}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {audienceDemographicsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Engagement Rate Trend */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <CardTitle>Engagement Rate Trend</CardTitle>
            </div>
            <CardDescription>How your engagement rate has evolved over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2} name="Engagement Rate (%)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ROI & EMV Estimation */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <CardTitle>ROI & EMV Estimation</CardTitle>
            </div>
            <CardDescription>Return on Investment and Estimated Media Value trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={roiData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="roi"
                  stroke="#f97316"
                  strokeWidth={2}
                  name="ROI (%)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="emv"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="EMV ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ROI Prediction Gauge */}
        <Card>
          <CardHeader>
            <CardTitle>ROI Performance Gauge</CardTitle>
            <CardDescription>Current ROI performance based on recent campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-8">
              <div className="relative w-64 h-64">
                {/* Gauge Background */}
                <svg className="w-full h-full transform -rotate-90">
                  {/* Background Arc */}
                  <circle
                    cx="128"
                    cy="128"
                    r="100"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="20"
                    strokeDasharray="440"
                    strokeDashoffset="110"
                  />
                  {/* Progress Arc - 85% of 440 */}
                  <circle
                    cx="128"
                    cy="128"
                    r="100"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="20"
                    strokeDasharray="440"
                    strokeDashoffset={440 - (440 * 0.75)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-5xl font-bold text-green-600">420%</p>
                  <p className="text-sm text-muted-foreground mt-2">Current ROI</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Low</p>
                <p className="text-sm font-semibold text-red-600">&lt; 300%</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Medium</p>
                <p className="text-sm font-semibold text-yellow-600">300-400%</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">High</p>
                <p className="text-sm font-semibold text-green-600">&gt; 400%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}

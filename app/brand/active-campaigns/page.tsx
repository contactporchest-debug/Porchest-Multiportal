"use client"

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
import { Button } from "@/components/ui/button"
import { Activity, TrendingUp, Users, DollarSign, Eye, MousePointer, Heart, MessageCircle, Share2 } from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"

// Sample data for Reach vs Impression
const reachImpressionData = [
  { campaign: "Summer Fashion", reach: 125000, impressions: 245000 },
  { campaign: "Tech Launch", reach: 89000, impressions: 178000 },
  { campaign: "Fitness Pro", reach: 156000, impressions: 312000 },
  { campaign: "Beauty Glow", reach: 98000, impressions: 196000 },
  { campaign: "Travel Vibes", reach: 134000, impressions: 268000 },
]

// Sample data for Engagement Trend
const engagementTrendData = [
  { date: "Week 1", likes: 12500, comments: 2100, shares: 1800 },
  { date: "Week 2", likes: 15800, comments: 2600, shares: 2200 },
  { date: "Week 3", likes: 18200, comments: 3100, shares: 2800 },
  { date: "Week 4", likes: 21000, comments: 3800, shares: 3400 },
  { date: "Week 5", likes: 24500, comments: 4200, shares: 4100 },
  { date: "Week 6", likes: 28000, comments: 4800, shares: 4600 },
]

// Sample data for Conversion Funnel
const conversionFunnelData = [
  { stage: "Impressions", count: 500000, percentage: 100 },
  { stage: "Clicks", count: 50000, percentage: 10 },
  { stage: "Visits", count: 35000, percentage: 7 },
  { stage: "Add to Cart", count: 12000, percentage: 2.4 },
  { stage: "Purchases", count: 5000, percentage: 1 },
]

// Sample data for ROI vs Spend Waterfall
const roiSpendData = [
  { category: "Initial Budget", value: 50000, fill: "#3b82f6" },
  { category: "Influencer Costs", value: -18000, fill: "#ef4444" },
  { category: "Content Production", value: -8000, fill: "#ef4444" },
  { category: "Ad Spend", value: -12000, fill: "#ef4444" },
  { category: "Platform Fees", value: -3000, fill: "#ef4444" },
  { category: "Revenue Generated", value: 85000, fill: "#10b981" },
  { category: "Net ROI", value: 44000, fill: "#8b5cf6" },
]

// Active campaigns data
const activeCampaigns = [
  {
    id: "1",
    name: "Summer Fashion 2025",
    status: "active",
    influencers: 5,
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    budget: 25000,
    spent: 18500,
    reach: 125000,
    engagement: 4.8,
  },
  {
    id: "2",
    name: "Tech Product Launch",
    status: "active",
    influencers: 3,
    startDate: "2025-05-15",
    endDate: "2025-07-15",
    budget: 35000,
    spent: 22000,
    reach: 89000,
    engagement: 5.2,
  },
  {
    id: "3",
    name: "Fitness Challenge",
    status: "active",
    influencers: 8,
    startDate: "2025-06-10",
    endDate: "2025-09-10",
    budget: 40000,
    spent: 28000,
    reach: 156000,
    engagement: 6.1,
  },
]

// Sentiment analysis data
const sentimentData = [
  {
    campaign: "Summer Fashion 2025",
    posts: [
      { platform: "Instagram", sentiment: "positive", score: 92, comments: 1250 },
      { platform: "TikTok", sentiment: "positive", score: 88, comments: 980 },
      { platform: "YouTube", sentiment: "neutral", score: 75, comments: 450 },
    ],
  },
  {
    campaign: "Tech Product Launch",
    posts: [
      { platform: "Instagram", sentiment: "positive", score: 85, comments: 820 },
      { platform: "YouTube", sentiment: "positive", score: 90, comments: 1100 },
    ],
  },
  {
    campaign: "Fitness Challenge",
    posts: [
      { platform: "Instagram", sentiment: "positive", score: 95, comments: 2100 },
      { platform: "TikTok", sentiment: "positive", score: 93, comments: 1850 },
      { platform: "Facebook", sentiment: "positive", score: 87, comments: 650 },
    ],
  },
]

export default function ActiveCampaigns() {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800"
      case "neutral":
        return "bg-yellow-100 text-yellow-800"
      case "negative":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <PortalLayout
      sidebar={<BrandSidebar />}
      title="Active Campaigns"
      userRole="Brand Manager"
      breadcrumbs={[{ label: "Dashboard", href: "/brand" }, { label: "Active Campaigns" }]}
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Campaign Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeCampaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="default" className="bg-green-500">
                    Active
                  </Badge>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
                <CardTitle className="mt-2">{campaign.name}</CardTitle>
                <CardDescription>
                  {campaign.influencers} influencers • {campaign.startDate} to {campaign.endDate}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Budget</p>
                    <p className="font-semibold">${campaign.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Spent</p>
                    <p className="font-semibold">${campaign.spent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Reach</p>
                    <p className="font-semibold">{(campaign.reach / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Engagement</p>
                    <p className="font-semibold">{campaign.engagement}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {((campaign.spent / campaign.budget) * 100).toFixed(0)}% of budget used
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reach vs Impression Bar Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <CardTitle>Reach vs Impressions</CardTitle>
            </div>
            <CardDescription>Compare reach and impression metrics across campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reachImpressionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="campaign" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="reach" fill="#3b82f6" name="Reach" />
                <Bar dataKey="impressions" fill="#8b5cf6" name="Impressions" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Trend Line Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <CardTitle>Engagement Trend</CardTitle>
            </div>
            <CardDescription>Track engagement metrics over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="likes" stroke="#ef4444" strokeWidth={2} name="Likes" />
                <Line type="monotone" dataKey="comments" stroke="#3b82f6" strokeWidth={2} name="Comments" />
                <Line type="monotone" dataKey="shares" stroke="#10b981" strokeWidth={2} name="Shares" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MousePointer className="h-5 w-5 text-purple-600" />
                <CardTitle>Conversion Funnel</CardTitle>
              </div>
              <CardDescription>Track user journey from impression to purchase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnelData.map((stage, index) => (
                  <div key={stage.stage}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{stage.stage}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold">{stage.count.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground ml-2">({stage.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                      <div
                        className={`h-8 rounded-full flex items-center justify-center text-white text-xs font-medium transition-all ${
                          index === 0
                            ? "bg-blue-600"
                            : index === conversionFunnelData.length - 1
                            ? "bg-green-600"
                            : "bg-purple-600"
                        }`}
                        style={{ width: `${stage.percentage * 10}%` }}
                      >
                        {stage.percentage >= 5 && stage.percentage + "%"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ROI vs Spend Waterfall */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <CardTitle>ROI vs Spend Waterfall</CardTitle>
              </div>
              <CardDescription>Financial breakdown of campaign performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roiSpendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value">
                    {roiSpendData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Sentiment Analysis */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-pink-600" />
              <CardTitle>Sentiment Analysis on Running Posts</CardTitle>
            </div>
            <CardDescription>Real-time sentiment tracking across campaign posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {sentimentData.map((campaign) => (
                <div key={campaign.campaign} className="border-b pb-4 last:border-0">
                  <h4 className="font-semibold text-sm mb-3">{campaign.campaign}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {campaign.posts.map((post, idx) => (
                      <Card key={idx} className="border-2">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{post.platform}</span>
                            <Badge className={getSentimentColor(post.sentiment)} variant="outline">
                              {post.sentiment}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Sentiment Score</span>
                              <span className="text-sm font-bold">{post.score}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  post.score >= 80
                                    ? "bg-green-500"
                                    : post.score >= 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{ width: `${post.score}%` }}
                              />
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MessageCircle className="h-3 w-3" />
                              <span>{post.comments} comments analyzed</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}

"use client"

import { useState } from "react"
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
import { Activity, TrendingUp, Eye, MousePointer, DollarSign, MessageCircle, ArrowLeft, Calendar, Users, Target } from "lucide-react"
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

// Active campaigns data
const activeCampaigns = [
  {
    id: "1",
    name: "Summer Fashion 2025",
    description: "Promoting the new summer collection across fashion influencers",
    status: "active",
    influencers: 5,
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    budget: 25000,
    spent: 18500,
    reach: 125000,
    impressions: 245000,
    engagement: 4.8,
    clicks: 12500,
    conversions: 980,
  },
  {
    id: "2",
    name: "Tech Product Launch",
    description: "Launching new smartphone with tech reviewers and unboxing creators",
    status: "active",
    influencers: 3,
    startDate: "2025-05-15",
    endDate: "2025-07-15",
    budget: 35000,
    spent: 22000,
    reach: 89000,
    impressions: 178000,
    engagement: 5.2,
    clicks: 8900,
    conversions: 750,
  },
  {
    id: "3",
    name: "Fitness Challenge",
    description: "30-day fitness transformation challenge with fitness influencers",
    status: "active",
    influencers: 8,
    startDate: "2025-06-10",
    endDate: "2025-09-10",
    budget: 40000,
    spent: 28000,
    reach: 156000,
    impressions: 312000,
    engagement: 6.1,
    clicks: 15600,
    conversions: 1250,
  },
  {
    id: "4",
    name: "Beauty Glow Up",
    description: "Skincare routine transformation with beauty and wellness influencers",
    status: "active",
    influencers: 4,
    startDate: "2025-06-05",
    endDate: "2025-08-05",
    budget: 30000,
    spent: 19500,
    reach: 98000,
    impressions: 196000,
    engagement: 5.5,
    clicks: 9800,
    conversions: 820,
  },
]

// Function to generate campaign-specific data
const getCampaignAnalytics = (campaignId: string) => {
  const campaign = activeCampaigns.find(c => c.id === campaignId)
  if (!campaign) return null

  return {
    reachImpression: [
      { metric: "Reach", value: campaign.reach },
      { metric: "Impressions", value: campaign.impressions },
    ],
    engagementTrend: [
      { date: "Week 1", likes: Math.floor(campaign.reach * 0.1), comments: Math.floor(campaign.reach * 0.017), shares: Math.floor(campaign.reach * 0.014) },
      { date: "Week 2", likes: Math.floor(campaign.reach * 0.13), comments: Math.floor(campaign.reach * 0.021), shares: Math.floor(campaign.reach * 0.018) },
      { date: "Week 3", likes: Math.floor(campaign.reach * 0.15), comments: Math.floor(campaign.reach * 0.025), shares: Math.floor(campaign.reach * 0.022) },
      { date: "Week 4", likes: Math.floor(campaign.reach * 0.17), comments: Math.floor(campaign.reach * 0.030), shares: Math.floor(campaign.reach * 0.027) },
      { date: "Week 5", likes: Math.floor(campaign.reach * 0.20), comments: Math.floor(campaign.reach * 0.034), shares: Math.floor(campaign.reach * 0.033) },
      { date: "Week 6", likes: Math.floor(campaign.reach * 0.22), comments: Math.floor(campaign.reach * 0.038), shares: Math.floor(campaign.reach * 0.037) },
    ],
    conversionFunnel: [
      { stage: "Impressions", count: campaign.impressions, percentage: 100 },
      { stage: "Clicks", count: campaign.clicks, percentage: (campaign.clicks / campaign.impressions * 100).toFixed(1) },
      { stage: "Visits", count: Math.floor(campaign.clicks * 0.7), percentage: (campaign.clicks * 0.7 / campaign.impressions * 100).toFixed(1) },
      { stage: "Add to Cart", count: Math.floor(campaign.conversions * 1.2), percentage: (campaign.conversions * 1.2 / campaign.impressions * 100).toFixed(1) },
      { stage: "Purchases", count: campaign.conversions, percentage: (campaign.conversions / campaign.impressions * 100).toFixed(1) },
    ],
    roiSpend: [
      { category: "Budget", value: campaign.budget, fill: "#3b82f6" },
      { category: "Influencer Costs", value: -(campaign.spent * 0.36), fill: "#ef4444" },
      { category: "Content Production", value: -(campaign.spent * 0.16), fill: "#ef4444" },
      { category: "Ad Spend", value: -(campaign.spent * 0.24), fill: "#ef4444" },
      { category: "Platform Fees", value: -(campaign.spent * 0.06), fill: "#ef4444" },
      { category: "Revenue", value: campaign.conversions * 85, fill: "#10b981" },
      { category: "Net ROI", value: (campaign.conversions * 85) - campaign.spent, fill: "#8b5cf6" },
    ],
    sentiment: [
      { platform: "Instagram", sentiment: "positive", score: Math.floor(85 + Math.random() * 10), comments: Math.floor(campaign.reach * 0.01) },
      { platform: "TikTok", sentiment: "positive", score: Math.floor(85 + Math.random() * 10), comments: Math.floor(campaign.reach * 0.008) },
      { platform: "YouTube", sentiment: Math.random() > 0.3 ? "positive" : "neutral", score: Math.floor(70 + Math.random() * 20), comments: Math.floor(campaign.reach * 0.004) },
    ],
  }
}

export default function ActiveCampaigns() {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null)

  const selectedCampaignData = selectedCampaign
    ? activeCampaigns.find(c => c.id === selectedCampaign)
    : null

  const analyticsData = selectedCampaign
    ? getCampaignAnalytics(selectedCampaign)
    : null

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

  // If a campaign is selected, show analytics view
  if (selectedCampaign && selectedCampaignData && analyticsData) {
    return (
      <PortalLayout
        sidebar={<BrandSidebar />}
        title={selectedCampaignData.name}
        userRole="Brand Manager"
        breadcrumbs={[
          { label: "Dashboard", href: "/brand" },
          { label: "Active Campaigns", href: "/brand/active-campaigns" },
          { label: selectedCampaignData.name },
        ]}
      >
        <div className="grid grid-cols-1 gap-6">
          {/* Back Button and Campaign Info */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setSelectedCampaign(null)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Campaigns
            </Button>
            <Badge variant="default" className="bg-green-500">
              Active
            </Badge>
          </div>

          {/* Campaign Summary */}
          <Card>
            <CardHeader>
              <CardTitle>{selectedCampaignData.name}</CardTitle>
              <CardDescription>{selectedCampaignData.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{selectedCampaignData.influencers}</p>
                    <p className="text-xs text-muted-foreground">Influencers</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">${(selectedCampaignData.spent / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-muted-foreground">of ${(selectedCampaignData.budget / 1000).toFixed(0)}K spent</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{(selectedCampaignData.reach / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-muted-foreground">Total Reach</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Target className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{selectedCampaignData.engagement}%</p>
                    <p className="text-xs text-muted-foreground">Engagement Rate</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{selectedCampaignData.startDate} to {selectedCampaignData.endDate}</span>
              </div>
            </CardContent>
          </Card>

          {/* Reach vs Impression Bar Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                <CardTitle>Reach vs Impressions</CardTitle>
              </div>
              <CardDescription>Compare reach and impression metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.reachImpression}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
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
                <LineChart data={analyticsData.engagementTrend}>
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
                  {analyticsData.conversionFunnel.map((stage, index) => (
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
                              : index === analyticsData.conversionFunnel.length - 1
                              ? "bg-green-600"
                              : "bg-purple-600"
                          }`}
                          style={{ width: `${Math.max(parseFloat(stage.percentage.toString()) * 10, 5)}%` }}
                        >
                          {parseFloat(stage.percentage.toString()) >= 0.5 && stage.percentage + "%"}
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
                  <BarChart data={analyticsData.roiSpend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value">
                      {analyticsData.roiSpend.map((entry, index) => (
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analyticsData.sentiment.map((post, idx) => (
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
                          <span>{post.comments.toLocaleString()} comments analyzed</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </PortalLayout>
    )
  }

  // Default view: Show all campaigns as cards
  return (
    <PortalLayout
      sidebar={<BrandSidebar />}
      title="Active Campaigns"
      userRole="Brand Manager"
      breadcrumbs={[{ label: "Dashboard", href: "/brand" }, { label: "Active Campaigns" }]}
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Activity className="h-6 w-6" />
              Active Campaigns Overview
            </CardTitle>
            <CardDescription className="text-blue-100">
              Track and analyze your running influencer marketing campaigns
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Campaign Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeCampaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="default" className="bg-green-500">
                    Active
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{campaign.endDate}</span>
                  </div>
                </div>
                <CardTitle className="mt-2">{campaign.name}</CardTitle>
                <CardDescription>{campaign.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-semibold">{campaign.influencers}</p>
                      <p className="text-xs text-muted-foreground">Influencers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="font-semibold">${campaign.spent.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">of ${campaign.budget.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="font-semibold">{(campaign.reach / 1000).toFixed(0)}K</p>
                      <p className="text-xs text-muted-foreground">Reach</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="font-semibold">{campaign.engagement}%</p>
                      <p className="text-xs text-muted-foreground">Engagement</p>
                    </div>
                  </div>
                </div>

                {/* Budget Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <span className="text-muted-foreground">Budget Progress</span>
                    <span className="font-medium">{((campaign.spent / campaign.budget) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                    />
                  </div>
                </div>

                {/* View Analytics Button */}
                <Button
                  className="w-full"
                  onClick={() => setSelectedCampaign(campaign.id)}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Campaign Summary</CardTitle>
            <CardDescription>Overall performance across all active campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">{activeCampaigns.length}</p>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">
                  {activeCampaigns.reduce((sum, c) => sum + c.influencers, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Influencers</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">
                  {(activeCampaigns.reduce((sum, c) => sum + c.reach, 0) / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-muted-foreground">Total Reach</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-3xl font-bold text-orange-600">
                  ${(activeCampaigns.reduce((sum, c) => sum + c.spent, 0) / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-muted-foreground">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}

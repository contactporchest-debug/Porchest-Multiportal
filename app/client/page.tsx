"use client"

import { useEffect, useState } from "react"
import { PortalLayout } from "@/components/portal-layout"
import { ClientSidebar } from "@/components/client-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Calendar, Users, CheckCircle, TrendingUp, FileText, MessageSquare, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"

interface Campaign {
  _id: string
  name: string
  description?: string
  status: string
  budget: number
  spent_amount: number
  brand_name?: string
  metrics: {
    total_reach: number
    total_impressions: number
    total_engagement: number
    engagement_rate: number
    estimated_roi: number
  }
  created_at: string
}

export default function ClientDashboard() {
  const { data: session } = useSession()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/client/campaigns?limit=100")
      const data = await response.json()

      if (data.success) {
        setCampaigns(data.data.campaigns || [])
      } else {
        setError(data.error || "Failed to load campaigns")
      }
    } catch (err) {
      setError("Failed to load campaigns")
      console.error("Error fetching campaigns:", err)
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats from real data
  const activeCampaigns = campaigns.filter((c) => c.status === "active")
  const completedCampaigns = campaigns.filter((c) => c.status === "completed")
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0)
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent_amount, 0)
  const avgROI = campaigns.length > 0
    ? campaigns.reduce((sum, c) => sum + (c.metrics?.estimated_roi || 0), 0) / campaigns.length
    : 0

  // Generate timeline data from campaigns (last 6 months)
  const campaignTimeline = generateTimelineData(campaigns)

  // Budget overview for top campaigns
  const budgetData = campaigns
    .slice(0, 5)
    .map((c) => ({
      campaign: c.name.substring(0, 15) + (c.name.length > 15 ? "..." : ""),
      allocated: c.budget,
      spent: c.spent_amount,
    }))

  if (loading) {
    return (
      <PortalLayout
        sidebar={<ClientSidebar />}
        title="Client Dashboard"
        userRole="Client"
        breadcrumbs={[{ label: "Dashboard" }]}
      >
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </PortalLayout>
    )
  }

  return (
    <PortalLayout
      sidebar={<ClientSidebar />}
      title="Client Dashboard"
      userRole="Client"
      breadcrumbs={[{ label: "Dashboard" }]}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome back, {session?.user?.name || "Client"}</CardTitle>
            <CardDescription>Here's an overview of your campaigns with Porchest</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={session?.user?.image || ""} alt="Company" />
                  <AvatarFallback>
                    {session?.user?.name?.substring(0, 2).toUpperCase() || "CL"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{session?.user?.name || "Client"}</h2>
                  <p className="text-muted-foreground">Client Portal</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">Client</Badge>
                    <Badge variant="outline">{activeCampaigns.length} Active Campaigns</Badge>
                  </div>
                </div>
              </div>
              <Button>
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Team
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCampaigns.length}</div>
              <p className="text-xs text-muted-foreground">
                {completedCampaigns.length} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                ${totalSpent.toLocaleString()} spent
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. ROI</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(avgROI)}%</div>
              <p className="text-xs text-muted-foreground">Across all campaigns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaigns.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Campaign Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Timeline</CardTitle>
              <CardDescription>Campaign status over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={campaignTimeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#22c55e" name="Completed" />
                  <Bar dataKey="active" fill="#f59e0b" name="Active" />
                  <Bar dataKey="draft" fill="#6b7280" name="Draft" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Budget Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
              <CardDescription>Top campaigns - budget allocation vs spending</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={budgetData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="campaign" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="allocated" fill="#3b82f6" name="Budget" />
                  <Bar dataKey="spent" fill="#ef4444" name="Spent" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>Your latest campaigns and their performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.slice(0, 5).map((campaign) => (
                <div key={campaign._id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="space-y-1">
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-sm text-muted-foreground">
                      By {campaign.brand_name || "Unknown Brand"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        ${campaign.spent_amount.toLocaleString()} / ${campaign.budget.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round((campaign.spent_amount / campaign.budget) * 100)}% spent
                      </p>
                    </div>
                    <Badge
                      variant={
                        campaign.status === "active"
                          ? "default"
                          : campaign.status === "completed"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {campaigns.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No campaigns found. You'll see campaigns assigned to you here.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}

// Helper function to generate timeline data
function generateTimelineData(campaigns: Campaign[]) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  const now = new Date()
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

  return months.map((month, index) => {
    const monthDate = new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + index, 1)
    const nextMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1)

    const campaignsInMonth = campaigns.filter((c) => {
      const createdAt = new Date(c.created_at)
      return createdAt >= monthDate && createdAt < nextMonth
    })

    return {
      month,
      completed: campaignsInMonth.filter((c) => c.status === "completed").length,
      active: campaignsInMonth.filter((c) => c.status === "active").length,
      draft: campaignsInMonth.filter((c) => c.status === "draft").length,
    }
  })
}

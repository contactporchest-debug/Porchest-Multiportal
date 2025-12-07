// @ts-nocheck
"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import { PortalLayout } from "@/components/portal-layout"
import { InfluencerSidebar } from "@/components/influencer-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DollarSign, Users, Heart, Calendar, Star, Award, Target, AlertCircle } from "lucide-react"
import { formatNumber } from "@/lib/utils/calculations"

// Dynamically import Recharts components with SSR disabled
const LineChart = dynamic<any>(
  () => import("recharts").then((m) => m.LineChart || m.default),
  { ssr: false }
)
const Line = dynamic<any>(
  () => import("recharts").then((m) => m.Line || m.default),
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
const CartesianGrid = dynamic<any>(
  () => import("recharts").then((m) => m.CartesianGrid || m.default),
  { ssr: false }
)
const Tooltip = dynamic<any>(
  () => import("recharts").then((m) => m.Tooltip || m.default),
  { ssr: false }
)
const ResponsiveContainer = dynamic<any>(
  () => import("recharts").then((m) => m.ResponsiveContainer || m.default),
  { ssr: false }
)
const PieChart = dynamic<any>(
  () => import("recharts").then((m) => m.PieChart || m.default),
  { ssr: false }
)
const Pie = dynamic<any>(
  () => import("recharts").then((m) => m.Pie || m.default),
  { ssr: false }
)
const Cell = dynamic<any>(
  () => import("recharts").then((m) => m.Cell || m.default),
  { ssr: false }
)

// Placeholder data for charts (will be replaced with real data when available)
const earningsData = [
  { month: "Jan", earnings: 2400, campaigns: 3 },
  { month: "Feb", earnings: 3200, campaigns: 4 },
  { month: "Mar", earnings: 2800, campaigns: 3 },
  { month: "Apr", earnings: 4100, campaigns: 5 },
  { month: "May", earnings: 3600, campaigns: 4 },
  { month: "Jun", earnings: 4800, campaigns: 6 },
]

const recentCollaborations = [
  {
    id: 1,
    brand: "Fashion Forward",
    campaign: "Summer Collection Launch",
    status: "Active",
    payment: 2500,
    deadline: "2024-07-20",
    deliverables: "3 Instagram posts, 2 Stories",
  },
  {
    id: 2,
    brand: "TechGear Pro",
    campaign: "Product Review Series",
    status: "Completed",
    payment: 1800,
    deadline: "2024-06-15",
    deliverables: "1 YouTube video, 5 Instagram posts",
  },
  {
    id: 3,
    brand: "Wellness Co",
    campaign: "Health & Fitness Challenge",
    status: "Pending",
    payment: 3200,
    deadline: "2024-08-01",
    deliverables: "4 Instagram posts, 1 Reel",
  },
]

export default function InfluencerDashboard() {
  const sessionHook = useSession() ?? {}
  const session = sessionHook.data ?? null
  const status = sessionHook.status ?? "loading"
  const [profile, setProfile] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch profile data
      const profileRes = await fetch("/api/influencer/profile")
      if (profileRes.ok) {
        const profileJson = await profileRes.json().catch(() => null)
        const profileData = profileJson ?? {}
        if (profileData.success && profileData.data?.profile) {
          setProfile(profileData.data.profile)
        }
      }

      // Fetch posts data (optional - may not exist yet)
      try {
        const postsRes = await fetch("/api/influencer/posts")
        if (postsRes.ok) {
          const postsJson = await postsRes.json().catch(() => null)
          const postsData = postsJson ?? {}
          if (postsData.success && postsData.data?.posts) {
            setPosts(postsData.data.posts)
          }
        }
      } catch (err) {
        // Posts API may not exist, that's ok
      }
    } catch (err) {
      setError("Failed to load dashboard data")
      console.error("Dashboard fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Extract data from profile with fallbacks
  const displayName = session?.user?.full_name || profile?.full_name || session?.user?.name || "User"
  const industry = profile?.industry || profile?.niche || "Content Creator"
  const username = profile?.instagram_account?.username || ""
  const profilePicture = profile?.instagram_account?.profile_picture_url || ""

  // Instagram metrics
  const metrics = profile?.instagram_metrics || {}
  const followers = metrics.followers_count || profile?.followers || 0
  const profileViews = metrics.profile_views || 0
  const reach = metrics.reach || 0
  const impressions = metrics.impressions || 0

  // Calculated metrics
  const calculated = profile?.calculated_metrics || {}
  const engagementRate = calculated.engagement_rate_30_days || 0
  const avgLikes = calculated.avg_likes || 0
  const avgComments = calculated.avg_comments || 0
  const avgReach = calculated.avg_reach || 0

  // Calculate engagement breakdown from posts
  const totalLikes = posts.reduce((sum, post) => sum + (post.metrics?.likes || 0), 0)
  const totalComments = posts.reduce((sum, post) => sum + (post.metrics?.comments || 0), 0)
  const totalSaves = posts.reduce((sum, post) => sum + (post.metrics?.saves || 0), 0)
  const totalShares = posts.reduce((sum, post) => sum + (post.metrics?.shares || 0), 0)
  const totalEngagements = totalLikes + totalComments + totalSaves + totalShares

  const engagementData = totalEngagements > 0 ? [
    { name: "Likes", value: totalLikes, color: "#FF6B6B" },
    { name: "Comments", value: totalComments, color: "#4ECDC4" },
    { name: "Shares", value: totalShares, color: "#45B7D1" },
    { name: "Saves", value: totalSaves, color: "#96CEB4" },
  ] : [
    { name: "Likes", value: 45, color: "#FF6B6B" },
    { name: "Comments", value: 25, color: "#4ECDC4" },
    { name: "Shares", value: 20, color: "#45B7D1" },
    { name: "Saves", value: 10, color: "#96CEB4" },
  ]

  const hasInstagramConnected = !!profile?.instagram_account?.instagram_user_id

  return (
    <PortalLayout
      sidebar={<InfluencerSidebar />}
      title="Influencer Dashboard"
      userRole="Content Creator"
      breadcrumbs={[{ label: "Dashboard" }]}
    >
      <div className="space-y-6">
        {!hasInstagramConnected && !loading && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Connect your Instagram account to see real-time metrics and analytics.
              <Button variant="link" asChild className="ml-2 p-0 h-auto">
                <a href="/influencer/profile">Go to Profile Setup</a>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Profile Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                {profilePicture ? (
                  <AvatarImage src={profilePicture} alt="Profile" />
                ) : (
                  <AvatarFallback>
                    {displayName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{displayName}</h2>
                  <Badge variant="secondary">{industry}</Badge>
                </div>
                <p className="text-muted-foreground">
                  {username ? `@${username} • ` : ""}{formatNumber(followers)} followers
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>4.8 Rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-blue-500" />
                    <span>{hasInstagramConnected ? "Connected" : "Setup Required"}</span>
                  </div>
                  {engagementRate > 0 && (
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4 text-green-500" />
                      <span>{engagementRate.toFixed(2)}% Engagement</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$4,800</div>
              <p className="text-xs text-muted-foreground">+33% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">2 ending this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {engagementRate > 0 ? `${engagementRate.toFixed(1)}%` : "N/A"}
              </div>
              <p className="text-xs text-muted-foreground">
                {hasInstagramConnected ? "Last 30 days" : "Connect Instagram"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(followers)}</div>
              <p className="text-xs text-muted-foreground">
                {hasInstagramConnected ? "From Instagram" : "Not connected"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Earnings Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
              <CardDescription>Monthly earnings and campaign count</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="earnings" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Engagement Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Breakdown</CardTitle>
              <CardDescription>
                {hasInstagramConnected && posts.length > 0
                  ? "Distribution from your posts"
                  : "Connect Instagram to see real data"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Collaborations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Collaborations</CardTitle>
            <CardDescription>Your latest brand partnerships and campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCollaborations.map((collab) => (
                <div key={collab.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{collab.brand}</h3>
                      <Badge
                        variant={
                          collab.status === "Active"
                            ? "default"
                            : collab.status === "Completed"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {collab.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{collab.campaign}</p>
                    <p className="text-xs text-muted-foreground">{collab.deliverables}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-semibold">${collab.payment.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Due: {collab.deadline}</p>
                    {collab.status === "Active" && (
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    )}
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

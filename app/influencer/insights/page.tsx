"use client"

import { useEffect, useState } from "react"
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
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import {
  MapPin,
  Users,
  TrendingUp,
  TrendingDown,
  Eye,
  RefreshCw,
  Instagram,
  Globe,
  AlertCircle,
  UserPlus,
  MousePointerClick,
  BarChart3,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { CustomLineChart } from "@/components/charts/line-chart"
import { CustomAreaChart } from "@/components/charts/area-chart"
import { CustomBarChart } from "@/components/charts/bar-chart"
import { CustomPieChart } from "@/components/charts/pie-chart"
import { Sparkline } from "@/components/charts/sparkline"

export default function InsightsDashboard() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/influencer/profile")
      const data = await response.json()

      if (data.success) {
        setProfile(data.data)
      } else {
        toast({
          title: "Error",
          description: data.error?.message || "Failed to load profile",
          variant: "destructive",
        })
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to load profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    try {
      setSyncing(true)
      const response = await fetch("/api/influencer/instagram/sync", {
        method: "POST",
      })
      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Instagram metrics synced successfully!",
        })
        await fetchProfile() // Refresh the data
      } else {
        toast({
          title: "Error",
          description: data.error?.message || "Failed to sync metrics",
          variant: "destructive",
        })
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to sync metrics",
        variant: "destructive",
      })
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return (
      <PortalLayout
        sidebar={<InfluencerSidebar />}
        title="Instagram Insights"
        userRole="Influencer"
        breadcrumbs={[{ label: "Dashboard", href: "/influencer" }, { label: "Instagram Insights" }]}
      >
        <div className="space-y-6">
          <Skeleton className="h-48 w-full" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        </div>
      </PortalLayout>
    )
  }

  if (!profile?.instagram_account?.is_connected) {
    return (
      <PortalLayout
        sidebar={<InfluencerSidebar />}
        title="Instagram Insights"
        userRole="Influencer"
        breadcrumbs={[{ label: "Dashboard", href: "/influencer" }, { label: "Instagram Insights" }]}
      >
        <Card className="border-orange-200 bg-gradient-to-br from-gray-900 to-gray-800">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-16 w-16 text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">Instagram Not Connected</h3>
            <p className="text-gray-300 mb-6 text-center">
              Connect your Instagram account to view detailed insights and analytics.
            </p>
            <Button
              onClick={() => window.location.href = "/influencer/profile"}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Instagram className="mr-2 h-4 w-4" />
              Go to Profile to Connect
            </Button>
          </CardContent>
        </Card>
      </PortalLayout>
    )
  }

  const metrics = profile.instagram_metrics || {}
  const calculatedMetrics = profile.calculated_metrics || {}
  const instagramAccount = profile.instagram_account || {}
  const insightsHistory = profile.instagram_insights_history || []

  const lastSynced = instagramAccount.last_synced_at
    ? new Date(instagramAccount.last_synced_at).toLocaleString()
    : "Never"

  // Helper to display metric value or fallback
  const displayMetric = (value: any, fallback: string = "N/A"): string => {
    if (value === null || value === undefined) return fallback
    if (typeof value === 'number') return value.toLocaleString()
    return String(value)
  }

  const displayPercentage = (value: any, decimals: number = 2): string => {
    if (value === null || value === undefined) return "N/A"
    return typeof value === 'number' ? value.toFixed(decimals) + '%' : 'N/A'
  }

  // Calculate percentage changes based on history snapshots
  const calculateChange = (data: any[], key: string) => {
    if (!data || data.length < 2) return 0
    const latest = data[data.length - 1]
    const previous = data[data.length - 2]
    const latestValue = latest[key] ?? 0
    const previousValue = previous[key] ?? 0
    if (previousValue === 0) return 0
    return ((latestValue - previousValue) / previousValue) * 100
  }

  const impressionsChange = calculateChange(insightsHistory, "impressions_30d")
  const reachChange = calculateChange(insightsHistory, "reach_30d")
  const viewsChange = calculateChange(insightsHistory, "profile_views_30d")
  const clicksChange = calculateChange(insightsHistory, "website_clicks_30d")

  // Format chart data - map snapshots to chart-friendly format
  let chartData = insightsHistory.map((snapshot: any) => ({
    date: new Date(snapshot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    followers: snapshot.followers_count ?? null,
    impressions: snapshot.impressions_30d ?? null,
    reach: snapshot.reach_30d ?? null,
    views: snapshot.profile_views_30d ?? null,
    clicks: snapshot.website_clicks_30d ?? null,
    engagement_rate: snapshot.engagement_rate_30d ?? null,
  })).filter((item: any) => item.followers !== null || item.impressions !== null)

  // Fallback: if no history, create single point from current metrics
  if (chartData.length === 0 && metrics.followers_count != null) {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    chartData = [{
      date: today,
      followers: metrics.followers_count,
      impressions: metrics.impressions ?? null,
      reach: metrics.reach ?? null,
      views: metrics.profile_views ?? null,
      clicks: metrics.website_clicks ?? null,
      engagement_rate: metrics.engagement_rate ?? null,
    }]
  }

  // Prepare gender demographics data
  const demographics = profile.instagram_demographics || {}
  const genderData: Array<{ name: string; value: number }> = []

  if (demographics.audience_gender_age) {
    const genderCounts: any = { M: 0, F: 0, U: 0 }
    Object.entries(demographics.audience_gender_age).forEach(([key, value]: [string, any]) => {
      const gender = key.split('.')[0] // Extract M, F, or U from "M.25-34"
      genderCounts[gender] = (genderCounts[gender] || 0) + (value || 0)
    })

    if (genderCounts.M > 0) genderData.push({ name: 'Male', value: genderCounts.M })
    if (genderCounts.F > 0) genderData.push({ name: 'Female', value: genderCounts.F })
    if (genderCounts.U > 0) genderData.push({ name: 'Unknown', value: genderCounts.U })
  }

  return (
    <PortalLayout
      sidebar={<InfluencerSidebar />}
      title="Instagram Insights"
      userRole="Influencer"
      breadcrumbs={[{ label: "Dashboard", href: "/influencer" }, { label: "Instagram Insights" }]}
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Instagram Profile Header */}
        <Card className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white border-0">
          <CardHeader>
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24 border-4 border-white">
                  <AvatarImage src={profile.profile_picture} alt={profile.full_name} />
                  <AvatarFallback className="text-2xl">
                    {profile.full_name?.split(" ").map((n: string) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Instagram className="h-6 w-6" />
                    <h2 className="text-3xl font-bold">@{instagramAccount.username}</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      {profile.niche}
                    </Badge>
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{profile.location}</span>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-2xl font-bold">{displayMetric(metrics.followers_count, "0")}</p>
                      <p className="text-sm opacity-80">Followers</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{displayMetric(metrics.follows_count, "0")}</p>
                      <p className="text-sm opacity-80">Following</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{displayMetric(metrics.media_count, "0")}</p>
                      <p className="text-sm opacity-80">Posts</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Button
                  onClick={handleSync}
                  disabled={syncing}
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
                  {syncing ? "Syncing..." : "Sync Metrics"}
                </Button>
                <p className="text-xs opacity-80 mt-2">Last synced: {lastSynced}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="h-4 w-4 text-blue-400" />
                <p className="text-xs text-gray-400">Impressions (30d)</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{displayMetric(metrics.impressions, "0")}</p>
              {impressionsChange !== 0 && (
                <div className={`flex items-center gap-1 text-xs ${impressionsChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {impressionsChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{Math.abs(impressionsChange).toFixed(1)}%</span>
                </div>
              )}
              <div className="mt-2">
                <Sparkline data={chartData} dataKey="impressions" color="#60a5fa" height={30} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-purple-400" />
                <p className="text-xs text-gray-400">Reach (30d)</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{displayMetric(metrics.reach, "0")}</p>
              {reachChange !== 0 && (
                <div className={`flex items-center gap-1 text-xs ${reachChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {reachChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{Math.abs(reachChange).toFixed(1)}%</span>
                </div>
              )}
              <div className="mt-2">
                <Sparkline data={chartData} dataKey="reach" color="#a78bfa" height={30} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <p className="text-xs text-gray-400">Engagement Rate</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{displayPercentage(metrics.engagement_rate)}</p>
              <p className="text-xs text-gray-400">Average</p>
              <div className="mt-2 h-[30px]"></div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="h-4 w-4 text-orange-400" />
                <p className="text-xs text-gray-400">Profile Views (30d)</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{displayMetric(metrics.profile_views, "0")}</p>
              {viewsChange !== 0 && (
                <div className={`flex items-center gap-1 text-xs ${viewsChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {viewsChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{Math.abs(viewsChange).toFixed(1)}%</span>
                </div>
              )}
              <div className="mt-2">
                <Sparkline data={chartData} dataKey="views" color="#fb923c" height={30} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="h-4 w-4 text-cyan-400" />
                <p className="text-xs text-gray-400">Link Clicks (30d)</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{displayMetric(metrics.website_clicks, "0")}</p>
              {clicksChange !== 0 && (
                <div className={`flex items-center gap-1 text-xs ${clicksChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {clicksChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{Math.abs(clicksChange).toFixed(1)}%</span>
                </div>
              )}
              <div className="mt-2">
                <Sparkline data={chartData} dataKey="clicks" color="#22d3ee" height={30} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <UserPlus className="h-4 w-4 text-pink-400" />
                <p className="text-xs text-gray-400">Follower Growth</p>
              </div>
              <p className="text-2xl font-bold text-white mb-1">+{((metrics.followers_count || 0) * 0.02).toFixed(0)}</p>
              <p className="text-xs text-gray-400">Last 30 days</p>
              <div className="mt-2 h-[30px]"></div>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts Section */}
        {insightsHistory.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Views Over Time (AreaChart) */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Eye className="h-5 w-5 text-orange-400" />
                  Views Over Time
                </CardTitle>
                <CardDescription className="text-gray-400">Profile views in the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomAreaChart
                  data={chartData}
                  xKey="date"
                  areas={[
                    { key: "views", color: "#fb923c", name: "Views" }
                  ]}
                  height={250}
                />
              </CardContent>
            </Card>

            {/* Reach Over Time (AreaChart) */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-400" />
                  Reach Over Time
                </CardTitle>
                <CardDescription className="text-gray-400">Unique accounts reached daily</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomAreaChart
                  data={chartData}
                  xKey="date"
                  areas={[
                    { key: "reach", color: "#a78bfa", name: "Reach" }
                  ]}
                  height={250}
                />
              </CardContent>
            </Card>

            {/* Awareness Funnel (BarChart) */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MousePointerClick className="h-5 w-5 text-blue-400" />
                  Awareness Funnel
                </CardTitle>
                <CardDescription className="text-gray-400">Impressions → Reach → Profile Views (last 10 days)</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomBarChart
                  data={chartData.slice(-10)}
                  xKey="date"
                  bars={[
                    { key: "impressions", color: "#60a5fa", name: "Impressions" },
                    { key: "reach", color: "#a78bfa", name: "Reach" },
                    { key: "views", color: "#fb923c", name: "Profile Views" }
                  ]}
                  height={250}
                />
              </CardContent>
            </Card>

            {/* Link Clicks Over Time (LineChart) */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="h-5 w-5 text-cyan-400" />
                  Link Clicks Over Time
                </CardTitle>
                <CardDescription className="text-gray-400">Website/bio link clicks daily</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomLineChart
                  data={chartData}
                  xKey="date"
                  lines={[
                    { key: "clicks", color: "#22d3ee", name: "Clicks" }
                  ]}
                  height={250}
                />
              </CardContent>
            </Card>

            {/* Visits Over Time (LineChart) */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-400" />
                  Visits Over Time
                </CardTitle>
                <CardDescription className="text-gray-400">Profile visits daily</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomLineChart
                  data={chartData}
                  xKey="date"
                  lines={[
                    { key: "visits", color: "#10b981", name: "Visits" }
                  ]}
                  height={250}
                />
              </CardContent>
            </Card>

            {/* Followers Growth (LineChart) */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-pink-400" />
                  Followers Growth
                </CardTitle>
                <CardDescription className="text-gray-400">Follower count over time (last 30 days)</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomLineChart
                  data={chartData}
                  xKey="date"
                  lines={[
                    { key: "followers", color: "#ec4899", name: "Followers" }
                  ]}
                  height={250}
                />
              </CardContent>
            </Card>

            {/* Engagement Rate Trend (AreaChart) */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  Engagement Rate Trend
                </CardTitle>
                <CardDescription className="text-gray-400">Daily engagement rate percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomAreaChart
                  data={chartData}
                  xKey="date"
                  areas={[
                    { key: "engagement_rate", color: "#10b981", name: "Engagement %" }
                  ]}
                  height={250}
                />
              </CardContent>
            </Card>

            {/* Audience Gender Demographics (PieChart) */}
            {genderData.length > 0 && (
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-400" />
                    Audience Gender
                  </CardTitle>
                  <CardDescription className="text-gray-400">Gender distribution of your audience</CardDescription>
                </CardHeader>
                <CardContent>
                  <CustomPieChart
                    data={genderData}
                    colors={["#60a5fa", "#ec4899", "#a78bfa"]}
                    height={250}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BarChart3 className="h-16 w-16 text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-white">No Historical Data Yet</h3>
              <p className="text-gray-400 mb-6 text-center max-w-md">
                Click "Sync Metrics" above to fetch your Instagram insights and populate these charts with your account data.
              </p>
              <Button
                onClick={handleSync}
                disabled={syncing}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Syncing..." : "Sync Metrics Now"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Account Info */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Instagram User ID</p>
                <p className="font-mono text-sm text-gray-200">{instagramAccount.instagram_user_id || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Business Account ID</p>
                <p className="font-mono text-sm text-gray-200">{instagramAccount.instagram_business_account_id || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Token Expires</p>
                <p className="text-sm text-gray-200">
                  {instagramAccount.token_expires_at
                    ? new Date(instagramAccount.token_expires_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}

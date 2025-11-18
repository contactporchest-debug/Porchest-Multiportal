"use client"

import { useEffect, useState } from "react"
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
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import {
  MapPin,
  Users,
  TrendingUp,
  Eye,
  RefreshCw,
  Instagram,
  Globe,
  MapPinned,
  User,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  PhoneCall,
  Mail,
  Navigation,
  MessageSquare,
  AlertCircle,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

// Dynamically import Recharts components with SSR disabled
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

const COLORS = ["#ff6b35", "#004e89", "#f77f00", "#06d6a0", "#8338ec"]

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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
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
        <Card className="border-orange-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-16 w-16 text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Instagram Not Connected</h3>
            <p className="text-muted-foreground mb-6 text-center">
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
  const demographics = profile.instagram_demographics || {}
  const instagramAccount = profile.instagram_account || {}

  // Prepare engagement breakdown data
  const engagementData = [
    { type: "Impressions", count: metrics.impressions || 0 },
    { type: "Reach", count: metrics.reach || 0 },
    { type: "Profile Views", count: metrics.profile_views || 0 },
  ].filter((item) => item.count > 0)

  // Prepare interaction data
  const interactionData = [
    { type: "Website Clicks", count: metrics.website_clicks || 0, icon: Globe },
    { type: "Email Contacts", count: metrics.email_contacts || 0, icon: Mail },
    { type: "Phone Calls", count: metrics.phone_call_clicks || 0, icon: PhoneCall },
    { type: "Directions", count: metrics.get_directions_clicks || 0, icon: Navigation },
    { type: "Text Messages", count: metrics.text_message_clicks || 0, icon: MessageSquare },
  ].filter((item) => item.count > 0)

  // Prepare city demographics (top 5)
  const cityData = demographics.audience_city
    ? Object.entries(demographics.audience_city)
        .map(([city, count]: [string, any]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    : []

  // Prepare country demographics (top 5)
  const countryData = demographics.audience_country
    ? Object.entries(demographics.audience_country)
        .map(([country, count]: [string, any]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    : []

  // Prepare age/gender demographics
  const ageGenderData = demographics.audience_gender_age
    ? Object.entries(demographics.audience_gender_age)
        .map(([key, value]: [string, any]) => ({
          demographic: key,
          value,
        }))
        .sort((a, b) => b.value - a.value)
    : []

  const lastSynced = instagramAccount.last_synced_at
    ? new Date(instagramAccount.last_synced_at).toLocaleString()
    : "Never"

  return (
    <PortalLayout
      sidebar={<InfluencerSidebar />}
      title="Instagram Insights"
      userRole="Influencer"
      breadcrumbs={[{ label: "Dashboard", href: "/influencer" }, { label: "Instagram Insights" }]}
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Instagram Profile Header */}
        <Card className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white">
          <CardHeader>
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24 border-4 border-white">
                  <AvatarImage src={profile.profile_picture} alt={profile.full_name} />
                  <AvatarFallback>
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
                      <p className="text-2xl font-bold">{(metrics.followers_count || 0).toLocaleString()}</p>
                      <p className="text-sm opacity-80">Followers</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{(metrics.follows_count || 0).toLocaleString()}</p>
                      <p className="text-sm opacity-80">Following</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{(metrics.media_count || 0).toLocaleString()}</p>
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

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{(metrics.impressions || 0).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Impressions (30d)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{(metrics.reach || 0).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Reach (30d)</p>
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
                  <p className="text-2xl font-bold">{metrics.engagement_rate?.toFixed(2) || "0.00"}%</p>
                  <p className="text-sm text-muted-foreground">Engagement Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{(metrics.profile_views || 0).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Profile Views (30d)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Engagement Overview */}
        {engagementData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                Engagement Overview (Last 30 Days)
              </CardTitle>
              <CardDescription>Your Instagram account performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ff6b35" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Audience Interactions */}
        {interactionData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Audience Interactions (Last 30 Days)</CardTitle>
              <CardDescription>How people are interacting with your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4">
                {interactionData.map((item) => (
                  <div key={item.type} className="flex flex-col items-center p-4 border rounded-lg">
                    <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                      <item.icon className="h-6 w-6 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold">{item.count.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground text-center mt-1">{item.type}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Cities */}
          {cityData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPinned className="h-5 w-5 text-orange-600" />
                  Top Cities
                </CardTitle>
                <CardDescription>Where your audience is located (by city)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cityData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="city" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#004e89" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Top Countries */}
          {countryData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-orange-600" />
                  Top Countries
                </CardTitle>
                <CardDescription>Where your audience is located (by country)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={countryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ country, count }) => `${country}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {countryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Age & Gender Demographics */}
        {ageGenderData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                Age & Gender Demographics
              </CardTitle>
              <CardDescription>Breakdown of your audience by age and gender</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ageGenderData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="demographic" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8338ec" name="Audience Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Account Info */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Instagram User ID</p>
                <p className="font-mono text-sm">{instagramAccount.instagram_user_id || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Business Account ID</p>
                <p className="font-mono text-sm">{instagramAccount.instagram_business_account_id || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Token Expires</p>
                <p className="text-sm">
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

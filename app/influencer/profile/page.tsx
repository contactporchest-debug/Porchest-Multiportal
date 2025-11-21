"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { PortalLayout } from "@/components/portal-layout"
import { InfluencerSidebar } from "@/components/influencer-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  Save,
  Plus,
  X,
  User,
  Instagram,
  RefreshCw,
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  BarChart3,
  Globe,
  MapPin,
  Clock,
  Activity,
  CheckCircle
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useSearchParams } from "next/navigation"

interface BasicInfo {
  full_name: string
  niche: string
  bio: string
  location: string
  contact_email: string
  languages: string[]
  brand_preferences: string[]
}

interface InstagramMetrics {
  followers_count: number
  follows_count: number
  media_count: number
  profile_views: number
  website_clicks: number
  email_contacts: number
  phone_call_clicks: number
  reach: number
  impressions: number
  engagement: number
  online_followers: Record<string, number>
  audience_country: Record<string, number>
  audience_city: Record<string, number>
  audience_gender_age: Record<string, number>
  audience_locale: Record<string, number>
}

interface CalculatedMetrics {
  avg_likes: number
  avg_comments: number
  avg_reach: number
  engagement_rate_30_days: number
  followers_growth_rate: number
  posting_frequency: number
  story_frequency: number
}

interface InstagramAccount {
  username: string
  is_connected: boolean
  last_synced_at: Date
}

export default function InfluencerProfileSetup() {
  // Basic Info (Manual Entry)
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    full_name: "",
    niche: "",
    bio: "",
    location: "",
    contact_email: "",
    languages: [],
    brand_preferences: [],
  })

  // Instagram Data (Auto-filled)
  const [instagramAccount, setInstagramAccount] = useState<InstagramAccount | null>(null)
  const [instagramMetrics, setInstagramMetrics] = useState<InstagramMetrics | null>(null)
  const [calculatedMetrics, setCalculatedMetrics] = useState<CalculatedMetrics | null>(null)

  // UI State
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false)
  const [checkingSetup, setCheckingSetup] = useState(false)
  const [setupStatus, setSetupStatus] = useState<any>(null)
  const [newLanguage, setNewLanguage] = useState("")
  const [newBrandPref, setNewBrandPref] = useState("")
  const [lastOAuthError, setLastOAuthError] = useState<string | null>(null)

  const { toast } = useToast()
  const router = useRouter()
  const sessionHook = useSession()
  const update = sessionHook?.update ?? (async () => {})
  const searchParams = useSearchParams()

  useEffect(() => {
    const initializePage = async () => {
      // Check for success/error messages in URL FIRST
      const success = searchParams.get("success")
      const error = searchParams.get("error")

      if (success) {
        console.log("✅ OAuth success detected:", success)
        toast({
          title: "Success",
          description: success,
        })

        // Wait for MongoDB to finalize writes, then refresh
        console.log("Waiting 2 seconds for MongoDB sync, then refreshing profile...")
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Now fetch the updated profile
        console.log("Fetching profile after OAuth success...")
        await fetchProfile()
        console.log("Profile fetch completed after OAuth")

        // Clean up URL
        router.replace("/influencer/profile")
      } else if (error) {
        console.log("❌ OAuth error detected:", error)
        setLastOAuthError(error)
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        })

        // Still fetch profile to show existing data
        await fetchProfile()

        // Clean up URL
        router.replace("/influencer/profile")
      } else {
        // Normal page load, just fetch profile
        console.log("Normal page load, fetching profile...")
        await fetchProfile()
        setLastOAuthError(null)
      }
    }

    initializePage()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      console.log("Fetching influencer profile...")

      const response = await fetch("/api/influencer/profile", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
        },
      })
      console.log("Fetch response status:", response.status)

      const data = await response.json()
      console.log("=== FULL API RESPONSE ===", JSON.stringify(data, null, 2))

      if (data.success && data.data && data.data.profile) {
        const profile = data.data.profile
        const instagram_account = data.data.instagram_account
        const instagram_metrics = data.data.instagram_metrics
        const calculated_metrics = data.data.calculated_metrics

        console.log("=== PROFILE OBJECT ===", profile)
        console.log("=== instagram_account ===", instagram_account)
        console.log("=== instagram_metrics ===", instagram_metrics)
        console.log("=== calculated_metrics ===", calculated_metrics)

        // Set basic info (manual fields)
        setBasicInfo({
          full_name: profile.full_name || "",
          niche: profile.niche || "",
          bio: profile.bio || "",
          location: profile.location || "",
          contact_email: profile.contact_email || profile.email || "",
          languages: profile.languages || [],
          brand_preferences: profile.brand_preferences || [],
        })

        // Check for Instagram connection
        const hasInstagramAccount = instagram_account !== null
        const isConnected = instagram_account?.is_connected === true

        console.log("=== CONNECTION CHECK ===")
        console.log("  hasInstagramAccount:", hasInstagramAccount)
        console.log("  instagram_account:", instagram_account)
        console.log("  isConnected:", isConnected)

        // Set Instagram account info if connected
        if (isConnected && instagram_account) {
          console.log("✅ INSTAGRAM IS CONNECTED")
          setInstagramAccount({
            username: instagram_account.username || profile.instagram_username || "",
            is_connected: true,
            last_synced_at: instagram_account.last_synced_at
              ? new Date(instagram_account.last_synced_at)
              : new Date(),
          })

          // Set Instagram metrics
          if (instagram_metrics) {
            console.log("✅ Setting Instagram metrics:", instagram_metrics)
            setInstagramMetrics(instagram_metrics)
          }

          // Set calculated metrics
          if (calculated_metrics) {
            console.log("✅ Setting calculated metrics:", calculated_metrics)
            setCalculatedMetrics(calculated_metrics)
          }
        } else {
          console.log("❌ INSTAGRAM NOT CONNECTED")
          console.log("  Reason: isConnected =", isConnected, ", hasInstagramAccount =", hasInstagramAccount)
          // Reset Instagram state
          setInstagramAccount(null)
          setInstagramMetrics(null)
          setCalculatedMetrics(null)
        }
      } else {
        console.error("❌ Profile fetch failed - invalid response structure:", data)
      }
    } catch (err) {
      console.error("❌ Error fetching profile:", err)
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveBasicInfo = async () => {
    try {
      setSaving(true)
      console.log("Saving basic info...", basicInfo)

      // Validate required fields
      if (!basicInfo.full_name || !basicInfo.niche || !basicInfo.location || !basicInfo.contact_email) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields: Full Name, Niche, Location, and Contact Email",
          variant: "destructive",
        })
        return
      }

      if (basicInfo.languages.length === 0) {
        toast({
          title: "Validation Error",
          description: "Please add at least one language",
          variant: "destructive",
        })
        return
      }

      const payload = {
        full_name: basicInfo.full_name,
        niche: basicInfo.niche,
        bio: basicInfo.bio,
        location: basicInfo.location,
        contact_email: basicInfo.contact_email,
        languages: basicInfo.languages,
        brand_preferences: basicInfo.brand_preferences,
      }

      console.log("Sending payload:", payload)

      const response = await fetch("/api/influencer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      console.log("Response status:", response.status)

      const data = await response.json()
      console.log("Response data:", data)

      if (!response.ok) {
        throw new Error(data.error?.message || `Server error: ${response.status}`)
      }

      if (data.success) {
        toast({
          title: "Success",
          description: "Basic information saved successfully!",
        })

        await update()
        await fetchProfile()
      } else {
        throw new Error(data.error?.message || "Failed to save profile")
      }
    } catch (err: any) {
      console.error("Error saving basic info:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to save basic information",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleConnectInstagram = async () => {
    try {
      setConnecting(true)
      setLastOAuthError(null) // Clear any previous errors
      console.log("Initiating Instagram connection...")

      const response = await fetch("/api/influencer/instagram/connect")
      console.log("Response status:", response.status)

      const data = await response.json()
      console.log("Response data:", data)

      if (!response.ok) {
        throw new Error(data.error?.message || `Server error: ${response.status}`)
      }

      if (data.success && data.data?.authUrl) {
        console.log("Redirecting to Meta OAuth:", data.data.authUrl)
        window.location.href = data.data.authUrl
      } else {
        throw new Error(data.error?.message || "No authorization URL received from server")
      }
    } catch (err: any) {
      console.error("Instagram connection error:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to connect Instagram",
        variant: "destructive",
      })
      setConnecting(false)
    }
  }

  const handleSyncInstagram = async () => {
    try {
      setSyncing(true)
      const response = await fetch("/api/influencer/instagram/sync", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to sync Instagram metrics")
      }

      if (data.success) {
        toast({
          title: "Success",
          description: "Instagram metrics synced successfully!",
        })

        await fetchProfile()
      } else {
        throw new Error(data.error?.message || "Failed to sync Instagram metrics")
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to sync Instagram metrics",
        variant: "destructive",
      })
    } finally {
      setSyncing(false)
    }
  }

  const handleDisconnectInstagram = async () => {
    try {
      setDisconnecting(true)
      const response = await fetch("/api/influencer/instagram/disconnect", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to disconnect Instagram")
      }

      if (data.success) {
        toast({
          title: "Success",
          description: "Instagram account disconnected successfully!",
        })

        setInstagramAccount(null)
        setInstagramMetrics(null)
        setCalculatedMetrics(null)
        setSetupStatus(null)
        setShowDisconnectDialog(false)
        await fetchProfile()
      } else {
        throw new Error(data.error?.message || "Failed to disconnect Instagram")
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to disconnect Instagram",
        variant: "destructive",
      })
    } finally {
      setDisconnecting(false)
    }
  }

  const handleCheckSetup = async () => {
    try {
      setCheckingSetup(true)
      console.log("Checking Instagram setup...")

      // FIXED: First refetch the profile to get latest connection state
      await fetchProfile()

      const response = await fetch("/api/influencer/instagram/verify-setup", {
        method: "POST",
        cache: "no-store",
      })

      const data = await response.json()
      console.log("=== VERIFY SETUP RESPONSE ===", data)

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to check setup")
      }

      if (data.success && data.data) {
        setSetupStatus(data.data)
        console.log("Setup status:", data.data)

        // Show appropriate message based on status
        if (data.data.status === "ready") {
          toast({
            title: "Setup Complete! 🎉",
            description: data.data.message,
          })
          // Refetch profile to update UI with latest data
          await fetchProfile()
        } else if (data.data.status === "needs_connection") {
          toast({
            title: "Not Connected",
            description: "Please connect your Instagram account to continue.",
            variant: "default",
          })
        } else {
          toast({
            title: "Setup Incomplete",
            description: data.data.message,
            variant: "default",
          })
        }
      } else {
        throw new Error(data.error?.message || "Failed to verify setup")
      }
    } catch (err: any) {
      console.error("Setup check error:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to check setup",
        variant: "destructive",
      })
    } finally {
      setCheckingSetup(false)
    }
  }

  const addLanguage = () => {
    if (newLanguage && !basicInfo.languages.includes(newLanguage)) {
      setBasicInfo({ ...basicInfo, languages: [...basicInfo.languages, newLanguage] })
      setNewLanguage("")
    }
  }

  const removeLanguage = (lang: string) => {
    setBasicInfo({ ...basicInfo, languages: basicInfo.languages.filter((l) => l !== lang) })
  }

  const addBrandPref = () => {
    if (newBrandPref && !basicInfo.brand_preferences.includes(newBrandPref)) {
      setBasicInfo({ ...basicInfo, brand_preferences: [...basicInfo.brand_preferences, newBrandPref] })
      setNewBrandPref("")
    }
  }

  const removeBrandPref = (pref: string) => {
    setBasicInfo({ ...basicInfo, brand_preferences: basicInfo.brand_preferences.filter((p) => p !== pref) })
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  const formatPercentage = (num: number) => {
    return num.toFixed(2) + "%"
  }

  if (loading) {
    return (
      <PortalLayout
        sidebar={<InfluencerSidebar />}
        title="Profile Setup"
        userRole="Influencer"
        breadcrumbs={[{ label: "Profile Setup" }]}
      >
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      </PortalLayout>
    )
  }

  return (
    <PortalLayout
      sidebar={<InfluencerSidebar />}
      title="Profile Setup"
      userRole="Influencer"
      breadcrumbs={[{ label: "Profile Setup" }]}
    >
      <div className="space-y-6">
        {/* Basic Information Section (Manual Entry) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-orange-600" />
              Basic Information
            </CardTitle>
            <CardDescription>Enter your personal and professional details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="full_name"
                  value={basicInfo.full_name}
                  onChange={(e) => setBasicInfo({ ...basicInfo, full_name: e.target.value })}
                  placeholder="Sara Malik"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="niche">
                  Niche/Category <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="niche"
                  value={basicInfo.niche}
                  onChange={(e) => setBasicInfo({ ...basicInfo, niche: e.target.value })}
                  placeholder="Beauty, Fashion, Tech, Lifestyle, etc."
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={basicInfo.bio}
                  onChange={(e) => setBasicInfo({ ...basicInfo, bio: e.target.value })}
                  placeholder="Tell us about yourself and your content..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  value={basicInfo.location}
                  onChange={(e) => setBasicInfo({ ...basicInfo, location: e.target.value })}
                  placeholder="City, Country"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email">
                  Contact Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={basicInfo.contact_email}
                  onChange={(e) => setBasicInfo({ ...basicInfo, contact_email: e.target.value })}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <Separator />

            {/* Languages */}
            <div className="space-y-3">
              <Label>
                Languages <span className="text-red-500">*</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {basicInfo.languages.map((lang) => (
                  <Badge key={lang} variant="secondary" className="flex items-center gap-1 bg-orange-100 text-orange-800">
                    {lang}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeLanguage(lang)} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  placeholder="Add a language..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
                />
                <Button onClick={addLanguage} size="sm" type="button">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Brand Preferences */}
            <div className="space-y-3">
              <Label>Brand Preferences (Optional)</Label>
              <p className="text-sm text-gray-500">Brands you'd like to collaborate with</p>
              <div className="flex flex-wrap gap-2">
                {basicInfo.brand_preferences.map((pref) => (
                  <Badge key={pref} variant="secondary" className="flex items-center gap-1 bg-orange-100 text-orange-800">
                    {pref}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeBrandPref(pref)} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newBrandPref}
                  onChange={(e) => setNewBrandPref(e.target.value)}
                  placeholder="Add a brand preference..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBrandPref())}
                />
                <Button onClick={addBrandPref} size="sm" type="button" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleSaveBasicInfo} disabled={saving} size="lg" className="bg-orange-600 hover:bg-orange-700">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-5 w-5" />
                    Save Basic Information
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instagram Connection Section */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Instagram className="h-5 w-5 text-orange-600" />
              Instagram Business Account
            </CardTitle>
            <CardDescription>
              {instagramAccount?.is_connected
                ? "Your Instagram account is connected. All metrics are automatically synced."
                : "Connect your Instagram Business Account to automatically fetch your metrics"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!instagramAccount?.is_connected ? (
              <div className="space-y-4">
                <Alert>
                  <Instagram className="h-4 w-4" />
                  <AlertDescription>
                    To connect Instagram, you need:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>An Instagram Business or Creator account</li>
                      <li>A Facebook Page linked to your Instagram account</li>
                      <li>Admin access to the Facebook Page</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                {/* OAuth Error Alert */}
                {lastOAuthError && (
                  <Alert className="bg-red-50 border-red-200">
                    <Activity className="h-4 w-4 text-red-600" />
                    <AlertDescription>
                      <p className="font-medium text-red-900 mb-2">Connection Failed</p>
                      <p className="text-sm text-red-800 mb-3">{lastOAuthError}</p>
                      <div className="text-xs text-red-700 space-y-1">
                        <p className="font-medium">To fix this, please:</p>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                          <li>Create a Facebook Page (if you don't have one)</li>
                          <li>Convert your Instagram to a Business or Creator account</li>
                          <li>Link your Instagram Business Account to the Facebook Page</li>
                          <li>Click "Check My Setup" below for detailed guidance</li>
                        </ol>
                      </div>
                      <Button
                        onClick={() => setLastOAuthError(null)}
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-red-700 hover:text-red-900 hover:bg-red-100"
                      >
                        Dismiss
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Success Alert when setup is ready */}
                {setupStatus && setupStatus.status === "ready" && (
                  <Alert className="bg-green-50 border-green-200">
                    <Activity className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                      <p className="font-medium text-green-900 mb-1">Setup Complete!</p>
                      <p className="text-sm text-green-800">
                        Your Instagram account <span className="font-semibold">@{setupStatus.username}</span> is ready to connect.
                        Click the button below to complete the connection.
                      </p>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Guided Setup Wizard */}
                {setupStatus && setupStatus.status !== "needs_connection" && setupStatus.status !== "ready" && (
                  <div className="space-y-4 p-4 border-2 border-orange-300 rounded-lg bg-orange-50">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-orange-100 rounded-full">
                        <Activity className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-orange-900 mb-2">Setup Required</h4>
                        <p className="text-sm text-orange-800 mb-4">{setupStatus.message}</p>

                        {/* Step A: Convert to Business/Creator */}
                        {setupStatus.step === "convert_to_business" && (
                          <div className="space-y-3">
                            <div className="p-3 bg-white rounded border border-orange-200">
                              <p className="text-sm font-medium text-gray-900 mb-2">📱 Step A: Switch to Business or Creator Account</p>
                              <p className="text-xs text-gray-600 mb-3">
                                Your account <span className="font-semibold">@{setupStatus.username}</span> is currently a Personal account.
                                Convert it to a Business or Creator account to access Instagram Insights.
                              </p>
                              <Button
                                onClick={() => window.open("instagram://settings/account", "_blank")}
                                variant="outline"
                                size="sm"
                                className="w-full"
                              >
                                Open Instagram Settings
                              </Button>
                              <p className="text-xs text-gray-500 mt-2">
                                If the link doesn't work, open Instagram app → Settings → Account → Switch to Professional Account
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Step B: Create Facebook Page */}
                        {setupStatus.step === "create_page" && (
                          <div className="space-y-3">
                            <div className="p-3 bg-white rounded border border-orange-200">
                              <p className="text-sm font-medium text-gray-900 mb-2">📄 Step B: Create a Facebook Page</p>
                              <p className="text-xs text-gray-600 mb-3">
                                You need a Facebook Page to link your Instagram Business Account. Create one now (it only takes a minute).
                              </p>
                              <Button
                                onClick={() => window.open(setupStatus.action_url, "_blank")}
                                variant="outline"
                                size="sm"
                                className="w-full"
                              >
                                Create Facebook Page
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Step C: Link Instagram to Facebook Page */}
                        {setupStatus.step === "link_instagram" && (
                          <div className="space-y-3">
                            <div className="p-3 bg-white rounded border border-orange-200">
                              <p className="text-sm font-medium text-gray-900 mb-2">🔗 Step C: Link Instagram to Facebook Page</p>
                              <p className="text-xs text-gray-600 mb-3">
                                Connect your Instagram Business Account to your Facebook Page <span className="font-semibold">{setupStatus.page_name}</span>.
                              </p>
                              <Button
                                onClick={() => window.open(setupStatus.action_url, "_blank")}
                                variant="outline"
                                size="sm"
                                className="w-full"
                              >
                                Open Facebook Page Settings
                              </Button>
                              <p className="text-xs text-gray-500 mt-2">
                                Go to Instagram tab → Connect Account → Link your Instagram Business Account
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Token Expired */}
                        {setupStatus.status === "token_expired" && (
                          <div className="p-3 bg-white rounded border border-orange-200">
                            <p className="text-sm font-medium text-gray-900 mb-2">🔄 Reconnection Required</p>
                            <p className="text-xs text-gray-600 mb-3">
                              Your Instagram connection has expired. Please reconnect to refresh your access.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  {/* FIXED: Show Check Setup button when NOT connected */}
                  {!instagramAccount?.is_connected && (
                    <Button
                      onClick={handleCheckSetup}
                      disabled={checkingSetup}
                      variant="outline"
                      className="w-full"
                    >
                      {checkingSetup ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Checking Setup...
                        </>
                      ) : (
                        <>
                          <Activity className="mr-2 h-4 w-4" />
                          Check My Setup
                        </>
                      )}
                    </Button>
                  )}

                  {/* FIXED: Show different button states based on connection */}
                  {instagramAccount?.is_connected ? (
                    <div className="flex flex-col gap-2">
                      {/* Connected Status Card */}
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-green-900">Instagram Connected</span>
                        </div>
                        <p className="text-sm text-green-800 mb-1">@{instagramAccount.username}</p>
                        <p className="text-xs text-green-600">
                          Last synced: {new Date(instagramAccount.last_synced_at).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Re-sync Button */}
                      <Button
                        onClick={handleSyncInstagram}
                        disabled={syncing}
                        variant="outline"
                        className="w-full"
                      >
                        {syncing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Syncing...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Re-sync Insights
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={handleConnectInstagram}
                      disabled={connecting}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      size="lg"
                    >
                      {connecting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Instagram className="mr-2 h-5 w-5" />
                          Connect Instagram Account
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Instagram className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="font-medium text-green-900">Connected</p>
                      <p className="text-sm text-green-700">@{instagramAccount.username}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Last synced: {new Date(instagramAccount.last_synced_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSyncInstagram}
                    disabled={syncing}
                    variant="outline"
                    className="flex-1"
                  >
                    {syncing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sync Metrics
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => setShowDisconnectDialog(true)}
                    variant="destructive"
                    size="sm"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Disconnect
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Instagram Metrics Dashboard (Only shown if connected) */}
        {instagramAccount?.is_connected && instagramMetrics && (
          <>
            {/* Overview Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Followers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-orange-600" />
                    <p className="text-2xl font-bold">{formatNumber(instagramMetrics.followers_count)}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Following: {formatNumber(instagramMetrics.follows_count)}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Reach</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <p className="text-2xl font-bold">{formatNumber(instagramMetrics.reach)}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Impressions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-purple-600" />
                    <p className="text-2xl font-bold">{formatNumber(instagramMetrics.impressions)}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Engagement Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-600" />
                    <p className="text-2xl font-bold">
                      {calculatedMetrics ? formatPercentage(calculatedMetrics.engagement_rate_30_days) : "N/A"}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Metrics Tabs */}
            <Card>
              <CardHeader>
                <CardTitle>Instagram Analytics</CardTitle>
                <CardDescription>Comprehensive metrics from your Instagram Business Account</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="profile" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="engagement">Engagement</TabsTrigger>
                    <TabsTrigger value="audience">Audience</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                  </TabsList>

                  {/* Profile Metrics */}
                  <TabsContent value="profile" className="space-y-4 mt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">Profile Views</span>
                          <span className="text-lg font-bold text-orange-600">{formatNumber(instagramMetrics.profile_views)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">Website Clicks</span>
                          <span className="text-lg font-bold text-blue-600">{formatNumber(instagramMetrics.website_clicks)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">Email Contacts</span>
                          <span className="text-lg font-bold text-purple-600">{formatNumber(instagramMetrics.email_contacts)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">Phone Clicks</span>
                          <span className="text-lg font-bold text-green-600">{formatNumber(instagramMetrics.phone_call_clicks)}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">Total Posts</span>
                          <span className="text-lg font-bold text-orange-600">{formatNumber(instagramMetrics.media_count)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">Total Engagement</span>
                          <span className="text-lg font-bold text-pink-600">{formatNumber(instagramMetrics.engagement)}</span>
                        </div>
                        {calculatedMetrics && (
                          <>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm font-medium">Posting Frequency</span>
                              <span className="text-lg font-bold text-blue-600">{calculatedMetrics.posting_frequency.toFixed(1)} / week</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm font-medium">Story Frequency</span>
                              <span className="text-lg font-bold text-purple-600">{calculatedMetrics.story_frequency.toFixed(1)} / week</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Engagement Metrics */}
                  <TabsContent value="engagement" className="space-y-4 mt-4">
                    {calculatedMetrics && (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-red-500" />
                              <span className="text-sm font-medium">Average Likes</span>
                            </div>
                            <span className="text-lg font-bold text-red-600">{formatNumber(calculatedMetrics.avg_likes)}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <MessageCircle className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-medium">Average Comments</span>
                            </div>
                            <span className="text-lg font-bold text-blue-600">{formatNumber(calculatedMetrics.avg_comments)}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-purple-500" />
                              <span className="text-sm font-medium">Average Reach</span>
                            </div>
                            <span className="text-lg font-bold text-purple-600">{formatNumber(calculatedMetrics.avg_reach)}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-green-500" />
                              <span className="text-sm font-medium">Engagement Rate (30d)</span>
                            </div>
                            <span className="text-lg font-bold text-green-600">{formatPercentage(calculatedMetrics.engagement_rate_30_days)}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-orange-500" />
                              <span className="text-sm font-medium">Growth Rate</span>
                            </div>
                            <span className="text-lg font-bold text-orange-600">{formatPercentage(calculatedMetrics.followers_growth_rate)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* Audience Demographics */}
                  <TabsContent value="audience" className="space-y-4 mt-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Top Countries */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Globe className="h-4 w-4 text-orange-600" />
                          Top Countries
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(instagramMetrics.audience_country || {})
                            .sort(([, a], [, b]) => (b as number) - (a as number))
                            .slice(0, 5)
                            .map(([country, percentage]) => (
                              <div key={country} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm">{country}</span>
                                <span className="text-sm font-medium text-orange-600">
                                  {((percentage as number) * 100).toFixed(1)}%
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Top Cities */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          Top Cities
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(instagramMetrics.audience_city || {})
                            .sort(([, a], [, b]) => (b as number) - (a as number))
                            .slice(0, 5)
                            .map(([city, percentage]) => (
                              <div key={city} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm">{city}</span>
                                <span className="text-sm font-medium text-blue-600">
                                  {((percentage as number) * 100).toFixed(1)}%
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Gender & Age */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4 text-purple-600" />
                          Gender & Age Distribution
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(instagramMetrics.audience_gender_age || {})
                            .sort(([, a], [, b]) => (b as number) - (a as number))
                            .slice(0, 5)
                            .map(([segment, percentage]) => (
                              <div key={segment} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm">{segment}</span>
                                <span className="text-sm font-medium text-purple-600">
                                  {((percentage as number) * 100).toFixed(1)}%
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Online Followers Peak Hours */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-green-600" />
                          Peak Online Hours
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(instagramMetrics.online_followers || {})
                            .sort(([, a], [, b]) => (b as number) - (a as number))
                            .slice(0, 5)
                            .map(([hour, count]) => {
                              const h = parseInt(hour)
                              const period = h >= 12 ? "PM" : "AM"
                              const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h
                              return (
                                <div key={hour} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <span className="text-sm">{displayHour}:00 {period}</span>
                                  <span className="text-sm font-medium text-green-600">{formatNumber(count as number)}</span>
                                </div>
                              )
                            })}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Performance Summary */}
                  <TabsContent value="performance" className="space-y-4 mt-4">
                    <Alert className="bg-blue-50 border-blue-200">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                      <AlertDescription>
                        <p className="font-medium text-blue-900 mb-2">Performance Summary</p>
                        <ul className="space-y-1 text-sm text-blue-800">
                          <li>• {formatNumber(instagramMetrics.media_count)} total posts published</li>
                          <li>• {formatNumber(instagramMetrics.reach)} accounts reached in last 30 days</li>
                          <li>• {formatNumber(instagramMetrics.impressions)} total impressions</li>
                          {calculatedMetrics && (
                            <>
                              <li>• {formatPercentage(calculatedMetrics.engagement_rate_30_days)} average engagement rate</li>
                              <li>• {calculatedMetrics.posting_frequency.toFixed(1)} posts per week average</li>
                            </>
                          )}
                        </ul>
                      </AlertDescription>
                    </Alert>

                    <div className="grid gap-4 md:grid-cols-3">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Best Performing</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold text-green-600">
                            {calculatedMetrics ? formatNumber(calculatedMetrics.avg_likes) : "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">Avg Likes per Post</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Audience Growth</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold text-blue-600">
                            {calculatedMetrics ? formatPercentage(calculatedMetrics.followers_growth_rate) : "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">Estimated Growth Rate</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">Content Output</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold text-purple-600">
                            {calculatedMetrics ? calculatedMetrics.posting_frequency.toFixed(1) : "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">Posts per Week</p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Disconnect Confirmation Dialog */}
      <AlertDialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Instagram Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all Instagram data from your profile, including metrics and demographics.
              You can reconnect your account at any time, but you'll need to go through the connection process again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={disconnecting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisconnectInstagram}
              disabled={disconnecting}
              className="bg-red-600 hover:bg-red-700"
            >
              {disconnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                "Disconnect"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PortalLayout>
  )
}

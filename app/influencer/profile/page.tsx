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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Save, Plus, X, User, Instagram, RefreshCw } from "lucide-react"
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

interface ProfileFormData {
  full_name: string
  instagram_username: string
  profile_picture: string
  niche: string
  location: string
  followers: number
  following: number
  verified: boolean
  engagement_rate: number
  average_views_monthly: number
  last_post_views: number
  last_post_engagement: number
  last_post_date: string
  price_per_post: number
  availability: string
  languages: string[]
  platforms: string[]
  brands_worked_with: string[]
}

export default function InfluencerProfileSetup() {
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: "",
    instagram_username: "",
    profile_picture: "",
    niche: "",
    location: "",
    followers: 0,
    following: 0,
    verified: false,
    engagement_rate: 0,
    average_views_monthly: 0,
    last_post_views: 0,
    last_post_engagement: 0,
    last_post_date: "",
    price_per_post: 0,
    availability: "Available",
    languages: [],
    platforms: [],
    brands_worked_with: [],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false)
  const [instagramConnected, setInstagramConnected] = useState(false)
  const [newLanguage, setNewLanguage] = useState("")
  const [newPlatform, setNewPlatform] = useState("")
  const [newBrand, setNewBrand] = useState("")
  const { toast } = useToast()
  const router = useRouter()
  const session = useSession();
  const update = session?.update ?? (async () => {});
  const searchParams = useSearchParams()

  useEffect(() => {
    fetchProfile()

    // Check for success/error messages in URL
    const success = searchParams.get("success")
    const error = searchParams.get("error")

    if (success) {
      toast({
        title: "Success",
        description: success,
      })
      // Clean URL
      router.replace("/influencer/profile")
    }

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
      // Clean URL
      router.replace("/influencer/profile")
    }
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/influencer/profile")
      const data = await response.json()

      if (data.success && data.data.profile) {
        const profile = data.data.profile
        setFormData({
          full_name: profile.full_name || "",
          instagram_username: profile.instagram_username || "",
          profile_picture: profile.profile_picture || "",
          niche: profile.niche || "",
          location: profile.location || "",
          followers: profile.followers || 0,
          following: profile.following || 0,
          verified: profile.verified || false,
          engagement_rate: profile.engagement_rate || 0,
          average_views_monthly: profile.average_views_monthly || 0,
          last_post_views: profile.last_post_views || 0,
          last_post_engagement: profile.last_post_engagement || 0,
          last_post_date: profile.last_post_date ? new Date(profile.last_post_date).toISOString().split('T')[0] : "",
          price_per_post: profile.price_per_post || 0,
          availability: profile.availability || "Available",
          languages: profile.languages || [],
          platforms: profile.platforms || [],
          brands_worked_with: profile.brands_worked_with || [],
        })

        // Check if Instagram is connected
        setInstagramConnected(profile.instagram_account?.is_connected || false)
      }
    } catch (err) {
      console.error("Error fetching profile:", err)
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      const payload = {
        ...formData,
        last_post_date: formData.last_post_date ? new Date(formData.last_post_date).toISOString() : undefined,
      }

      const response = await fetch("/api/influencer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to save profile")
      }

      if (data.success) {
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        })

        // Update session to reflect profile completion
        await update()
      } else {
        throw new Error(data.error?.message || "Failed to save profile")
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const addLanguage = () => {
    if (newLanguage && !formData.languages.includes(newLanguage)) {
      setFormData({ ...formData, languages: [...formData.languages, newLanguage] })
      setNewLanguage("")
    }
  }

  const removeLanguage = (lang: string) => {
    setFormData({ ...formData, languages: formData.languages.filter((l) => l !== lang) })
  }

  const addPlatform = () => {
    if (newPlatform && !formData.platforms.includes(newPlatform)) {
      setFormData({ ...formData, platforms: [...formData.platforms, newPlatform] })
      setNewPlatform("")
    }
  }

  const removePlatform = (platform: string) => {
    setFormData({ ...formData, platforms: formData.platforms.filter((p) => p !== platform) })
  }

  const addBrand = () => {
    if (newBrand && !formData.brands_worked_with.includes(newBrand)) {
      setFormData({ ...formData, brands_worked_with: [...formData.brands_worked_with, newBrand] })
      setNewBrand("")
    }
  }

  const removeBrand = (brand: string) => {
    setFormData({ ...formData, brands_worked_with: formData.brands_worked_with.filter((b) => b !== brand) })
  }

  const handleConnectInstagram = async () => {
    try {
      setConnecting(true)
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
        // Redirect to Meta OAuth page
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

        // Refresh profile data
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

        // Refresh profile data
        await fetchProfile()
        setShowDisconnectDialog(false)
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
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-orange-600" />
              Basic Information
            </CardTitle>
            <CardDescription>Your personal and professional details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Sara Malik"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram_username">Instagram Username</Label>
                <Input
                  id="instagram_username"
                  value={formData.instagram_username}
                  onChange={(e) => setFormData({ ...formData, instagram_username: e.target.value })}
                  placeholder="@sara.malik"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="niche">
                  Niche <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="niche"
                  value={formData.niche}
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                  placeholder="beauty"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Pakistan"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile_picture">Profile Picture URL</Label>
                <Input
                  id="profile_picture"
                  type="url"
                  value={formData.profile_picture}
                  onChange={(e) => setFormData({ ...formData, profile_picture: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Select
                  value={formData.availability}
                  onValueChange={(value) => setFormData({ ...formData, availability: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Busy">Busy</SelectItem>
                    <SelectItem value="Not Available">Not Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instagram Connection */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Instagram className="h-5 w-5 text-orange-600" />
              Instagram Connection
            </CardTitle>
            <CardDescription>
              {instagramConnected
                ? "Your Instagram account is connected. Sync to get the latest metrics."
                : "Connect your Instagram Business Account to automatically fetch your metrics"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!instagramConnected ? (
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
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-green-900">Instagram Connected</p>
                    <p className="text-sm text-green-700">@{formData.instagram_username}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Connected</Badge>
                </div>

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
                      Sync Instagram Metrics
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => setShowDisconnectDialog(true)}
                  disabled={disconnecting}
                  variant="destructive"
                  className="w-full"
                  size="sm"
                >
                  <X className="mr-2 h-4 w-4" />
                  Disconnect Instagram
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Last synced: {formData.instagram_username ? "Recently" : "Never"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Social Media Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Metrics</CardTitle>
            <CardDescription>Your follower stats and engagement data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="followers">Followers</Label>
                <Input
                  id="followers"
                  type="number"
                  value={formData.followers}
                  onChange={(e) => setFormData({ ...formData, followers: parseInt(e.target.value) || 0 })}
                  placeholder="300000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="following">Following</Label>
                <Input
                  id="following"
                  type="number"
                  value={formData.following}
                  onChange={(e) => setFormData({ ...formData, following: parseInt(e.target.value) || 0 })}
                  placeholder="150"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="engagement_rate">Engagement Rate (%)</Label>
                <Input
                  id="engagement_rate"
                  type="number"
                  step="0.1"
                  value={formData.engagement_rate}
                  onChange={(e) => setFormData({ ...formData, engagement_rate: parseFloat(e.target.value) || 0 })}
                  placeholder="5.2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="average_views_monthly">Average Monthly Views</Label>
                <Input
                  id="average_views_monthly"
                  type="number"
                  value={formData.average_views_monthly}
                  onChange={(e) => setFormData({ ...formData, average_views_monthly: parseInt(e.target.value) || 0 })}
                  placeholder="1200000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_post_views">Last Post Views</Label>
                <Input
                  id="last_post_views"
                  type="number"
                  value={formData.last_post_views}
                  onChange={(e) => setFormData({ ...formData, last_post_views: parseInt(e.target.value) || 0 })}
                  placeholder="85000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_post_engagement">Last Post Engagement</Label>
                <Input
                  id="last_post_engagement"
                  type="number"
                  value={formData.last_post_engagement}
                  onChange={(e) => setFormData({ ...formData, last_post_engagement: parseInt(e.target.value) || 0 })}
                  placeholder="5200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_post_date">Last Post Date</Label>
                <Input
                  id="last_post_date"
                  type="date"
                  value={formData.last_post_date}
                  onChange={(e) => setFormData({ ...formData, last_post_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_per_post">Price Per Post ($)</Label>
                <Input
                  id="price_per_post"
                  type="number"
                  value={formData.price_per_post}
                  onChange={(e) => setFormData({ ...formData, price_per_post: parseInt(e.target.value) || 0 })}
                  placeholder="1800"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Languages */}
        <Card>
          <CardHeader>
            <CardTitle>Languages</CardTitle>
            <CardDescription>Languages you speak or create content in</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {formData.languages.map((lang) => (
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
                onKeyPress={(e) => e.key === "Enter" && addLanguage()}
              />
              <Button onClick={addLanguage} size="sm" type="button">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Platforms */}
        <Card>
          <CardHeader>
            <CardTitle>Platforms</CardTitle>
            <CardDescription>Social media platforms you're active on</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {formData.platforms.map((platform) => (
                <Badge key={platform} variant="secondary" className="flex items-center gap-1 bg-orange-100 text-orange-800">
                  {platform}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removePlatform(platform)} />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value)}
                placeholder="Add a platform..."
                onKeyPress={(e) => e.key === "Enter" && addPlatform()}
              />
              <Button onClick={addPlatform} size="sm" type="button">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Brands Worked With */}
        <Card>
          <CardHeader>
            <CardTitle>Brands Worked With</CardTitle>
            <CardDescription>Brands you've collaborated with in the past</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {formData.brands_worked_with.map((brand) => (
                <Badge key={brand} variant="secondary" className="flex items-center gap-1 bg-orange-100 text-orange-800">
                  {brand}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeBrand(brand)} />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                placeholder="Add a brand..."
                onKeyPress={(e) => e.key === "Enter" && addBrand()}
              />
              <Button onClick={addBrand} size="sm" type="button">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} size="lg" className="bg-orange-600 hover:bg-orange-700">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                Save Profile
              </>
            )}
          </Button>
        </div>
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

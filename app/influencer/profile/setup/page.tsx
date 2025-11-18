"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { PortalLayout } from "@/components/portal-layout"
import { InfluencerSidebar } from "@/components/influencer-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, Plus, X, Instagram, CheckCircle, AlertCircle } from "lucide-react"
import { ProfileSetupFormData } from "@/lib/types/influencer"

// Country list (you can expand this)
const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "India", "Germany", "France",
  "Spain", "Italy", "Brazil", "Mexico", "Japan", "South Korea", "China", "Other"
]

// Language list (you can expand this)
const LANGUAGES = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese", "Mandarin",
  "Japanese", "Korean", "Hindi", "Arabic", "Russian", "Other"
]

export default function InfluencerProfileSetup() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, update } = useSession()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasInstagram, setHasInstagram] = useState(false)

  const [formData, setFormData] = useState<ProfileSetupFormData>({
    name: "",
    category: "",
    bio: "",
    country: "",
    city: "",
    languages: [],
    email: "",
    brand_preferences: [],
  })

  const [newLanguage, setNewLanguage] = useState("")
  const [newBrandPref, setNewBrandPref] = useState("")

  useEffect(() => {
    fetchProfile()

    // Check for success/error messages
    const success = searchParams.get("success")
    const error = searchParams.get("error")

    if (success) {
      toast({
        title: "Success",
        description: success,
      })
      router.replace("/influencer/profile/setup")
    }

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
      router.replace("/influencer/profile/setup")
    }
  }, [searchParams])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/influencer/profile-setup")
      const data = await response.json()

      if (data.success && data.data.profile) {
        const profile = data.data.profile
        setFormData({
          name: profile.basic_info?.name || "",
          category: profile.basic_info?.category || "",
          bio: profile.basic_info?.bio || "",
          country: profile.basic_info?.country || "",
          city: profile.basic_info?.city || "",
          languages: profile.basic_info?.languages || [],
          email: profile.basic_info?.email || session?.user?.email || "",
          brand_preferences: profile.basic_info?.brand_preferences || [],
        })
        setHasInstagram(data.data.hasInstagram)
      } else {
        // Pre-fill email from session
        setFormData((prev) => ({
          ...prev,
          email: session?.user?.email || "",
        }))
      }
    } catch (err) {
      console.error("Error fetching profile:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      // Validate required fields
      if (!formData.name || !formData.category || !formData.bio ||
          !formData.country || !formData.city || formData.languages.length === 0 ||
          !formData.email) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("/api/influencer/profile-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to save profile")
      }

      toast({
        title: "Success",
        description: "Profile saved successfully!",
      })

      // Update session if needed
      await update()
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

  const addBrandPref = () => {
    if (newBrandPref && !formData.brand_preferences.includes(newBrandPref)) {
      setFormData({
        ...formData,
        brand_preferences: [...formData.brand_preferences, newBrandPref],
      })
      setNewBrandPref("")
    }
  }

  const removeBrandPref = (pref: string) => {
    setFormData({
      ...formData,
      brand_preferences: formData.brand_preferences.filter((p) => p !== pref),
    })
  }

  const handleConnectInstagram = () => {
    window.location.href = "/api/meta/auth"
  }

  if (loading) {
    return (
      <PortalLayout
        sidebar={<InfluencerSidebar />}
        title="Profile Setup"
        userRole="Influencer"
        breadcrumbs={[{ label: "Profile Setup" }]}
      >
        <div className="flex items-center justify-center h-64">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE - FORM */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="backdrop-blur-sm bg-white/90 border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-600">Basic Information</CardTitle>
              <CardDescription>Tell us about yourself</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                  className="border-orange-200 focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category (Niche) *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Fashion, Travel, Tech, Fitness"
                  className="border-orange-200 focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio *</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell brands about yourself..."
                  rows={4}
                  className="border-orange-200 focus:border-orange-500"
                />
                <p className="text-xs text-gray-500">{formData.bio.length}/500 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="border-orange-200 focus:border-orange-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="backdrop-blur-sm bg-white/90 border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-600">Location</CardTitle>
              <CardDescription>Where are you based?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <select
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-orange-200 bg-white px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Your city"
                    className="border-orange-200 focus:border-orange-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card className="backdrop-blur-sm bg-white/90 border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-600">Languages *</CardTitle>
              <CardDescription>What languages do you speak?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <select
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  className="flex h-10 flex-1 rounded-md border border-orange-200 bg-white px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="">Select language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={addLanguage}
                  type="button"
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.languages.map((lang) => (
                  <Badge
                    key={lang}
                    variant="secondary"
                    className="bg-orange-100 text-orange-800 hover:bg-orange-200"
                  >
                    {lang}
                    <X
                      className="ml-2 h-3 w-3 cursor-pointer"
                      onClick={() => removeLanguage(lang)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Brand Preferences */}
          <Card className="backdrop-blur-sm bg-white/90 border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-600">Brand Preferences</CardTitle>
              <CardDescription>What types of brands do you prefer to work with?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newBrandPref}
                  onChange={(e) => setNewBrandPref(e.target.value)}
                  placeholder="e.g., Sustainable brands, Tech companies"
                  className="border-orange-200 focus:border-orange-500"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addBrandPref()
                    }
                  }}
                />
                <Button
                  onClick={addBrandPref}
                  type="button"
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.brand_preferences.map((pref) => (
                  <Badge
                    key={pref}
                    variant="secondary"
                    className="bg-orange-100 text-orange-800 hover:bg-orange-200"
                  >
                    {pref}
                    <X
                      className="ml-2 h-3 w-3 cursor-pointer"
                      onClick={() => removeBrandPref(pref)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={saving}
            size="lg"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          >
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

        {/* RIGHT SIDE - INSTAGRAM CONNECTION */}
        <div className="space-y-6">
          <Card className="backdrop-blur-sm bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 sticky top-4">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Instagram className="h-6 w-6 text-purple-600" />
                <CardTitle className="text-purple-600">Instagram Connection</CardTitle>
              </div>
              <CardDescription>
                Connect your Instagram Business account to auto-fill your metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasInstagram ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Instagram Connected</p>
                      <p className="text-sm text-green-700">Your metrics are synced</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => router.push("/influencer/dashboard")}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900 mb-2">Requirements:</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-700">
                        <li>Instagram Business or Creator account</li>
                        <li>Facebook Page linked to Instagram</li>
                        <li>Admin access to the Facebook Page</li>
                      </ul>
                    </div>
                  </div>

                  <Button
                    onClick={handleConnectInstagram}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    size="lg"
                  >
                    <Instagram className="mr-2 h-5 w-5" />
                    Connect Instagram
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    We'll fetch your followers, engagement, demographics, and post metrics
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="backdrop-blur-sm bg-white/90 border-orange-200">
            <CardHeader>
              <CardTitle className="text-sm text-orange-600">Tips for Success</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">•</span>
                  <span>Complete your profile to increase brand visibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">•</span>
                  <span>Connect Instagram to auto-sync your metrics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">•</span>
                  <span>Be specific about your niche and preferences</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5">•</span>
                  <span>Keep your bio professional and engaging</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  )
}

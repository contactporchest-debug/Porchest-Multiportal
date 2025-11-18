"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Building2, CheckCircle2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ProfileFormData {
  brand_name: string
  contact_email: string
  representative_name: string
  niche: string
  location: string
  website_url: string
  brand_logo: string
  description: string
}

export default function BrandProfileSetupPage() {
  const [formData, setFormData] = useState<ProfileFormData>({
    brand_name: "",
    contact_email: "",
    representative_name: "",
    niche: "",
    location: "",
    website_url: "",
    brand_logo: "",
    description: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    checkProfileStatus()
  }, [])

  const checkProfileStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/brand/profile")
      const data = await response.json()

      if (data.success && data.data.profile) {
        const profile = data.data.profile

        // If profile is already completed, redirect to dashboard
        if (profile.profile_completed) {
          router.push("/brand")
          return
        }

        // Prefill form with existing data
        setFormData({
          brand_name: profile.brand_name || "",
          contact_email: profile.contact_email || "",
          representative_name: profile.representative_name || "",
          niche: profile.niche || "",
          location: profile.location || "",
          website_url: profile.website_url || "",
          brand_logo: profile.brand_logo || "",
          description: profile.description || "",
        })
      }
    } catch (err) {
      console.error("Error checking profile status:", err)
      setError("Failed to load profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const response = await fetch("/api/brand/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to save profile")
      }

      if (data.success) {
        toast({
          title: "Success",
          description: "Profile setup completed successfully!",
        })

        // Redirect to brand dashboard
        setTimeout(() => {
          router.push("/brand")
        }, 1000)
      } else {
        throw new Error(data.error?.message || "Failed to save profile")
      }
    } catch (err: any) {
      setError(err.message || "Failed to save profile. Please try again.")
      toast({
        title: "Error",
        description: err.message || "Failed to save profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-slate-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-slate-100 p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-100 p-4 rounded-full">
              <Building2 className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Complete Your Brand Profile
          </CardTitle>
          <CardDescription className="text-slate-600">
            Please provide the following information to set up your brand profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Brand Name & Representative */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="brand_name">
                  Brand Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="brand_name"
                  type="text"
                  value={formData.brand_name}
                  onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                  placeholder="Enter your brand name"
                  required
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="representative_name">
                  Representative Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="representative_name"
                  type="text"
                  value={formData.representative_name}
                  onChange={(e) => setFormData({ ...formData, representative_name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                  disabled={saving}
                />
              </div>
            </div>

            {/* Contact Email */}
            <div className="space-y-2">
              <Label htmlFor="contact_email">
                Contact Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                placeholder="contact@yourbrand.com"
                required
                disabled={saving}
              />
            </div>

            {/* Niche & Location */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="niche">
                  Niche/Industry <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="niche"
                  type="text"
                  value={formData.niche}
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                  placeholder="e.g., Fashion, Tech, Beauty"
                  required
                  disabled={saving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City, Country"
                  required
                  disabled={saving}
                />
              </div>
            </div>

            {/* Optional Fields */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-slate-700 mb-4">
                Optional Information
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="website_url">Website URL</Label>
                  <Input
                    id="website_url"
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                    placeholder="https://yourbrand.com"
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand_logo">Brand Logo URL</Label>
                  <Input
                    id="brand_logo"
                    type="url"
                    value={formData.brand_logo}
                    onChange={(e) => setFormData({ ...formData, brand_logo: e.target.value })}
                    placeholder="https://yourbrand.com/logo.png"
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="description">Brand Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell us about your brand..."
                  rows={4}
                  disabled={saving}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                className="w-full md:w-auto px-8"
                disabled={saving}
                size="lg"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Setting up profile...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Complete Profile Setup
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            <p>After completing your profile, you'll have access to the full brand dashboard.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

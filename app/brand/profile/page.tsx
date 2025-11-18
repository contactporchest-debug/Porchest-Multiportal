"use client"

import { useEffect, useState } from "react"
import { PortalLayout } from "@/components/portal-layout"
import { BrandSidebar } from "@/components/brand-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, Save, Building2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface BrandProfile {
  _id?: string
  user_id?: string
  brand_id?: string
  brand_name?: string
  contact_email?: string
  representative_name?: string
  niche?: string
  industry?: string
  location?: string
  website?: string
  company_description?: string
  preferred_platforms?: string[]
  active_campaigns?: any[]
  profile_completed?: boolean
}

export default function BrandProfilePage() {
  const [profile, setProfile] = useState<BrandProfile>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/brand/profile")
      const data = await response.json()

      if (data.success) {
        setProfile(data.data.profile || {})
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
      const response = await fetch("/api/brand/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand_name: profile.brand_name,
          contact_email: profile.contact_email,
          representative_name: profile.representative_name,
          niche: profile.niche,
          industry: profile.industry,
          location: profile.location,
          website: profile.website,
          company_description: profile.company_description,
          preferred_platforms: profile.preferred_platforms,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
        fetchProfile()
      } else {
        throw new Error(data.error || "Failed to update profile")
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <PortalLayout
        sidebar={<BrandSidebar />}
        title="Brand Profile"
        userRole="Brand"
        breadcrumbs={[{ label: "Profile" }]}
      >
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </PortalLayout>
    )
  }

  return (
    <PortalLayout
      sidebar={<BrandSidebar />}
      title="Brand Profile"
      userRole="Brand"
      breadcrumbs={[{ label: "Profile" }]}
    >
      <div className="space-y-6">
        {/* Brand ID Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Brand ID</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-mono font-bold text-orange-600">{profile.brand_id || "N/A"}</div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>Brand Information</CardTitle>
            <CardDescription>Manage your brand profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="brand_name">Brand Name</Label>
                <Input
                  id="brand_name"
                  value={profile.brand_name || ""}
                  onChange={(e) => setProfile({ ...profile, brand_name: e.target.value })}
                  placeholder="Your Brand Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="representative_name">Representative Name</Label>
                <Input
                  id="representative_name"
                  value={profile.representative_name || ""}
                  onChange={(e) => setProfile({ ...profile, representative_name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={profile.contact_email || ""}
                  onChange={(e) => setProfile({ ...profile, contact_email: e.target.value })}
                  placeholder="contact@yourbrand.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="niche">Niche</Label>
                <Input
                  id="niche"
                  value={profile.niche || ""}
                  onChange={(e) => setProfile({ ...profile, niche: e.target.value })}
                  placeholder="e.g., Fashion, Tech, Beauty"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={profile.industry || ""}
                  onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                  placeholder="e.g., Retail, Technology, Services"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profile.location || ""}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder="City, Country"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={profile.website || ""}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  placeholder="https://yourbrand.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_description">Company Description</Label>
              <Textarea
                id="company_description"
                value={profile.company_description || ""}
                onChange={(e) => setProfile({ ...profile, company_description: e.target.value })}
                placeholder="Tell us about your company..."
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Profile
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}

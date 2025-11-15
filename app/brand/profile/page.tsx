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
  company_name?: string
  industry?: string
  website?: string
  logo?: string
  description?: string
  contact_person?: string
  contact_email?: string
  contact_phone?: string
  preferred_influencer_types?: string[]
  target_markets?: string[]
  budget_range?: {
    min: number
    max: number
  }
  total_campaigns?: number
  active_campaigns?: number
  total_spent?: number
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
          company_name: profile.company_name,
          industry: profile.industry,
          website: profile.website,
          logo: profile.logo,
          description: profile.description,
          contact_person: profile.contact_person,
          contact_email: profile.contact_email,
          contact_phone: profile.contact_phone,
          preferred_influencer_types: profile.preferred_influencer_types,
          target_markets: profile.target_markets,
          budget_range: profile.budget_range,
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
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.total_campaigns || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.active_campaigns || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(profile.total_spent || 0).toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Manage your brand profile and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={profile.company_name || ""}
                  onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                  placeholder="Acme Corporation"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={profile.industry || ""}
                  onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                  placeholder="Technology, Fashion, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={profile.website || ""}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  type="url"
                  value={profile.logo || ""}
                  onChange={(e) => setProfile({ ...profile, logo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Company Description</Label>
              <Textarea
                id="description"
                value={profile.description || ""}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                placeholder="Tell us about your company..."
                rows={4}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="contact_person">Contact Person</Label>
                <Input
                  id="contact_person"
                  value={profile.contact_person || ""}
                  onChange={(e) => setProfile({ ...profile, contact_person: e.target.value })}
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
                  placeholder="contact@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  value={profile.contact_phone || ""}
                  onChange={(e) => setProfile({ ...profile, contact_phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="budget_min">Budget Range (Min)</Label>
                <Input
                  id="budget_min"
                  type="number"
                  value={profile.budget_range?.min || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      budget_range: {
                        ...profile.budget_range,
                        min: parseInt(e.target.value) || 0,
                        max: profile.budget_range?.max || 0,
                      },
                    })
                  }
                  placeholder="5000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget_max">Budget Range (Max)</Label>
                <Input
                  id="budget_max"
                  type="number"
                  value={profile.budget_range?.max || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      budget_range: {
                        min: profile.budget_range?.min || 0,
                        max: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="50000"
                />
              </div>
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

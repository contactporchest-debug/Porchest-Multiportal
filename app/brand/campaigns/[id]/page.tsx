"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { PortalLayout } from "@/components/portal-layout"
import { BrandSidebar } from "@/components/brand-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Users, Send, TrendingUp, DollarSign, Target } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Campaign {
  _id: string
  name: string
  description?: string
  status: string
  budget: number
  spent_amount: number
  metrics: {
    total_reach: number
    total_impressions: number
    total_engagement: number
    engagement_rate: number
    estimated_roi: number
  }
}

interface Influencer {
  _id: string
  full_name?: string
  email: string
  total_followers?: number
  avg_engagement_rate?: number
  content_categories?: string[]
}

export default function CampaignDetailPage() {
  const params = useParams()
  const campaignId = params.id as string
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [selectedInfluencers, setSelectedInfluencers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingInfluencers, setLoadingInfluencers] = useState(false)
  const [inviting, setInviting] = useState(false)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const { toast } = useToast()

  const [inviteData, setInviteData] = useState({
    offer_amount: 0,
    deliverables: [] as string[],
    deliverable_input: "",
    message: "",
  })

  useEffect(() => {
    fetchCampaign()
  }, [campaignId])

  const fetchCampaign = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/brand/campaigns/${campaignId}`)
      const data = await response.json()

      if (data.success) {
        setCampaign(data.data.campaign)
      }
    } catch (err) {
      console.error("Error fetching campaign:", err)
      toast({
        title: "Error",
        description: "Failed to load campaign",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchInfluencers = async () => {
    try {
      setLoadingInfluencers(true)
      const response = await fetch("/api/brand/recommend-influencers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
      const data = await response.json()

      if (data.success) {
        setInfluencers(data.data.influencers || [])
      }
    } catch (err) {
      console.error("Error fetching influencers:", err)
    } finally {
      setLoadingInfluencers(false)
    }
  }

  const handleInvite = async () => {
    if (selectedInfluencers.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one influencer",
        variant: "destructive",
      })
      return
    }

    if (!inviteData.offer_amount || inviteData.deliverables.length === 0) {
      toast({
        title: "Error",
        description: "Please provide offer amount and deliverables",
        variant: "destructive",
      })
      return
    }

    try {
      setInviting(true)
      const response = await fetch(`/api/brand/campaigns/${campaignId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          influencer_ids: selectedInfluencers,
          offer_amount: inviteData.offer_amount,
          deliverables: inviteData.deliverables,
          message: inviteData.message,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `Invited ${data.data.invited_count} influencer(s)`,
        })
        setShowInviteDialog(false)
        setSelectedInfluencers([])
        setInviteData({
          offer_amount: 0,
          deliverables: [],
          deliverable_input: "",
          message: "",
        })
      } else {
        throw new Error(data.error || "Failed to send invitations")
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to send invitations",
        variant: "destructive",
      })
    } finally {
      setInviting(false)
    }
  }

  const addDeliverable = () => {
    if (inviteData.deliverable_input.trim()) {
      setInviteData({
        ...inviteData,
        deliverables: [...inviteData.deliverables, inviteData.deliverable_input.trim()],
        deliverable_input: "",
      })
    }
  }

  const removeDeliverable = (index: number) => {
    setInviteData({
      ...inviteData,
      deliverables: inviteData.deliverables.filter((_, i) => i !== index),
    })
  }

  if (loading || !campaign) {
    return (
      <PortalLayout
        sidebar={<BrandSidebar />}
        title="Campaign Details"
        userRole="Brand"
        breadcrumbs={[{ label: "Campaigns", href: "/brand/campaigns" }, { label: "Details" }]}
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
      title={campaign.name}
      userRole="Brand"
      breadcrumbs={[{ label: "Campaigns", href: "/brand/campaigns" }, { label: campaign.name }]}
    >
      <div className="space-y-6">
        {/* Campaign Info */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${campaign.budget.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                ${campaign.spent_amount.toLocaleString()} spent
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {campaign.metrics.total_reach.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROI</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {campaign.metrics.estimated_roi.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invite Influencers Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Invite Influencers</CardTitle>
                <CardDescription>Find and invite influencers to your campaign</CardDescription>
              </div>
              <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                <DialogTrigger asChild>
                  <Button onClick={fetchInfluencers} disabled={selectedInfluencers.length === 0}>
                    <Send className="mr-2 h-4 w-4" />
                    Send Invitations ({selectedInfluencers.length})
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Send Campaign Invitations</DialogTitle>
                    <DialogDescription>
                      Configure your offer for the selected {selectedInfluencers.length} influencer(s)
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="offer_amount">Offer Amount ($)</Label>
                      <Input
                        id="offer_amount"
                        type="number"
                        value={inviteData.offer_amount}
                        onChange={(e) =>
                          setInviteData({
                            ...inviteData,
                            offer_amount: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Deliverables</Label>
                      <div className="flex gap-2">
                        <Input
                          value={inviteData.deliverable_input}
                          onChange={(e) =>
                            setInviteData({ ...inviteData, deliverable_input: e.target.value })
                          }
                          placeholder="e.g., 1 Instagram post"
                          onKeyPress={(e) => e.key === "Enter" && addDeliverable()}
                        />
                        <Button type="button" onClick={addDeliverable}>
                          Add
                        </Button>
                      </div>
                      <div className="space-y-1 mt-2">
                        {inviteData.deliverables.map((deliverable, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-muted p-2 rounded"
                          >
                            <span className="text-sm">{deliverable}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDeliverable(index)}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message (Optional)</Label>
                      <Textarea
                        id="message"
                        value={inviteData.message}
                        onChange={(e) => setInviteData({ ...inviteData, message: e.target.value })}
                        placeholder="Personalize your invitation..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleInvite} disabled={inviting}>
                      {inviting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Invitations
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {!influencers.length && (
              <Button onClick={fetchInfluencers} disabled={loadingInfluencers}>
                {loadingInfluencers ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading Influencers...
                  </>
                ) : (
                  <>
                    <Users className="mr-2 h-4 w-4" />
                    Load Recommended Influencers
                  </>
                )}
              </Button>
            )}

            {influencers.length > 0 && (
              <div className="space-y-2">
                {influencers.slice(0, 10).map((influencer) => (
                  <div
                    key={influencer._id}
                    className="flex items-center justify-between border rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedInfluencers.includes(influencer._id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedInfluencers([...selectedInfluencers, influencer._id])
                          } else {
                            setSelectedInfluencers(
                              selectedInfluencers.filter((id) => id !== influencer._id)
                            )
                          }
                        }}
                      />
                      <div>
                        <div className="font-medium">
                          {influencer.full_name || influencer.email}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {influencer.total_followers?.toLocaleString() || 0} followers •{" "}
                          {influencer.avg_engagement_rate?.toFixed(2) || 0}% engagement
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {influencer.content_categories?.slice(0, 3).map((cat, i) => (
                        <Badge key={i} variant="outline">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}

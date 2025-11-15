"use client"

import { useState } from "react"
import { PortalLayout } from "@/components/portal-layout"
import { BrandSidebar } from "@/components/brand-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Calendar, Users, DollarSign, TrendingUp, Eye, Edit, Trash2 } from "lucide-react"

// Mock data for campaigns
const mockCampaigns = {
  active: [
    {
      id: 1,
      title: "Summer Fashion Launch",
      description: "Promote our new summer collection with lifestyle influencers",
      status: "Active",
      budget: 15000,
      spent: 8500,
      influencers: 12,
      targetInfluencers: 15,
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      engagement: 145000,
      reach: 2500000,
    },
    {
      id: 2,
      title: "Tech Product Review",
      description: "Get authentic reviews from tech YouTubers",
      status: "Active",
      budget: 25000,
      spent: 12000,
      influencers: 8,
      targetInfluencers: 10,
      startDate: "2024-07-01",
      endDate: "2024-09-30",
      engagement: 89000,
      reach: 1800000,
    },
  ],
  draft: [
    {
      id: 3,
      title: "Holiday Season Campaign",
      description: "Plan ahead for Q4 holiday marketing",
      status: "Draft",
      budget: 50000,
      spent: 0,
      influencers: 0,
      targetInfluencers: 25,
      startDate: "2024-11-01",
      endDate: "2024-12-31",
      engagement: 0,
      reach: 0,
    },
  ],
  completed: [
    {
      id: 4,
      title: "Spring Product Launch",
      description: "Successfully launched spring collection",
      status: "Completed",
      budget: 20000,
      spent: 19500,
      influencers: 15,
      targetInfluencers: 15,
      startDate: "2024-03-01",
      endDate: "2024-05-31",
      engagement: 250000,
      reach: 4200000,
    },
  ],
}

export default function CampaignsPage() {
  const [selectedTab, setSelectedTab] = useState("active")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500"
      case "draft":
        return "bg-yellow-500"
      case "completed":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const renderCampaignCard = (campaign: any) => (
    <Card key={campaign.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">{campaign.title}</CardTitle>
            <CardDescription className="mt-1">{campaign.description}</CardDescription>
          </div>
          <Badge className={`${getStatusColor(campaign.status)} text-white`}>{campaign.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Campaign Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              Budget
            </p>
            <p className="text-lg font-semibold">${campaign.budget.toLocaleString()}</p>
            {campaign.status === "Active" && (
              <p className="text-xs text-muted-foreground">Spent: ${campaign.spent.toLocaleString()}</p>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Users className="h-4 w-4" />
              Influencers
            </p>
            <p className="text-lg font-semibold">
              {campaign.influencers}/{campaign.targetInfluencers}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Engagement
            </p>
            <p className="text-lg font-semibold">{campaign.engagement.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Eye className="h-4 w-4" />
              Reach
            </p>
            <p className="text-lg font-semibold">{campaign.reach.toLocaleString()}</p>
          </div>
        </div>

        {/* Progress Bar for Active Campaigns */}
        {campaign.status === "Active" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Campaign Progress</span>
              <span className="font-medium">
                {Math.round((campaign.influencers / campaign.targetInfluencers) * 100)}%
              </span>
            </div>
            <Progress value={(campaign.influencers / campaign.targetInfluencers) * 100} className="h-2" />
          </div>
        )}

        {/* Dates */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {campaign.startDate} - {campaign.endDate}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          {campaign.status === "Draft" && (
            <Button variant="outline" size="sm" className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <PortalLayout
      sidebar={<BrandSidebar />}
      title="Campaign Management"
      userRole="Brand Manager"
      breadcrumbs={[{ label: "Dashboard", href: "/brand" }, { label: "Campaigns" }]}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Campaigns</h2>
            <p className="text-muted-foreground">Manage and track your influencer marketing campaigns</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Campaign</DialogTitle>
                <DialogDescription>Set up a new influencer marketing campaign</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Campaign Title</Label>
                  <Input id="title" placeholder="e.g., Summer Product Launch" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe your campaign goals and requirements..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget ($)</Label>
                    <Input id="budget" type="number" placeholder="25000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="influencers">Target Influencers</Label>
                    <Input id="influencers" type="number" placeholder="10" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" type="date" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>Create Campaign</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Campaign Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="active">
              Active ({mockCampaigns.active.length})
            </TabsTrigger>
            <TabsTrigger value="draft">
              Draft ({mockCampaigns.draft.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({mockCampaigns.completed.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4 mt-6">
            {mockCampaigns.active.length > 0 ? (
              <div className="grid gap-4">
                {mockCampaigns.active.map(renderCampaignCard)}
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No active campaigns</h3>
                    <p className="text-muted-foreground">Create a new campaign to get started</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="draft" className="space-y-4 mt-6">
            {mockCampaigns.draft.length > 0 ? (
              <div className="grid gap-4">
                {mockCampaigns.draft.map(renderCampaignCard)}
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Edit className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No draft campaigns</h3>
                    <p className="text-muted-foreground">Draft campaigns will appear here</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-6">
            {mockCampaigns.completed.length > 0 ? (
              <div className="grid gap-4">
                {mockCampaigns.completed.map(renderCampaignCard)}
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No completed campaigns</h3>
                    <p className="text-muted-foreground">Completed campaigns will appear here</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  )
}

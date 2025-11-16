"use client"

import { useState } from "react"
import { PortalLayout } from "@/components/portal-layout"
import { InfluencerSidebar } from "@/components/influencer-sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  CheckCircle,
  Clock,
  XCircle,
  Link as LinkIcon,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Plus,
} from "lucide-react"

// Sample post verification data
const verificationRequests = [
  {
    id: "1",
    postUrl: "https://instagram.com/p/abc123",
    platform: "Instagram",
    campaign: "Summer Fashion Collection",
    brand: "Fashion Forward",
    submittedDate: "2025-06-15",
    status: "approved",
    views: 125000,
    likes: 8500,
    comments: 420,
    shares: 180,
  },
  {
    id: "2",
    postUrl: "https://youtube.com/watch?v=xyz789",
    platform: "YouTube",
    campaign: "Tech Product Review",
    brand: "TechGear Pro",
    submittedDate: "2025-06-18",
    status: "pending",
    views: 45000,
    likes: 2800,
    comments: 150,
    shares: 90,
  },
  {
    id: "3",
    postUrl: "https://instagram.com/p/def456",
    platform: "Instagram",
    campaign: "Wellness Challenge",
    brand: "Wellness Co",
    submittedDate: "2025-06-12",
    status: "rejected",
    views: 98000,
    likes: 6200,
    comments: 310,
    shares: 145,
    rejectionReason: "Post does not meet brand guidelines - missing required hashtags",
  },
  {
    id: "4",
    postUrl: "https://tiktok.com/@user/video/123",
    platform: "TikTok",
    campaign: "Beauty Essentials",
    brand: "Beauty Essentials",
    submittedDate: "2025-06-20",
    status: "pending",
    views: 215000,
    likes: 18500,
    comments: 890,
    shares: 420,
  },
]

// Post performance data for charts
const postPerformanceData = [
  { date: "Day 1", views: 5000, likes: 350, comments: 45 },
  { date: "Day 2", views: 12000, likes: 850, comments: 98 },
  { date: "Day 3", views: 25000, likes: 1800, comments: 185 },
  { date: "Day 4", views: 45000, likes: 3200, comments: 280 },
  { date: "Day 5", views: 68000, likes: 4800, comments: 350 },
  { date: "Day 6", views: 92000, likes: 6500, comments: 395 },
  { date: "Day 7", views: 125000, likes: 8500, comments: 420 },
]

const engagementData = [
  { metric: "Likes", count: 8500 },
  { metric: "Comments", count: 420 },
  { metric: "Shares", count: 180 },
  { metric: "Saves", count: 950 },
]

export default function PostVerification() {
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [newPostUrl, setNewPostUrl] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState("")
  const [selectedCampaign, setSelectedCampaign] = useState("")
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-500">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-500">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleSubmitPost = () => {
    // TODO: Implement API call to submit post for verification
    setNewPostUrl("")
    setSelectedPlatform("")
    setSelectedCampaign("")
    setShowSubmitDialog(false)
  }

  return (
    <PortalLayout
      sidebar={<InfluencerSidebar />}
      title="Post Verification"
      userRole="Influencer"
      breadcrumbs={[{ label: "Dashboard", href: "/influencer" }, { label: "Post Verification" }]}
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Submit New Post Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Submit Post for Verification</CardTitle>
                <CardDescription>Submit your campaign posts to get verified by brands</CardDescription>
              </div>
              <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Post
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit Post for Verification</DialogTitle>
                    <DialogDescription>
                      Add your post URL and campaign details for admin verification
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="campaign">Campaign</Label>
                      <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                        <SelectTrigger id="campaign">
                          <SelectValue placeholder="Select campaign" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="summer-fashion">Summer Fashion Collection</SelectItem>
                          <SelectItem value="tech-review">Tech Product Review</SelectItem>
                          <SelectItem value="wellness">Wellness Challenge</SelectItem>
                          <SelectItem value="beauty">Beauty Essentials</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="platform">Platform</Label>
                      <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                        <SelectTrigger id="platform">
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postUrl">Post URL</Label>
                      <Input
                        id="postUrl"
                        placeholder="https://..."
                        value={newPostUrl}
                        onChange={(e) => setNewPostUrl(e.target.value)}
                      />
                    </div>

                    <Button className="w-full" onClick={handleSubmitPost}>
                      Submit for Verification
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
        </Card>

        {/* Verification Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Requests</CardTitle>
            <CardDescription>Track the status of your submitted posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {verificationRequests.map((request) => (
                <Card key={request.id} className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline">{request.platform}</Badge>
                          {getStatusBadge(request.status)}
                        </div>
                        <h4 className="font-semibold text-lg mb-1">{request.campaign}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{request.brand}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <LinkIcon className="h-4 w-4" />
                          <a href={request.postUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                            {request.postUrl}
                          </a>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Submitted on {request.submittedDate}
                        </p>
                        {request.status === "rejected" && request.rejectionReason && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800">
                              <strong>Rejection Reason:</strong> {request.rejectionReason}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPost(request)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View KPIs
                        </Button>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Eye className="h-4 w-4 text-blue-600" />
                          <p className="text-sm font-semibold">{(request.views / 1000).toFixed(0)}K</p>
                        </div>
                        <p className="text-xs text-muted-foreground">Views</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Heart className="h-4 w-4 text-red-600" />
                          <p className="text-sm font-semibold">{(request.likes / 1000).toFixed(1)}K</p>
                        </div>
                        <p className="text-xs text-muted-foreground">Likes</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <MessageCircle className="h-4 w-4 text-green-600" />
                          <p className="text-sm font-semibold">{request.comments}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">Comments</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Share2 className="h-4 w-4 text-purple-600" />
                          <p className="text-sm font-semibold">{request.shares}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">Shares</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Post Performance Charts */}
        {selectedPost && (
          <>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <CardTitle>Post Performance Over Time</CardTitle>
                </div>
                <CardDescription>Track how your post performed over 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={postPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} name="Views" />
                    <Line type="monotone" dataKey="likes" stroke="#ef4444" strokeWidth={2} name="Likes" />
                    <Line type="monotone" dataKey="comments" stroke="#10b981" strokeWidth={2} name="Comments" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Breakdown</CardTitle>
                <CardDescription>Total engagement metrics for this post</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button variant="outline" onClick={() => setSelectedPost(null)}>
                Close KPI View
              </Button>
            </div>
          </>
        )}
      </div>
    </PortalLayout>
  )
}

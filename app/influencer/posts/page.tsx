"use client"

import { useEffect, useState } from "react"
import { PortalLayout } from "@/components/portal-layout"
import { InfluencerSidebar } from "@/components/influencer-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, Plus, ExternalLink, TrendingUp } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

interface Post {
  _id: string
  campaign_id: string
  platform: string
  post_url: string
  post_type: string
  likes: number
  comments: number
  shares: number
  views: number
  engagement_rate: number
  created_at: string
}

interface Collaboration {
  _id: string
  campaign_id: string
  campaign_name?: string
  status: string
}

export default function InfluencerPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [collaborations, setCollaborations] = useState<Collaboration[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const { toast } = useToast()

  const [newPost, setNewPost] = useState({
    campaign_id: "",
    platform: "instagram",
    post_url: "",
    post_type: "image",
    likes: 0,
    comments: 0,
    shares: 0,
    views: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [postsRes, collabsRes] = await Promise.all([
        fetch("/api/influencer/posts"),
        fetch("/api/collaboration"),
      ])

      const [postsData, collabsData] = await Promise.all([
        postsRes.json(),
        collabsRes.json(),
      ])

      if (postsData.success) {
        setPosts(postsData.data.posts || [])
      }

      if (collabsData.success) {
        const accepted = (collabsData.data.collaborations || []).filter(
          (c: Collaboration) => c.status === "accepted"
        )
        setCollaborations(accepted)
      }
    } catch (err) {
      console.error("Error fetching data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!newPost.campaign_id || !newPost.post_url) {
      toast({
        title: "Error",
        description: "Please select a campaign and provide a post URL",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch("/api/influencer/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Post submitted successfully",
        })
        setShowDialog(false)
        setNewPost({
          campaign_id: "",
          platform: "instagram",
          post_url: "",
          post_type: "image",
          likes: 0,
          comments: 0,
          shares: 0,
          views: 0,
        })
        fetchData()
      } else {
        throw new Error(data.error || "Failed to submit post")
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to submit post",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const totalEngagement = posts.reduce(
    (sum, p) => sum + p.likes + p.comments + p.shares,
    0
  )
  const totalViews = posts.reduce((sum, p) => sum + p.views, 0)
  const avgEngagement =
    posts.length > 0
      ? posts.reduce((sum, p) => sum + p.engagement_rate, 0) / posts.length
      : 0

  return (
    <PortalLayout
      sidebar={<InfluencerSidebar />}
      title="My Posts"
      userRole="Influencer"
      breadcrumbs={[{ label: "Posts" }]}
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{posts.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEngagement.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Engagement Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgEngagement.toFixed(2)}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Posts List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Submitted Posts</CardTitle>
                <CardDescription>Track your campaign post submissions and performance</CardDescription>
              </div>
              <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Submit Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Submit New Post</DialogTitle>
                    <DialogDescription>
                      Provide details about your campaign post and its performance metrics
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="campaign">Campaign</Label>
                      <Select
                        value={newPost.campaign_id}
                        onValueChange={(value) =>
                          setNewPost({ ...newPost, campaign_id: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select campaign" />
                        </SelectTrigger>
                        <SelectContent>
                          {collaborations.map((collab) => (
                            <SelectItem key={collab._id} value={collab.campaign_id}>
                              {collab.campaign_name || collab.campaign_id}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="platform">Platform</Label>
                        <Select
                          value={newPost.platform}
                          onValueChange={(value) =>
                            setNewPost({ ...newPost, platform: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="tiktok">TikTok</SelectItem>
                            <SelectItem value="twitter">Twitter</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="post_type">Post Type</Label>
                        <Select
                          value={newPost.post_type}
                          onValueChange={(value) =>
                            setNewPost({ ...newPost, post_type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="story">Story</SelectItem>
                            <SelectItem value="reel">Reel</SelectItem>
                            <SelectItem value="carousel">Carousel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="post_url">Post URL</Label>
                      <Input
                        id="post_url"
                        type="url"
                        value={newPost.post_url}
                        onChange={(e) => setNewPost({ ...newPost, post_url: e.target.value })}
                        placeholder="https://instagram.com/p/..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="views">Views</Label>
                        <Input
                          id="views"
                          type="number"
                          value={newPost.views}
                          onChange={(e) =>
                            setNewPost({ ...newPost, views: parseInt(e.target.value) || 0 })
                          }
                          placeholder="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="likes">Likes</Label>
                        <Input
                          id="likes"
                          type="number"
                          value={newPost.likes}
                          onChange={(e) =>
                            setNewPost({ ...newPost, likes: parseInt(e.target.value) || 0 })
                          }
                          placeholder="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="comments">Comments</Label>
                        <Input
                          id="comments"
                          type="number"
                          value={newPost.comments}
                          onChange={(e) =>
                            setNewPost({ ...newPost, comments: parseInt(e.target.value) || 0 })
                          }
                          placeholder="0"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="shares">Shares</Label>
                        <Input
                          id="shares"
                          type="number"
                          value={newPost.shares}
                          onChange={(e) =>
                            setNewPost({ ...newPost, shares: parseInt(e.target.value) || 0 })
                          }
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSubmit} disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Post"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No posts submitted yet</p>
                <p className="text-sm mt-2">Submit your first post to track performance</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="flex items-center justify-between border rounded-lg p-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{post.platform}</Badge>
                        <Badge variant="secondary">{post.post_type}</Badge>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={post.post_url} target="_blank">
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(post.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-bold">{post.views.toLocaleString()}</div>
                        <div className="text-muted-foreground">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold">{post.likes.toLocaleString()}</div>
                        <div className="text-muted-foreground">Likes</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold">{post.comments.toLocaleString()}</div>
                        <div className="text-muted-foreground">Comments</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold">{post.shares.toLocaleString()}</div>
                        <div className="text-muted-foreground">Shares</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold">{post.engagement_rate.toFixed(2)}%</div>
                        <div className="text-muted-foreground">Engagement</div>
                      </div>
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

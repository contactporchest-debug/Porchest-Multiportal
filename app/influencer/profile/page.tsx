"use client"

import { useState } from "react"
import { PortalLayout } from "@/components/portal-layout"
import { InfluencerSidebar } from "@/components/influencer-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Instagram, Youtube, Twitter, Linkedin, Camera, Save, Plus, X } from "lucide-react"

export default function ProfileManagement() {
  const [bio, setBio] = useState(
    "Fashion enthusiast and lifestyle content creator. Passionate about sustainable fashion and wellness. Collaborating with brands that align with my values.",
  )
  const [niche, setNiche] = useState("fashion")
  const [location, setLocation] = useState("New York, NY")
  const [rate, setRate] = useState("2500")
  const [tags, setTags] = useState(["Fashion", "Lifestyle", "Sustainable", "Wellness"])
  const [newTag, setNewTag] = useState("")

  const socialAccounts = [
    { platform: "Instagram", username: "@sarahjohnson", followers: "125K", connected: true, icon: Instagram },
    { platform: "YouTube", username: "Sarah Johnson", followers: "45K", connected: true, icon: Youtube },
    { platform: "Twitter", username: "@sarahjohnson", followers: "28K", connected: false, icon: Twitter },
    { platform: "LinkedIn", username: "Sarah Johnson", followers: "15K", connected: false, icon: Linkedin },
  ]

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <PortalLayout
      sidebarContent={<InfluencerSidebar />}
      title="Profile Management"
      userRole="Content Creator"
      breadcrumbs={[{ label: "Dashboard", href: "/influencer" }, { label: "Profile Management" }]}
    >
      <div className="space-y-6">
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList>
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="social">Social Accounts</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            {/* Profile Picture & Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your basic profile information and bio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Camera className="mr-2 h-4 w-4" />
                      Change Photo
                    </Button>
                    <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="Sarah Johnson" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue="@sarahjohnson" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="sarah@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="niche">Primary Niche</Label>
                    <Select value={niche} onValueChange={setNiche}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fashion">Fashion</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="tech">Tech</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    placeholder="Tell brands about yourself and your content style..."
                  />
                  <p className="text-xs text-muted-foreground">{bio.length}/500 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rate">Base Rate (per post)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                    <Input
                      id="rate"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      className="pl-8"
                      placeholder="2500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Content Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === "Enter" && addTag()}
                    />
                    <Button onClick={addTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Accounts</CardTitle>
                <CardDescription>Connect your social media accounts to showcase your reach</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {socialAccounts.map((account) => (
                  <div key={account.platform} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <account.icon className="h-8 w-8" />
                      <div>
                        <h3 className="font-semibold">{account.platform}</h3>
                        <p className="text-sm text-muted-foreground">
                          {account.connected ? account.username : "Not connected"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {account.connected && (
                        <div className="text-right">
                          <p className="font-semibold">{account.followers}</p>
                          <p className="text-xs text-muted-foreground">followers</p>
                        </div>
                      )}
                      <Button variant={account.connected ? "outline" : "default"} size="sm">
                        {account.connected ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Portfolio</CardTitle>
                <CardDescription>Showcase your best work to attract brands</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    </div>
                  ))}
                </div>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Content
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Collaboration Preferences</CardTitle>
                <CardDescription>Set your preferences for brand collaborations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive emails about new collaboration requests</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-Accept Requests</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically accept requests from verified brands
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Public Profile</Label>
                      <p className="text-sm text-muted-foreground">Make your profile visible to brands</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Minimum Campaign Budget</Label>
                  <Select defaultValue="1000">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="500">$500+</SelectItem>
                      <SelectItem value="1000">$1,000+</SelectItem>
                      <SelectItem value="2500">$2,500+</SelectItem>
                      <SelectItem value="5000">$5,000+</SelectItem>
                      <SelectItem value="10000">$10,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  )
}

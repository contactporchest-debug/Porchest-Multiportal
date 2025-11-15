"use client"

import { useState } from "react"
import { PortalLayout } from "@/components/portal-layout"
import { BrandSidebar } from "@/components/brand-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { mockInfluencers } from "@/lib/mock-data"
import { Search, Filter, MapPin, Users, TrendingUp, Verified } from "lucide-react"

export default function InfluencerSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNiche, setSelectedNiche] = useState("all")
  const [followersRange, setFollowersRange] = useState([10000])
  const [engagementRange, setEngagementRange] = useState([3])

  const filteredInfluencers = mockInfluencers.filter((influencer) => {
    const matchesSearch =
      influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      influencer.username.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesNiche = selectedNiche === "all" || influencer.niche.toLowerCase() === selectedNiche.toLowerCase()
    const matchesFollowers = influencer.followers >= followersRange[0]
    const matchesEngagement = influencer.engagement >= engagementRange[0]

    return matchesSearch && matchesNiche && matchesFollowers && matchesEngagement
  })

  return (
    <PortalLayout
      sidebar={<BrandSidebar />}
      title="Influencer Search"
      userRole="Brand Manager"
      breadcrumbs={[{ label: "Dashboard", href: "/brand" }, { label: "Influencer Search" }]}
    >
      <div className="space-y-6">
        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search Filters
            </CardTitle>
            <CardDescription>Find the perfect influencers for your campaign</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search by name or username</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search influencers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-48">
                <Label htmlFor="niche">Niche</Label>
                <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select niche" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Niches</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="tech">Tech</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Minimum Followers: {followersRange[0].toLocaleString()}</Label>
                <Slider
                  value={followersRange}
                  onValueChange={setFollowersRange}
                  max={500000}
                  min={1000}
                  step={5000}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label>Minimum Engagement Rate: {engagementRange[0]}%</Label>
                <Slider
                  value={engagementRange}
                  onValueChange={setEngagementRange}
                  max={10}
                  min={1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>{filteredInfluencers.length} influencers found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {filteredInfluencers.map((influencer) => (
                <div
                  key={influencer.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={influencer.avatar || "/placeholder.svg"} alt={influencer.name} />
                      <AvatarFallback>
                        {influencer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{influencer.name}</h3>
                        {influencer.verified && <Verified className="h-4 w-4 text-blue-500" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{influencer.username}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {influencer.followers.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {influencer.engagement}%
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {influencer.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge variant="secondary">{influencer.niche}</Badge>
                      <p className="text-sm font-medium mt-1">${influencer.rate}/post</p>
                    </div>
                    <Button>Contact</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}

"use client"

import { PortalLayout } from "@/components/portal-layout"
import { BrandSidebar } from "@/components/brand-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { TrendingUp, TrendingDown, Eye, Heart, Share2, Download } from "lucide-react"

const engagementData = [
  { date: "Jan 1", likes: 1200, comments: 89, shares: 45, saves: 67 },
  { date: "Jan 8", likes: 1450, comments: 102, shares: 52, saves: 78 },
  { date: "Jan 15", likes: 1680, comments: 125, shares: 68, saves: 89 },
  { date: "Jan 22", likes: 1520, comments: 98, shares: 55, saves: 72 },
  { date: "Jan 29", likes: 1890, comments: 145, shares: 78, saves: 95 },
  { date: "Feb 5", likes: 2100, comments: 167, shares: 89, saves: 112 },
]

const reachData = [
  { date: "Week 1", organic: 45000, paid: 25000, total: 70000 },
  { date: "Week 2", organic: 52000, paid: 28000, total: 80000 },
  { date: "Week 3", organic: 48000, paid: 32000, total: 80000 },
  { date: "Week 4", organic: 58000, paid: 35000, total: 93000 },
]

const campaignPerformance = [
  { campaign: "Summer Fashion", reach: 450000, engagement: 18500, conversions: 1250, roi: 285 },
  { campaign: "Tech Review", reach: 280000, engagement: 12300, conversions: 890, roi: 195 },
  { campaign: "Lifestyle Brand", reach: 320000, engagement: 15600, conversions: 1100, roi: 220 },
]

export default function Analytics() {
  return (
    <PortalLayout
      sidebarContent={<BrandSidebar />}
      title="Analytics Dashboard"
      userRole="Brand Manager"
      breadcrumbs={[{ label: "Dashboard", href: "/brand" }, { label: "Analytics" }]}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Campaign Analytics</h2>
            <p className="text-muted-foreground">Detailed insights into your campaign performance</p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="30days">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4M</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                +12.5% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                +0.3% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversions</CardTitle>
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,240</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                -2.1% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average ROI</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">233%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                +18.2% from last month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="engagement" className="space-y-4">
          <TabsList>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="reach">Reach & Impressions</TabsTrigger>
            <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
          </TabsList>

          <TabsContent value="engagement" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Trends</CardTitle>
                <CardDescription>Track likes, comments, shares, and saves over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="likes" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="comments" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="shares" stackId="1" stroke="#ffc658" fill="#ffc658" />
                    <Area type="monotone" dataKey="saves" stackId="1" stroke="#ff7300" fill="#ff7300" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reach" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reach & Impressions</CardTitle>
                <CardDescription>Organic vs paid reach performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={reachData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="organic" fill="hsl(var(--primary))" />
                    <Bar dataKey="paid" fill="hsl(var(--secondary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance Comparison</CardTitle>
                <CardDescription>Compare key metrics across your campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaignPerformance.map((campaign, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h3 className="font-semibold">{campaign.campaign}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Reach: {campaign.reach.toLocaleString()}</span>
                          <span>Engagement: {campaign.engagement.toLocaleString()}</span>
                          <span>Conversions: {campaign.conversions.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={campaign.roi > 200 ? "default" : "secondary"}>{campaign.roi}% ROI</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demographics" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Age Distribution</CardTitle>
                  <CardDescription>Audience age breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">18-24</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="w-3/4 h-full bg-primary rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">35%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">25-34</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="w-2/3 h-full bg-primary rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">28%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">35-44</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="w-1/2 h-full bg-primary rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">22%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">45+</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="w-1/3 h-full bg-primary rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">15%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Locations</CardTitle>
                  <CardDescription>Geographic distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { country: "United States", percentage: 42 },
                      { country: "United Kingdom", percentage: 18 },
                      { country: "Canada", percentage: 12 },
                      { country: "Australia", percentage: 8 },
                      { country: "Germany", percentage: 6 },
                    ].map((location, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{location.country}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${location.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{location.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  )
}

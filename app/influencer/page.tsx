"use client"

import { PortalLayout } from "@/components/portal-layout"
import { InfluencerSidebar } from "@/components/influencer-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { DollarSign, Users, Heart, Calendar, Star, Award, Target } from "lucide-react"

const earningsData = [
  { month: "Jan", earnings: 2400, campaigns: 3 },
  { month: "Feb", earnings: 3200, campaigns: 4 },
  { month: "Mar", earnings: 2800, campaigns: 3 },
  { month: "Apr", earnings: 4100, campaigns: 5 },
  { month: "May", earnings: 3600, campaigns: 4 },
  { month: "Jun", earnings: 4800, campaigns: 6 },
]

const engagementData = [
  { name: "Likes", value: 45, color: "#FF6B6B" },
  { name: "Comments", value: 25, color: "#4ECDC4" },
  { name: "Shares", value: 20, color: "#45B7D1" },
  { name: "Saves", value: 10, color: "#96CEB4" },
]

const recentCollaborations = [
  {
    id: 1,
    brand: "Fashion Forward",
    campaign: "Summer Collection Launch",
    status: "Active",
    payment: 2500,
    deadline: "2024-07-20",
    deliverables: "3 Instagram posts, 2 Stories",
  },
  {
    id: 2,
    brand: "TechGear Pro",
    campaign: "Product Review Series",
    status: "Completed",
    payment: 1800,
    deadline: "2024-06-15",
    deliverables: "1 YouTube video, 5 Instagram posts",
  },
  {
    id: 3,
    brand: "Wellness Co",
    campaign: "Health & Fitness Challenge",
    status: "Pending",
    payment: 3200,
    deadline: "2024-08-01",
    deliverables: "4 Instagram posts, 1 Reel",
  },
]

export default function InfluencerDashboard() {
  return (
    <PortalLayout
      sidebar={<InfluencerSidebar />}
      title="Influencer Dashboard"
      userRole="Content Creator"
      breadcrumbs={[{ label: "Dashboard" }]}
    >
      <div className="space-y-6">
        {/* Profile Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile" />
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">Sarah Johnson</h2>
                  <Badge variant="secondary">Fashion & Lifestyle</Badge>
                </div>
                <p className="text-muted-foreground">@sarahjohnson • 125K followers</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>4.8 Rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-blue-500" />
                    <span>Top Creator</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4 text-green-500" />
                    <span>98% Completion Rate</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$4,800</div>
              <p className="text-xs text-muted-foreground">+33% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">2 ending this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2%</div>
              <p className="text-xs text-muted-foreground">+0.5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">125K</div>
              <p className="text-xs text-muted-foreground">+2.1K this month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Earnings Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
              <CardDescription>Monthly earnings and campaign count</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="earnings" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Engagement Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Breakdown</CardTitle>
              <CardDescription>Distribution of engagement types</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Collaborations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Collaborations</CardTitle>
            <CardDescription>Your latest brand partnerships and campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCollaborations.map((collab) => (
                <div key={collab.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{collab.brand}</h3>
                      <Badge
                        variant={
                          collab.status === "Active"
                            ? "default"
                            : collab.status === "Completed"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {collab.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{collab.campaign}</p>
                    <p className="text-xs text-muted-foreground">{collab.deliverables}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-semibold">${collab.payment.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Due: {collab.deadline}</p>
                    {collab.status === "Active" && (
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    )}
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

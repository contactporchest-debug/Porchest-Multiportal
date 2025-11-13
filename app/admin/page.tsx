"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Users, DollarSign, Shield, Activity, CheckCircle } from "lucide-react"
import PortalLayout from "@/components/portal-layout"
import AdminSidebar from "@/components/admin-sidebar"
import { mockData } from "@/lib/mock-data"

export default function AdminDashboard() {
  const systemStats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalRevenue: 125400,
    systemUptime: 99.8,
    activeCampaigns: 34,
    pendingPayments: 12,
  }

  const userGrowthData = [
    { month: "Jan", brands: 45, influencers: 120, clients: 30 },
    { month: "Feb", brands: 52, influencers: 145, clients: 38 },
    { month: "Mar", brands: 61, influencers: 178, clients: 45 },
    { month: "Apr", brands: 68, influencers: 203, clients: 52 },
    { month: "May", brands: 75, influencers: 234, clients: 61 },
  ]

  const revenueData = [
    { month: "Jan", revenue: 18500, campaigns: 28 },
    { month: "Feb", revenue: 22300, campaigns: 32 },
    { month: "Mar", revenue: 26800, campaigns: 38 },
    { month: "Apr", revenue: 31200, campaigns: 42 },
    { month: "May", revenue: 35400, campaigns: 48 },
  ]

  const userDistribution = [
    { name: "Influencers", value: 234, color: "#f97316" },
    { name: "Brands", value: 75, color: "#1e293b" },
    { name: "Clients", value: 61, color: "#64748b" },
    { name: "Employees", value: 28, color: "#94a3b8" },
  ]

  return (
    <PortalLayout sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">System overview and management controls</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Activity className="h-4 w-4 mr-2" />
              System Health
            </Button>
            <Button size="sm">
              <Shield className="h-4 w-4 mr-2" />
              Security Center
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{systemStats.activeUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">71.5% of total users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${systemStats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+18% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{systemStats.systemUptime}%</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth */}
          <Card>
            <CardHeader>
              <CardTitle>User Growth Trends</CardTitle>
              <CardDescription>Monthly user acquisition by type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="influencers" fill="#f97316" name="Influencers" />
                  <Bar dataKey="brands" fill="#1e293b" name="Brands" />
                  <Bar dataKey="clients" fill="#64748b" name="Clients" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Campaign Analytics</CardTitle>
              <CardDescription>Monthly revenue and campaign performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#f97316" name="Revenue ($)" />
                  <Line yAxisId="right" type="monotone" dataKey="campaigns" stroke="#1e293b" name="Campaigns" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
              <CardDescription>Breakdown by user type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={userDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {userDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Current system status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Server Performance</span>
                  <span>98%</span>
                </div>
                <Progress value={98} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Database Health</span>
                  <span>95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>API Response Time</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Security Score</span>
                  <span>99%</span>
                </div>
                <Progress value={99} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>System notifications and warnings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockData.admin.recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      alert.severity === "high"
                        ? "bg-red-500"
                        : alert.severity === "medium"
                          ? "bg-orange-500"
                          : "bg-green-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                  <Badge
                    variant={
                      alert.severity === "high" ? "destructive" : alert.severity === "medium" ? "default" : "secondary"
                    }
                  >
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  )
}

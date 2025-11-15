"use client"

import { PortalLayout } from "@/components/portal-layout"
import { InfluencerSidebar } from "@/components/influencer-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { DollarSign, TrendingUp, Calendar, Download, CreditCard, Clock, CheckCircle } from "lucide-react"

const monthlyEarnings = [
  { month: "Jan", earnings: 2400, campaigns: 3, avgRate: 800 },
  { month: "Feb", earnings: 3200, campaigns: 4, avgRate: 800 },
  { month: "Mar", earnings: 2800, campaigns: 3, avgRate: 933 },
  { month: "Apr", earnings: 4100, campaigns: 5, avgRate: 820 },
  { month: "May", earnings: 3600, campaigns: 4, avgRate: 900 },
  { month: "Jun", earnings: 4800, campaigns: 6, avgRate: 800 },
]

const earningsByPlatform = [
  { name: "Instagram", value: 65, earnings: 18200, color: "#E1306C" },
  { name: "YouTube", value: 25, earnings: 7000, color: "#FF0000" },
  { name: "TikTok", value: 10, earnings: 2800, color: "#000000" },
]

const recentPayments = [
  {
    id: 1,
    brand: "Fashion Forward",
    campaign: "Summer Collection",
    amount: 2500,
    date: "2024-06-15",
    status: "paid",
    method: "Bank Transfer",
  },
  {
    id: 2,
    brand: "TechGear Pro",
    campaign: "Product Review",
    amount: 1800,
    date: "2024-06-10",
    status: "paid",
    method: "PayPal",
  },
  {
    id: 3,
    brand: "Beauty Essentials",
    campaign: "Skincare Series",
    amount: 2200,
    date: "2024-07-01",
    status: "pending",
    method: "Bank Transfer",
  },
  {
    id: 4,
    brand: "Travel Gear",
    campaign: "Adventure Collection",
    amount: 1900,
    date: "2024-07-15",
    status: "processing",
    method: "PayPal",
  },
]

export default function EarningsDashboard() {
  const totalEarnings = monthlyEarnings.reduce((sum, month) => sum + month.earnings, 0)
  const currentMonthEarnings = monthlyEarnings[monthlyEarnings.length - 1].earnings
  const avgMonthlyEarnings = totalEarnings / monthlyEarnings.length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "processing":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return CheckCircle
      case "pending":
        return Clock
      case "processing":
        return CreditCard
      default:
        return Clock
    }
  }

  return (
    <PortalLayout
      sidebar={<InfluencerSidebar />}
      title="Earnings Dashboard"
      userRole="Content Creator"
      breadcrumbs={[{ label: "Dashboard", href: "/influencer" }, { label: "Earnings" }]}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Earnings Overview</h2>
            <p className="text-muted-foreground">Track your income and payment history</p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="6months">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">Last 3 months</SelectItem>
                <SelectItem value="6months">Last 6 months</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${currentMonthEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+33% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Monthly</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${Math.round(avgMonthlyEarnings).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">6-month average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {recentPayments
                  .filter((p) => p.status !== "paid")
                  .reduce((sum, p) => sum + p.amount, 0)
                  .toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {recentPayments.filter((p) => p.status !== "paid").length} payments
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Monthly Earnings Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Earnings</CardTitle>
                  <CardDescription>Your earnings trend over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyEarnings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="earnings" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Platform Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Earnings by Platform</CardTitle>
                  <CardDescription>Revenue distribution across platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={earningsByPlatform}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {earningsByPlatform.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>Your payment history and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPayments.map((payment) => {
                    const StatusIcon = getStatusIcon(payment.status)
                    return (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <StatusIcon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <h3 className="font-semibold">{payment.brand}</h3>
                            <p className="text-sm text-muted-foreground">{payment.campaign}</p>
                            <p className="text-xs text-muted-foreground">{payment.method}</p>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-semibold">${payment.amount.toLocaleString()}</p>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(payment.status)}>
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{payment.date}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Average Rate Trends</CardTitle>
                  <CardDescription>Your average rate per campaign over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyEarnings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="avgRate" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Performance</CardTitle>
                  <CardDescription>Earnings breakdown by platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {earningsByPlatform.map((platform) => (
                      <div key={platform.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: platform.color }}></div>
                          <span className="font-medium">{platform.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${platform.earnings.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{platform.value}%</p>
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

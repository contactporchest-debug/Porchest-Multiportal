"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { PortalLayout } from "@/components/portal-layout"
import AdminSidebar from "@/components/admin-sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  AlertTriangle,
  Eye,
  Ban,
  Activity,
  Server,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"

// Dynamic Recharts imports
const LineChart = dynamic<any>(
  () => import("recharts").then((m) => m.LineChart),
  { ssr: false }
)
const Line = dynamic<any>(
  () => import("recharts").then((m) => m.Line),
  { ssr: false }
)
const XAxis = dynamic<any>(
  () => import("recharts").then((m) => m.XAxis),
  { ssr: false }
)
const YAxis = dynamic<any>(
  () => import("recharts").then((m) => m.YAxis),
  { ssr: false }
)
const CartesianGrid = dynamic<any>(
  () => import("recharts").then((m) => m.CartesianGrid),
  { ssr: false }
)
const Tooltip = dynamic<any>(
  () => import("recharts").then((m) => m.Tooltip),
  { ssr: false }
)
const Legend = dynamic<any>(
  () => import("recharts").then((m) => m.Legend),
  { ssr: false }
)
const ResponsiveContainer = dynamic<any>(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false }
)

// Fraud alerts
const fraudAlerts = [
  {
    id: "1",
    type: "Multiple Login Attempts",
    user: "john.suspicious@email.com",
    description: "10 failed login attempts from different IPs in 5 minutes",
    severity: "high",
    status: "active",
    date: "2025-06-16 10:35",
    ipAddress: "192.168.1.100",
  },
  {
    id: "2",
    type: "Unusual Payment Activity",
    user: "Brand X",
    description: "Payment request for unusually high amount",
    severity: "high",
    status: "investigating",
    date: "2025-06-16 09:20",
    ipAddress: "10.0.0.45",
  },
  {
    id: "3",
    type: "Suspicious Account Creation",
    user: "fake.influencer@email.com",
    description: "Account created with fake social media profiles",
    severity: "medium",
    status: "investigating",
    date: "2025-06-15 18:45",
    ipAddress: "172.16.0.12",
  },
]

// System monitoring
const systemMetrics = [
  {
    id: "1",
    service: "API Server",
    status: "healthy",
    uptime: "99.9%",
    responseTime: "45ms",
    requests: "125K/day",
  },
  {
    id: "2",
    service: "Database",
    status: "healthy",
    uptime: "99.95%",
    responseTime: "12ms",
    requests: "350K/day",
  },
  {
    id: "3",
    service: "Payment Gateway",
    status: "healthy",
    uptime: "99.8%",
    responseTime: "180ms",
    requests: "8K/day",
  },
  {
    id: "4",
    service: "File Storage",
    status: "warning",
    uptime: "98.5%",
    responseTime: "95ms",
    requests: "45K/day",
  },
]

// System activity logs
const activityLogs = [
  {
    id: "1",
    action: "User Login",
    user: "admin@porchest.com",
    timestamp: "2025-06-16 11:30",
    ipAddress: "192.168.1.1",
    status: "success",
  },
  {
    id: "2",
    action: "Payment Approved",
    user: "admin@porchest.com",
    timestamp: "2025-06-16 11:25",
    ipAddress: "192.168.1.1",
    status: "success",
  },
  {
    id: "3",
    action: "User Verification Rejected",
    user: "admin@porchest.com",
    timestamp: "2025-06-16 11:20",
    ipAddress: "192.168.1.1",
    status: "success",
  },
  {
    id: "4",
    action: "Failed Login Attempt",
    user: "unknown@email.com",
    timestamp: "2025-06-16 11:15",
    ipAddress: "10.0.0.99",
    status: "failed",
  },
]

// Threat activity over time
const threatData = [
  { hour: "00:00", threats: 2, blocked: 2 },
  { hour: "04:00", threats: 1, blocked: 1 },
  { hour: "08:00", threats: 5, blocked: 4 },
  { hour: "12:00", threats: 8, blocked: 7 },
  { hour: "16:00", threats: 6, blocked: 6 },
  { hour: "20:00", threats: 4, blocked: 3 },
]

export default function FraudMonitoring() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Healthy
          </Badge>
        )
      case "warning":
        return (
          <Badge className="bg-yellow-500">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Warning
          </Badge>
        )
      case "critical":
        return (
          <Badge className="bg-red-500">
            <XCircle className="h-3 w-3 mr-1" />
            Critical
          </Badge>
        )
      case "success":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Success
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-500">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        )
      case "active":
      case "investigating":
        return (
          <Badge className="bg-yellow-500">
            <Clock className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge className="bg-red-500">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>
      case "low":
        return <Badge className="bg-blue-500">Low</Badge>
      default:
        return <Badge variant="secondary">{severity}</Badge>
    }
  }

  return (
    <PortalLayout
      sidebar={<AdminSidebar />}
      title="Fraud & System Monitoring"
      userRole="Admin"
      breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Fraud Monitoring" }]}
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Threats</p>
                  <p className="text-2xl font-bold text-red-600">{fraudAlerts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Threats Blocked</p>
                  <p className="text-2xl font-bold">142</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Server className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">System Health</p>
                  <p className="text-2xl font-bold">99.5%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">1,247</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Threat Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Threat Activity (Last 24 Hours)</CardTitle>
            <CardDescription>Real-time threat detection and blocking</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={threatData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="threats" stroke="#ef4444" name="Threats Detected" />
                <Line type="monotone" dataKey="blocked" stroke="#10b981" name="Threats Blocked" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tabs for different monitoring sections */}
        <Tabs defaultValue="fraud" className="space-y-4">
          <TabsList>
            <TabsTrigger value="fraud">Fraud Alerts ({fraudAlerts.length})</TabsTrigger>
            <TabsTrigger value="system">System Health ({systemMetrics.length})</TabsTrigger>
            <TabsTrigger value="activity">Activity Logs</TabsTrigger>
          </TabsList>

          {/* Fraud Alerts */}
          <TabsContent value="fraud">
            <Card>
              <CardHeader>
                <CardTitle>Fraud Alerts</CardTitle>
                <CardDescription>Security threats and suspicious activities</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fraudAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>
                          <Badge variant="outline">{alert.type}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{alert.user}</TableCell>
                        <TableCell className="max-w-xs">{alert.description}</TableCell>
                        <TableCell className="font-mono text-sm">{alert.ipAddress}</TableCell>
                        <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                        <TableCell>{getStatusBadge(alert.status)}</TableCell>
                        <TableCell>{alert.date}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Ban className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Health */}
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Health Monitoring</CardTitle>
                <CardDescription>Real-time status of all system services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemMetrics.map((metric) => (
                    <div
                      key={metric.id}
                      className="p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Server className="h-8 w-8 text-blue-600" />
                          <div>
                            <h3 className="font-semibold text-lg">{metric.service}</h3>
                            <p className="text-sm text-muted-foreground">
                              {metric.requests} requests
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(metric.status)}
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">Uptime</p>
                          <p className="font-semibold text-lg">{metric.uptime}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Response Time</p>
                          <p className="font-semibold text-lg">{metric.responseTime}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Daily Requests</p>
                          <p className="font-semibold text-lg">{metric.requests}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Logs */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>System Activity Logs</CardTitle>
                <CardDescription>Recent system and user activities</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.action}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>{getStatusBadge(log.status)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { CheckCircle, Clock, AlertCircle, MessageSquare, FileText, Users } from "lucide-react"
import PortalLayout from "@/components/portal-layout"
import EmployeeSidebar from "@/components/employee-sidebar"
import { mockData } from "@/lib/mock-data"

export default function EmployeeDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("week")

  const taskStats = {
    total: 24,
    completed: 18,
    inProgress: 4,
    pending: 2,
  }

  const weeklyProgress = [
    { day: "Mon", completed: 3, assigned: 5 },
    { day: "Tue", completed: 4, assigned: 6 },
    { day: "Wed", completed: 2, assigned: 4 },
    { day: "Thu", completed: 5, assigned: 7 },
    { day: "Fri", completed: 4, assigned: 5 },
  ]

  const performanceData = [
    { month: "Jan", efficiency: 85, quality: 92 },
    { month: "Feb", efficiency: 88, quality: 89 },
    { month: "Mar", efficiency: 92, quality: 94 },
    { month: "Apr", efficiency: 87, quality: 91 },
    { month: "May", efficiency: 94, quality: 96 },
  ]

  return (
    <PortalLayout sidebar={<EmployeeSidebar />}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Employee Dashboard</h1>
            <p className="text-muted-foreground">Track your tasks, performance, and team collaboration</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Submit Report
            </Button>
            <Button size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Team Chat
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskStats.total}</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
              <p className="text-xs text-muted-foreground">75% completion rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{taskStats.inProgress}</div>
              <p className="text-xs text-muted-foreground">2 due today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{taskStats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
              <CardDescription>Tasks completed vs assigned this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="assigned" fill="#e2e8f0" name="Assigned" />
                  <Bar dataKey="completed" fill="#f97316" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Efficiency and quality scores over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="efficiency" stroke="#f97316" name="Efficiency %" />
                  <Line type="monotone" dataKey="quality" stroke="#1e293b" name="Quality %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tasks & Team Updates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>Your latest assignments and progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.employee.recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-muted-foreground">{task.project}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={
                          task.status === "completed"
                            ? "default"
                            : task.status === "in-progress"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {task.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Due: {task.dueDate}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Progress value={task.progress} className="w-20" />
                    <span className="text-xs text-muted-foreground">{task.progress}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Team Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Team Updates</CardTitle>
              <CardDescription>Latest messages and announcements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.employee.teamUpdates.map((update) => (
                <div key={update.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{update.author}</span>
                      <span className="text-xs text-muted-foreground">{update.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{update.message}</p>
                    {update.type && (
                      <Badge variant="outline" className="mt-2">
                        {update.type}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  )
}

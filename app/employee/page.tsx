"use client"

import { PortalLayout } from "@/components/portal-layout"
import { EmployeeSidebar } from "@/components/employee-sidebar"
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
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  ClipboardList,
  Award,
  Calendar,
  ArrowRight,
} from "lucide-react"

// Recent tasks
const recentTasks = [
  {
    id: "1",
    title: "Complete Q2 Performance Review",
    status: "completed",
    dueDate: "2025-06-15",
    completedDate: "2025-06-14",
  },
  {
    id: "2",
    title: "Submit Weekly Progress Report",
    status: "pending",
    dueDate: "2025-06-20",
  },
  {
    id: "3",
    title: "Update Client Project Documentation",
    status: "in_progress",
    dueDate: "2025-06-22",
  },
  {
    id: "4",
    title: "Team Meeting Notes - E-Commerce Project",
    status: "completed",
    dueDate: "2025-06-13",
    completedDate: "2025-06-13",
  },
]

// Upcoming deadlines
const upcomingDeadlines = [
  {
    id: "1",
    title: "Monthly Sales Report",
    dueDate: "2025-06-30",
    priority: "high",
  },
  {
    id: "2",
    title: "Client Presentation Prep",
    dueDate: "2025-06-25",
    priority: "medium",
  },
  {
    id: "3",
    title: "Training Module Completion",
    dueDate: "2025-07-05",
    priority: "low",
  },
]

export default function EmployeeDashboard() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      case "in_progress":
        return (
          <Badge className="bg-blue-500">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-500">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>
      case "low":
        return <Badge className="bg-blue-500">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  return (
    <PortalLayout
      sidebar={<EmployeeSidebar />}
      title="Dashboard"
      userRole="Employee"
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <ClipboardList className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Tasks</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">18</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">6</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Performance</p>
                  <p className="text-2xl font-bold">92%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Tasks */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Tasks</CardTitle>
                  <CardDescription>Your latest task submissions and updates</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href="/employee/reporting">
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium mb-2">{task.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Due: {task.dueDate}
                        </div>
                        {task.completedDate && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Completed: {task.completedDate}
                        </div>
                        )}
                      </div>
                    </div>
                    <div>{getStatusBadge(task.status)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                  <CardDescription>Tasks that need your attention</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a href="/employee/reporting">
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline) => (
                  <div
                    key={deadline.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium mb-2">{deadline.title}</h4>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Due: {deadline.dueDate}
                      </div>
                    </div>
                    <div>{getPriorityBadge(deadline.priority)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              <CardTitle>Performance Overview</CardTitle>
            </div>
            <CardDescription>Quick glance at your performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center p-6 bg-accent rounded-lg">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-3xl font-bold mb-1">92%</p>
                <p className="text-sm text-muted-foreground">Task Completion Rate</p>
              </div>

              <div className="flex flex-col items-center p-6 bg-accent rounded-lg">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-3xl font-bold mb-1">4.5</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>

              <div className="flex flex-col items-center p-6 bg-accent rounded-lg">
                <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-3xl font-bold mb-1">8</p>
                <p className="text-sm text-muted-foreground">Achievements Earned</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button asChild>
                <a href="/employee/performance">
                  View Detailed Performance
                  <ArrowRight className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button className="h-24 flex-col gap-2" variant="outline" asChild>
                <a href="/employee/reporting">
                  <ClipboardList className="h-6 w-6" />
                  <span>Submit Daily Report</span>
                </a>
              </Button>
              <Button className="h-24 flex-col gap-2" variant="outline" asChild>
                <a href="/employee/profile">
                  <CheckCircle className="h-6 w-6" />
                  <span>Update Profile</span>
                </a>
              </Button>
              <Button className="h-24 flex-col gap-2" variant="outline" asChild>
                <a href="/employee/performance">
                  <TrendingUp className="h-6 w-6" />
                  <span>Track Performance</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}

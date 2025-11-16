"use client"

import { useState } from "react"
import { PortalLayout } from "@/components/portal-layout"
import { EmployeeSidebar } from "@/components/employee-sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
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
  ClipboardList,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Send,
  Plus,
  FileText,
  Edit,
  Trash2,
} from "lucide-react"

// Task submissions
const taskSubmissions = [
  {
    id: "1",
    title: "Complete Q2 Performance Review",
    project: "Internal - HR",
    submittedDate: "2025-06-14",
    dueDate: "2025-06-15",
    status: "completed",
    hoursSpent: 4,
    description: "Completed self-assessment and manager review",
  },
  {
    id: "2",
    title: "Update Client Project Documentation",
    project: "E-Commerce Platform",
    submittedDate: "2025-06-15",
    dueDate: "2025-06-22",
    status: "in_progress",
    hoursSpent: 6,
    description: "Updated API documentation and user guides",
  },
  {
    id: "3",
    title: "Team Meeting Notes - E-Commerce Project",
    project: "E-Commerce Platform",
    submittedDate: "2025-06-13",
    dueDate: "2025-06-13",
    status: "completed",
    hoursSpent: 1,
    description: "Documented weekly team sync meeting",
  },
  {
    id: "4",
    title: "Bug Fix - Payment Gateway Integration",
    project: "E-Commerce Platform",
    submittedDate: "2025-06-12",
    dueDate: "2025-06-14",
    status: "completed",
    hoursSpent: 8,
    description: "Fixed payment processing error on checkout page",
  },
]

// Pending tasks
const pendingTasks = [
  {
    id: "5",
    title: "Submit Weekly Progress Report",
    project: "Internal - Management",
    dueDate: "2025-06-20",
    priority: "high",
    assignedBy: "Sarah Mitchell",
  },
  {
    id: "6",
    title: "Code Review - Mobile App Feature",
    project: "Mobile App Development",
    dueDate: "2025-06-21",
    priority: "medium",
    assignedBy: "Michael Chen",
  },
  {
    id: "7",
    title: "Training Module Completion",
    project: "Internal - HR",
    dueDate: "2025-07-05",
    priority: "low",
    assignedBy: "Emma Davis",
  },
]

export default function DailyReporting() {
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)

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
      title="Daily Reporting"
      userRole="Employee"
      breadcrumbs={[{ label: "Dashboard", href: "/employee" }, { label: "Daily Reporting" }]}
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
                  <p className="text-sm text-muted-foreground">Today's Tasks</p>
                  <p className="text-2xl font-bold">3</p>
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
                  <p className="text-2xl font-bold">12</p>
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
                  <p className="text-sm text-muted-foreground">Hours This Week</p>
                  <p className="text-2xl font-bold">32</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit New Task Report */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-blue-600" />
                  <CardTitle>Submit Task Report</CardTitle>
                </div>
                <CardDescription>Report your completed or ongoing work</CardDescription>
              </div>
              <Button
                variant={showNewTaskForm ? "outline" : "default"}
                onClick={() => setShowNewTaskForm(!showNewTaskForm)}
              >
                {showNewTaskForm ? "Cancel" : "New Report"}
              </Button>
            </div>
          </CardHeader>
          {showNewTaskForm && (
            <CardContent>
              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taskTitle">Task Title</Label>
                    <Input id="taskTitle" placeholder="Enter task title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project">Project</Label>
                    <Select>
                      <SelectTrigger id="project">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ecommerce">E-Commerce Platform</SelectItem>
                        <SelectItem value="mobile">Mobile App Development</SelectItem>
                        <SelectItem value="api">API Integration</SelectItem>
                        <SelectItem value="internal">Internal - Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue="in_progress">
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hoursSpent">Hours Spent</Label>
                    <Input id="hoursSpent" type="number" min="0" step="0.5" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Due Date
                    </Label>
                    <Input id="dueDate" type="date" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the work you completed or the progress you made..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Report
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Tasks Tabs */}
        <Tabs defaultValue="submissions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="submissions">My Submissions ({taskSubmissions.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending Tasks ({pendingTasks.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle>Task Submissions</CardTitle>
                <CardDescription>Your recent task reports and submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task Title</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taskSubmissions.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.title}</TableCell>
                        <TableCell>{task.project}</TableCell>
                        <TableCell>{task.submittedDate}</TableCell>
                        <TableCell>{task.dueDate}</TableCell>
                        <TableCell>{task.hoursSpent}h</TableCell>
                        <TableCell>{getStatusBadge(task.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-red-600" />
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

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>Tasks assigned to you that need completion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">{task.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {task.project}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Due: {task.dueDate}
                          </div>
                          <div>Assigned by: {task.assignedBy}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getPriorityBadge(task.priority)}
                        <Button>
                          <ClipboardList className="h-4 w-4 mr-2" />
                          Start Task
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  )
}

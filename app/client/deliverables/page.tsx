"use client"

import { PortalLayout } from "@/components/portal-layout"
import { ClientSidebar } from "@/components/client-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Download, Eye, CheckCircle, Clock, AlertCircle, FileText, Package } from "lucide-react"

const deliverables = [
  {
    id: 1,
    title: "User Authentication System",
    project: "E-commerce Platform",
    type: "Feature",
    status: "completed",
    dueDate: "2024-06-15",
    completedDate: "2024-06-12",
    assignee: "John Doe",
    description: "Complete user registration, login, and password reset functionality",
    files: ["auth-system-docs.pdf", "user-flow-diagram.png"],
  },
  {
    id: 2,
    title: "Payment Gateway Integration",
    project: "E-commerce Platform",
    type: "Integration",
    status: "in-progress",
    dueDate: "2024-07-20",
    assignee: "Jane Smith",
    description: "Integration with Stripe and PayPal payment systems",
    progress: 75,
    files: ["payment-integration-spec.pdf"],
  },
  {
    id: 3,
    title: "Mobile App UI Design",
    project: "Mobile Banking App",
    type: "Design",
    status: "review",
    dueDate: "2024-07-10",
    assignee: "Sarah Wilson",
    description: "Complete UI/UX design for mobile banking application",
    files: ["mobile-ui-mockups.fig", "design-system.pdf"],
  },
  {
    id: 4,
    title: "Database Schema Design",
    project: "CRM System",
    type: "Architecture",
    status: "pending",
    dueDate: "2024-08-01",
    assignee: "Alex Turner",
    description: "Design and implement database schema for CRM system",
    files: [],
  },
  {
    id: 5,
    title: "API Documentation",
    project: "Mobile Banking App",
    type: "Documentation",
    status: "completed",
    dueDate: "2024-06-30",
    completedDate: "2024-06-28",
    assignee: "Tom Brown",
    description: "Complete API documentation for all endpoints",
    files: ["api-docs.pdf", "postman-collection.json"],
  },
]

const milestones = [
  {
    id: 1,
    title: "Phase 1: Foundation",
    project: "E-commerce Platform",
    status: "completed",
    dueDate: "2024-06-30",
    completedDate: "2024-06-25",
    deliverables: 5,
    completedDeliverables: 5,
  },
  {
    id: 2,
    title: "Phase 2: Core Features",
    project: "E-commerce Platform",
    status: "in-progress",
    dueDate: "2024-08-15",
    deliverables: 8,
    completedDeliverables: 3,
  },
  {
    id: 3,
    title: "MVP Release",
    project: "Mobile Banking App",
    status: "in-progress",
    dueDate: "2024-07-30",
    deliverables: 12,
    completedDeliverables: 8,
  },
]

export default function DeliverablesPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      case "review":
        return "bg-yellow-500"
      case "pending":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle
      case "in-progress":
        return Clock
      case "review":
        return AlertCircle
      case "pending":
        return Clock
      default:
        return Clock
    }
  }

  return (
    <PortalLayout
      sidebar={<ClientSidebar />}
      title="Deliverables Dashboard"
      userRole="Client"
      breadcrumbs={[{ label: "Dashboard", href: "/client" }, { label: "Deliverables" }]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Project Deliverables</h2>
            <p className="text-muted-foreground">Track milestones and deliverables across all your projects</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Deliverables</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deliverables.length}</div>
              <p className="text-xs text-muted-foreground">Across all projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deliverables.filter((d) => d.status === "completed").length}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((deliverables.filter((d) => d.status === "completed").length / deliverables.length) * 100)}%
                completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deliverables.filter((d) => d.status === "in-progress").length}</div>
              <p className="text-xs text-muted-foreground">Currently being worked on</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deliverables.filter((d) => d.status === "review").length}</div>
              <p className="text-xs text-muted-foreground">Awaiting your review</p>
            </CardContent>
          </Card>
        </div>

        {/* Deliverables Tabs */}
        <Tabs defaultValue="deliverables" className="space-y-4">
          <TabsList>
            <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
          </TabsList>

          <TabsContent value="deliverables" className="space-y-4">
            <div className="grid gap-4">
              {deliverables.map((deliverable) => {
                const StatusIcon = getStatusIcon(deliverable.status)
                return (
                  <Card key={deliverable.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center gap-2">
                            <StatusIcon className="h-5 w-5" />
                            {deliverable.title}
                            <Badge className={getStatusColor(deliverable.status)}>
                              {deliverable.status.replace("-", " ")}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <span>{deliverable.project}</span>
                            <Badge variant="outline">{deliverable.type}</Badge>
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt={deliverable.assignee} />
                            <AvatarFallback className="text-xs">
                              {deliverable.assignee
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-right text-sm">
                            <p className="font-medium">{deliverable.assignee}</p>
                            <p className="text-muted-foreground">Assignee</p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm">{deliverable.description}</p>

                      {deliverable.status === "in-progress" && deliverable.progress && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{deliverable.progress}%</span>
                          </div>
                          <Progress value={deliverable.progress} />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {deliverable.dueDate}</span>
                          </div>
                          {deliverable.completedDate && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>Completed: {deliverable.completedDate}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {deliverable.files.length > 0 && (
                            <Button variant="outline" size="sm">
                              <FileText className="mr-2 h-4 w-4" />
                              Files ({deliverable.files.length})
                            </Button>
                          )}
                          <Button size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </div>
                      </div>

                      {deliverable.files.length > 0 && (
                        <div className="pt-2 border-t">
                          <h4 className="text-sm font-medium mb-2">Attached Files:</h4>
                          <div className="flex flex-wrap gap-2">
                            {deliverable.files.map((file, index) => (
                              <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                                <Download className="mr-1 h-3 w-3" />
                                {file}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-4">
            <div className="grid gap-4">
              {milestones.map((milestone) => (
                <Card key={milestone.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {milestone.status === "completed" ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-blue-500" />
                          )}
                          {milestone.title}
                          <Badge className={getStatusColor(milestone.status)}>
                            {milestone.status.replace("-", " ")}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{milestone.project}</CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {milestone.completedDeliverables}/{milestone.deliverables} deliverables
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round((milestone.completedDeliverables / milestone.deliverables) * 100)}% complete
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round((milestone.completedDeliverables / milestone.deliverables) * 100)}%</span>
                      </div>
                      <Progress value={(milestone.completedDeliverables / milestone.deliverables) * 100} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {milestone.dueDate}</span>
                        </div>
                        {milestone.completedDate && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Completed: {milestone.completedDate}</span>
                          </div>
                        )}
                      </div>
                      <Button size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  )
}

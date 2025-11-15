"use client"

import { useState } from "react"
import { PortalLayout } from "@/components/portal-layout"
import { ClientSidebar } from "@/components/client-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { mockProjects } from "@/lib/mock-data"
import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  MessageSquare,
  FileText,
} from "lucide-react"

export default function ProjectTracking() {
  const [selectedProject, setSelectedProject] = useState<any>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-500"
      case "Testing":
        return "bg-yellow-500"
      case "Planning":
        return "bg-gray-500"
      case "Completed":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Progress":
        return Clock
      case "Testing":
        return AlertTriangle
      case "Planning":
        return Calendar
      case "Completed":
        return CheckCircle
      default:
        return Clock
    }
  }

  return (
    <PortalLayout
      sidebar={<ClientSidebar />}
      title="Project Tracking"
      userRole="Client"
      breadcrumbs={[{ label: "Dashboard", href: "/client" }, { label: "Project Tracking" }]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Your Projects</h2>
            <p className="text-muted-foreground">Track progress and manage your software development projects</p>
          </div>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Request New Project
          </Button>
        </div>

        {/* Project Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Projects ({mockProjects.length})</TabsTrigger>
            <TabsTrigger value="active">
              Active ({mockProjects.filter((p) => p.status === "In Progress" || p.status === "Testing").length})
            </TabsTrigger>
            <TabsTrigger value="planning">
              Planning ({mockProjects.filter((p) => p.status === "Planning").length})
            </TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4">
              {mockProjects.map((project) => {
                const StatusIcon = getStatusIcon(project.status)
                return (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center gap-2">
                            <StatusIcon className="h-5 w-5" />
                            {project.name}
                            <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                          </CardTitle>
                          <CardDescription>Client: {project.client}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedProject(project)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>{selectedProject?.name}</DialogTitle>
                                <DialogDescription>Project Details and Progress</DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-6 py-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <h4 className="font-semibold">Project Information</h4>
                                    <div className="space-y-1 text-sm">
                                      <p>
                                        <span className="font-medium">Client:</span> {selectedProject?.client}
                                      </p>
                                      <p>
                                        <span className="font-medium">Start Date:</span> {selectedProject?.startDate}
                                      </p>
                                      <p>
                                        <span className="font-medium">Deadline:</span> {selectedProject?.deadline}
                                      </p>
                                      <p>
                                        <span className="font-medium">Budget:</span> $
                                        {selectedProject?.budget.toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <h4 className="font-semibold">Team Members</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedProject?.team.map((member: string, index: number) => (
                                        <Badge key={index} variant="secondary">
                                          {member}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="font-semibold">Progress</h4>
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                      <span>Overall Progress</span>
                                      <span>{selectedProject?.progress}%</span>
                                    </div>
                                    <Progress value={selectedProject?.progress} />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="font-semibold">Recent Updates</h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="p-2 bg-muted rounded">
                                      <p className="font-medium">Database integration completed</p>
                                      <p className="text-muted-foreground">2 days ago</p>
                                    </div>
                                    <div className="p-2 bg-muted rounded">
                                      <p className="font-medium">UI/UX design approved</p>
                                      <p className="text-muted-foreground">1 week ago</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button size="sm">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message Team
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Timeline</span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm">Start: {project.startDate}</p>
                            <p className="text-sm">Due: {project.deadline}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Budget</span>
                          </div>
                          <p className="text-xl font-bold">${project.budget.toLocaleString()}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Team</span>
                          </div>
                          <div className="flex -space-x-2">
                            {project.team.slice(0, 3).map((member, index) => (
                              <Avatar key={index} className="h-8 w-8 border-2 border-background">
                                <AvatarImage src={`/placeholder-32px.png?height=32&width=32`} alt={member} />
                                <AvatarFallback className="text-xs">
                                  {member
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {project.team.length > 3 && (
                              <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                <span className="text-xs">+{project.team.length - 3}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Progress</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{project.progress}%</span>
                              <span className="text-muted-foreground">Complete</span>
                            </div>
                            <Progress value={project.progress} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="active">
            <div className="grid gap-4">
              {mockProjects
                .filter((p) => p.status === "In Progress" || p.status === "Testing")
                .map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription>{project.client}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                        <span className="text-sm font-medium">{project.progress}% Complete</span>
                      </div>
                      <Progress value={project.progress} className="mt-2" />
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="planning">
            <div className="grid gap-4">
              {mockProjects
                .filter((p) => p.status === "Planning")
                .map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription>{project.client}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                        <span className="text-sm">Start Date: {project.startDate}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No completed projects yet</h3>
                  <p className="text-muted-foreground">Your completed projects will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  )
}

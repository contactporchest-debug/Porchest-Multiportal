"use client"

import { PortalLayout } from "@/components/portal-layout"
import { ClientSidebar } from "@/components/client-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { mockProjects } from "@/lib/mock-data"
import { Calendar, Users, CheckCircle, TrendingUp, FileText, MessageSquare } from "lucide-react"

const projectTimeline = [
  { month: "Jan", completed: 2, inProgress: 3, planned: 1 },
  { month: "Feb", completed: 3, inProgress: 2, planned: 2 },
  { month: "Mar", completed: 1, inProgress: 4, planned: 1 },
  { month: "Apr", completed: 4, inProgress: 3, planned: 3 },
  { month: "May", completed: 2, inProgress: 5, planned: 2 },
  { month: "Jun", completed: 3, inProgress: 3, planned: 4 },
]

const budgetData = [
  { project: "E-commerce", allocated: 45000, spent: 28000 },
  { project: "Banking App", allocated: 65000, spent: 58500 },
  { project: "CRM System", allocated: 35000, spent: 5250 },
]

export default function ClientDashboard() {
  const activeProjects = mockProjects.filter((p) => p.status === "In Progress" || p.status === "Testing")
  const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget, 0)
  const avgProgress = Math.round(mockProjects.reduce((sum, p) => sum + p.progress, 0) / mockProjects.length)

  return (
    <PortalLayout
      sidebar={<ClientSidebar />}
      title="Client Dashboard"
      userRole="Client"
      breadcrumbs={[{ label: "Dashboard" }]}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome back, TechCorp Inc.</CardTitle>
            <CardDescription>Here's an overview of your projects with Porchest</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Company" />
                  <AvatarFallback>TC</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">TechCorp Inc.</h2>
                  <p className="text-muted-foreground">Premium Client since 2024</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">Enterprise</Badge>
                    <Badge variant="outline">3 Active Projects</Badge>
                  </div>
                </div>
              </div>
              <Button>
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Team
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjects.length}</div>
              <p className="text-xs text-muted-foreground">2 in testing phase</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgProgress}%</div>
              <p className="text-xs text-muted-foreground">Across active projects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Working on your projects</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Project Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>Project status over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectTimeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#22c55e" />
                  <Bar dataKey="inProgress" fill="#f59e0b" />
                  <Bar dataKey="planned" fill="#6b7280" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Budget Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
              <CardDescription>Budget allocation vs spending</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={budgetData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="project" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="allocated" fill="hsl(var(--primary))" />
                  <Bar dataKey="spent" fill="hsl(var(--secondary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Active Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>Current projects in development</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{project.name}</h3>
                      <Badge
                        variant={
                          project.status === "In Progress"
                            ? "default"
                            : project.status === "Testing"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Due: {project.deadline}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{project.team.length} team members</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>${project.budget.toLocaleString()} budget</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Progress: {project.progress}%</span>
                      <Progress value={project.progress} className="w-32" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button size="sm">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Message Team
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Updates */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription>Latest project updates and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">E-commerce Platform - Payment Integration Completed</p>
                  <p className="text-xs text-muted-foreground">2 hours ago • John Doe</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Mobile Banking App - Testing Phase Started</p>
                  <p className="text-xs text-muted-foreground">1 day ago • Sarah Wilson</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">CRM System - Requirements Review Scheduled</p>
                  <p className="text-xs text-muted-foreground">3 days ago • Alex Turner</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}

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
import { Progress } from "@/components/ui/progress"
import {
  FolderKanban,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Users,
  Calendar,
  Eye,
} from "lucide-react"

// Dynamic Recharts imports
const BarChart = dynamic<any>(
  () => import("recharts").then((m) => m.BarChart),
  { ssr: false }
)
const Bar = dynamic<any>(
  () => import("recharts").then((m) => m.Bar),
  { ssr: false }
)
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

// Software projects data
const projects = [
  {
    id: "1",
    name: "E-Commerce Platform",
    client: "TechCorp Solutions",
    status: "in_progress",
    progress: 75,
    budget: 50000,
    spent: 37500,
    startDate: "2025-01-15",
    endDate: "2025-07-15",
    teamSize: 6,
    priority: "high",
    health: "on_track",
  },
  {
    id: "2",
    name: "Mobile App Development",
    client: "Startup Innovations",
    status: "in_progress",
    progress: 60,
    budget: 40000,
    spent: 24000,
    startDate: "2025-02-01",
    endDate: "2025-08-01",
    teamSize: 4,
    priority: "high",
    health: "on_track",
  },
  {
    id: "3",
    name: "API Integration",
    client: "Global Enterprises",
    status: "in_progress",
    progress: 45,
    budget: 25000,
    spent: 14000,
    startDate: "2025-03-10",
    endDate: "2025-06-30",
    teamSize: 3,
    priority: "medium",
    health: "at_risk",
  },
  {
    id: "4",
    name: "CRM System",
    client: "Sales Pro Inc",
    status: "planning",
    progress: 15,
    budget: 60000,
    spent: 5000,
    startDate: "2025-04-01",
    endDate: "2025-10-01",
    teamSize: 5,
    priority: "medium",
    health: "on_track",
  },
  {
    id: "5",
    name: "Data Analytics Platform",
    client: "Analytics Corp",
    status: "completed",
    progress: 100,
    budget: 35000,
    spent: 33500,
    startDate: "2024-11-01",
    endDate: "2025-05-31",
    teamSize: 4,
    priority: "high",
    health: "completed",
  },
]

// Project timeline data
const projectTimeline = [
  { week: "Week 1", planned: 10, actual: 8 },
  { week: "Week 2", planned: 20, actual: 18 },
  { week: "Week 3", planned: 30, actual: 28 },
  { week: "Week 4", planned: 40, actual: 40 },
  { week: "Week 5", planned: 50, actual: 52 },
  { week: "Week 6", planned: 60, actual: 58 },
]

// Budget overview
const budgetData = [
  { project: "E-Commerce", budget: 50000, spent: 37500 },
  { project: "Mobile App", budget: 40000, spent: 24000 },
  { project: "API Integration", budget: 25000, spent: 14000 },
  { project: "CRM", budget: 60000, spent: 5000 },
  { project: "Analytics", budget: 35000, spent: 33500 },
]

export default function SoftwareProjects() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

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
      case "planning":
        return (
          <Badge className="bg-yellow-500">
            <Clock className="h-3 w-3 mr-1" />
            Planning
          </Badge>
        )
      case "on_hold":
        return (
          <Badge variant="secondary">
            <AlertTriangle className="h-3 w-3 mr-1" />
            On Hold
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getHealthBadge = (health: string) => {
    switch (health) {
      case "on_track":
        return <Badge className="bg-green-500">On Track</Badge>
      case "at_risk":
        return <Badge className="bg-yellow-500">At Risk</Badge>
      case "delayed":
        return <Badge className="bg-red-500">Delayed</Badge>
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      default:
        return <Badge variant="secondary">{health}</Badge>
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

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0)

  return (
    <PortalLayout
      sidebar={<AdminSidebar />}
      title="Software Project Oversight"
      userRole="Admin"
      breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Software Projects" }]}
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FolderKanban className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold">{projects.length}</p>
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
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold">
                    {projects.filter((p) => p.status === "in_progress").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                  <p className="text-2xl font-bold">${(totalBudget / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Team Members</p>
                  <p className="text-2xl font-bold">22</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Project Progress Timeline</CardTitle>
            <CardDescription>Planned vs actual progress across all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={projectTimeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="planned" stroke="#94a3b8" name="Planned %" />
                <Line type="monotone" dataKey="actual" stroke="#10b981" name="Actual %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Budget Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
            <CardDescription>Budget allocation vs spending across projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="project" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="budget" fill="#3b82f6" name="Budget" />
                <Bar dataKey="spent" fill="#f97316" name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* All Projects */}
        <Card>
          <CardHeader>
            <CardTitle>All Projects</CardTitle>
            <CardDescription>Complete overview of all software development projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{project.name}</h3>
                        {getStatusBadge(project.status)}
                        {getPriorityBadge(project.priority)}
                        {getHealthBadge(project.health)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Client: {project.client}</p>

                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">Progress</p>
                          <div className="flex items-center gap-2">
                            <Progress value={project.progress} className="flex-1" />
                            <span className="font-medium">{project.progress}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Budget</p>
                          <p className="font-semibold">
                            ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Timeline</p>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <p className="font-medium">
                              {project.startDate} - {project.endDate}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Team</p>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <p className="font-medium">{project.teamSize} members</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      View Team
                    </Button>
                    <Button size="sm" variant="outline">
                      View Timeline
                    </Button>
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

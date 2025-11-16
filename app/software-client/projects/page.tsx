"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { PortalLayout } from "@/components/portal-layout"
import { SoftwareClientSidebar } from "@/components/software-client-sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Code,
  FileText,
  Zap,
  TrendingUp,
} from "lucide-react"

// Dynamically import Recharts components with SSR disabled
const LineChart = dynamic<any>(
  () => import("recharts").then((m) => m.LineChart),
  { ssr: false }
)
const Line = dynamic<any>(
  () => import("recharts").then((m) => m.Line),
  { ssr: false }
)
const BarChart = dynamic<any>(
  () => import("recharts").then((m) => m.BarChart),
  { ssr: false }
)
const Bar = dynamic<any>(
  () => import("recharts").then((m) => m.Bar),
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

// Project data
const projects = [
  {
    id: "1",
    name: "E-Commerce Platform",
    description: "Custom e-commerce solution with payment integration",
    status: "in-progress",
    progress: 65,
    startDate: "2025-04-01",
    expectedCompletion: "2025-08-15",
    daysRemaining: 45,
    budget: 85000,
    spent: 55250,
    phase: "Development",
    tasks: {
      completed: 42,
      total: 65,
    },
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Cross-platform mobile application for iOS and Android",
    status: "in-progress",
    progress: 40,
    startDate: "2025-05-15",
    expectedCompletion: "2025-09-30",
    daysRemaining: 75,
    budget: 120000,
    spent: 48000,
    phase: "Design & Prototyping",
    tasks: {
      completed: 18,
      total: 45,
    },
  },
  {
    id: "3",
    name: "API Integration",
    description: "Third-party API integration and data synchronization",
    status: "completed",
    progress: 100,
    startDate: "2025-03-01",
    expectedCompletion: "2025-06-01",
    daysRemaining: 0,
    budget: 35000,
    spent: 33500,
    phase: "Completed",
    tasks: {
      completed: 28,
      total: 28,
    },
  },
]

// Timeline data showing project completion over time
const timelineData = [
  { week: "Week 1", planned: 10, actual: 8 },
  { week: "Week 2", planned: 20, actual: 18 },
  { week: "Week 3", planned: 30, actual: 28 },
  { week: "Week 4", planned: 40, actual: 38 },
  { week: "Week 5", planned: 50, actual: 48 },
  { week: "Week 6", planned: 60, actual: 55 },
  { week: "Week 7", planned: 70, actual: 65 },
  { week: "Week 8", planned: 80, actual: 70, projected: true },
  { week: "Week 9", planned: 90, actual: 85, projected: true },
  { week: "Week 10", planned: 100, actual: 100, projected: true },
]

// Task breakdown by phase
const phaseData = [
  { phase: "Planning", completion: 100 },
  { phase: "Design", completion: 100 },
  { phase: "Development", completion: 65 },
  { phase: "Testing", completion: 30 },
  { phase: "Deployment", completion: 0 },
]

// Team members working on projects
const teamMembers = [
  {
    id: "1",
    name: "Michael Chen",
    role: "Project Manager",
    avatar: "/placeholder.svg",
    email: "michael.chen@porchest.com",
    phone: "+1 (555) 234-5678",
    tasksAssigned: 12,
  },
  {
    id: "2",
    name: "Sarah Anderson",
    role: "Lead Developer",
    avatar: "/placeholder.svg",
    email: "sarah.anderson@porchest.com",
    phone: "+1 (555) 345-6789",
    tasksAssigned: 18,
  },
  {
    id: "3",
    name: "David Martinez",
    role: "Frontend Developer",
    avatar: "/placeholder.svg",
    email: "david.martinez@porchest.com",
    phone: "+1 (555) 456-7890",
    tasksAssigned: 15,
  },
  {
    id: "4",
    name: "Emma Wilson",
    role: "Backend Developer",
    avatar: "/placeholder.svg",
    email: "emma.wilson@porchest.com",
    phone: "+1 (555) 567-8901",
    tasksAssigned: 14,
  },
  {
    id: "5",
    name: "James Taylor",
    role: "QA Engineer",
    avatar: "/placeholder.svg",
    email: "james.taylor@porchest.com",
    phone: "+1 (555) 678-9012",
    tasksAssigned: 8,
  },
  {
    id: "6",
    name: "Lisa Johnson",
    role: "UI/UX Designer",
    avatar: "/placeholder.svg",
    email: "lisa.johnson@porchest.com",
    phone: "+1 (555) 789-0123",
    tasksAssigned: 10,
  },
]

export default function ProjectDashboard() {
  const [selectedProject, setSelectedProject] = useState(projects[0])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      case "on-hold":
        return "bg-yellow-500"
      case "delayed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "delayed":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <PortalLayout
      sidebar={<SoftwareClientSidebar />}
      title="Project Dashboard"
      userRole="Software Client"
      breadcrumbs={[{ label: "Dashboard", href: "/software-client" }, { label: "Projects" }]}
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Project Selection Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card
              key={project.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedProject.id === project.id ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => setSelectedProject(project)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getStatusColor(project.status)}>
                    {getStatusIcon(project.status)}
                    <span className="ml-1 capitalize">{project.status.replace("-", " ")}</span>
                  </Badge>
                </div>
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  {project.status !== "completed" && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {project.daysRemaining} days remaining
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Project Details */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{selectedProject.name}</CardTitle>
                <CardDescription className="text-blue-100">{selectedProject.description}</CardDescription>
              </div>
              <Badge className="bg-white/20 text-white border-0 text-lg px-4 py-2">
                {selectedProject.progress}% Complete
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm opacity-80 mb-1">Current Phase</p>
                <p className="text-lg font-semibold">{selectedProject.phase}</p>
              </div>
              <div>
                <p className="text-sm opacity-80 mb-1">Expected Completion</p>
                <p className="text-lg font-semibold">{selectedProject.expectedCompletion}</p>
              </div>
              <div>
                <p className="text-sm opacity-80 mb-1">Budget</p>
                <p className="text-lg font-semibold">${(selectedProject.budget / 1000).toFixed(0)}K</p>
              </div>
              <div>
                <p className="text-sm opacity-80 mb-1">Tasks Completed</p>
                <p className="text-lg font-semibold">
                  {selectedProject.tasks.completed}/{selectedProject.tasks.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Days Remaining</p>
                  <p className="text-2xl font-bold">{selectedProject.daysRemaining}</p>
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
                  <p className="text-sm text-muted-foreground">Tasks Done</p>
                  <p className="text-2xl font-bold">{selectedProject.tasks.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Code className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget Used</p>
                  <p className="text-2xl font-bold">
                    {((selectedProject.spent / selectedProject.budget) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Team Members</p>
                  <p className="text-2xl font-bold">{teamMembers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Timeline Graph */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <CardTitle>Project Completion Timeline</CardTitle>
            </div>
            <CardDescription>Planned vs Actual progress over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis label={{ value: "Completion %", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="planned"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Planned Progress"
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Actual Progress"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Phase Completion Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              <CardTitle>Phase-wise Completion</CardTitle>
            </div>
            <CardDescription>Progress breakdown by development phase</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={phaseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="phase" />
                <YAxis label={{ value: "Completion %", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Bar dataKey="completion" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-600" />
              <CardTitle>Porchest Team Working on Your Project</CardTitle>
            </div>
            <CardDescription>Meet the dedicated team members building your solution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.map((member) => (
                <Card key={member.id} className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{member.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {member.email}
                          </p>
                          <p className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {member.phone}
                          </p>
                        </div>
                        <div className="mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {member.tasksAssigned} tasks assigned
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Budget Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Breakdown</CardTitle>
            <CardDescription>Financial overview of the project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Budget</span>
                <span className="text-lg font-bold">${selectedProject.budget.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Amount Spent</span>
                <span className="text-lg font-bold text-blue-600">${selectedProject.spent.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Remaining</span>
                <span className="text-lg font-bold text-green-600">
                  ${(selectedProject.budget - selectedProject.spent).toLocaleString()}
                </span>
              </div>
              <Progress value={(selectedProject.spent / selectedProject.budget) * 100} className="h-3" />
              <p className="text-xs text-muted-foreground text-center">
                {((selectedProject.spent / selectedProject.budget) * 100).toFixed(1)}% of budget utilized
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}

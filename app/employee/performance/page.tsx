"use client"

import dynamic from "next/dynamic"
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
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  Award,
  Target,
  CheckCircle,
  Clock,
  Star,
  ThumbsUp,
  Calendar,
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
const RadarChart = dynamic<any>(
  () => import("recharts").then((m) => m.RadarChart),
  { ssr: false }
)
const PolarGrid = dynamic<any>(
  () => import("recharts").then((m) => m.PolarGrid),
  { ssr: false }
)
const PolarAngleAxis = dynamic<any>(
  () => import("recharts").then((m) => m.PolarAngleAxis),
  { ssr: false }
)
const PolarRadiusAxis = dynamic<any>(
  () => import("recharts").then((m) => m.PolarRadiusAxis),
  { ssr: false }
)
const Radar = dynamic<any>(
  () => import("recharts").then((m) => m.Radar),
  { ssr: false }
)

// Performance data
const monthlyPerformance = [
  { month: "Jan", efficiency: 85, quality: 92, teamwork: 88 },
  { month: "Feb", efficiency: 88, quality: 89, teamwork: 90 },
  { month: "Mar", efficiency: 92, quality: 94, teamwork: 93 },
  { month: "Apr", efficiency: 87, quality: 91, teamwork: 89 },
  { month: "May", efficiency: 94, quality: 96, teamwork: 95 },
  { month: "Jun", efficiency: 96, quality: 95, teamwork: 94 },
]

const taskCompletionData = [
  { week: "Week 1", completed: 12, assigned: 15 },
  { week: "Week 2", completed: 14, assigned: 16 },
  { week: "Week 3", completed: 16, assigned: 18 },
  { week: "Week 4", completed: 18, assigned: 20 },
]

const skillsRadarData = [
  { skill: "Technical", score: 95 },
  { skill: "Communication", score: 88 },
  { skill: "Problem Solving", score: 92 },
  { skill: "Leadership", score: 85 },
  { skill: "Creativity", score: 90 },
  { skill: "Teamwork", score: 94 },
]

// Goals and achievements
const goals = [
  {
    id: "1",
    title: "Complete Advanced React Certification",
    progress: 75,
    status: "in_progress",
    dueDate: "2025-07-31",
  },
  {
    id: "2",
    title: "Mentor 2 Junior Developers",
    progress: 100,
    status: "completed",
    dueDate: "2025-06-30",
  },
  {
    id: "3",
    title: "Reduce Bug Rate by 20%",
    progress: 85,
    status: "in_progress",
    dueDate: "2025-08-15",
  },
  {
    id: "4",
    title: "Lead Team Project Successfully",
    progress: 60,
    status: "in_progress",
    dueDate: "2025-09-30",
  },
]

const achievements = [
  {
    id: "1",
    title: "Top Performer Q2 2025",
    icon: Award,
    date: "2025-06-30",
    description: "Achieved highest performance rating in the team",
  },
  {
    id: "2",
    title: "Bug Hunter",
    icon: Target,
    date: "2025-05-15",
    description: "Fixed 50+ bugs in production",
  },
  {
    id: "3",
    title: "Team Player",
    icon: ThumbsUp,
    date: "2025-04-20",
    description: "Received 10+ positive peer reviews",
  },
  {
    id: "4",
    title: "Quick Learner",
    icon: Star,
    date: "2025-03-10",
    description: "Completed 5 technical certifications",
  },
]

// Reviews
const recentReviews = [
  {
    id: "1",
    reviewer: "Sarah Mitchell",
    role: "Engineering Lead",
    rating: 5,
    date: "2025-06-15",
    comment: "Exceptional performance on the e-commerce project. Great attention to detail and proactive communication.",
  },
  {
    id: "2",
    reviewer: "Michael Chen",
    role: "Project Manager",
    rating: 4.5,
    date: "2025-05-20",
    comment: "Consistently delivers high-quality work on time. Strong technical skills and team collaboration.",
  },
]

export default function PerformanceTracking() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in_progress":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <PortalLayout
      sidebar={<EmployeeSidebar />}
      title="Performance Tracking"
      userRole="Employee"
      breadcrumbs={[{ label: "Dashboard", href: "/employee" }, { label: "Performance" }]}
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Performance Metrics */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Overall Rating</p>
                  <p className="text-2xl font-bold">4.8/5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold">92%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Achievements</p>
                  <p className="text-2xl font-bold">{achievements.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Review</p>
                  <p className="text-2xl font-bold">4.75</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <CardTitle>Performance Trends</CardTitle>
            </div>
            <CardDescription>Track your performance metrics over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="efficiency" stroke="#3b82f6" name="Efficiency %" />
                <Line type="monotone" dataKey="quality" stroke="#10b981" name="Quality %" />
                <Line type="monotone" dataKey="teamwork" stroke="#8b5cf6" name="Teamwork %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Task Completion */}
          <Card>
            <CardHeader>
              <CardTitle>Task Completion</CardTitle>
              <CardDescription>Completed vs assigned tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={taskCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="assigned" fill="#e2e8f0" name="Assigned" />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Skills Radar */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Assessment</CardTitle>
              <CardDescription>Your skill scores across different areas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={skillsRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Skills"
                    dataKey="score"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Goals Progress */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              <CardTitle>Goals & Objectives</CardTitle>
            </div>
            <CardDescription>Track your progress towards your goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {goals.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{goal.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4" />
                        Due: {goal.dueDate}
                        <Badge
                          className={`ml-2 ${getStatusColor(goal.status)}`}
                        >
                          {goal.status === "completed" ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold">{goal.progress}%</span>
                    </div>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <CardTitle>Achievements</CardTitle>
            </div>
            <CardDescription>Your earned badges and recognitions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <achievement.icon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {achievement.description}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {achievement.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-green-600" />
              <CardTitle>Recent Reviews</CardTitle>
            </div>
            <CardDescription>Feedback from managers and peers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{review.reviewer}</h4>
                      <p className="text-sm text-muted-foreground">{review.role}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                      <span className="font-semibold">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm mb-2">{review.comment}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {review.date}
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

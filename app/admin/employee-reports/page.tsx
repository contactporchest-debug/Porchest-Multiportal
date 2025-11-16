"use client"

import dynamic from "next/dynamic"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  TrendingUp,
  Award,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Users,
  Star,
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

// Employee performance data
const employeePerformance = [
  {
    id: "1",
    name: "John Doe",
    department: "Engineering",
    position: "Senior Developer",
    tasksCompleted: 92,
    tasksAssigned: 100,
    completionRate: 92,
    avgRating: 4.8,
    hoursLogged: 160,
    performance: "excellent",
  },
  {
    id: "2",
    name: "Jane Smith",
    department: "Marketing",
    position: "Marketing Manager",
    tasksCompleted: 85,
    tasksAssigned: 95,
    completionRate: 89,
    avgRating: 4.6,
    hoursLogged: 155,
    performance: "excellent",
  },
  {
    id: "3",
    name: "Michael Chen",
    department: "Sales",
    position: "Sales Lead",
    tasksCompleted: 78,
    tasksAssigned: 90,
    completionRate: 87,
    avgRating: 4.5,
    hoursLogged: 158,
    performance: "good",
  },
  {
    id: "4",
    name: "Sarah Mitchell",
    department: "Engineering",
    position: "Engineering Lead",
    tasksCompleted: 95,
    tasksAssigned: 100,
    completionRate: 95,
    avgRating: 4.9,
    hoursLogged: 165,
    performance: "excellent",
  },
]

// Department performance
const departmentData = [
  { department: "Engineering", avgCompletion: 94, avgRating: 4.7, employees: 12 },
  { department: "Marketing", avgCompletion: 88, avgRating: 4.5, employees: 8 },
  { department: "Sales", avgCompletion: 85, avgRating: 4.4, employees: 10 },
  { department: "HR", avgCompletion: 91, avgRating: 4.6, employees: 5 },
  { department: "Finance", avgCompletion: 89, avgRating: 4.5, employees: 6 },
]

// Monthly performance trend
const monthlyPerformance = [
  { month: "Jan", completion: 85, rating: 4.2 },
  { month: "Feb", completion: 87, rating: 4.3 },
  { month: "Mar", completion: 89, rating: 4.5 },
  { month: "Apr", completion: 91, rating: 4.6 },
  { month: "May", completion: 92, rating: 4.7 },
  { month: "Jun", completion: 94, rating: 4.8 },
]

export default function EmployeeReports() {
  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case "excellent":
        return <Badge className="bg-green-500">Excellent</Badge>
      case "good":
        return <Badge className="bg-blue-500">Good</Badge>
      case "average":
        return <Badge className="bg-yellow-500">Average</Badge>
      case "needs_improvement":
        return <Badge className="bg-red-500">Needs Improvement</Badge>
      default:
        return <Badge variant="secondary">{performance}</Badge>
    }
  }

  return (
    <PortalLayout
      sidebar={<AdminSidebar />}
      title="Employee Performance Reports"
      userRole="Admin"
      breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Employee Reports" }]}
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Employees</p>
                  <p className="text-2xl font-bold">41</p>
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
                  <p className="text-sm text-muted-foreground">Avg Completion Rate</p>
                  <p className="text-2xl font-bold">91%</p>
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
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold">4.6</p>
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
                  <p className="text-sm text-muted-foreground">Top Performers</p>
                  <p className="text-2xl font-bold">15</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Overall Performance Trends</CardTitle>
                <CardDescription>Company-wide performance metrics over time</CardDescription>
              </div>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="completion"
                  stroke="#10b981"
                  name="Completion %"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="rating"
                  stroke="#3b82f6"
                  name="Avg Rating"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>Performance metrics by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgCompletion" fill="#10b981" name="Avg Completion %" />
                <Bar dataKey="employees" fill="#3b82f6" name="Employees" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Individual Employee Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Individual Employee Performance</CardTitle>
            <CardDescription>Detailed performance metrics for each employee</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Tasks</TableHead>
                  <TableHead>Completion Rate</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Hours Logged</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeePerformance.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>
                      {employee.tasksCompleted}/{employee.tasksAssigned}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={employee.completionRate} className="w-16" />
                        <span className="text-sm font-medium">{employee.completionRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-medium">{employee.avgRating}</span>
                      </div>
                    </TableCell>
                    <TableCell>{employee.hoursLogged}h</TableCell>
                    <TableCell>{getPerformanceBadge(employee.performance)}</TableCell>
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

        {/* Department Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Department Summary</CardTitle>
            <CardDescription>Overview of performance by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentData.map((dept, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{dept.department}</h3>
                      <p className="text-sm text-muted-foreground">{dept.employees} employees</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Avg Completion</p>
                        <p className="text-xl font-bold text-green-600">{dept.avgCompletion}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Avg Rating</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                          <p className="text-xl font-bold">{dept.avgRating}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Progress value={dept.avgCompletion} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}

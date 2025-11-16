"use client"

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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  UserPlus,
  Briefcase,
  Code,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Edit,
  Trash2,
  Key,
} from "lucide-react"

// Existing software client accounts
const softwareClients = [
  {
    id: "1",
    companyName: "TechCorp Solutions",
    email: "admin@techcorp.com",
    phone: "+1 (555) 123-4567",
    projectType: "E-Commerce Platform",
    createdDate: "2025-01-15",
    status: "active",
  },
  {
    id: "2",
    companyName: "Startup Innovations",
    email: "contact@startupinnovations.com",
    phone: "+1 (555) 234-5678",
    projectType: "Mobile App Development",
    createdDate: "2025-02-20",
    status: "active",
  },
  {
    id: "3",
    companyName: "Global Enterprises",
    email: "info@globalenterprises.com",
    phone: "+1 (555) 345-6789",
    projectType: "API Integration",
    createdDate: "2025-03-10",
    status: "active",
  },
]

// Existing employee accounts
const employees = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@porchest.com",
    phone: "+1 (555) 456-7890",
    department: "Engineering",
    position: "Senior Developer",
    createdDate: "2024-01-15",
    status: "active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@porchest.com",
    phone: "+1 (555) 567-8901",
    department: "Marketing",
    position: "Marketing Manager",
    createdDate: "2024-02-01",
    status: "active",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.chen@porchest.com",
    phone: "+1 (555) 678-9012",
    department: "Sales",
    position: "Sales Lead",
    createdDate: "2024-03-15",
    status: "active",
  },
  {
    id: "4",
    name: "Sarah Mitchell",
    email: "sarah.mitchell@porchest.com",
    phone: "+1 (555) 789-0123",
    department: "Engineering",
    position: "Engineering Lead",
    createdDate: "2024-01-10",
    status: "active",
  },
]

export default function LoginCreation() {
  const [showClientForm, setShowClientForm] = useState(false)
  const [showEmployeeForm, setShowEmployeeForm] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        )
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <PortalLayout
      sidebar={<AdminSidebar />}
      title="Login Creation"
      userRole="Admin"
      breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Login Creation" }]}
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Code className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Software Clients</p>
                  <p className="text-2xl font-bold">{softwareClients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employees</p>
                  <p className="text-2xl font-bold">{employees.length}</p>
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
                  <p className="text-sm text-muted-foreground">Active Accounts</p>
                  <p className="text-2xl font-bold">{softwareClients.length + employees.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created This Month</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Login Forms */}
        <Tabs defaultValue="software-client" className="space-y-4">
          <TabsList>
            <TabsTrigger value="software-client">Software Client Logins</TabsTrigger>
            <TabsTrigger value="employee">Employee Logins</TabsTrigger>
          </TabsList>

          <TabsContent value="software-client">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-blue-600" />
                      <CardTitle>Software Client Accounts</CardTitle>
                    </div>
                    <CardDescription>Create and manage software client login credentials</CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowClientForm(!showClientForm)}
                    variant={showClientForm ? "outline" : "default"}
                  >
                    {showClientForm ? "Cancel" : "Create New Client"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showClientForm && (
                  <div className="mb-6 p-4 border rounded-lg bg-accent">
                    <h3 className="font-semibold mb-4">Create Software Client Login</h3>
                    <div className="grid gap-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="clientCompany">Company Name</Label>
                          <Input id="clientCompany" placeholder="Tech Solutions Inc" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="clientEmail">
                            <Mail className="h-4 w-4 inline mr-2" />
                            Email Address
                          </Label>
                          <Input id="clientEmail" type="email" placeholder="admin@company.com" />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="clientPhone">
                            <Phone className="h-4 w-4 inline mr-2" />
                            Phone Number
                          </Label>
                          <Input id="clientPhone" type="tel" placeholder="+1 (555) 123-4567" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="projectType">Project Type</Label>
                          <Select>
                            <SelectTrigger id="projectType">
                              <SelectValue placeholder="Select project type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="web">Web Application</SelectItem>
                              <SelectItem value="mobile">Mobile App</SelectItem>
                              <SelectItem value="ecommerce">E-Commerce</SelectItem>
                              <SelectItem value="api">API Integration</SelectItem>
                              <SelectItem value="custom">Custom Solution</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="clientPassword">
                            <Key className="h-4 w-4 inline mr-2" />
                            Initial Password
                          </Label>
                          <Input id="clientPassword" type="password" placeholder="Temporary password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="clientConfirmPassword">Confirm Password</Label>
                          <Input id="clientConfirmPassword" type="password" placeholder="Re-enter password" />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowClientForm(false)}>
                          Cancel
                        </Button>
                        <Button>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Create Client Account
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Project Type</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {softwareClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.companyName}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.phone}</TableCell>
                        <TableCell>{client.projectType}</TableCell>
                        <TableCell>{client.createdDate}</TableCell>
                        <TableCell>{getStatusBadge(client.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Key className="h-4 w-4" />
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

          <TabsContent value="employee">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-purple-600" />
                      <CardTitle>Employee Accounts</CardTitle>
                    </div>
                    <CardDescription>Create and manage employee login credentials</CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowEmployeeForm(!showEmployeeForm)}
                    variant={showEmployeeForm ? "outline" : "default"}
                  >
                    {showEmployeeForm ? "Cancel" : "Create New Employee"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showEmployeeForm && (
                  <div className="mb-6 p-4 border rounded-lg bg-accent">
                    <h3 className="font-semibold mb-4">Create Employee Login</h3>
                    <div className="grid gap-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="employeeName">Full Name</Label>
                          <Input id="employeeName" placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="employeeEmail">
                            <Mail className="h-4 w-4 inline mr-2" />
                            Email Address
                          </Label>
                          <Input id="employeeEmail" type="email" placeholder="john.doe@porchest.com" />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="employeePhone">
                            <Phone className="h-4 w-4 inline mr-2" />
                            Phone Number
                          </Label>
                          <Input id="employeePhone" type="tel" placeholder="+1 (555) 123-4567" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Select>
                            <SelectTrigger id="department">
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="engineering">Engineering</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="sales">Sales</SelectItem>
                              <SelectItem value="hr">Human Resources</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="operations">Operations</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="position">Position</Label>
                          <Input id="position" placeholder="Software Engineer" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="joinDate">
                            <Calendar className="h-4 w-4 inline mr-2" />
                            Join Date
                          </Label>
                          <Input id="joinDate" type="date" />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="employeePassword">
                            <Key className="h-4 w-4 inline mr-2" />
                            Initial Password
                          </Label>
                          <Input id="employeePassword" type="password" placeholder="Temporary password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="employeeConfirmPassword">Confirm Password</Label>
                          <Input id="employeeConfirmPassword" type="password" placeholder="Re-enter password" />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowEmployeeForm(false)}>
                          Cancel
                        </Button>
                        <Button>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Create Employee Account
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.phone}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>{employee.createdDate}</TableCell>
                        <TableCell>{getStatusBadge(employee.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Key className="h-4 w-4" />
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
        </Tabs>
      </div>
    </PortalLayout>
  )
}

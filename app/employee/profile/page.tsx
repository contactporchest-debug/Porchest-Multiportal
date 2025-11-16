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
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Save,
  Upload,
  X,
} from "lucide-react"

export default function ProfileSetup() {
  const [skills, setSkills] = useState([
    "JavaScript",
    "React",
    "TypeScript",
    "Node.js",
  ])
  const [newSkill, setNewSkill] = useState("")

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  return (
    <PortalLayout
      sidebar={<EmployeeSidebar />}
      title="Profile Setup"
      userRole="Employee"
      breadcrumbs={[{ label: "Dashboard", href: "/employee" }, { label: "Profile Setup" }]}
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Profile Picture */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Upload your professional photo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                JD
              </div>
              <div className="flex-1">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New Photo
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              <CardTitle>Personal Information</CardTitle>
            </div>
            <CardDescription>Your basic personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" defaultValue="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" defaultValue="Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@porchest.com"
                  defaultValue="john.doe@porchest.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  defaultValue="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Address
                </Label>
                <Input
                  id="address"
                  placeholder="123 Main St, City, State 12345"
                  defaultValue="123 Main St, New York, NY 10001"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-purple-600" />
              <CardTitle>Professional Information</CardTitle>
            </div>
            <CardDescription>Your role and department details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input id="employeeId" defaultValue="EMP-2025-001" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select defaultValue="engineering">
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
              <div className="space-y-2">
                <Label htmlFor="position">Position/Role</Label>
                <Input
                  id="position"
                  placeholder="Senior Developer"
                  defaultValue="Senior Full Stack Developer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinDate">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Join Date
                </Label>
                <Input id="joinDate" type="date" defaultValue="2024-01-15" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manager">Reporting Manager</Label>
                <Select defaultValue="sarah">
                  <SelectTrigger id="manager">
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah">Sarah Mitchell - Engineering Lead</SelectItem>
                    <SelectItem value="michael">Michael Chen - Project Manager</SelectItem>
                    <SelectItem value="emma">Emma Davis - HR Director</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Work Location</Label>
                <Select defaultValue="new-york">
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new-york">New York, NY</SelectItem>
                    <SelectItem value="san-francisco">San Francisco, CA</SelectItem>
                    <SelectItem value="chicago">Chicago, IL</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills & Expertise */}
        <Card>
          <CardHeader>
            <CardTitle>Skills & Expertise</CardTitle>
            <CardDescription>Add your technical and professional skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill (e.g., Python, Project Management)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddSkill()
                    }
                  }}
                />
                <Button onClick={handleAddSkill} type="button">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} className="px-3 py-1 bg-blue-100 text-blue-700">
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 hover:text-blue-900"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Bio</CardTitle>
            <CardDescription>Tell us about your professional background and goals</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Write a brief professional bio..."
              rows={6}
              defaultValue="Experienced full-stack developer with 5+ years of expertise in building scalable web applications. Passionate about clean code, user experience, and continuous learning. Specializing in React, Node.js, and cloud technologies."
            />
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
            <CardDescription>Contact information for emergencies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="emergencyName">Contact Name</Label>
                <Input
                  id="emergencyName"
                  placeholder="Jane Doe"
                  defaultValue="Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyRelation">Relationship</Label>
                <Input
                  id="emergencyRelation"
                  placeholder="Spouse"
                  defaultValue="Spouse"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Phone Number</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  placeholder="+1 (555) 987-6543"
                  defaultValue="+1 (555) 987-6543"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyEmail">Email Address</Label>
                <Input
                  id="emergencyEmail"
                  type="email"
                  placeholder="jane.doe@email.com"
                  defaultValue="jane.doe@email.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button variant="outline">Cancel</Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </PortalLayout>
  )
}

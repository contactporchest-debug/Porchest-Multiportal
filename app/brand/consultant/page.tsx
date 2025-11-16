"use client"

import { useState } from "react"
import { PortalLayout } from "@/components/portal-layout"
import { BrandSidebar } from "@/components/brand-sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  CheckCircle2,
  Users,
  Briefcase,
  Headphones,
} from "lucide-react"

interface TeamMember {
  id: string
  name: string
  avatar: string
  role: string
  department: string
  email: string
  phone: string
  expertise: string[]
  availability: "available" | "busy" | "offline"
}

const porchestTeam: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Mitchell",
    avatar: "/placeholder.svg",
    role: "Account Manager",
    department: "Client Success",
    email: "sarah.mitchell@porchest.com",
    phone: "+1 (555) 123-4567",
    expertise: ["Campaign Strategy", "Account Management", "Brand Partnerships"],
    availability: "available",
  },
  {
    id: "2",
    name: "David Chen",
    avatar: "/placeholder.svg",
    role: "Technical Support Lead",
    department: "Support",
    email: "david.chen@porchest.com",
    phone: "+1 (555) 234-5678",
    expertise: ["Platform Issues", "Technical Setup", "Integrations"],
    availability: "available",
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    avatar: "/placeholder.svg",
    role: "Marketing Strategist",
    department: "Strategy",
    email: "emma.rodriguez@porchest.com",
    phone: "+1 (555) 345-6789",
    expertise: ["Influencer Selection", "Campaign Optimization", "Analytics"],
    availability: "busy",
  },
  {
    id: "4",
    name: "Michael Park",
    avatar: "/placeholder.svg",
    role: "Billing & Finance",
    department: "Finance",
    email: "michael.park@porchest.com",
    phone: "+1 (555) 456-7890",
    expertise: ["Invoicing", "Payment Issues", "Subscription Management"],
    availability: "available",
  },
  {
    id: "5",
    name: "Lisa Thompson",
    avatar: "/placeholder.svg",
    role: "Customer Success Manager",
    department: "Client Success",
    email: "lisa.thompson@porchest.com",
    phone: "+1 (555) 567-8901",
    expertise: ["Onboarding", "Best Practices", "Training"],
    availability: "available",
  },
  {
    id: "6",
    name: "James Wilson",
    avatar: "/placeholder.svg",
    role: "Sales Director",
    department: "Sales",
    email: "james.wilson@porchest.com",
    phone: "+1 (555) 678-9012",
    expertise: ["Enterprise Solutions", "Custom Plans", "Pricing"],
    availability: "offline",
  },
]

export default function ConsultantContact() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    department: "",
    urgency: "",
  })

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "available":
        return <Badge className="bg-green-500">Available</Badge>
      case "busy":
        return <Badge className="bg-yellow-500">Busy</Badge>
      case "offline":
        return <Badge className="bg-gray-500">Offline</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission - would connect to API
    alert(`Message sent to ${selectedMember?.name || "Porchest team"}!`)
    setFormData({
      subject: "",
      message: "",
      department: "",
      urgency: "",
    })
    setSelectedMember(null)
  }

  return (
    <PortalLayout
      sidebar={<BrandSidebar />}
      title="Contact Porchest Team"
      userRole="Brand Manager"
      breadcrumbs={[{ label: "Dashboard", href: "/brand" }, { label: "Contact Team" }]}
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Header Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="h-6 w-6" />
              Get in Touch with Porchest
            </CardTitle>
            <CardDescription className="text-blue-100">
              Our dedicated team is here to help you succeed with your influencer marketing campaigns
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Quick Contact Options */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Phone Support</h3>
              <p className="text-sm text-muted-foreground mb-2">Mon-Fri, 9AM-6PM EST</p>
              <a href="tel:+15551234567" className="text-blue-600 font-medium">
                +1 (555) 123-4567
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-sm text-muted-foreground mb-2">24/7 Response</p>
              <a href="mailto:support@porchest.com" className="text-purple-600 font-medium">
                support@porchest.com
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Office Location</h3>
              <p className="text-sm text-muted-foreground mb-2">San Francisco, CA</p>
              <p className="text-sm font-medium">123 Market Street, Suite 500</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Members */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Our Team ({porchestTeam.length})</h3>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="success">Client Success</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="strategy">Strategy</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {porchestTeam.map((member) => (
              <Card
                key={member.id}
                className={`hover:shadow-lg transition-all cursor-pointer ${
                  selectedMember?.id === member.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedMember(member)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{member.name}</CardTitle>
                          <CardDescription>{member.role}</CardDescription>
                        </div>
                        {getAvailabilityBadge(member.availability)}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          <Briefcase className="h-3 w-3 mr-1" />
                          {member.department}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${member.email}`} className="hover:text-blue-600">
                          {member.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${member.phone}`} className="hover:text-blue-600">
                          {member.phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center justify-end">
                      <Button
                        size="sm"
                        onClick={() => setSelectedMember(member)}
                        disabled={member.availability === "offline"}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Send Message
                </CardTitle>
                <CardDescription>
                  {selectedMember
                    ? `Contact ${selectedMember.name}`
                    : "Select a team member or send a general inquiry"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {selectedMember && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedMember.avatar} alt={selectedMember.name} />
                          <AvatarFallback>
                            {selectedMember.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{selectedMember.name}</p>
                          <p className="text-xs text-muted-foreground">{selectedMember.role}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                      required
                    >
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="success">Client Success</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="strategy">Marketing Strategy</SelectItem>
                        <SelectItem value="finance">Billing & Finance</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="general">General Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="e.g., Help with campaign setup"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency">Priority Level</Label>
                    <Select
                      value={formData.urgency}
                      onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                      required
                    >
                      <SelectTrigger id="urgency">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - General question</SelectItem>
                        <SelectItem value="medium">Medium - Need help soon</SelectItem>
                        <SelectItem value="high">High - Urgent issue</SelectItem>
                        <SelectItem value="critical">Critical - Service down</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Describe your question or issue in detail..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>

                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                    <p>We typically respond within 2-4 business hours. For urgent issues, please call us directly.</p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Support Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Support Hours & Response Times
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Business Hours</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday:</span>
                    <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday:</span>
                    <span className="font-medium">10:00 AM - 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday:</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Expected Response Times</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Critical Issues:</span>
                    <span className="font-medium text-red-600">< 1 hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">High Priority:</span>
                    <span className="font-medium text-orange-600">2-4 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Medium/Low Priority:</span>
                    <span className="font-medium text-green-600">4-24 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}

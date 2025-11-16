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
  Star,
  Calendar,
  Award,
  TrendingUp,
  Users,
  Send,
  Clock,
  CheckCircle2,
} from "lucide-react"

interface Consultant {
  id: string
  name: string
  avatar: string
  title: string
  specialties: string[]
  rating: number
  totalCampaigns: number
  avgROI: number
  experience: string
  availability: "available" | "busy" | "booked"
  responseTime: string
}

const consultants: Consultant[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg",
    title: "Senior Marketing Strategist",
    specialties: ["Fashion", "Lifestyle", "E-commerce"],
    rating: 4.9,
    totalCampaigns: 127,
    avgROI: 385,
    experience: "8+ years",
    availability: "available",
    responseTime: "< 2 hours",
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "/placeholder.svg",
    title: "Influencer Campaign Expert",
    specialties: ["Tech", "Gaming", "Electronics"],
    rating: 4.8,
    totalCampaigns: 98,
    avgROI: 412,
    experience: "6+ years",
    availability: "available",
    responseTime: "< 4 hours",
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    avatar: "/placeholder.svg",
    title: "Social Media Growth Specialist",
    specialties: ["Health", "Fitness", "Wellness"],
    rating: 5.0,
    totalCampaigns: 156,
    avgROI: 445,
    experience: "10+ years",
    availability: "busy",
    responseTime: "< 24 hours",
  },
  {
    id: "4",
    name: "David Park",
    avatar: "/placeholder.svg",
    title: "ROI Optimization Consultant",
    specialties: ["Finance", "Business", "SaaS"],
    rating: 4.7,
    totalCampaigns: 89,
    avgROI: 398,
    experience: "5+ years",
    availability: "available",
    responseTime: "< 3 hours",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    avatar: "/placeholder.svg",
    title: "Brand Partnership Director",
    specialties: ["Beauty", "Cosmetics", "Skincare"],
    rating: 4.9,
    totalCampaigns: 143,
    avgROI: 421,
    experience: "9+ years",
    availability: "booked",
    responseTime: "< 48 hours",
  },
  {
    id: "6",
    name: "James Wilson",
    avatar: "/placeholder.svg",
    title: "Content Strategy Lead",
    specialties: ["Travel", "Food", "Hospitality"],
    rating: 4.8,
    totalCampaigns: 112,
    avgROI: 367,
    experience: "7+ years",
    availability: "available",
    responseTime: "< 2 hours",
  },
]

export default function ConsultantContact() {
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null)
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    preferredTime: "",
    urgency: "",
  })

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "available":
        return <Badge className="bg-green-500">Available Now</Badge>
      case "busy":
        return <Badge className="bg-yellow-500">Limited Availability</Badge>
      case "booked":
        return <Badge className="bg-red-500">Fully Booked</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission - would connect to API
    alert(`Message sent to ${selectedConsultant?.name || "consultant"}!`)
    setFormData({
      subject: "",
      message: "",
      preferredTime: "",
      urgency: "",
    })
    setSelectedConsultant(null)
  }

  return (
    <PortalLayout
      sidebar={<BrandSidebar />}
      title="Consultant Contact"
      userRole="Brand Manager"
      breadcrumbs={[{ label: "Dashboard", href: "/brand" }, { label: "Consultant Contact" }]}
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Header Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Get Expert Guidance</CardTitle>
            <CardDescription className="text-blue-100">
              Connect with our top marketing consultants to optimize your campaigns and maximize ROI
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Consultant Listings */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Available Consultants ({consultants.length})</h3>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="campaigns">Most Campaigns</SelectItem>
                  <SelectItem value="roi">Best ROI</SelectItem>
                  <SelectItem value="availability">Availability</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {consultants.map((consultant) => (
              <Card
                key={consultant.id}
                className={`hover:shadow-lg transition-all cursor-pointer ${
                  selectedConsultant?.id === consultant.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedConsultant(consultant)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={consultant.avatar} alt={consultant.name} />
                      <AvatarFallback>
                        {consultant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{consultant.name}</CardTitle>
                          <CardDescription>{consultant.title}</CardDescription>
                        </div>
                        {getAvailabilityBadge(consultant.availability)}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {consultant.specialties.map((specialty, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <div>
                        <p className="font-semibold">{consultant.rating}</p>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="font-semibold">{consultant.avgROI}%</p>
                        <p className="text-xs text-muted-foreground">Avg ROI</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="font-semibold">{consultant.totalCampaigns}</p>
                        <p className="text-xs text-muted-foreground">Campaigns</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <div>
                        <p className="font-semibold">{consultant.responseTime}</p>
                        <p className="text-xs text-muted-foreground">Response</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Award className="h-4 w-4" />
                      <span>{consultant.experience} experience</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setSelectedConsultant(consultant)}
                      disabled={consultant.availability === "booked"}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
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
                  Contact Consultant
                </CardTitle>
                <CardDescription>
                  {selectedConsultant
                    ? `Send a message to ${selectedConsultant.name}`
                    : "Select a consultant to send a message"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedConsultant ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedConsultant.avatar} alt={selectedConsultant.name} />
                          <AvatarFallback>
                            {selectedConsultant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{selectedConsultant.name}</p>
                          <p className="text-xs text-muted-foreground">{selectedConsultant.title}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="e.g., Campaign Strategy Consultation"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="urgency">Urgency</Label>
                      <Select
                        value={formData.urgency}
                        onValueChange={(value) => setFormData({ ...formData, urgency: value })}
                        required
                      >
                        <SelectTrigger id="urgency">
                          <SelectValue placeholder="Select urgency level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - General inquiry</SelectItem>
                          <SelectItem value="medium">Medium - Need help soon</SelectItem>
                          <SelectItem value="high">High - Urgent assistance needed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="preferredTime">Preferred Contact Time</Label>
                      <Select
                        value={formData.preferredTime}
                        onValueChange={(value) => setFormData({ ...formData, preferredTime: value })}
                        required
                      >
                        <SelectTrigger id="preferredTime">
                          <SelectValue placeholder="Select preferred time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                          <SelectItem value="evening">Evening (5 PM - 8 PM)</SelectItem>
                          <SelectItem value="anytime">Anytime</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Describe your needs and how the consultant can help..."
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
                      <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500" />
                      <p>
                        Expected response time: <span className="font-semibold">{selectedConsultant.responseTime}</span>
                      </p>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Select a consultant from the list to start a conversation
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tips for Working with Consultants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Be Specific</h4>
                  <p className="text-xs text-muted-foreground">
                    Clearly describe your goals, budget, and timeline for the best guidance
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Share Data</h4>
                  <p className="text-xs text-muted-foreground">
                    Provide campaign data and analytics to help consultants give accurate advice
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Follow Up</h4>
                  <p className="text-xs text-muted-foreground">
                    Keep consultants updated on progress and results for ongoing optimization
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}

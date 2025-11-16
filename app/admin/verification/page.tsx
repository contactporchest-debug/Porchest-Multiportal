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
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  UserCheck,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Eye,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
} from "lucide-react"

// Pending verification requests
const brandRequests = [
  {
    id: "1",
    companyName: "TechStyle Fashion",
    email: "contact@techstylefashion.com",
    phone: "+1 (555) 234-5678",
    industry: "Fashion & Retail",
    website: "www.techstylefashion.com",
    location: "Los Angeles, CA",
    requestedDate: "2025-06-15",
    status: "pending",
    description: "Leading fashion brand with focus on sustainable clothing",
  },
  {
    id: "2",
    companyName: "GreenLife Organics",
    email: "info@greenlifeorganics.com",
    phone: "+1 (555) 345-6789",
    industry: "Health & Wellness",
    website: "www.greenlifeorganics.com",
    location: "Portland, OR",
    requestedDate: "2025-06-14",
    status: "pending",
    description: "Organic food and wellness products company",
  },
  {
    id: "3",
    companyName: "Digital Innovations Inc",
    email: "hello@digitalinnovations.com",
    phone: "+1 (555) 456-7890",
    industry: "Technology",
    website: "www.digitalinnovations.com",
    location: "Austin, TX",
    requestedDate: "2025-06-13",
    status: "pending",
    description: "Tech solutions for modern businesses",
  },
]

const influencerRequests = [
  {
    id: "1",
    name: "Jessica Martinez",
    email: "jessica.m@email.com",
    phone: "+1 (555) 567-8901",
    niche: "Fashion & Lifestyle",
    platforms: ["Instagram", "TikTok"],
    followers: "250K",
    location: "Miami, FL",
    requestedDate: "2025-06-16",
    status: "pending",
    bio: "Fashion influencer specializing in sustainable style",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    email: "marcus.j@email.com",
    phone: "+1 (555) 678-9012",
    niche: "Tech Reviews",
    platforms: ["YouTube", "Twitter"],
    followers: "180K",
    location: "San Francisco, CA",
    requestedDate: "2025-06-15",
    status: "pending",
    bio: "Tech enthusiast reviewing latest gadgets and software",
  },
  {
    id: "3",
    name: "Amy Chen",
    email: "amy.chen@email.com",
    phone: "+1 (555) 789-0123",
    niche: "Beauty & Skincare",
    platforms: ["Instagram", "YouTube"],
    followers: "320K",
    location: "New York, NY",
    requestedDate: "2025-06-14",
    status: "pending",
    bio: "Beauty expert sharing skincare routines and makeup tutorials",
  },
  {
    id: "4",
    name: "David Lee",
    email: "david.lee@email.com",
    phone: "+1 (555) 890-1234",
    niche: "Fitness & Nutrition",
    platforms: ["Instagram", "TikTok", "YouTube"],
    followers: "450K",
    location: "Los Angeles, CA",
    requestedDate: "2025-06-13",
    status: "pending",
    bio: "Personal trainer and nutrition coach helping people transform their lives",
  },
  {
    id: "5",
    name: "Sophia Rodriguez",
    email: "sophia.r@email.com",
    phone: "+1 (555) 901-2345",
    niche: "Travel & Adventure",
    platforms: ["Instagram", "YouTube"],
    followers: "290K",
    location: "Denver, CO",
    requestedDate: "2025-06-12",
    status: "pending",
    bio: "Adventure seeker documenting travels around the world",
  },
]

// Approved/Rejected history
const verificationHistory = [
  {
    id: "1",
    name: "Sarah's Boutique",
    type: "Brand",
    email: "sarah@boutique.com",
    status: "approved",
    verifiedDate: "2025-06-10",
    verifiedBy: "Admin User",
  },
  {
    id: "2",
    name: "John Smith",
    type: "Influencer",
    email: "john.s@email.com",
    status: "approved",
    verifiedDate: "2025-06-09",
    verifiedBy: "Admin User",
  },
  {
    id: "3",
    name: "Fake Brand LLC",
    type: "Brand",
    email: "fake@email.com",
    status: "rejected",
    verifiedDate: "2025-06-08",
    verifiedBy: "Admin User",
  },
]

export default function UserVerification() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [selectedInfluencer, setSelectedInfluencer] = useState<string | null>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-500">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-500">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleApprove = (id: string, type: string) => {
    alert(`Approved ${type} with ID: ${id}`)
    // In a real app, this would make an API call
  }

  const handleReject = (id: string, type: string) => {
    alert(`Rejected ${type} with ID: ${id}`)
    // In a real app, this would make an API call
  }

  return (
    <PortalLayout
      sidebar={<AdminSidebar />}
      title="User Verification"
      userRole="Admin"
      breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "User Verification" }]}
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{brandRequests.length + influencerRequests.length}</p>
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
                  <p className="text-sm text-muted-foreground">Approved Today</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rejected Today</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Verified</p>
                  <p className="text-2xl font-bold">1,247</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or company..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Verification Tabs */}
        <Tabs defaultValue="brands" className="space-y-4">
          <TabsList>
            <TabsTrigger value="brands">Brand Requests ({brandRequests.length})</TabsTrigger>
            <TabsTrigger value="influencers">Influencer Requests ({influencerRequests.length})</TabsTrigger>
            <TabsTrigger value="history">Verification History</TabsTrigger>
          </TabsList>

          <TabsContent value="brands">
            <Card>
              <CardHeader>
                <CardTitle>Pending Brand Verifications</CardTitle>
                <CardDescription>Review and approve or reject brand signup requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {brandRequests.map((brand) => (
                    <div
                      key={brand.id}
                      className="p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{brand.companyName}</h3>
                          <div className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {brand.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {brand.phone}
                            </div>
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              {brand.website}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {brand.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Requested: {brand.requestedDate}
                            </div>
                          </div>
                          <p className="mt-3 text-sm">{brand.description}</p>
                          <Badge className="mt-2">{brand.industry}</Badge>
                        </div>
                        <div>{getStatusBadge(brand.status)}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(brand.id, "Brand")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(brand.id, "Brand")}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="influencers">
            <Card>
              <CardHeader>
                <CardTitle>Pending Influencer Verifications</CardTitle>
                <CardDescription>Review and approve or reject influencer signup requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {influencerRequests.map((influencer) => (
                    <div
                      key={influencer.id}
                      className="p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{influencer.name}</h3>
                          <div className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {influencer.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {influencer.phone}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {influencer.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Requested: {influencer.requestedDate}
                            </div>
                          </div>
                          <p className="mt-3 text-sm">{influencer.bio}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge>{influencer.niche}</Badge>
                            <Badge variant="outline">{influencer.followers} followers</Badge>
                            {influencer.platforms.map((platform) => (
                              <Badge key={platform} variant="secondary">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>{getStatusBadge(influencer.status)}</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(influencer.id, "Influencer")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(influencer.id, "Influencer")}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Verification History</CardTitle>
                <CardDescription>Recently approved or rejected requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Verified By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {verificationHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.name}</TableCell>
                        <TableCell>{record.type}</TableCell>
                        <TableCell>{record.email}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell>{record.verifiedDate}</TableCell>
                        <TableCell>{record.verifiedBy}</TableCell>
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

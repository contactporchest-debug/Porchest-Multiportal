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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  FileText,
  Building2,
  Users,
  Code,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Eye,
  Search,
  Calendar,
} from "lucide-react"

// Brand contracts
const brandContracts = [
  {
    id: "BC-2025-001",
    brand: "TechStyle Fashion",
    type: "Campaign Services",
    value: 12500,
    startDate: "2025-01-15",
    endDate: "2025-07-15",
    status: "active",
    influencersCount: 5,
  },
  {
    id: "BC-2025-002",
    brand: "GreenLife Organics",
    type: "Influencer Marketing",
    value: 8500,
    startDate: "2025-02-01",
    endDate: "2025-08-01",
    status: "active",
    influencersCount: 3,
  },
  {
    id: "BC-2025-003",
    brand: "Digital Innovations Inc",
    type: "Social Media Campaign",
    value: 15000,
    startDate: "2025-03-10",
    endDate: "2025-09-10",
    status: "active",
    influencersCount: 7,
  },
  {
    id: "BC-2024-045",
    brand: "Fashion Forward",
    type: "Campaign Services",
    value: 9200,
    startDate: "2024-10-01",
    endDate: "2025-04-01",
    status: "completed",
    influencersCount: 4,
  },
]

// Influencer contracts
const influencerContracts = [
  {
    id: "IC-2025-001",
    influencer: "Sarah Johnson",
    campaign: "Summer Fashion Campaign",
    brand: "TechStyle Fashion",
    value: 2500,
    startDate: "2025-01-15",
    endDate: "2025-07-15",
    status: "active",
    deliverables: "10 posts, 5 stories",
  },
  {
    id: "IC-2025-002",
    influencer: "Marcus Johnson",
    campaign: "Tech Review Campaign",
    brand: "Digital Innovations Inc",
    value: 1800,
    startDate: "2025-02-01",
    endDate: "2025-05-01",
    status: "active",
    deliverables: "5 YouTube videos",
  },
  {
    id: "IC-2025-003",
    influencer: "Amy Chen",
    campaign: "Beauty Launch",
    brand: "Beauty Co",
    value: 3200,
    startDate: "2025-01-20",
    endDate: "2025-06-20",
    status: "active",
    deliverables: "8 posts, 10 stories, 2 reels",
  },
  {
    id: "IC-2025-004",
    influencer: "David Lee",
    campaign: "Fitness Challenge",
    brand: "FitLife",
    value: 4500,
    startDate: "2025-02-15",
    endDate: "2025-08-15",
    status: "active",
    deliverables: "12 posts, 20 stories",
  },
]

// Software client contracts
const softwareContracts = [
  {
    id: "SC-2025-001",
    client: "TechCorp Solutions",
    project: "E-Commerce Platform",
    value: 50000,
    startDate: "2025-01-15",
    endDate: "2025-07-15",
    status: "in_progress",
    milestone: "Development Phase",
  },
  {
    id: "SC-2025-002",
    client: "Startup Innovations",
    project: "Mobile App Development",
    value: 40000,
    startDate: "2025-02-01",
    endDate: "2025-08-01",
    status: "in_progress",
    milestone: "Design Phase",
  },
  {
    id: "SC-2025-003",
    client: "Global Enterprises",
    project: "API Integration",
    value: 25000,
    startDate: "2025-03-10",
    endDate: "2025-06-30",
    status: "in_progress",
    milestone: "Testing Phase",
  },
  {
    id: "SC-2024-012",
    client: "Analytics Corp",
    project: "Data Analytics Platform",
    value: 35000,
    startDate: "2024-11-01",
    endDate: "2025-05-31",
    status: "completed",
    milestone: "Delivered",
  },
]

export default function AllContracts() {
  const [searchQuery, setSearchQuery] = useState("")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "in_progress":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        )
      case "completed":
      case "delivered":
        return (
          <Badge className="bg-blue-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-500">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "expired":
      case "cancelled":
        return (
          <Badge variant="secondary">
            <XCircle className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const totalBrandValue = brandContracts.reduce((sum, c) => sum + c.value, 0)
  const totalInfluencerValue = influencerContracts.reduce((sum, c) => sum + c.value, 0)
  const totalSoftwareValue = softwareContracts.reduce((sum, c) => sum + c.value, 0)

  return (
    <PortalLayout
      sidebar={<AdminSidebar />}
      title="All Contracts"
      userRole="Admin"
      breadcrumbs={[{ label: "Dashboard", href: "/admin" }, { label: "All Contracts" }]}
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Contracts</p>
                  <p className="text-2xl font-bold">
                    {brandContracts.length + influencerContracts.length + softwareContracts.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Brand Contracts</p>
                  <p className="text-2xl font-bold">{brandContracts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Influencer Contracts</p>
                  <p className="text-2xl font-bold">{influencerContracts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Code className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Software Contracts</p>
                  <p className="text-2xl font-bold">{softwareContracts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contract Value Summary */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Brand Contract Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">
                ${totalBrandValue.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {brandContracts.filter((c) => c.status === "active").length} active contracts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Influencer Contract Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-pink-600">
                ${totalInfluencerValue.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {influencerContracts.filter((c) => c.status === "active").length} active contracts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Software Contract Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">
                ${totalSoftwareValue.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {softwareContracts.filter((c) => c.status === "in_progress").length} active projects
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contracts by ID, client, or project name..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contract Tabs */}
        <Tabs defaultValue="brands" className="space-y-4">
          <TabsList>
            <TabsTrigger value="brands">Brand Contracts ({brandContracts.length})</TabsTrigger>
            <TabsTrigger value="influencers">Influencer Contracts ({influencerContracts.length})</TabsTrigger>
            <TabsTrigger value="software">Software Contracts ({softwareContracts.length})</TabsTrigger>
          </TabsList>

          {/* Brand Contracts */}
          <TabsContent value="brands">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Brand Contracts</CardTitle>
                    <CardDescription>All brand campaign and service contracts</CardDescription>
                  </div>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contract ID</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Influencers</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {brandContracts.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell className="font-mono">{contract.id}</TableCell>
                        <TableCell className="font-medium">{contract.brand}</TableCell>
                        <TableCell>{contract.type}</TableCell>
                        <TableCell className="font-semibold">
                          ${contract.value.toLocaleString()}
                        </TableCell>
                        <TableCell>{contract.startDate}</TableCell>
                        <TableCell>{contract.endDate}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{contract.influencersCount}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(contract.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
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

          {/* Influencer Contracts */}
          <TabsContent value="influencers">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Influencer Contracts</CardTitle>
                    <CardDescription>All influencer campaign contracts</CardDescription>
                  </div>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contract ID</TableHead>
                      <TableHead>Influencer</TableHead>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Deliverables</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {influencerContracts.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell className="font-mono">{contract.id}</TableCell>
                        <TableCell className="font-medium">{contract.influencer}</TableCell>
                        <TableCell>{contract.campaign}</TableCell>
                        <TableCell>{contract.brand}</TableCell>
                        <TableCell className="font-semibold">
                          ${contract.value.toLocaleString()}
                        </TableCell>
                        <TableCell>{contract.startDate}</TableCell>
                        <TableCell>{contract.endDate}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{contract.deliverables}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(contract.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
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

          {/* Software Contracts */}
          <TabsContent value="software">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Software Development Contracts</CardTitle>
                    <CardDescription>All software client project contracts</CardDescription>
                  </div>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contract ID</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Milestone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {softwareContracts.map((contract) => (
                      <TableRow key={contract.id}>
                        <TableCell className="font-mono">{contract.id}</TableCell>
                        <TableCell className="font-medium">{contract.client}</TableCell>
                        <TableCell>{contract.project}</TableCell>
                        <TableCell className="font-semibold">
                          ${contract.value.toLocaleString()}
                        </TableCell>
                        <TableCell>{contract.startDate}</TableCell>
                        <TableCell>{contract.endDate}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{contract.milestone}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(contract.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
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

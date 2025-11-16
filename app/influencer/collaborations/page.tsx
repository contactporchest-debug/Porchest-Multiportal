"use client"

import { useState } from "react"
import { PortalLayout } from "@/components/portal-layout"
import { InfluencerSidebar } from "@/components/influencer-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Calendar, DollarSign, Clock, CheckCircle, XCircle, Eye, MessageSquare } from "lucide-react"

const collaborationRequests = [
  {
    id: 1,
    brand: "Fashion Forward",
    brandLogo: "/placeholder.svg?height=40&width=40",
    campaign: "Summer Collection Launch",
    description:
      "We're looking for fashion influencers to showcase our new summer collection. The campaign focuses on sustainable fashion and eco-friendly materials.",
    budget: 2500,
    deadline: "2024-07-20",
    deliverables: ["3 Instagram posts", "2 Instagram stories", "1 Reel"],
    requirements: "Must have 50K+ followers, fashion niche, US-based",
    status: "pending",
    receivedDate: "2024-07-01",
  },
  {
    id: 2,
    brand: "TechGear Pro",
    brandLogo: "/placeholder.svg?height=40&width=40",
    campaign: "Product Review Series",
    description: "Looking for tech reviewers to create authentic content about our latest smartphone accessories.",
    budget: 1800,
    deadline: "2024-08-15",
    deliverables: ["1 YouTube video", "3 Instagram posts", "Product unboxing"],
    requirements: "Tech niche, video content experience",
    status: "pending",
    receivedDate: "2024-06-28",
  },
  {
    id: 3,
    brand: "Wellness Co",
    brandLogo: "/placeholder.svg?height=40&width=40",
    campaign: "Health & Fitness Challenge",
    description: "30-day wellness challenge featuring our supplement line and fitness programs.",
    budget: 3200,
    deadline: "2024-08-01",
    deliverables: ["4 Instagram posts", "1 Reel per week", "Story updates"],
    requirements: "Fitness/wellness niche, active lifestyle content",
    status: "pending",
    receivedDate: "2024-06-25",
  },
]

const activeCollaborations = [
  {
    id: 4,
    brand: "Beauty Essentials",
    campaign: "Skincare Routine Series",
    budget: 2200,
    deadline: "2024-07-25",
    progress: 60,
    deliverables: ["2 Instagram posts", "1 Tutorial video"],
    status: "active",
  },
  {
    id: 5,
    brand: "Travel Gear",
    campaign: "Adventure Collection",
    budget: 1900,
    deadline: "2024-08-10",
    progress: 30,
    deliverables: ["3 Instagram posts", "Travel story series"],
    status: "active",
  },
]

export default function CollaborationRequests() {
  const [selectedRequest, setSelectedRequest] = useState<any>(null)

  const handleAccept = (requestId: number) => {
    // TODO: Implement API call to accept collaboration request
  }

  const handleDecline = (requestId: number) => {
    // TODO: Implement API call to decline collaboration request
  }

  return (
    <PortalLayout
      sidebar={<InfluencerSidebar />}
      title="Collaboration Requests"
      userRole="Influencer"
      breadcrumbs={[{ label: "Dashboard", href: "/influencer" }, { label: "Collaboration Requests" }]}
    >
      <div className="space-y-6">
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">Pending Requests ({collaborationRequests.length})</TabsTrigger>
            <TabsTrigger value="active">Active Collaborations ({activeCollaborations.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {collaborationRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={request.brandLogo || "/placeholder.svg"} alt={request.brand} />
                        <AvatarFallback>{request.brand.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{request.campaign}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <span>{request.brand}</span>
                          <Badge variant="outline">New</Badge>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">${request.budget.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Budget</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{request.description}</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Deliverables:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {request.deliverables.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Requirements:</h4>
                      <p className="text-sm text-muted-foreground">{request.requirements}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Due: {request.deadline}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Received: {request.receivedDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{selectedRequest?.campaign}</DialogTitle>
                            <DialogDescription>{selectedRequest?.brand}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Campaign Description</h4>
                              <p className="text-sm">{selectedRequest?.description}</p>
                            </div>
                            <Separator />
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Budget</h4>
                                <p className="text-2xl font-bold text-green-600">
                                  ${selectedRequest?.budget.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Deadline</h4>
                                <p>{selectedRequest?.deadline}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Deliverables</h4>
                              <ul className="space-y-1">
                                {selectedRequest?.deliverables.map((item: string, index: number) => (
                                  <li key={index} className="text-sm">
                                    • {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => handleDecline(selectedRequest?.id)}>
                                <XCircle className="mr-2 h-4 w-4" />
                                Decline
                              </Button>
                              <Button onClick={() => handleAccept(selectedRequest?.id)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Accept
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" onClick={() => handleDecline(request.id)}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Decline
                      </Button>
                      <Button size="sm" onClick={() => handleAccept(request.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Accept
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activeCollaborations.map((collab) => (
              <Card key={collab.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{collab.campaign}</CardTitle>
                      <CardDescription>{collab.brand}</CardDescription>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">{collab.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${collab.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>${collab.budget.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Due: {collab.deadline}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message
                      </Button>
                      <Button size="sm">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No completed collaborations yet</h3>
                  <p className="text-muted-foreground">Your completed collaborations will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  )
}

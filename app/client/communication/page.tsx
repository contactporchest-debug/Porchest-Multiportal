"use client"

import { useState } from "react"
import { PortalLayout } from "@/components/portal-layout"
import { ClientSidebar } from "@/components/client-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Send, Paperclip, Phone, Video, MoreHorizontal, Search, Plus, Calendar } from "lucide-react"

const conversations = [
  {
    id: 1,
    name: "John Doe",
    role: "Project Manager",
    project: "E-commerce Platform",
    lastMessage: "The payment integration is now complete and ready for testing.",
    timestamp: "2 hours ago",
    unread: 2,
    avatar: "/pm-avatar.jpg",
    online: true,
  },
  {
    id: 2,
    name: "Sarah Wilson",
    role: "Lead Developer",
    project: "Mobile Banking App",
    lastMessage: "I've uploaded the latest build to the staging environment.",
    timestamp: "1 day ago",
    unread: 0,
    avatar: "/dev-avatar.jpg",
    online: false,
  },
  {
    id: 3,
    name: "Alex Turner",
    role: "UI/UX Designer",
    project: "CRM System",
    lastMessage: "The wireframes are ready for your review.",
    timestamp: "2 days ago",
    unread: 1,
    avatar: "/designer-avatar.jpg",
    online: true,
  },
]

const messages = [
  {
    id: 1,
    sender: "John Doe",
    content: "Hi! I wanted to update you on the payment integration progress.",
    timestamp: "10:30 AM",
    isClient: false,
    avatar: "/pm-avatar.jpg",
  },
  {
    id: 2,
    sender: "You",
    content: "Great! How is it looking?",
    timestamp: "10:32 AM",
    isClient: true,
  },
  {
    id: 3,
    sender: "John Doe",
    content:
      "We've successfully integrated both Stripe and PayPal. The testing phase is complete and everything is working smoothly. We're ready to deploy to staging.",
    timestamp: "10:35 AM",
    isClient: false,
    avatar: "/pm-avatar.jpg",
  },
  {
    id: 4,
    sender: "John Doe",
    content: "I've also attached the test results and integration documentation for your review.",
    timestamp: "10:36 AM",
    isClient: false,
    avatar: "/pm-avatar.jpg",
    attachment: "payment-integration-test-results.pdf",
  },
  {
    id: 5,
    sender: "You",
    content: "Excellent work! When can we schedule the demo?",
    timestamp: "11:15 AM",
    isClient: true,
  },
  {
    id: 6,
    sender: "John Doe",
    content: "How about tomorrow at 2 PM? I can walk you through all the features.",
    timestamp: "11:20 AM",
    isClient: false,
    avatar: "/pm-avatar.jpg",
  },
]

const announcements = [
  {
    id: 1,
    title: "System Maintenance Scheduled",
    content:
      "We will be performing system maintenance on July 15th from 2 AM to 4 AM EST. Services may be temporarily unavailable.",
    timestamp: "3 days ago",
    priority: "medium",
  },
  {
    id: 2,
    title: "New Feature: Real-time Collaboration",
    content:
      "We're excited to announce our new real-time collaboration feature that allows you to work directly with your development team.",
    timestamp: "1 week ago",
    priority: "low",
  },
  {
    id: 3,
    title: "Security Update Required",
    content:
      "Please update your password as part of our quarterly security review. Use the link in your email to update.",
    timestamp: "2 weeks ago",
    priority: "high",
  },
]

const meetings = [
  {
    id: 1,
    title: "Payment Integration Demo",
    time: "Tomorrow at 2:00 PM EST",
    with: "John Doe (Project Manager)",
    location: "Google Meet",
  },
  {
    id: 2,
    title: "Design Review",
    time: "Friday at 11:00 AM EST",
    with: "Alex Turner (UI/UX Designer)",
    location: "Zoom",
  },
]

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-red-500 text-white"
    case "medium":
      return "bg-yellow-500 text-black"
    case "low":
      return "bg-blue-500 text-white"
    default:
      return "bg-gray-500 text-white"
  }
}

export default function CommunicationPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      console.log("[v0] Sending message:", newMessage)
      setNewMessage("")
    }
  }

  return (
    <PortalLayout
      sidebar={<ClientSidebar />}
      title="Communication Hub"
      userRole="Client"
      breadcrumbs={[{ label: "Dashboard", href: "/client" }, { label: "Communication" }]}
    >
      <div className="space-y-6">
        <Tabs defaultValue="messages" className="space-y-4">
          <TabsList>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
          </TabsList>

          <TabsContent value="messages">
            <div className="grid md:grid-cols-3 gap-6 h-[600px]">
              {/* Conversations List */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Conversations</CardTitle>
                    <Button size="sm" aria-label="Start new conversation">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search conversations..." className="pl-10" aria-label="Search conversations" />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-1 p-4">
                      {conversations.map((conversation) => (
                        <button
                          type="button"
                          key={conversation.id}
                          className={`w-full text-left flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedConversation.id === conversation.id ? "bg-secondary" : "hover:bg-muted"
                          }`}
                          onClick={() => setSelectedConversation(conversation)}
                        >
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={conversation.avatar || "/placeholder.svg?height=40&width=40&query=avatar"}
                                alt={`${conversation.name} avatar`}
                              />
                              <AvatarFallback>
                                {conversation.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            {conversation.online && (
                              <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium truncate">{conversation.name}</p>
                              <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {conversation.role} • {conversation.project}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                          </div>
                          {conversation.unread > 0 && (
                            <Badge className="bg-primary text-primary-foreground">{conversation.unread}</Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Chat Area */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={selectedConversation.avatar || "/placeholder.svg?height=40&width=40&query=avatar"}
                          alt={`${selectedConversation.name} avatar`}
                        />
                        <AvatarFallback>
                          {selectedConversation.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{selectedConversation.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedConversation.role} • {selectedConversation.project}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" aria-label="Start voice call">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" aria-label="Start video call">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" aria-label="More options">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="p-0">
                  <ScrollArea className="h-[350px] p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.isClient ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`flex space-x-2 max-w-[70%] ${
                              message.isClient ? "flex-row-reverse space-x-reverse" : ""
                            }`}
                          >
                            {!message.isClient && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={message.avatar || "/placeholder.svg?height=32&width=32&query=avatar"}
                                  alt={`${message.sender} avatar`}
                                />
                                <AvatarFallback className="text-xs">
                                  {message.sender
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`rounded-lg p-3 ${
                                message.isClient ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              {message.attachment && (
                                <div className="mt-2 p-2 bg-background/10 rounded border">
                                  <div className="flex items-center gap-2">
                                    <Paperclip className="h-4 w-4" />
                                    <span className="text-xs">{message.attachment}</span>
                                  </div>
                                </div>
                              )}
                              <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <Separator />
                  <div className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" aria-label="Attach file">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") sendMessage()
                        }}
                        className="flex-1"
                        aria-label="Message input"
                      />
                      <Button onClick={sendMessage} aria-label="Send message">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="announcements">
            <Card>
              <CardHeader>
                <CardTitle>Company Announcements</CardTitle>
                <CardDescription>Important updates and notifications from Porchest</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{announcement.title}</h3>
                            <Badge className={getPriorityColor(announcement.priority)}>{announcement.priority}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{announcement.content}</p>
                          <p className="text-xs text-muted-foreground">{announcement.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meetings">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Meetings</CardTitle>
                <CardDescription>Scheduled meetings and calls with your development team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {meetings.map((m) => (
                    <div key={m.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <h3 className="font-semibold">{m.title}</h3>
                            <p className="text-sm text-muted-foreground">{m.time}</p>
                            <p className="text-xs text-muted-foreground">
                              With {m.with} • {m.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" aria-label="Add to calendar">
                            Add to calendar
                          </Button>
                          <Button size="sm" aria-label="Join meeting">
                            Join
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  )
}

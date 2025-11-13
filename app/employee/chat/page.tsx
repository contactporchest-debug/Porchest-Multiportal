"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Phone, Video, MoreVertical, Search } from "lucide-react"
import PortalLayout from "@/components/portal-layout"
import EmployeeSidebar from "@/components/employee-sidebar"
import { mockData } from "@/lib/mock-data"

export default function TeamChat() {
  const [selectedChat, setSelectedChat] = useState(mockData.employee.chatChannels[0])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage("")
    }
  }

  return (
    <PortalLayout sidebar={<EmployeeSidebar />}>
      <div className="h-[calc(100vh-2rem)] flex gap-6">
        {/* Chat List */}
        <Card className="w-80 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Team Chat</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full">
              <div className="space-y-1 p-4">
                {mockData.employee.chatChannels.map((channel) => (
                  <div
                    key={channel.id}
                    onClick={() => setSelectedChat(channel)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedChat.id === channel.id ? "bg-primary/10" : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{channel.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm truncate">{channel.name}</p>
                          <span className="text-xs text-muted-foreground">{channel.lastMessageTime}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{channel.lastMessage}</p>
                      </div>
                      {channel.unreadCount > 0 && (
                        <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                          {channel.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="flex-1 flex flex-col">
          {/* Chat Header */}
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{selectedChat.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{selectedChat.name}</CardTitle>
                  <CardDescription>
                    {selectedChat.members} members • {selectedChat.status}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {selectedChat.messages.map((message) => (
                  <div key={message.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{message.sender}</span>
                        <span className="text-xs text-muted-foreground">{message.time}</span>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PortalLayout>
  )
}

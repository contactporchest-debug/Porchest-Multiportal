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
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Bot, User, Instagram, Youtube, Video, TrendingUp, Users, Target } from "lucide-react"

interface Message {
  id: number
  type: "user" | "bot"
  content: string
  influencers?: InfluencerCard[]
}

interface InfluencerCard {
  id: string
  name: string
  avatar: string
  niche: string[]
  followers: number
  engagement: number
  platform: string
  price: number
  rating: number
}

const sampleInfluencers: InfluencerCard[] = [
  {
    id: "1",
    name: "Emma Williams",
    avatar: "/placeholder.svg",
    niche: ["Fashion", "Lifestyle", "Sustainability"],
    followers: 555000,
    engagement: 4.8,
    platform: "instagram",
    price: 3500,
    rating: 4.9,
  },
  {
    id: "2",
    name: "Alex Rodriguez",
    avatar: "/placeholder.svg",
    niche: ["Fitness", "Health", "Nutrition"],
    followers: 695000,
    engagement: 6.2,
    platform: "tiktok",
    price: 4000,
    rating: 4.8,
  },
  {
    id: "3",
    name: "Maya Chen",
    avatar: "/placeholder.svg",
    niche: ["Tech", "Gadgets", "Reviews"],
    followers: 420000,
    engagement: 5.1,
    platform: "youtube",
    price: 3000,
    rating: 4.7,
  },
]

const initialMessages: Message[] = [
  {
    id: 1,
    type: "bot",
    content:
      "👋 Hello! I'm your AI influencer recommendation assistant. I can help you find the perfect influencers for your campaign. Tell me about your campaign goals, target audience, or budget!",
  },
]

export default function AIRecommendations() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="h-4 w-4" />
      case "youtube":
        return <Youtube className="h-4 w-4" />
      case "tiktok":
        return <Video className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: input,
    }

    setMessages([...messages, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        type: "bot",
        content:
          "Based on your requirements, I've found these top influencers who would be perfect for your campaign. They have strong engagement rates and align with your target audience.",
        influencers: sampleInfluencers,
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <PortalLayout
      sidebar={<BrandSidebar />}
      title="AI Influencer Recommendations"
      userRole="Brand Manager"
      breadcrumbs={[{ label: "Dashboard", href: "/brand" }, { label: "AI Recommendations" }]}
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Chat Interface */}
        <Card className="h-[calc(100vh-200px)] flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle>AI Recommendation Assistant</CardTitle>
                <CardDescription>
                  Get personalized influencer recommendations powered by AI
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto space-y-4">
            {Array.isArray(messages) && messages.map((message) => {
              if (!message) return null;
              return (
              <div key={message.id}>
                {/* Message Bubble */}
                <div
                  className={`flex items-start gap-3 ${
                    message.type === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    {message.type === "bot" ? (
                      <div className="h-full w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                    ) : (
                      <>
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>

                  <div
                    className={`max-w-[70%] rounded-lg p-4 ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.content || ""}</p>
                  </div>
                </div>

                {/* Influencer Cards */}
                {message.influencers && Array.isArray(message.influencers) && (
                  <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 ml-11">
                    {message.influencers.map((influencer) => {
                      if (!influencer) return null;
                      return (
                      <Card key={influencer.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={influencer.avatar} alt={influencer.name} />
                              <AvatarFallback>
                                {influencer.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{influencer.name}</h4>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                {getPlatformIcon(influencer.platform)}
                                <span className="capitalize">{influencer.platform}</span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-3">
                          {/* Niches */}
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(influencer.niche) && influencer.niche.map((n, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {n}
                              </Badge>
                            ))}
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span className="font-medium">
                                {(influencer.followers / 1000).toFixed(0)}K
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-muted-foreground" />
                              <span className="font-medium">{influencer.engagement}%</span>
                            </div>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(influencer.rating)
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {influencer.rating}
                            </span>
                          </div>

                          {/* Price & Action */}
                          <div className="flex items-center justify-between pt-2 border-t">
                            <span className="text-sm font-bold">
                              ${influencer.price.toLocaleString()}
                            </span>
                            <Button size="sm" variant="outline">
                              <Target className="h-3 w-3 mr-1" />
                              Select
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      );
                    })}
                  </div>
                )}
              </div>
              );
            })}

            {isTyping && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <div className="h-full w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                </Avatar>
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" />
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about influencers, niches, budgets..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Try: "Find fashion influencers with 500K+ followers" or "Fitness influencers under $5000"
            </div>
          </div>
        </Card>
      </div>
    </PortalLayout>
  )
}

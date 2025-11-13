"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"

interface Message {
  id: number
  text: string
  isBot: boolean
  timestamp: Date
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm here to help you with any questions about our services. How can I assist you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const quickReplies = [
    "What services do you offer?",
    "How much does a website cost?",
    "How long does a project take?",
    "Can I see your portfolio?",
    "Do you offer support?",
  ]

  const botResponses: { [key: string]: string } = {
    "what services do you offer?":
      "We offer web development, mobile apps, e-commerce solutions, UI/UX design, SEO & marketing, and ongoing support & maintenance. Would you like to know more about any specific service?",
    "how much does a website cost?":
      "Our web development starts at $999, but the final cost depends on your specific requirements. Would you like to schedule a call to discuss your project and get a custom quote?",
    "how long does a project take?":
      "Project timelines vary based on complexity. A simple website typically takes 2-3 weeks, while complex applications can take 2-3 months. We'll provide a detailed timeline after understanding your requirements.",
    "can i see your portfolio?":
      "I'd be happy to show you our work! Please contact us directly and we'll share relevant portfolio pieces based on your industry and project type.",
    "do you offer support?":
      "Yes! We offer 24/7 support and maintenance services starting at $299/month. This includes monitoring, updates, bug fixes, and performance optimization.",
    default:
      "That's a great question! For detailed information about your specific needs, I'd recommend contacting our team directly. Would you like me to connect you with them?",
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Generate bot response
    setTimeout(() => {
      const lowerInput = inputValue.toLowerCase()
      let botResponse = botResponses.default

      for (const [key, response] of Object.entries(botResponses)) {
        if (key !== "default" && lowerInput.includes(key)) {
          botResponse = response
          break
        }
      }

      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        isBot: true,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1000)

    setInputValue("")
  }

  const handleQuickReply = (reply: string) => {
    setInputValue(reply)
    handleSendMessage()
  }

  const handleContactRedirect = () => {
    setIsOpen(false)
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-orange-500 hover:bg-orange-600 shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-2xl z-50 flex flex-col bg-black border-white/20">
          <CardHeader className="bg-orange-500 text-white rounded-t-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <CardTitle className="text-sm">Tivuq Assistant</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-orange-600 h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isBot ? "bg-white/10 text-gray-300" : "bg-orange-500 text-white"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.isBot && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                      <p className="text-sm">{message.text}</p>
                      {!message.isBot && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div className="p-4 border-t border-white/20">
                <p className="text-xs text-gray-400 mb-2">Quick questions:</p>
                <div className="space-y-1">
                  {quickReplies.slice(0, 3).map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickReply(reply)}
                      className="w-full text-left justify-start text-xs h-8 border-white/20 text-gray-300 hover:bg-white/10"
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-white/20">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 text-sm bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Button onClick={handleSendMessage} size="icon" className="bg-orange-500 hover:bg-orange-600 h-9 w-9">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={handleContactRedirect}
                variant="link"
                className="w-full text-xs text-orange-500 p-0 h-6 mt-2"
              >
                Need more help? Contact us directly →
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}

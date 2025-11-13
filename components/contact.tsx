"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Calendar,
  Video,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
} from "lucide-react"

export function Contact() {
  const [activeTab, setActiveTab] = useState("inquiry")

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+92 347 7437615", "+92 300 1234567"],
      action: "Call Now",
      link: "tel:+923477437615",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["hello@porchest.com", "support@porchest.com"],
      action: "Send Email",
      link: "mailto:hello@porchest.com",
    },
    {
      icon: MapPin,
      title: "Office",
      details: ["Karachi, Pakistan", "Remote Worldwide"],
      action: "Get Directions",
      link: "#",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 4:00 PM"],
      action: "Schedule Call",
      link: "#",
    },
  ]

  const socialLinks = [
    { icon: Linkedin, name: "LinkedIn", link: "#", color: "hover:text-blue-400" },
    { icon: Twitter, name: "Twitter", link: "#", color: "hover:text-blue-400" },
    { icon: Instagram, name: "Instagram", link: "#", color: "hover:text-pink-400" },
    { icon: Globe, name: "Website", link: "#", color: "hover:text-[#ff7a00]" },
  ]

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Thank you for your inquiry! We'll get back to you within 24 hours.")
  }

  const handleMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Generate Google Meet link
    const meetingTitle = encodeURIComponent("Porchest Consultation Meeting")
    const meetingDescription = encodeURIComponent("Discussion about your project requirements and how we can help.")
    const googleMeetUrl = `https://meet.google.com/new?authuser=0&hs=179&title=${meetingTitle}&description=${meetingDescription}`

    // Open Google Meet
    window.open(googleMeetUrl, "_blank")

    // Send email notification
    const emailSubject = encodeURIComponent("Google Meet Scheduled - Porchest Consultation")
    const emailBody = encodeURIComponent(`
Hello,

Thank you for scheduling a consultation with Porchest. We've created a Google Meet link for our discussion.

Meeting Details:
- Topic: Project Consultation
- Platform: Google Meet
- Link: ${googleMeetUrl}

We look forward to discussing your project requirements and how we can help bring your vision to life.

Best regards,
Porchest Team
    `)

    window.open(`mailto:hello@porchest.com?subject=${emailSubject}&body=${emailBody}`, "_blank")

    alert("Google Meet link created! Please check your email for meeting details.")
  }

  return (
    <section id="contact" className="py-20 bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-40 right-40 w-96 h-96 bg-[#ff7a00] rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-40 left-40 w-96 h-96 bg-coral-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-[#ff7a00]/30 text-[#ff7a00] mb-4 bg-[#ff7a00]/10">
            <Mail className="w-4 h-4 mr-2" />
            Get In Touch
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 font-[var(--font-roboto)]">
            Let's Start Your
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7a00] to-coral-500 block">
              Next Big Project
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Ready to transform your business? Get in touch with our team of experts and let's discuss how we can help
            you achieve your goals.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => {
            const Icon = info.icon
            return (
              <Card
                key={index}
                className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 group"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#ff7a00] to-coral-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-3">{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-slate-400 text-sm mb-1">
                      {detail}
                    </p>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 border-[#ff7a00]/30 text-[#ff7a00] hover:bg-[#ff7a00]/10 text-xs bg-transparent"
                    onClick={() => window.open(info.link, "_blank")}
                  >
                    {info.action}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Contact Forms */}
        <div className="max-w-4xl mx-auto mb-16">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-[#ff7a00]/20 rounded-xl p-1 h-16">
              <TabsTrigger
                value="inquiry"
                className="flex items-center justify-center h-full px-6 py-3 rounded-xl text-slate-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff7a00] data-[state=active]:to-coral-500 data-[state=active]:text-white transition-all duration-300 hover:bg-[#ff7a00]/10 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff7a00]/10 to-coral-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">General Inquiry</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="meeting"
                className="flex items-center justify-center h-full px-6 py-3 rounded-xl text-slate-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff7a00] data-[state=active]:to-coral-500 data-[state=active]:text-white transition-all duration-300 hover:bg-[#ff7a00]/10 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff7a00]/10 to-coral-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <Video className="w-4 h-4" />
                  <span className="text-sm font-medium">Book Google Meet</span>
                </div>
              </TabsTrigger>
            </TabsList>

            {/* General Inquiry Form */}
            <TabsContent value="inquiry">
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Send us a Message</CardTitle>
                  <CardDescription className="text-slate-300">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleInquirySubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-white font-medium">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          required
                          className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-white font-medium">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="phone" className="text-white font-medium">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20"
                          placeholder="+92 300 1234567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="service" className="text-white font-medium">
                          Service Interested In *
                        </Label>
                        <Select required>
                          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="web-development">Web Development</SelectItem>
                            <SelectItem value="mobile-development">Mobile Development</SelectItem>
                            <SelectItem value="influencer-marketing">Influencer Marketing</SelectItem>
                            <SelectItem value="custom-software">Custom Software</SelectItem>
                            <SelectItem value="consultation">Consultation</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="budget" className="text-white font-medium">
                        Project Budget
                      </Label>
                      <Select>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                          <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                          <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                          <SelectItem value="50k+">$50,000+</SelectItem>
                          <SelectItem value="discuss">Let's Discuss</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-white font-medium">
                        Project Details *
                      </Label>
                      <Textarea
                        id="message"
                        required
                        rows={6}
                        className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20"
                        placeholder="Tell us about your project, goals, timeline, and any specific requirements..."
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#ff7a00] to-coral-500 hover:from-[#ff7a00]/90 hover:to-coral-500/90 text-white py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      Send Message
                      <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Google Meet Booking Form */}
            <TabsContent value="meeting">
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Schedule a Google Meet</CardTitle>
                  <CardDescription className="text-slate-300">
                    Book a video consultation to discuss your project in detail.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleMeetingSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="meet-name" className="text-white font-medium">
                          Full Name *
                        </Label>
                        <Input
                          id="meet-name"
                          required
                          className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="meet-email" className="text-white font-medium">
                          Email Address *
                        </Label>
                        <Input
                          id="meet-email"
                          type="email"
                          required
                          className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="meet-company" className="text-white font-medium">
                          Company Name
                        </Label>
                        <Input
                          id="meet-company"
                          className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20"
                          placeholder="Your company name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="meet-phone" className="text-white font-medium">
                          Phone Number
                        </Label>
                        <Input
                          id="meet-phone"
                          className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20"
                          placeholder="+92 300 1234567"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="meet-service" className="text-white font-medium">
                        Service Discussion *
                      </Label>
                      <Select required>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20">
                          <SelectValue placeholder="What would you like to discuss?" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="web-development">Web Development Project</SelectItem>
                          <SelectItem value="mobile-app">Mobile App Development</SelectItem>
                          <SelectItem value="influencer-marketing">Influencer Marketing Campaign</SelectItem>
                          <SelectItem value="custom-software">Custom Software Solution</SelectItem>
                          <SelectItem value="general-consultation">General Consultation</SelectItem>
                          <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="meet-agenda" className="text-white font-medium">
                        Meeting Agenda *
                      </Label>
                      <Textarea
                        id="meet-agenda"
                        required
                        rows={4}
                        className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20"
                        placeholder="Please describe what you'd like to discuss during our meeting..."
                      />
                    </div>

                    <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/50">
                      <h4 className="text-white font-medium mb-2 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-[#ff7a00]" />
                        Meeting Information
                      </h4>
                      <ul className="text-slate-300 text-sm space-y-1">
                        <li>• Duration: 30-60 minutes</li>
                        <li>• Platform: Google Meet</li>
                        <li>• We'll send you the meeting link via email</li>
                        <li>• Available: Mon-Fri 9 AM - 6 PM (PKT)</li>
                      </ul>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#ff7a00] to-coral-500 hover:from-[#ff7a00]/90 hover:to-coral-500/90 text-white py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      Create Google Meet
                      <Video className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Quick Contact & Social */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-6">Or Connect With Us Directly</h3>

          {/* Social Links */}
          <div className="flex justify-center space-x-6">
            {socialLinks.map((social, index) => {
              const Icon = social.icon
              return (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 bg-slate-800/50 border border-slate-700/50 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-700/50 transition-all duration-300 hover:scale-110 ${social.color}`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

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
import {
  Users,
  Target,
  MessageCircle,
  BarChart3,
  Calendar,
  Award,
  Send,
  ArrowRight,
  CheckCircle,
  Instagram,
  Youtube,
} from "lucide-react"

export function InfluencerMarketing() {
  const [selectedPlatform, setSelectedPlatform] = useState("instagram")

  const services = [
    {
      icon: Users,
      title: "Influencer Matching",
      description: "Connect with the perfect influencers for your brand and target audience",
      features: ["AI-powered matching", "Audience analysis", "Performance metrics", "Brand alignment"],
    },
    {
      icon: Target,
      title: "Campaign Strategy",
      description: "Develop comprehensive influencer marketing strategies that deliver results",
      features: ["Goal setting", "Content planning", "Timeline management", "ROI optimization"],
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting",
      description: "Track performance and measure the success of your influencer campaigns",
      features: ["Real-time tracking", "Detailed reports", "ROI analysis", "Performance insights"],
    },
    {
      icon: MessageCircle,
      title: "Content Creation",
      description: "Professional content creation services for maximum engagement",
      features: ["Creative direction", "Video production", "Photography", "Copywriting"],
    },
    {
      icon: Calendar,
      title: "Campaign Management",
      description: "End-to-end campaign management from planning to execution",
      features: ["Project coordination", "Timeline tracking", "Quality assurance", "Performance monitoring"],
    },
    {
      icon: Award,
      title: "Brand Partnerships",
      description: "Build long-term relationships between brands and influencers",
      features: ["Partnership facilitation", "Contract management", "Relationship building", "Growth strategies"],
    },
  ]

  const platforms = [
    { id: "instagram", name: "Instagram", icon: Instagram, color: "from-pink-500 to-purple-500" },
    { id: "youtube", name: "YouTube", icon: Youtube, color: "from-red-500 to-red-600" },
    { id: "tiktok", name: "TikTok", icon: MessageCircle, color: "from-gray-800 to-gray-900" },
    { id: "linkedin", name: "LinkedIn", icon: Users, color: "from-blue-600 to-blue-700" },
  ]

  const benefits = [
    "Increased brand awareness and visibility",
    "Higher engagement rates than traditional advertising",
    "Access to targeted niche audiences",
    "Authentic content that resonates with consumers",
    "Cost-effective marketing solution",
    "Measurable ROI and performance metrics",
  ]

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle booking submission
    alert("Booking request submitted successfully! We'll contact you within 24 hours.")
  }

  return (
    <section id="influencer-marketing" className="py-20 bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#ff7a00] rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-coral-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-[#ff7a00]/30 text-[#ff7a00] mb-4 bg-[#ff7a00]/10">
            <Users className="w-4 h-4 mr-2" />
            Marketing Services
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Amplify Your Brand with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7a00] to-coral-500 block">
              Powerful Marketing Services
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Connect with your target audience through authentic influencer partnerships. We help brands create impactful
            campaigns that drive engagement, build trust, and deliver measurable results.
          </p>
        </div>

        {/* Services Grid */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Our Marketing Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <Card
                  key={index}
                  className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 group"
                >
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-[#ff7a00] to-coral-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-white text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-slate-400">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-slate-300 text-sm">
                          <CheckCircle className="w-4 h-4 text-[#ff7a00] mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Platform Selection */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Platforms We Work With</h3>
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {platforms.map((platform) => {
              const Icon = platform.icon
              return (
                <Card
                  key={platform.id}
                  className={`bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 cursor-pointer group flex-shrink-0 w-48 ${
                    selectedPlatform === platform.id ? "ring-2 ring-[#ff7a00]" : ""
                  }`}
                  onClick={() => setSelectedPlatform(platform.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${platform.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-white font-semibold">{platform.name}</h4>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Why Choose Marketing Services?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-slate-800/30 rounded-lg backdrop-blur-sm">
                <div className="w-8 h-8 bg-gradient-to-r from-[#ff7a00] to-coral-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <p className="text-slate-300">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Form */}
        <div className="mb-16">
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm max-w-4xl mx-auto">
            <CardHeader className="bg-gradient-to-r from-[#ff7a00]/10 to-coral-500/10 border-b border-slate-700/50">
              <CardTitle className="text-white text-2xl text-center">Book Your Marketing Campaign</CardTitle>
              <CardDescription className="text-slate-300 text-center">
                Ready to get started? Fill out the form below and we'll create a custom strategy for your brand.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="company-name" className="text-white font-medium">
                      Company Name *
                    </Label>
                    <Input
                      id="company-name"
                      required
                      className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20"
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-name" className="text-white font-medium">
                      Contact Name *
                    </Label>
                    <Input
                      id="contact-name"
                      required
                      className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email" className="text-white font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20"
                      placeholder="your.email@company.com"
                    />
                  </div>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="budget" className="text-white font-medium">
                      Campaign Budget *
                    </Label>
                    <Select required>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                        <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                        <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                        <SelectItem value="50k+">$50,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timeline" className="text-white font-medium">
                      Campaign Timeline *
                    </Label>
                    <Select required>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20">
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="1-month">1 Month</SelectItem>
                        <SelectItem value="2-3-months">2-3 Months</SelectItem>
                        <SelectItem value="3-6-months">3-6 Months</SelectItem>
                        <SelectItem value="ongoing">Ongoing Partnership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="campaign-goals" className="text-white font-medium">
                    Campaign Goals *
                  </Label>
                  <Textarea
                    id="campaign-goals"
                    required
                    rows={4}
                    className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20"
                    placeholder="Describe your campaign objectives, target audience, and key messages..."
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#ff7a00] to-coral-500 hover:from-[#ff7a00]/90 hover:to-coral-500/90 text-white py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  Book Your Campaign
                  <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white mb-6">Ready to Amplify Your Brand?</h3>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of successful brands who have transformed their marketing with our influencer partnerships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#ff7a00] to-coral-500 hover:from-[#ff7a00]/90 hover:to-coral-500/90 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-[#ff7a00]/30 text-[#ff7a00] hover:bg-[#ff7a00]/10 px-8 py-4 text-lg font-semibold rounded-full bg-transparent"
              onClick={() =>
                window.open(
                  "https://wa.me/923477437615?text=Hi! I'd like to learn more about marketing services.",
                  "_blank",
                )
              }
            >
              Schedule Consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

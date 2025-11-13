"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Megaphone, TrendingUp, Palette, BarChart3, Users, Zap } from "lucide-react"

const services = [
  {
    icon: Megaphone,
    title: "Brand Strategy",
    description: "Comprehensive brand positioning and messaging strategies",
    details:
      "We develop data-driven brand strategies that resonate with your target audience, including brand positioning, messaging frameworks, and competitive analysis to ensure your brand stands out in the market.",
    color: "bg-white",
  },
  {
    icon: TrendingUp,
    title: "Social Media Engagement",
    description: "Boost your social presence with targeted campaigns",
    details:
      "Our social media experts create engaging content strategies, manage community interactions, and implement growth tactics across all major platforms to increase your brand visibility and engagement rates.",
    color: "bg-gray-600",
  },
  {
    icon: Palette,
    title: "Creative Campaigns",
    description: "Innovative campaigns that capture attention",
    details:
      "From concept to execution, we design creative campaigns that tell your brand story in compelling ways, utilizing cutting-edge design, video production, and interactive content to maximize impact.",
    color: "bg-white",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "Data-driven decisions for better ROI",
    details:
      "We provide comprehensive analytics and reporting services, tracking campaign performance, audience insights, and ROI metrics to continuously optimize your marketing efforts and drive better results.",
    color: "bg-gray-600",
  },
  {
    icon: Users,
    title: "Influencer Marketing",
    description: "Connect with the right influencers for your brand",
    details:
      "Our extensive network of influencers and content creators helps you reach new audiences authentically. We handle everything from influencer selection to campaign management and performance tracking.",
    color: "bg-white",
  },
  {
    icon: Zap,
    title: "Growth Hacking",
    description: "Rapid growth through innovative strategies",
    details:
      "We implement cutting-edge growth hacking techniques, A/B testing, and conversion optimization strategies to accelerate your business growth and maximize your marketing budget efficiency.",
    color: "bg-gray-600",
  },
]

export function Services() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-white">Services</span>
          </h2>
          <div className="w-20 h-1 bg-gray-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-900 max-w-3xl mx-auto">
            We offer comprehensive digital marketing solutions tailored to help your brand thrive in today's competitive
            landscape.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                hoveredCard === index ? "scale-105" : ""
              }`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardHeader className="text-center">
                <div
                  className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <service.icon className="h-8 w-8 text-black" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-black transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-900 text-center mb-4">{service.description}</CardDescription>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    hoveredCard === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-sm text-gray-900 leading-relaxed">{service.details}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

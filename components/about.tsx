"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, Target, Lightbulb } from "lucide-react"
import Image from "next/image"

export function About() {
  const values = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Mission-Driven",
      description: "We're committed to delivering solutions that drive real business results and exceed expectations.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Client-Focused",
      description: "Your success is our priority. We work closely with you to understand and achieve your goals.",
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Innovation First",
      description: "We stay ahead of technology trends to provide cutting-edge solutions for your business.",
    },
  ]

  const achievements = [
    "50+ Successful Projects Delivered",
    "100% Client Satisfaction Rate",
    "3+ Years of Industry Experience",
    "24/7 Support & Maintenance",
    "Cutting-Edge Technology Stack",
    "Agile Development Methodology",
  ]

  return (
    <section id="about" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-orange-500/30 text-orange-400 mb-4">
              About Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Crafting Digital Excellence
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                {" "}
                Since Day One
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We're a passionate team of developers, designers, and digital strategists dedicated to transforming your
              ideas into powerful digital solutions that drive growth and success.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Content */}
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">Building the Future, One Project at a Time</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                With years of experience in web development, mobile applications, and digital transformation, we've
                helped businesses of all sizes achieve their digital goals. Our approach combines technical expertise
                with creative vision to deliver solutions that not only look great but perform exceptionally.
              </p>
              <p className="text-gray-300 mb-8 leading-relaxed">
                From startups to established enterprises, we've been the trusted partner for companies looking to
                innovate, scale, and succeed in the digital landscape. Every project is an opportunity to push
                boundaries and create something extraordinary.
              </p>

              {/* Achievements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/modern-office-team.png"
                  alt="Our team working together"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-orange-500 text-white p-4 rounded-xl shadow-lg">
                <div className="text-2xl font-bold">50+</div>
                <div className="text-sm opacity-90">Happy Clients</div>
              </div>
              <div className="absolute -top-6 -right-6 bg-white text-black p-4 rounded-xl shadow-lg">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm opacity-70">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="bg-white/10 border-white/20 hover:border-orange-500/30 transition-all duration-300 group"
              >
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-500/20 text-orange-500 rounded-lg mb-4 group-hover:bg-orange-500/30 transition-colors duration-300">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

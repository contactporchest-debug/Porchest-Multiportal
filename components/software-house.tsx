"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code2, Globe, ArrowRight, CheckCircle, BarChart3 } from "lucide-react"

export function SoftwareHouse() {
  const [activeService, setActiveService] = useState(0)

  const services = [
    {
      icon: BarChart3,
      title: "Data Science/Analytics",
      description: "Transform your data into actionable insights and strategic decisions",
      features: ["Data Mining", "Statistical Analysis", "Predictive Modeling", "Business Intelligence"],
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Code2,
      title: "Machine Learning/AI",
      description: "Intelligent solutions powered by advanced machine learning algorithms",
      features: ["ML Model Development", "Natural Language Processing", "Computer Vision", "AI Integration"],
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Code2,
      title: "Custom Software",
      description: "Tailored software solutions for unique business needs",
      features: ["Enterprise Software", "Automation Tools", "Integration", "Maintenance"],
      color: "from-teal-500 to-blue-500",
    },
    {
      icon: Globe,
      title: "Full Stack Development",
      description: "Complete web applications with modern frontend and backend technologies",
      features: ["React/Next.js", "Node.js Backend", "Database Integration", "API Development"],
      color: "from-[#ff7a00] to-red-500",
    },
  ]

  const technologies = [
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "TypeScript",
    "MongoDB",
    "PostgreSQL",
    "AWS",
    "Docker",
    "Kubernetes",
  ]

  const process = [
    {
      step: "01",
      title: "Discovery & Planning",
      description: "We analyze your requirements and create a comprehensive project roadmap.",
    },
    {
      step: "02",
      title: "Design & Architecture",
      description: "Our team designs the system architecture and user experience.",
    },
    {
      step: "03",
      title: "Development & Testing",
      description: "We build your solution using agile methodologies with continuous testing.",
    },
    {
      step: "04",
      title: "Deployment & Launch",
      description: "We deploy your application and ensure smooth launch operations.",
    },
    {
      step: "05",
      title: "Support & Maintenance",
      description: "Ongoing support, updates, and maintenance to keep your software running optimally.",
    },
  ]

  return (
    <section id="software-house" className="py-20 bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#ff7a00] rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-coral-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-[#ff7a00]/30 text-[#ff7a00] mb-4 bg-[#ff7a00]/10">
            <Code2 className="w-4 h-4 mr-2" />
            Software Development
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Build the Future with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7a00] to-coral-500 block">
              Cutting-Edge Software Services
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            From web applications to mobile apps, we deliver scalable, secure, and innovative software solutions that
            drive your business forward in the digital age.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 justify-items-center">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card
                key={index}
                className="bg-gray-400/20 border-gray-500/30 backdrop-blur-sm hover:bg-gray-400/30 transition-all duration-300 group cursor-pointer w-full max-w-sm"
                onMouseEnter={() => setActiveService(index)}
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl text-center">{service.title}</CardTitle>
                  <CardDescription className="text-slate-400 text-center">{service.description}</CardDescription>
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

        {/* Technologies Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Technologies We Master</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {technologies.map((tech, index) => (
              <Badge
                key={index}
                variant="outline"
                className="border-[#ff7a00]/30 text-[#ff7a00] bg-[#ff7a00]/10 px-4 py-2 text-sm hover:bg-[#ff7a00]/20 transition-colors duration-300"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Process Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Our Development Process</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-[#ff7a00] to-coral-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  {item.step}
                </div>
                <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                <p className="text-slate-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white mb-6">Ready to Start Your Project?</h3>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Let's discuss your software development needs and create something amazing together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#ff7a00] to-coral-500 hover:from-[#ff7a00]/90 hover:to-coral-500/90 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-[#ff7a00]/30 text-[#ff7a00] hover:bg-[#ff7a00]/10 px-8 py-4 text-lg font-semibold rounded-full bg-transparent"
              onClick={() =>
                window.open("https://wa.me/923477437615?text=Hi! I'd like to discuss a software project.", "_blank")
              }
            >
              Get Free Consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

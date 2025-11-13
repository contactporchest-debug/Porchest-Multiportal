"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code, Brain, BarChart3, Megaphone, ArrowRight, CheckCircle } from "lucide-react"

export function Services() {
  const services = [
    {
      icon: <Code className="h-8 w-8" />,
      title: "Web Development",
      description:
        "Custom websites and web applications built with modern technologies for optimal performance and user experience.",
      features: ["Responsive Design", "Fast Loading", "SEO Optimized", "Secure & Scalable"],
      price: "Starting from $999",
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI/ML Solutions",
      description:
        "Intelligent systems and machine learning models that automate processes and provide valuable insights.",
      features: ["Custom AI Models", "Data Processing", "Predictive Analytics", "Automation"],
      price: "Starting from $2,499",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Data Science/Analytics",
      description: "Transform your data into actionable insights with advanced analytics and visualization tools.",
      features: ["Data Visualization", "Statistical Analysis", "Business Intelligence", "Custom Dashboards"],
      price: "Starting from $1,299",
    },
    {
      icon: <Megaphone className="h-8 w-8" />,
      title: "Digital Marketing",
      description: "Comprehensive digital marketing strategies to boost your online presence and drive growth.",
      features: ["SEO Optimization", "Social Media Marketing", "Content Strategy", "Performance Tracking"],
      price: "Starting from $799/month",
    },
  ]

  const handleGetQuote = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="services" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="border-orange-500/30 text-orange-400 mb-4">
              Our Services
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Comprehensive Digital
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                {" "}
                Solutions
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              From concept to launch, we provide end-to-end digital services that help your business thrive in the
              digital landscape. Every solution is tailored to your unique needs.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
            {services.map((service, index) => (
              <Card
                key={index}
                className="bg-white/10 border-white/20 hover:border-orange-500/30 transition-all duration-300 group hover:transform hover:scale-105"
              >
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 text-orange-500 rounded-xl mb-4 group-hover:bg-orange-500/30 transition-colors duration-300">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-orange-400 transition-colors duration-300">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 leading-relaxed">{service.description}</p>

                  {/* Features */}
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="pt-4 border-t border-white/20">
                    <div className="text-orange-400 font-semibold mb-3">{service.price}</div>
                    <Button
                      onClick={handleGetQuote}
                      className="w-full bg-transparent border border-orange-500/30 text-orange-400 hover:bg-orange-500 hover:text-white transition-all duration-300"
                    >
                      Get Quote
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-2xl p-8 border border-orange-500/20">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to Start Your Project?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Let's discuss your requirements and create a custom solution that perfectly fits your business needs.
            </p>
            <Button
              onClick={handleGetQuote}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Get Free Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

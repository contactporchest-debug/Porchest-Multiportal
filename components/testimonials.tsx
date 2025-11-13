"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechFlow Solutions",
      image: "/professional-woman-marketing.png",
      rating: 5,
      text: "Porchest transformed our digital presence completely. Their software development team delivered a cutting-edge platform that increased our efficiency by 300%. The attention to detail and technical expertise is unmatched.",
    },
    {
      name: "Michael Chen",
      role: "CEO",
      company: "InnovateLab",
      image: "/professional-man-tech.png",
      rating: 5,
      text: "Working with Porchest on our influencer marketing campaign was a game-changer. We saw a 250% increase in brand awareness and 180% boost in sales. Their strategic approach and execution are phenomenal.",
    },
    {
      name: "Emily Rodriguez",
      role: "Founder",
      company: "GreenEarth Startup",
      image: "/professional-woman-diverse.png",
      rating: 5,
      text: "The team at Porchest didn't just build our app; they understood our vision and brought it to life. The mobile application they developed has over 50k downloads and counting. Exceptional work!",
    },
    {
      name: "David Thompson",
      role: "Operations Manager",
      company: "RetailMax",
      image: "/professional-man.png",
      rating: 5,
      text: "Porchest's influencer marketing strategy helped us reach our target demographic perfectly. The ROI exceeded our expectations by 200%. Their team is professional, creative, and results-driven.",
    },
    {
      name: "Lisa Park",
      role: "Restaurant Owner",
      company: "Fusion Bistro",
      image: "/restaurant-owner.png",
      rating: 5,
      text: "From concept to launch, Porchest handled our restaurant management system flawlessly. The software streamlined our operations and improved customer satisfaction significantly. Highly recommended!",
    },
    {
      name: "James Wilson",
      role: "Creative Director",
      company: "DesignStudio Pro",
      image: "/creative-director-woman.png",
      rating: 5,
      text: "The collaboration with Porchest on our brand's digital transformation was outstanding. Their influencer partnerships and software solutions created a cohesive strategy that delivered remarkable results.",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#ff7a00] rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-coral-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 ml-20">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-[#ff7a00]/30 text-[#ff7a00] mb-4 bg-[#ff7a00]/10">
            <Star className="w-4 h-4 mr-2" />
            Client Success Stories
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            What Our Clients
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7a00] to-coral-500 block">
              Say About Us
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what our satisfied clients have to say about their experience
            working with Porchest.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-6 left-6">
              <Quote className="w-12 h-12 text-[#ff7a00]/20" />
            </div>
            <CardContent className="p-12 text-center">
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-[#ff7a00] fill-current" />
                ))}
              </div>

              <blockquote className="text-xl md:text-2xl text-white mb-8 leading-relaxed font-medium">
                "{testimonials[currentTestimonial].text}"
              </blockquote>

              <div className="flex items-center justify-center space-x-4">
                <img
                  src={testimonials[currentTestimonial].image || "/placeholder.svg"}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#ff7a00]/30"
                />
                <div className="text-left">
                  <div className="text-white font-semibold text-lg">{testimonials[currentTestimonial].name}</div>
                  <div className="text-[#ff7a00] font-medium">{testimonials[currentTestimonial].role}</div>
                  <div className="text-slate-400 text-sm">{testimonials[currentTestimonial].company}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={prevTestimonial}
              className="border-[#ff7a00]/30 text-[#ff7a00] hover:bg-[#ff7a00]/10 p-3 bg-transparent"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? "bg-[#ff7a00]" : "bg-white/30 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextTestimonial}
              className="border-[#ff7a00]/30 text-[#ff7a00] hover:bg-[#ff7a00]/10 p-3 bg-transparent"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <Card
              key={index}
              className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 cursor-pointer"
              onClick={() => setCurrentTestimonial(index)}
            >
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#ff7a00] fill-current" />
                  ))}
                </div>

                <p className="text-slate-300 text-sm mb-4 line-clamp-3">"{testimonial.text.substring(0, 120)}..."</p>

                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-white font-medium text-sm">{testimonial.name}</div>
                    <div className="text-slate-400 text-xs">{testimonial.company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#ff7a00] mb-2">98%</div>
            <div className="text-slate-400">Client Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-coral-400 mb-2">50+</div>
            <div className="text-slate-400">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#ff7a00] mb-2">25+</div>
            <div className="text-slate-400">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-coral-400 mb-2">24/7</div>
            <div className="text-slate-400">Support</div>
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechFlow Inc.",
    image: "/placeholder.svg?height=80&width=80&text=SJ",
    quote:
      "WittyGo transformed our brand presence completely. Their creative approach and strategic thinking helped us achieve a 300% increase in engagement within just 3 months.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Founder",
    company: "EcoStyle",
    image: "/placeholder.svg?height=80&width=80&text=MC",
    quote:
      "The team at WittyGo understood our vision perfectly. They created campaigns that not only looked amazing but delivered real results. Our sales increased by 250%.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Brand Manager",
    company: "FitLife",
    image: "/placeholder.svg?height=80&width=80&text=ER",
    quote:
      "Working with WittyGo was a game-changer. Their data-driven approach and creative execution helped us reach new audiences and build a strong community around our brand.",
    rating: 5,
  },
  {
    id: 4,
    name: "David Thompson",
    role: "CEO",
    company: "Urban Eats",
    image: "/placeholder.svg?height=80&width=80&text=DT",
    quote:
      "The influencer marketing campaign WittyGo created for us went viral and brought in thousands of new customers. Their expertise in the digital space is unmatched.",
    rating: 5,
  },
  {
    id: 5,
    name: "Lisa Park",
    role: "Marketing Lead",
    company: "StyleHub",
    image: "/placeholder.svg?height=80&width=80&text=LP",
    quote:
      "WittyGo's creative campaigns helped us stand out in a crowded market. Their attention to detail and innovative strategies delivered exceptional ROI.",
    rating: 5,
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our <span className="text-white">Clients Say</span>
          </h2>
          <div className="w-20 h-1 bg-gray-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-900 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say about working with WittyGo.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <Card className="bg-gray-100 border-none shadow-2xl">
            <CardContent className="p-8 md:p-12">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-white fill-current" />
                  ))}
                </div>

                <blockquote className="text-xl md:text-2xl text-gray-900 italic mb-8 leading-relaxed">
                  "{testimonials[currentIndex].quote}"
                </blockquote>

                <div className="flex items-center justify-center space-x-4">
                  <Image
                    src={testimonials[currentIndex].image || "/placeholder.svg"}
                    alt={testimonials[currentIndex].name}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                  <div className="text-left">
                    <div className="font-bold text-gray-900 text-lg">{testimonials[currentIndex].name}</div>
                    <div className="text-gray-600 font-semibold">{testimonials[currentIndex].role}</div>
                    <div className="text-gray-900">{testimonials[currentIndex].company}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white border-white text-white hover:bg-white hover:text-black"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white border-white text-white hover:bg-white hover:text-black"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex ? "bg-white" : "bg-gray-300"
                }`}
                onClick={() => goToTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, Calendar } from "lucide-react"
import { useEffect, useState } from "react"

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section id="home" className="relative min-h-screen bg-black overflow-hidden flex items-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div
          className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x * 0.01}%`,
            top: `${mousePosition.y * 0.01}%`,
          }}
        />
        <div className="absolute w-64 h-64 bg-gray-500/10 rounded-full blur-2xl animate-bounce top-1/4 right-1/4" />
        <div className="absolute w-48 h-48 bg-white/20 rounded-full blur-xl animate-pulse bottom-1/4 left-1/4" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Empowering <span className="text-white">Brands</span>, <span className="text-gray-300">Influencers</span>,
            and <span className="text-white">Companies</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in-delay">
            We help you grow, collaborate, and achieve success in the digital world through innovative strategies and
            creative campaigns.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-delay-2">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-200 font-semibold px-8 py-4 text-lg transform hover:scale-105 transition-all duration-200"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book a Call
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg transform hover:scale-105 transition-all duration-200 bg-transparent"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Contact via WhatsApp
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}

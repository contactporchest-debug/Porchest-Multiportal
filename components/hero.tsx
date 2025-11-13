"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, Sparkles, Zap } from "lucide-react"

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentTextIndex, setCurrentTextIndex] = useState(0)

  const rotatingTexts = [
    "Your Digital Growth Partner",
    "Innovating with AI & Data",
    "Building Smarter Solutions",
    "Transforming Ideas into Reality",
  ]

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % rotatingTexts.length)
    }, 3000) // Change text every 3 seconds

    return () => clearInterval(interval)
  }, [rotatingTexts.length])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="home" className="min-h-screen bg-black relative overflow-hidden flex items-center">
      {/* Enhanced Background Animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#ff7a00] rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-coral-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-96 h-96 bg-[#ff7a00] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-40 right-40 w-80 h-80 bg-coral-400 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Mouse Follower Effect */}
      <div
        className="absolute w-96 h-96 bg-gradient-to-r from-[#ff7a00]/10 to-coral-500/10 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen py-20">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
            <div className="space-y-4 lg:space-y-6">
              <Badge
                variant="outline"
                className="border-[#ff7a00]/30 text-[#ff7a00] bg-[#ff7a00]/10 w-fit mx-auto lg:mx-0"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Welcome to Innovation
              </Badge>

              <div className="space-y-3 lg:space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  <span className="text-white">Welcome to Porchest</span>
                </h1>

                <div className="h-10 sm:h-12 flex items-center justify-center lg:justify-start">
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-[#ff7a00] transition-all duration-500 ease-in-out transform text-center lg:text-left">
                    {rotatingTexts[currentTextIndex]}
                  </p>
                </div>
              </div>

              <p className="text-lg sm:text-xl md:text-2xl text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Transforming ideas into digital reality through cutting-edge software development, innovative marketing
                strategies, and powerful influencer partnerships.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={() => scrollToSection("software-house")}
                className="bg-gradient-to-r from-[#ff7a00] to-coral-500 hover:from-[#ff7a00]/90 hover:to-coral-500/90 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Explore Services
                <Zap className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => scrollToSection("contact")}
                className="border-[#ff7a00]/30 text-[#ff7a00] hover:bg-[#ff7a00]/10 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full bg-transparent"
              >
                Get In Touch
              </Button>
            </div>
          </div>

          {/* Right Content - Logo with Effects */}
          <div className="relative flex items-center justify-center mt-8 lg:mt-0">
            {/* White Contrast Elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Outer Ring */}
              <div className="absolute w-64 sm:w-80 h-64 sm:h-80 border border-white/10 rounded-full animate-spin-slow"></div>
              <div className="absolute w-80 sm:w-96 h-80 sm:h-96 border border-white/5 rounded-full animate-spin-reverse"></div>

              {/* Floating Dots */}
              <div className="absolute w-3 h-3 bg-white/60 rounded-full top-16 sm:top-20 left-16 sm:left-20 animate-bounce"></div>
              <div className="absolute w-2 h-2 bg-white/40 rounded-full top-24 sm:top-32 right-20 sm:right-24 animate-bounce animation-delay-1000"></div>
              <div className="absolute w-4 h-4 bg-white/30 rounded-full bottom-20 sm:bottom-24 left-24 sm:left-32 animate-bounce animation-delay-2000"></div>
              <div className="absolute w-2 h-2 bg-white/50 rounded-full bottom-24 sm:bottom-32 right-16 sm:right-20 animate-bounce animation-delay-500"></div>

              {/* Geometric Shapes */}
              <div className="absolute w-6 h-6 border border-white/20 rotate-45 top-32 sm:top-40 right-32 sm:right-40 animate-float"></div>
              <div className="absolute w-4 h-4 bg-white/10 rotate-12 bottom-32 sm:bottom-40 left-32 sm:left-40 animate-float animation-delay-1500"></div>

              {/* Gradient Lines */}
              <div className="absolute w-24 sm:w-32 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent top-1/3 left-0 animate-pulse"></div>
              <div className="absolute w-px h-24 sm:h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent right-1/4 top-1/4 animate-pulse animation-delay-1000"></div>
            </div>

            {/* Main Logo */}
            <div className="relative z-10 animate-float">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff7a00]/20 to-coral-500/20 rounded-full blur-2xl scale-150"></div>
              <Image
                src="/new-logo.png"
                alt="Porchest Logo"
                width={224}
                height={224}
                className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 object-contain relative z-10 drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button
            onClick={() => scrollToSection("software-house")}
            className="flex flex-col items-center space-y-2 text-slate-400 hover:text-[#ff7a00] transition-colors duration-300 group"
          >
            <span className="text-sm font-medium">Scroll Down</span>
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  )
}

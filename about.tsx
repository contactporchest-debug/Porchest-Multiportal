"use client"

import { useEffect, useRef } from "react"
import { Lightbulb, Target, Users } from "lucide-react"

export function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image/Icon Side */}
          <div className="relative">
            <div className="bg-black rounded-2xl p-8 transform hover:scale-105 transition-transform duration-300">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 flex items-center justify-center">
                  <Lightbulb className="h-8 w-8 text-black" />
                </div>
                <div className="bg-gray-600 rounded-lg p-4 flex items-center justify-center">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div className="bg-white rounded-lg p-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-black" />
                </div>
              </div>
              <div className="mt-6 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Innovation</h3>
                <p className="text-gray-300">Creativity meets strategy</p>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Who We <span className="text-white">Are</span>
              </h2>
              <div className="w-20 h-1 bg-gray-600 mb-6"></div>
            </div>

            <p className="text-lg text-gray-900 leading-relaxed">
              WittyGo is a dynamic creative agency that bridges the gap between brands and their audiences through
              innovative influencer marketing and strategic campaigns. We believe in the power of authentic storytelling
              and data-driven creativity.
            </p>

            <p className="text-lg text-gray-900 leading-relaxed">
              Our team of creative strategists, content creators, and digital marketing experts work collaboratively to
              deliver campaigns that not only capture attention but drive meaningful engagement and measurable results.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-gray-900">Successful Campaigns</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600">200+</div>
                <div className="text-gray-900">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50M+</div>
                <div className="text-gray-900">Reach Generated</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

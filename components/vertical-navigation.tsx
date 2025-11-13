"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Home, Code, Megaphone, Users, Phone } from "lucide-react"

export function VerticalNavigation() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "software-house", label: "Software House", icon: Code },
    { id: "influencer-marketing", label: "Influencer Marketing", icon: Megaphone },
    { id: "careers", label: "Careers", icon: Users },
    { id: "contact", label: "Contact", icon: Phone },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => document.getElementById(item.id))
      const scrollPosition = window.scrollY + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    if (window.innerWidth < 768) {
      setIsExpanded(false)
    }
  }

  return (
    <>
      {isExpanded && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsExpanded(false)} />}

      <div className="fixed left-0 top-0 h-full z-50 flex">
        <div
          className={`bg-black/95 backdrop-blur-sm border-r border-[#ff7a00]/20 transition-all duration-300 ease-in-out ${
            isExpanded ? "w-64" : "w-20"
          } flex flex-col shadow-2xl`}
        >
          {/* Logo Section */}
          <div className="p-4 border-b border-[#ff7a00]/20">
            <div className="flex items-center justify-center mb-4">
              <button
                onClick={() => scrollToSection("home")}
                className="relative group transition-all duration-300 hover:scale-110"
              >
                <Image
                  src="/new-logo.png"
                  alt="Porchest Logo"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain transition-all duration-300"
                />
              </button>
            </div>

            {/* Expand/Contract Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-center p-2 rounded-lg bg-[#ff7a00]/10 hover:bg-[#ff7a00]/20 transition-colors duration-300 group"
            >
              {isExpanded ? (
                <ChevronLeft className="w-5 h-5 text-white group-hover:text-[#ff7a00] transition-colors" />
              ) : (
                <ChevronRight className="w-5 h-5 text-white group-hover:text-[#ff7a00] transition-colors" />
              )}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 py-6">
            <ul className="space-y-2 px-3">
              {navItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full flex items-center px-3 py-3 rounded-lg transition-all duration-300 group relative ${
                        activeSection === item.id
                          ? "bg-gradient-to-r from-[#ff7a00] to-coral-500 text-white shadow-lg"
                          : "text-slate-300 hover:bg-[#ff7a00]/10 hover:text-white"
                      }`}
                    >
                      {!isExpanded ? (
                        <>
                          <IconComponent
                            className={`w-5 h-5 transition-all duration-300 ${
                              activeSection === item.id ? "text-white" : "text-[#ff7a00]"
                            }`}
                          />
                          {/* Hover tooltip */}
                          <div className="absolute left-full ml-2 px-2 py-1 bg-black/90 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                            {item.label}
                          </div>
                        </>
                      ) : (
                        <span className="font-medium transition-all duration-300">{item.label}</span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-[#ff7a00]/20">
            <div className={`text-center transition-all duration-300 ${isExpanded ? "opacity-100" : "opacity-0"}`}>
              <p className="text-xs text-slate-400">© 2024 Porchest</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

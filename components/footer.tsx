"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Heart,
  Code,
  Users,
  MessageCircle,
  Linkedin,
  Twitter,
  Instagram,
  Globe,
} from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    services: [
      { name: "Web Development", href: "#software-house" },
      { name: "AI/ML Solutions", href: "#software-house" },
      { name: "Data Science/Analytics", href: "#software-house" },
      { name: "Digital Marketing", href: "#influencer-marketing" },
      { name: "Influencer Marketing", href: "#influencer-marketing" },
      { name: "Consulting", href: "#contact" },
    ],
    company: [
      { name: "About Us", href: "#software-house" },
      { name: "Careers", href: "#careers" },
      { name: "Software House", href: "#software-house" },
      { name: "Influencer Marketing", href: "#influencer-marketing" },
      { name: "Contact", href: "#contact" },
    ],
    resources: [
      { name: "Case Studies", href: "#" },
      { name: "Documentation", href: "#" },
      { name: "API Reference", href: "#" },
      { name: "Support Center", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
    ],
  }

  const socialLinks = [
    { icon: Linkedin, name: "LinkedIn", href: "#", color: "hover:text-blue-400" },
    { icon: Twitter, name: "Twitter", href: "#", color: "hover:text-blue-400" },
    { icon: Instagram, name: "Instagram", href: "#", color: "hover:text-pink-400" },
    { icon: Globe, name: "Website", href: "#", color: "hover:text-[#ff7a00]" },
  ]

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Thank you for subscribing to our newsletter!")
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace("#", ""))
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="bg-black border-t border-slate-800 relative overflow-hidden w-full">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#ff7a00] rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-coral-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="w-full max-w-none px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Company Info */}
              <div className="lg:col-span-1">
                <div className="flex items-center mb-6">
                  <img src="/porchest-logo.png" alt="Porchest Logo" className="w-10 h-10 object-contain mr-3" />
                  <h3 className="text-2xl font-bold text-white">Porchest</h3>
                </div>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Transforming businesses through innovative software development and powerful influencer marketing
                  strategies. Your success is our mission.
                </p>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center text-slate-400">
                    <Phone className="w-4 h-4 mr-3 text-[#ff7a00]" />
                    <span>+92 347 7437615</span>
                  </div>
                  <div className="flex items-center text-slate-400">
                    <Mail className="w-4 h-4 mr-3 text-[#ff7a00]" />
                    <span>hello@porchest.com</span>
                  </div>
                  <div className="flex items-center text-slate-400">
                    <MapPin className="w-4 h-4 mr-3 text-[#ff7a00]" />
                    <span>Karachi, Pakistan</span>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div>
                <h4 className="text-white font-semibold text-lg mb-6 flex items-center">
                  <Code className="w-5 h-5 mr-2 text-[#ff7a00]" />
                  Services
                </h4>
                <ul className="space-y-3">
                  {footerLinks.services.map((link, index) => (
                    <li key={index}>
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className="text-slate-400 hover:text-[#ff7a00] transition-colors duration-300 text-left"
                      >
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-white font-semibold text-lg mb-6 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-[#ff7a00]" />
                  Company
                </h4>
                <ul className="space-y-3">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      {link.name === "Software House" || link.name === "Influencer Marketing" ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => scrollToSection(link.href)}
                            className="text-slate-400 hover:text-[#ff7a00] transition-colors duration-300 text-left bg-black px-3 py-1.5 rounded-md border border-slate-700/50"
                          >
                            {link.name}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => scrollToSection(link.href)}
                          className="text-slate-400 hover:text-[#ff7a00] transition-colors duration-300 text-left"
                        >
                          {link.name}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <h4 className="text-white font-semibold text-lg mb-6 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-[#ff7a00]" />
                  Stay Updated
                </h4>
                <p className="text-slate-400 mb-4">Subscribe to our newsletter for the latest updates and insights.</p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-slate-800/50 border-slate-700 text-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20"
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#ff7a00] to-coral-500 hover:from-[#ff7a00]/90 hover:to-coral-500/90 text-white font-semibold rounded-lg transition-all duration-300 group"
                  >
                    Subscribe
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-800" />

        {/* Bottom Footer */}
        <div className="py-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              {/* Copyright */}
              <div className="flex items-center text-slate-400">
                <span>© {currentYear} Porchest. Made with</span>
                <Heart className="w-4 h-4 mx-2 text-red-500 fill-current" />
                <span>in Pakistan</span>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                <span className="text-slate-400 text-sm">Follow us:</span>
                {socialLinks.map((social, index) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 bg-slate-800/50 border border-slate-700/50 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-700/50 transition-all duration-300 hover:scale-110 ${social.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  )
                })}
              </div>

              {/* Quick Contact */}
              <div className="flex items-center space-x-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#ff7a00]/30 text-[#ff7a00] hover:bg-[#ff7a00]/10 bg-transparent"
                  onClick={() =>
                    window.open("https://wa.me/923477437615?text=Hi! I'm interested in your services.", "_blank")
                  }
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

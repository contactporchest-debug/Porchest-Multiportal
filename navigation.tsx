"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Menu, X, Video, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isBookCallOpen, setIsBookCallOpen] = useState(false)
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#contact", label: "Contact" },
  ]

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBookingData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleBookCall = (type: "googlemeet" | "whatsapp") => {
    if (type === "whatsapp") {
      const message = `Hi! I'd like to schedule a call to discuss your services.

Name: ${bookingData.name}
Email: ${bookingData.email}
Phone: ${bookingData.phone}
Preferred Date: ${bookingData.preferredDate}
Preferred Time: ${bookingData.preferredTime}
Message: ${bookingData.message}

When would be a good time for you?`

      const whatsappUrl = `https://wa.me/923477437615?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")
    } else {
      const subject = "Schedule a Google Meet Call - New Booking Request"
      const body = `Hi,

I'd like to schedule a Google Meet call to discuss your services. Here are my details:

Name: ${bookingData.name}
Email: ${bookingData.email}
Phone: ${bookingData.phone}
Preferred Date: ${bookingData.preferredDate}
Preferred Time: ${bookingData.preferredTime}

Additional Message:
${bookingData.message}

Please let me know your availability and send me the Google Meet link.

Best regards,
${bookingData.name}`

      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=fawada18110@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      window.open(gmailUrl, "_blank")
    }

    setIsBookCallOpen(false)
    setBookingData({
      name: "",
      email: "",
      phone: "",
      preferredDate: "",
      preferredTime: "",
      message: "",
    })
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Image src="/logo.png" alt="Tivuq Logo" width={120} height={40} className="h-8 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white hover:text-orange-500 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
            <Dialog open={isBookCallOpen} onOpenChange={setIsBookCallOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 text-white hover:bg-orange-600 font-semibold">Book a Call</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Book a Call</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={bookingData.name}
                      onChange={handleBookingChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={bookingData.email}
                      onChange={handleBookingChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={bookingData.phone}
                      onChange={handleBookingChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="preferredDate">Preferred Date</Label>
                    <Input
                      id="preferredDate"
                      name="preferredDate"
                      type="date"
                      value={bookingData.preferredDate}
                      onChange={handleBookingChange}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="preferredTime">Preferred Time</Label>
                    <Input
                      id="preferredTime"
                      name="preferredTime"
                      type="time"
                      value={bookingData.preferredTime}
                      onChange={handleBookingChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Additional Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={bookingData.message}
                      onChange={handleBookingChange}
                      placeholder="Tell us about your project or requirements"
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-2 pt-4">
                    <Button
                      onClick={() => handleBookCall("googlemeet")}
                      className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white"
                      disabled={!bookingData.name || !bookingData.email}
                    >
                      <Video className="h-4 w-4" />
                      Schedule Google Meet
                    </Button>
                    <Button
                      onClick={() => handleBookCall("whatsapp")}
                      className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white"
                      disabled={!bookingData.name || !bookingData.email}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Message on WhatsApp
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-white hover:text-orange-500 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-3 py-2">
                <Dialog open={isBookCallOpen} onOpenChange={setIsBookCallOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-orange-500 text-white hover:bg-orange-600 font-semibold">
                      Book a Call
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Book a Call</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="mobile-name">Full Name</Label>
                        <Input
                          id="mobile-name"
                          name="name"
                          value={bookingData.name}
                          onChange={handleBookingChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="mobile-email">Email</Label>
                        <Input
                          id="mobile-email"
                          name="email"
                          type="email"
                          value={bookingData.email}
                          onChange={handleBookingChange}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="mobile-phone">Phone Number</Label>
                        <Input
                          id="mobile-phone"
                          name="phone"
                          value={bookingData.phone}
                          onChange={handleBookingChange}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="mobile-preferredDate">Preferred Date</Label>
                        <Input
                          id="mobile-preferredDate"
                          name="preferredDate"
                          type="date"
                          value={bookingData.preferredDate}
                          onChange={handleBookingChange}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      <div>
                        <Label htmlFor="mobile-preferredTime">Preferred Time</Label>
                        <Input
                          id="mobile-preferredTime"
                          name="preferredTime"
                          type="time"
                          value={bookingData.preferredTime}
                          onChange={handleBookingChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="mobile-message">Additional Message</Label>
                        <Textarea
                          id="mobile-message"
                          name="message"
                          value={bookingData.message}
                          onChange={handleBookingChange}
                          placeholder="Tell us about your project or requirements"
                          rows={3}
                        />
                      </div>
                      <div className="grid gap-2 pt-4">
                        <Button
                          onClick={() => handleBookCall("googlemeet")}
                          className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white"
                          disabled={!bookingData.name || !bookingData.email}
                        >
                          <Video className="h-4 w-4" />
                          Schedule Google Meet
                        </Button>
                        <Button
                          onClick={() => handleBookCall("whatsapp")}
                          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white"
                          disabled={!bookingData.name || !bookingData.email}
                        >
                          <MessageCircle className="h-4 w-4" />
                          Message on WhatsApp
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

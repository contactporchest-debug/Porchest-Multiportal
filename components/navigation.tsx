"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Menu, X } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    date: undefined as Date | undefined,
    time: "",
    message: "",
  })

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    setIsOpen(false)
  }

  const handleBookingSubmit = (type: "gmail" | "whatsapp") => {
    const { name, email, phone, date, time, message } = bookingData

    if (!name || !email || !phone || !date || !time) {
      alert("Please fill in all required fields")
      return
    }

    const formattedDate = format(date, "PPP")
    const bookingDetails = `
Meeting Request Details:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}
- Preferred Date: ${formattedDate}
- Preferred Time: ${time}
- Message: ${message || "No additional message"}
    `.trim()

    if (type === "gmail") {
      const subject = `Meeting Request from ${name}`
      const body = encodeURIComponent(bookingDetails)
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=fawada18110@gmail.com&su=${encodeURIComponent(subject)}&body=${body}`,
        "_blank",
      )
    } else {
      const whatsappMessage = encodeURIComponent(`Hi! I'd like to schedule a meeting.\\n\\n${bookingDetails}`)
      window.open(`https://wa.me/923477437615?text=${whatsappMessage}`, "_blank")
    }

    setIsBookingOpen(false)
    setBookingData({ name: "", email: "", phone: "", date: undefined, time: "", message: "" })
  }

  const isFormValid = bookingData.name && bookingData.email && bookingData.phone && bookingData.date && bookingData.time

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-orange-500">
                Porchest
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
              <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap">
                    Book a Call
                  </Button>
                </DialogTrigger>
                {/* ... existing dialog content ... */}
              </Dialog>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-orange-500 transition-colors duration-200"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-md">
          <div className="flex flex-col h-full pt-20 px-4 py-8 space-y-6">
            <button
              onClick={() => scrollToSection("home")}
              className="text-left text-xl text-white hover:text-orange-500 transition-colors duration-200 font-medium py-4 border-b border-white/10"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("software-house")}
              className="text-left text-xl text-white hover:text-orange-500 transition-colors duration-200 font-medium py-4 border-b border-white/10"
            >
              Software Services
            </button>
            <button
              onClick={() => scrollToSection("influencer-marketing")}
              className="text-left text-xl text-white hover:text-orange-500 transition-colors duration-200 font-medium py-4 border-b border-white/10"
            >
              Marketing Services
            </button>
            <button
              onClick={() => scrollToSection("careers")}
              className="text-left text-xl text-white hover:text-orange-500 transition-colors duration-200 font-medium py-4 border-b border-white/10"
            >
              Careers
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-left text-xl text-white hover:text-orange-500 transition-colors duration-200 font-medium py-4 border-b border-white/10"
            >
              Contact
            </button>

            <div className="pt-4 space-y-4">
              <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 rounded-lg font-medium transition-all duration-200 text-lg">
                    Book a Call
                  </Button>
                </DialogTrigger>
                {/* ... existing dialog content ... */}
              </Dialog>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

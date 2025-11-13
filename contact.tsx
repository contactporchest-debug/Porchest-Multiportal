"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { MessageCircle, Mail, Calendar, MapPin, Phone, Send, Video } from "lucide-react"

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const subject = `New Contact Form Message from ${formData.name}`
      const body = `Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}`

      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=fawada18110@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      window.open(gmailUrl, "_blank")

      setSubmitStatus("success")
      setFormData({ name: "", email: "", message: "" })
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setBookingData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleWhatsApp = () => {
    const message = "Hi! I'm interested in your services and would like to discuss my project."
    const whatsappUrl = `https://wa.me/923477437615?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleBookCall = (type: "whatsapp" | "googlemeet") => {
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

    setBookingData({
      name: "",
      email: "",
      phone: "",
      preferredDate: "",
      preferredTime: "",
      message: "",
    })
  }

  const handleEmailClick = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=fawada18110@gmail.com`
    window.open(gmailUrl, "_blank")
  }

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Let's <span className="text-orange-500">Connect</span>
          </h2>
          <div className="w-20 h-1 bg-orange-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Ready to take your brand to the next level? Get in touch with us and let's discuss how we can help you
            achieve your goals.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="shadow-2xl border-none">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-black">Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <Input
                    type="text"
                    name="name"
                    placeholder=" "
                    value={formData.name}
                    onChange={handleChange}
                    className="peer border-2 border-gray-200 focus:border-orange-500 transition-colors"
                    required
                  />
                  <label className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-orange-500">
                    Your Name
                  </label>
                </div>

                <div className="relative">
                  <Input
                    type="email"
                    name="email"
                    placeholder=" "
                    value={formData.email}
                    onChange={handleChange}
                    className="peer border-2 border-gray-200 focus:border-orange-500 transition-colors"
                    required
                  />
                  <label className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-orange-500">
                    Email Address
                  </label>
                </div>

                <div className="relative">
                  <Textarea
                    name="message"
                    placeholder=" "
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="peer border-2 border-gray-200 focus:border-orange-500 transition-colors resize-none"
                    required
                  />
                  <label className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-orange-500">
                    Your Message
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 text-white hover:bg-orange-600 font-semibold py-3 transform hover:scale-105 transition-all duration-200"
                >
                  <Send className="mr-2 h-5 w-5" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>

                {submitStatus === "success" && <p className="text-green-600 text-center">Message sent successfully!</p>}
                {submitStatus === "error" && (
                  <p className="text-red-600 text-center">Failed to send message. Please try again.</p>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-black mb-6">Get in touch</h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                We're here to help you grow your brand and achieve your digital marketing goals. Choose the best way to
                reach us:
              </p>
            </div>

            <div className="grid gap-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <CardContent className="flex items-center p-6">
                      <div className="bg-orange-500 rounded-full p-3 mr-4 group-hover:scale-110 transition-transform duration-200">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-black mb-1">Book a Call</h4>
                        <p className="text-gray-600">Schedule a free consultation</p>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Book a Call</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="booking-name">Full Name</Label>
                      <Input
                        id="booking-name"
                        name="name"
                        value={bookingData.name}
                        onChange={handleBookingChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="booking-email">Email</Label>
                      <Input
                        id="booking-email"
                        name="email"
                        type="email"
                        value={bookingData.email}
                        onChange={handleBookingChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="booking-phone">Phone Number</Label>
                      <Input
                        id="booking-phone"
                        name="phone"
                        value={bookingData.phone}
                        onChange={handleBookingChange}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="booking-date">Preferred Date</Label>
                      <Input
                        id="booking-date"
                        name="preferredDate"
                        type="date"
                        value={bookingData.preferredDate}
                        onChange={handleBookingChange}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="booking-time">Preferred Time</Label>
                      <Input
                        id="booking-time"
                        name="preferredTime"
                        type="time"
                        value={bookingData.preferredTime}
                        onChange={handleBookingChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="booking-message">Additional Message</Label>
                      <Textarea
                        id="booking-message"
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

              <Card
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={handleWhatsApp}
              >
                <CardContent className="flex items-center p-6">
                  <div className="bg-green-500 rounded-full p-3 mr-4 group-hover:scale-110 transition-transform duration-200">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-1">WhatsApp</h4>
                    <p className="text-gray-600">+92 347 7437615</p>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={handleEmailClick}
              >
                <CardContent className="flex items-center p-6">
                  <div className="bg-orange-500 rounded-full p-3 mr-4 group-hover:scale-110 transition-transform duration-200">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-1">Email</h4>
                    <p className="text-gray-600">fawada18110@gmail.com</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardContent className="flex items-center p-6">
                  <div className="bg-black rounded-full p-3 mr-4 group-hover:scale-110 transition-transform duration-200">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-1">Phone</h4>
                    <p className="text-gray-600">+92 347 7437615</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardContent className="flex items-center p-6">
                  <div className="bg-orange-500 rounded-full p-3 mr-4 group-hover:scale-110 transition-transform duration-200">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-1">Office</h4>
                    <p className="text-gray-600">Pakistan</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

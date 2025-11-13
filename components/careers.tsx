"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Users, MapPin, Clock, Send, Star, Upload, FileText, CheckCircle } from "lucide-react"

const openPositions = [
  {
    id: 1,
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Build responsive and interactive user interfaces using modern frontend technologies.",
    requirements: ["React/Next.js", "TypeScript", "Tailwind CSS", "3+ years experience"],
  },
  {
    id: 2,
    title: "Backend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Develop scalable server-side applications and APIs using modern backend technologies.",
    requirements: ["Node.js/Python", "Database design", "API development", "3+ years experience"],
  },
  {
    id: 3,
    title: "AI/ML Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Design and implement machine learning models and AI solutions for various applications.",
    requirements: ["Python", "TensorFlow/PyTorch", "Machine Learning", "2+ years experience"],
  },
  {
    id: 4,
    title: "UI/UX Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    description: "Create intuitive and visually appealing user interfaces and experiences.",
    requirements: ["Figma/Adobe XD", "User Research", "Prototyping", "2+ years experience"],
  },
  {
    id: 5,
    title: "Digital Marketing Specialist",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    description: "Develop and execute digital marketing strategies across various platforms.",
    requirements: ["SEO/SEM", "Social Media Marketing", "Analytics", "2+ years experience"],
  },
  {
    id: 6,
    title: "Full Stack Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Work on both frontend and backend development for complete web applications.",
    requirements: ["React/Node.js", "Database management", "DevOps basics", "3+ years experience"],
  },
  {
    id: 7,
    title: "Data Science Analyst",
    department: "Analytics",
    location: "Remote",
    type: "Full-time",
    description: "Analyze complex datasets to derive insights and support business decisions.",
    requirements: ["Python/R", "SQL", "Data Visualization", "Statistics", "2+ years experience"],
  },
  {
    id: 8,
    title: "Sales Generation",
    department: "Sales",
    location: "Remote",
    type: "Full-time",
    description: "Generate leads and drive sales growth through various channels and strategies.",
    requirements: ["Sales experience", "CRM tools", "Communication skills", "1+ years experience"],
  },
]

export function Careers() {
  const [jobForm, setJobForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    portfolio: "",
    coverLetter: "",
    resume: null as File | null,
  })

  const [internshipForm, setInternshipForm] = useState({
    name: "",
    email: "",
    phone: "",
    field: "",
    university: "",
    year: "",
    portfolio: "",
    motivation: "",
    resume: null as File | null,
  })

  const handleJobSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create FormData for Google Forms submission
    const formData = new FormData()
    formData.append("entry.123456789", jobForm.name) // Replace with actual entry IDs from Google Form
    formData.append("entry.987654321", jobForm.email)
    formData.append("entry.456789123", jobForm.phone)
    formData.append("entry.789123456", jobForm.position)
    formData.append("entry.321654987", jobForm.experience)
    formData.append("entry.654987321", jobForm.portfolio)
    formData.append("entry.147258369", jobForm.coverLetter)

    // Submit to Google Forms
    fetch("https://docs.google.com/forms/d/e/YOUR_GOOGLE_FORM_ID/formResponse", {
      method: "POST",
      body: formData,
      mode: "no-cors",
    })
      .then(() => {
        alert("Job application submitted successfully! We'll get back to you soon.")
        // Reset form
        setJobForm({
          name: "",
          email: "",
          phone: "",
          position: "",
          experience: "",
          portfolio: "",
          coverLetter: "",
          resume: null,
        })
      })
      .catch(() => {
        alert("There was an error submitting your application. Please try again.")
      })
  }

  const handleInternshipSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create FormData for Google Forms submission
    const formData = new FormData()
    formData.append("entry.111222333", internshipForm.name) // Replace with actual entry IDs from Google Form
    formData.append("entry.444555666", internshipForm.email)
    formData.append("entry.777888999", internshipForm.phone)
    formData.append("entry.000111222", internshipForm.field)
    formData.append("entry.333444555", internshipForm.university)
    formData.append("entry.666777888", internshipForm.year)
    formData.append("entry.999000111", internshipForm.portfolio)
    formData.append("entry.222333444", internshipForm.motivation)

    // Submit to Google Forms
    fetch("https://docs.google.com/forms/d/e/YOUR_INTERNSHIP_GOOGLE_FORM_ID/formResponse", {
      method: "POST",
      body: formData,
      mode: "no-cors",
    })
      .then(() => {
        alert("Internship application submitted successfully! We'll review your application.")
        // Reset form
        setInternshipForm({
          name: "",
          email: "",
          phone: "",
          field: "",
          university: "",
          year: "",
          portfolio: "",
          motivation: "",
          resume: null,
        })
      })
      .catch(() => {
        alert("There was an error submitting your application. Please try again.")
      })
  }

  const handleFileUpload = (file: File, type: "job" | "internship") => {
    if (type === "job") {
      setJobForm({ ...jobForm, resume: file })
    } else {
      setInternshipForm({ ...internshipForm, resume: file })
    }
  }

  const handleApplyNow = (positionTitle: string) => {
    setJobForm({ ...jobForm, position: positionTitle })
    // Switch to job application tab
    const tabTrigger = document.querySelector('[value="job-application"]') as HTMLElement
    tabTrigger?.click()
  }

  return (
    <section id="careers" className="py-20 bg-black relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#ff7a00] rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-coral-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-[#ff7a00]/30 text-[#ff7a00] bg-[#ff7a00]/10 mb-4">
            <Briefcase className="w-4 h-4 mr-2" />
            Join Our Team
          </Badge>
          <h2 className="text-5xl md:text-8xl font-bold text-white mb-6">
            Build Your Career with <span className="text-white">Porchest</span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Join our innovative team and help shape the future of digital technology. We offer exciting opportunities
            for growth, learning, and making a real impact.
          </p>
        </div>

        <Tabs defaultValue="positions" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-[#ff7a00]/20 rounded-xl p-1 h-16">
            <TabsTrigger
              value="positions"
              className="flex items-center justify-center h-full px-6 py-3 rounded-xl text-slate-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff7a00] data-[state=active]:to-coral-500 data-[state=active]:text-white transition-all duration-300 hover:bg-[#ff7a00]/10"
            >
              <Users className="w-4 h-4 mr-2" />
              Open Positions
            </TabsTrigger>
            <TabsTrigger
              value="job-application"
              className="flex items-center justify-center h-full px-6 py-3 rounded-xl text-slate-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff7a00] data-[state=active]:to-coral-500 data-[state=active]:text-white transition-all duration-300 hover:bg-[#ff7a00]/10"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Job Application
            </TabsTrigger>
            <TabsTrigger
              value="internship"
              className="flex items-center justify-center h-full px-6 py-3 rounded-xl text-slate-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff7a00] data-[state=active]:to-coral-500 data-[state=active]:text-white transition-all duration-300 hover:bg-[#ff7a00]/10"
            >
              <Star className="w-4 h-4 mr-2" />
              Internship Application
            </TabsTrigger>
          </TabsList>

          <TabsContent value="positions" className="mt-8">
            <div className="block md:hidden">
              <div className="space-y-4">
                {openPositions.map((position) => (
                  <Card
                    key={position.id}
                    className="bg-slate-800/50 border-[#ff7a00]/20 hover:border-[#ff7a00]/40 transition-all duration-300"
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-lg">{position.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="border-[#ff7a00]/30 text-[#ff7a00] bg-[#ff7a00]/10 text-xs">
                          <MapPin className="w-3 h-3 mr-1" />
                          {position.location}
                        </Badge>
                        <Badge variant="outline" className="border-coral-500/30 text-coral-500 bg-coral-500/10 text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {position.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button
                        className="w-full bg-gradient-to-r from-[#ff7a00] to-coral-500 hover:from-[#ff7a00]/90 hover:to-coral-500/90 text-white"
                        onClick={() => handleApplyNow(position.title)}
                      >
                        Apply Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Desktop layout */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {openPositions.map((position) => (
                <Card
                  key={position.id}
                  className="bg-slate-800/50 border-[#ff7a00]/20 hover:border-[#ff7a00]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#ff7a00]/10"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-xl mb-2">{position.title}</CardTitle>
                        <CardDescription className="text-slate-300">{position.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge variant="outline" className="border-[#ff7a00]/30 text-[#ff7a00] bg-[#ff7a00]/10">
                        <MapPin className="w-3 h-3 mr-1" />
                        {position.location}
                      </Badge>
                      <Badge variant="outline" className="border-coral-500/30 text-coral-500 bg-coral-500/10">
                        <Clock className="w-3 h-3 mr-1" />
                        {position.type}
                      </Badge>
                      <Badge variant="outline" className="border-slate-500/30 text-slate-300 bg-slate-500/10">
                        {position.department}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-semibold mb-2">Requirements:</h4>
                        <ul className="text-slate-300 text-sm space-y-1">
                          {position.requirements.map((req, index) => (
                            <li key={index} className="flex items-center">
                              <div className="w-1.5 h-1.5 bg-[#ff7a00] rounded-full mr-2"></div>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        className="w-full bg-gradient-to-r from-[#ff7a00] to-coral-500 hover:from-[#ff7a00]/90 hover:to-coral-500/90 text-white"
                        onClick={() => handleApplyNow(position.title)}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="job-application" className="mt-8">
            <Card className="bg-slate-800/50 border-[#ff7a00]/20 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Job Application</CardTitle>
                <CardDescription className="text-slate-300">
                  Fill out the form below to apply for a position at Porchest.
                </CardDescription>
                <div className="block md:hidden mt-4">
                  {jobForm.position && (
                    <div className="bg-slate-700/30 p-4 rounded-lg border border-[#ff7a00]/20">
                      <h3 className="text-white font-semibold mb-2">Position Details</h3>
                      {(() => {
                        const position = openPositions.find((p) => p.title === jobForm.position)
                        if (!position) return null
                        return (
                          <div className="space-y-2">
                            <p className="text-slate-300 text-sm">{position.description}</p>
                            <div className="flex flex-wrap gap-2">
                              <Badge
                                variant="outline"
                                className="border-[#ff7a00]/30 text-[#ff7a00] bg-[#ff7a00]/10 text-xs"
                              >
                                {position.location}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="border-coral-500/30 text-coral-500 bg-coral-500/10 text-xs"
                              >
                                {position.type}
                              </Badge>
                            </div>
                            <div className="mt-2">
                              <h4 className="text-white text-sm font-semibold mb-1">Requirements:</h4>
                              <ul className="text-slate-300 text-xs space-y-1">
                                {position.requirements.map((req, index) => (
                                  <li key={index} className="flex items-center">
                                    <div className="w-1 h-1 bg-[#ff7a00] rounded-full mr-2"></div>
                                    {req}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleJobSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="job-name" className="text-white">
                        Full Name *
                      </Label>
                      <Input
                        id="job-name"
                        value={jobForm.name}
                        onChange={(e) => setJobForm({ ...jobForm, name: e.target.value })}
                        className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00]"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="job-email" className="text-white">
                        Email *
                      </Label>
                      <Input
                        id="job-email"
                        type="email"
                        value={jobForm.email}
                        onChange={(e) => setJobForm({ ...jobForm, email: e.target.value })}
                        className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="job-phone" className="text-white">
                        Phone Number *
                      </Label>
                      <Input
                        id="job-phone"
                        value={jobForm.phone}
                        onChange={(e) => setJobForm({ ...jobForm, phone: e.target.value })}
                        className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00]"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="job-position" className="text-white">
                        Position *
                      </Label>
                      <Select
                        value={jobForm.position}
                        onValueChange={(value) => setJobForm({ ...jobForm, position: value })}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00]">
                          <SelectValue placeholder="Select a position" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          {openPositions.map((position) => (
                            <SelectItem key={position.id} value={position.title} className="text-white">
                              {position.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="job-experience" className="text-white">
                        Years of Experience *
                      </Label>
                      <Select
                        value={jobForm.experience}
                        onValueChange={(value) => setJobForm({ ...jobForm, experience: value })}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00]">
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="0-1" className="text-white">
                            0-1 years
                          </SelectItem>
                          <SelectItem value="1-3" className="text-white">
                            1-3 years
                          </SelectItem>
                          <SelectItem value="3-5" className="text-white">
                            3-5 years
                          </SelectItem>
                          <SelectItem value="5+" className="text-white">
                            5+ years
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="job-portfolio" className="text-white">
                        Portfolio/LinkedIn URL
                      </Label>
                      <Input
                        id="job-portfolio"
                        type="url"
                        value={jobForm.portfolio}
                        onChange={(e) => setJobForm({ ...jobForm, portfolio: e.target.value })}
                        className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00]"
                      />
                    </div>
                  </div>

                  {/* CV Upload Section */}
                  <div className="space-y-2">
                    <Label htmlFor="job-resume" className="text-white">
                      Upload CV/Resume *
                    </Label>
                    <div className="mt-2">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#ff7a00]/30 border-dashed rounded-lg cursor-pointer bg-slate-700/30 hover:bg-slate-700/50 transition-colors duration-300 group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-[#ff7a00] group-hover:scale-110 transition-transform duration-300" />
                          <p className="mb-2 text-sm text-white">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-slate-400">PDF, DOC, DOCX (MAX. 10MB)</p>
                        </div>
                        <input
                          id="job-resume"
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file, "job")
                          }}
                          required
                        />
                      </label>
                      {jobForm.resume && (
                        <div className="mt-3 flex items-center space-x-2 text-sm text-[#ff7a00]">
                          <FileText className="w-4 h-4" />
                          <span>{jobForm.resume.name}</span>
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="job-cover-letter" className="text-white">
                      Cover Letter *
                    </Label>
                    <Textarea
                      id="job-cover-letter"
                      value={jobForm.coverLetter}
                      onChange={(e) => setJobForm({ ...jobForm, coverLetter: e.target.value })}
                      className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00] min-h-[120px]"
                      placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#ff7a00] to-coral-500 hover:from-[#ff7a00]/90 hover:to-coral-500/90 text-white py-3"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Application
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="internship" className="mt-8">
            <Card className="bg-slate-800/50 border-[#ff7a00]/20 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Internship Application</CardTitle>
                <CardDescription className="text-slate-300">
                  Apply for an internship opportunity and kickstart your career with us.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInternshipSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="intern-name" className="text-white">
                        Full Name *
                      </Label>
                      <Input
                        id="intern-name"
                        value={internshipForm.name}
                        onChange={(e) => setInternshipForm({ ...internshipForm, name: e.target.value })}
                        className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00]"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="intern-email" className="text-white">
                        Email *
                      </Label>
                      <Input
                        id="intern-email"
                        type="email"
                        value={internshipForm.email}
                        onChange={(e) => setInternshipForm({ ...internshipForm, email: e.target.value })}
                        className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="intern-phone" className="text-white">
                        Phone Number *
                      </Label>
                      <Input
                        id="intern-phone"
                        value={internshipForm.phone}
                        onChange={(e) => setInternshipForm({ ...internshipForm, phone: e.target.value })}
                        className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00]"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="intern-field" className="text-white">
                        Field of Interest *
                      </Label>
                      <Select
                        value={internshipForm.field}
                        onValueChange={(value) => setInternshipForm({ ...internshipForm, field: value })}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00]">
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="frontend" className="text-white">
                            Frontend Development
                          </SelectItem>
                          <SelectItem value="backend" className="text-white">
                            Backend Development
                          </SelectItem>
                          <SelectItem value="fullstack" className="text-white">
                            Full Stack Development
                          </SelectItem>
                          <SelectItem value="uiux" className="text-white">
                            UI/UX Design
                          </SelectItem>
                          <SelectItem value="marketing" className="text-white">
                            Digital Marketing
                          </SelectItem>
                          <SelectItem value="data" className="text-white">
                            Data Science
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="intern-university" className="text-white">
                        University/College *
                      </Label>
                      <Input
                        id="intern-university"
                        value={internshipForm.university}
                        onChange={(e) => setInternshipForm({ ...internshipForm, university: e.target.value })}
                        className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00]"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="intern-year" className="text-white">
                        Academic Year *
                      </Label>
                      <Select
                        value={internshipForm.year}
                        onValueChange={(value) => setInternshipForm({ ...internshipForm, year: value })}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00]">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-600">
                          <SelectItem value="1st" className="text-white">
                            1st Year
                          </SelectItem>
                          <SelectItem value="2nd" className="text-white">
                            2nd Year
                          </SelectItem>
                          <SelectItem value="3rd" className="text-white">
                            3rd Year
                          </SelectItem>
                          <SelectItem value="4th" className="text-white">
                            4th Year
                          </SelectItem>
                          <SelectItem value="graduate" className="text-white">
                            Graduate
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="intern-portfolio" className="text-white">
                      Portfolio/GitHub URL (Optional)
                    </Label>
                    <Input
                      id="intern-portfolio"
                      type="url"
                      value={internshipForm.portfolio}
                      onChange={(e) => setInternshipForm({ ...internshipForm, portfolio: e.target.value })}
                      className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00]"
                    />
                  </div>

                  {/* CV Upload Section for Internship */}
                  <div className="space-y-2">
                    <Label htmlFor="intern-resume" className="text-white">
                      Upload CV/Resume (Optional)
                    </Label>
                    <div className="mt-2">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#ff7a00]/30 border-dashed rounded-lg cursor-pointer bg-slate-700/30 hover:bg-slate-700/50 transition-colors duration-300 group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-[#ff7a00] group-hover:scale-110 transition-transform duration-300" />
                          <p className="mb-2 text-sm text-white">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-slate-400">PDF, DOC, DOCX (MAX. 10MB)</p>
                        </div>
                        <input
                          id="intern-resume"
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file, "internship")
                          }}
                        />
                      </label>
                      {internshipForm.resume && (
                        <div className="mt-3 flex items-center space-x-2 text-sm text-[#ff7a00]">
                          <FileText className="w-4 h-4" />
                          <span>{internshipForm.resume.name}</span>
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="intern-motivation" className="text-white">
                      Why do you want to intern with us? *
                    </Label>
                    <Textarea
                      id="intern-motivation"
                      value={internshipForm.motivation}
                      onChange={(e) => setInternshipForm({ ...internshipForm, motivation: e.target.value })}
                      className="bg-slate-700/50 border-slate-600 text-white focus:border-[#ff7a00] min-h-[120px]"
                      placeholder="Tell us about your motivation, goals, and what you hope to learn..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#ff7a00] to-coral-500 hover:from-[#ff7a00]/90 hover:to-coral-500/90 text-white py-3"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Application
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

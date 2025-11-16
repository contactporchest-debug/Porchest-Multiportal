import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Careers | Porchest",
  description: "Join our team of talented developers, marketers, and innovators",
};

export default function Careers() {
  const openPositions = [
    {
      title: "Senior Full-Stack Developer",
      department: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      description: "Build scalable web applications using React, Node.js, and modern cloud technologies.",
    },
    {
      title: "Digital Marketing Manager",
      department: "Marketing",
      location: "New York / Remote",
      type: "Full-time",
      description: "Lead influencer marketing campaigns and drive brand growth across social platforms.",
    },
    {
      title: "UI/UX Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Create beautiful, intuitive user experiences for web and mobile applications.",
    },
    {
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Manage cloud infrastructure, CI/CD pipelines, and ensure system reliability.",
    },
    {
      title: "Social Media Specialist",
      department: "Marketing",
      location: "Los Angeles / Remote",
      type: "Full-time",
      description: "Manage social media accounts, create engaging content, and grow our online community.",
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      type: "Full-time",
      description: "Define product strategy and roadmap for our influencer marketing platform.",
    },
  ];

  const benefits = [
    {
      title: "Competitive Salary",
      description: "Industry-leading compensation packages with equity options",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
    },
    {
      title: "Remote Work",
      description: "Work from anywhere with flexible hours and work-life balance",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
    },
    {
      title: "Health Insurance",
      description: "Comprehensive medical, dental, and vision coverage",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      ),
    },
    {
      title: "Learning Budget",
      description: "Annual budget for courses, conferences, and professional development",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      ),
    },
    {
      title: "Unlimited PTO",
      description: "Take time off when you need it to recharge and stay productive",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      ),
    },
    {
      title: "Team Events",
      description: "Regular team building activities and company retreats",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      ),
    },
  ];

  const values = [
    {
      title: "Innovation First",
      description: "We embrace new technologies and creative solutions to solve complex problems.",
    },
    {
      title: "Collaborative Spirit",
      description: "We believe the best work happens when talented people work together.",
    },
    {
      title: "Customer Obsessed",
      description: "Our success is measured by the success of our clients and their campaigns.",
    },
    {
      title: "Growth Mindset",
      description: "We invest in our team's development and celebrate continuous learning.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Join Our Team
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              Build the future of digital marketing and software development with Porchest
            </p>
            <a
              href="#positions"
              className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all shadow-xl"
            >
              View Open Positions
            </a>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Work at Porchest
            </h2>
            <p className="text-xl text-gray-600">
              Benefits and perks that support your best work
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {benefit.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Open Positions
            </h2>
            <p className="text-xl text-gray-600">
              Find your next opportunity with us
            </p>
          </div>

          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:border-indigo-500 hover:shadow-xl transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{position.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                        {position.department}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                        {position.location}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                        {position.type}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`mailto:careers@porchest.com?subject=Application for ${position.title}`}
                    className="mt-4 md:mt-0 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors whitespace-nowrap"
                  >
                    Apply Now
                  </a>
                </div>
                <p className="text-gray-600">{position.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center bg-gray-50 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Don't see a perfect fit?
            </h3>
            <p className="text-gray-600 mb-6">
              We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <a
              href="mailto:careers@porchest.com"
              className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Send Your Resume
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl mb-8 text-indigo-100 max-w-2xl mx-auto">
            Join a team that's shaping the future of digital marketing and software development
          </p>
          <a
            href="#positions"
            className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all shadow-xl"
          >
            Browse Positions
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

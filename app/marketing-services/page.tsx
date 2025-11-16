import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Marketing Services | Porchest",
  description: "Influencer marketing, social media management, SEO, and digital marketing solutions",
};

export default function MarketingServices() {
  const services = [
    {
      title: "Influencer Marketing",
      description: "Connect with the right influencers to amplify your brand message and reach your target audience authentically.",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      ),
      features: ["Influencer matchmaking", "Campaign management", "Performance tracking", "ROI analytics"],
    },
    {
      title: "Social Media Management",
      description: "Comprehensive social media strategy, content creation, and community management across all platforms.",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      ),
      features: ["Content calendar", "Post scheduling", "Engagement monitoring", "Audience growth"],
    },
    {
      title: "Content Marketing",
      description: "Strategic content creation that tells your brand story and drives engagement across digital channels.",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      ),
      features: ["Blog writing", "Video production", "Infographics", "Email campaigns"],
    },
    {
      title: "SEO & SEM",
      description: "Improve your search rankings and drive qualified traffic with data-driven SEO and paid search strategies.",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      ),
      features: ["Keyword research", "On-page optimization", "Link building", "PPC campaigns"],
    },
    {
      title: "Performance Marketing",
      description: "Data-driven campaigns optimized for conversions, ROI, and measurable business outcomes.",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      ),
      features: ["Conversion optimization", "A/B testing", "Analytics tracking", "Campaign reporting"],
    },
    {
      title: "Brand Strategy",
      description: "Build a powerful brand identity and positioning that resonates with your target market.",
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      ),
      features: ["Brand positioning", "Visual identity", "Messaging strategy", "Market research"],
    },
  ];

  const platforms = [
    "Instagram",
    "TikTok",
    "YouTube",
    "Facebook",
    "Twitter",
    "LinkedIn",
    "Pinterest",
    "Snapchat",
  ];

  const caseStudies = [
    {
      brand: "TechStyle Fashion",
      industry: "E-commerce",
      result: "180% increase in sales",
      metric: "500K+ impressions",
      color: "from-blue-600 to-purple-600",
    },
    {
      brand: "FitLife Nutrition",
      industry: "Health & Wellness",
      result: "4.2x ROI achieved",
      metric: "1.2M reach",
      color: "from-purple-600 to-pink-600",
    },
    {
      brand: "Urban Style Co",
      industry: "Fashion",
      result: "250% engagement growth",
      metric: "2.5M+ impressions",
      color: "from-pink-600 to-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Digital Marketing Services
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              Amplify your brand reach with strategic influencer marketing and data-driven digital campaigns
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all shadow-xl"
            >
              Launch Your Campaign
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Marketing Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive marketing solutions to grow your brand and drive results
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:border-purple-500"
              >
                <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {service.icon}
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Platforms We Dominate
            </h2>
            <p className="text-xl text-gray-600">
              Multi-channel marketing across all major social platforms
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {platforms.map((platform, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all text-center border-2 border-transparent hover:border-purple-500"
              >
                <p className="font-bold text-gray-900 text-lg">{platform}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Campaign Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Real results from real campaigns
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${study.color} text-white p-8 rounded-2xl shadow-xl`}
              >
                <h3 className="text-2xl font-bold mb-2">{study.brand}</h3>
                <p className="text-sm opacity-90 mb-6">{study.industry}</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold">{study.result}</p>
                    <p className="text-sm opacity-90">Growth achieved</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{study.metric}</p>
                    <p className="text-sm opacity-90">Total reach</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Porchest Marketing
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Data-Driven", description: "Every decision backed by analytics and insights" },
              { title: "Authentic Partnerships", description: "Genuine influencer relationships that resonate" },
              { title: "Measurable ROI", description: "Track every dollar with comprehensive reporting" },
              { title: "Creative Excellence", description: "Award-winning content that captivates audiences" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Amplify Your Brand?
          </h2>
          <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">
            Let's create a marketing campaign that drives real results
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all shadow-xl"
            >
              Start Campaign
            </Link>
            <a
              href="mailto:info@porchest.com"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-600 transition-all"
            >
              Talk to Expert
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

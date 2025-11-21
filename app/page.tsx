import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section - Glassmorphism */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient blobs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-porchest-orange opacity-20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-porchest-orange-light opacity-15 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            {/* Glass card container */}
            <div className="glass-card p-8 md:p-12 max-w-5xl mx-auto">
              <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight text-white">
                Transform Your Brand with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-porchest-orange via-porchest-orange-light to-white animate-gradient">
                  Influencer Marketing
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-gray-300 max-w-3xl mx-auto">
                Connect brands with authentic influencers. Drive engagement, build trust, and achieve measurable ROI through data-driven campaigns.
              </p>

              {/* CTA Buttons with glass effect */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="glass-button-primary px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-all duration-300"
                >
                  Get Started Free
                </Link>
                <Link
                  href="#about"
                  className="glass-button px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
              {[
                { number: "10K+", label: "Influencers" },
                { number: "500+", label: "Brands" },
                { number: "5M+", label: "Reach" },
                { number: "95%", label: "Success Rate" }
              ].map((stat, index) => (
                <div key={index} className="glass-card p-6 hover:glass-orange transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-bold text-porchest-orange mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Glassmorphism */}
      <section id="about" className="relative py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-20">
            <div className="glass-card inline-block px-6 py-2 mb-6">
              <span className="text-porchest-orange font-semibold">WHO WE ARE</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              The Future of{" "}
              <span className="text-porchest-orange">Influencer Marketing</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Porchest connects brands with authentic influencers through AI-powered matching,
              real-time analytics, and seamless campaign management.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl hover:glass-orange transition-all duration-500 group">
              <div className="w-16 h-16 glass-orange rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-porchest-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Matching</h3>
              <p className="text-gray-400 leading-relaxed">
                Our intelligent algorithm matches brands with the perfect influencers based on audience demographics,
                engagement rates, and brand alignment.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl hover:glass-orange transition-all duration-500 group">
              <div className="w-16 h-16 glass-orange rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-porchest-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Real-Time Analytics</h3>
              <p className="text-gray-400 leading-relaxed">
                Track campaign performance, engagement metrics, and ROI in real-time with comprehensive analytics dashboards and detailed reports.
              </p>
            </div>

            <div className="glass-card p-8 rounded-2xl hover:glass-orange transition-all duration-500 group">
              <div className="w-16 h-16 glass-orange rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-porchest-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Seamless Management</h3>
              <p className="text-gray-400 leading-relaxed">
                Manage all your influencer campaigns from one platform. From discovery to payment, we handle everything for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Glassmorphism */}
      <section className="relative py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="glass-card inline-block px-6 py-2 mb-6">
              <span className="text-porchest-orange font-semibold">HOW IT WORKS</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Simple, Fast, <span className="text-porchest-orange">Effective</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Connect Your Account",
                description: "Sign up and link your Instagram or TikTok account. Our AI analyzes your audience and engagement patterns.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                )
              },
              {
                step: "02",
                title: "Get Matched",
                description: "Our platform matches you with brands or influencers that align with your goals, audience, and values.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                )
              },
              {
                step: "03",
                title: "Launch & Grow",
                description: "Execute campaigns, track performance in real-time, and watch your influence (or brand) grow exponentially.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                )
              }
            ].map((item, index) => (
              <div key={index} className="relative group">
                {/* Connector line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-24 left-full w-full h-0.5 bg-gradient-to-r from-porchest-orange to-transparent opacity-30"></div>
                )}

                <div className="glass-card p-8 rounded-2xl hover:glass-orange transition-all duration-500">
                  <div className="text-6xl font-bold text-porchest-orange opacity-20 mb-4">{item.step}</div>
                  <div className="w-16 h-16 glass-orange rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-porchest-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {item.icon}
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portals Section - Glassmorphism */}
      <section className="relative py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="glass-card inline-block px-6 py-2 mb-6">
              <span className="text-porchest-orange font-semibold">CHOOSE YOUR PATH</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Join as <span className="text-porchest-orange">Brand</span> or{" "}
              <span className="text-porchest-orange">Influencer</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Brand Portal Card */}
            <Link href="/register?role=brand" className="group">
              <div className="glass-card p-10 rounded-3xl hover:glass-orange transition-all duration-500 h-full">
                <div className="text-center">
                  <div className="w-20 h-20 glass-orange rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10 text-porchest-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">For Brands</h3>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                    Find the perfect influencers for your brand. Launch campaigns, track ROI, and scale your marketing efforts.
                  </p>
                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-center text-gray-300">
                      <svg className="w-5 h-5 text-porchest-orange mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      AI-powered influencer discovery
                    </li>
                    <li className="flex items-center text-gray-300">
                      <svg className="w-5 h-5 text-porchest-orange mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Campaign management tools
                    </li>
                    <li className="flex items-center text-gray-300">
                      <svg className="w-5 h-5 text-porchest-orange mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Real-time performance analytics
                    </li>
                  </ul>
                  <div className="glass-button-primary px-6 py-3 rounded-xl font-semibold inline-block">
                    Join as Brand →
                  </div>
                </div>
              </div>
            </Link>

            {/* Influencer Portal Card */}
            <Link href="/register?role=influencer" className="group">
              <div className="glass-card p-10 rounded-3xl hover:glass-orange transition-all duration-500 h-full">
                <div className="text-center">
                  <div className="w-20 h-20 glass-orange rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10 text-porchest-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">For Influencers</h3>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                    Monetize your influence. Get matched with top brands, manage collaborations, and grow your income.
                  </p>
                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-center text-gray-300">
                      <svg className="w-5 h-5 text-porchest-orange mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Automatic brand matching
                    </li>
                    <li className="flex items-center text-gray-300">
                      <svg className="w-5 h-5 text-porchest-orange mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Earnings & insights dashboard
                    </li>
                    <li className="flex items-center text-gray-300">
                      <svg className="w-5 h-5 text-porchest-orange mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Secure & timely payments
                    </li>
                  </ul>
                  <div className="glass-button-primary px-6 py-3 rounded-xl font-semibold inline-block">
                    Join as Influencer →
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Glassmorphism */}
      <section className="relative py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-12 md:p-20 rounded-3xl text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-porchest-orange opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-porchest-orange-light opacity-10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Ready to <span className="text-porchest-orange">Transform</span> Your Marketing?
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Join thousands of brands and influencers already using Porchest to drive authentic engagement and measurable results.
              </p>
              <Link
                href="/register"
                className="glass-button-primary px-10 py-5 rounded-xl font-semibold text-xl inline-block hover:scale-105 transition-all duration-300"
              >
                Start Your Journey Today
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

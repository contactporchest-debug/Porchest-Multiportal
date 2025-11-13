import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { LoginSection } from "@/components/login-section"
import { SoftwareHouse } from "@/components/software-house"
import { InfluencerMarketing } from "@/components/influencer-marketing"
import { Careers } from "@/components/careers"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main className="main-content">
        <Hero />
        <LoginSection />
        <SoftwareHouse />
        <InfluencerMarketing />
        <Careers />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

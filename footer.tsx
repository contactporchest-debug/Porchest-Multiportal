import { Button } from "@/components/ui/button"
import { Instagram, Youtube, Linkedin, Twitter, Facebook } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Image src="/logo.png" alt="Tivuq Logo" width={120} height={40} className="h-8 w-auto" />
            </div>
            <p className="text-gray-300 leading-relaxed">
              Empowering brands, influencers, and companies to achieve success in the digital world through innovative
              strategies and creative campaigns.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-orange-500 hover:bg-orange-500/10"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-orange-500 hover:bg-orange-500/10"
              >
                <Youtube className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-orange-500 hover:bg-orange-500/10"
              >
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-orange-500 hover:bg-orange-500/10"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:text-orange-500 hover:bg-orange-500/10"
              >
                <Facebook className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#about" className="text-gray-300 hover:text-orange-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Brand Strategy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Social Media Marketing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Influencer Marketing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Creative Campaigns
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Analytics & Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Contact Info</h3>
            <div className="space-y-3">
              <p className="text-gray-300">
                <span className="text-orange-500">Phone:</span>
                <br />
                +92 347 7437615
              </p>
              <p className="text-gray-300">
                <span className="text-orange-500">Email:</span>
                <br />
                fawada18110@gmail.com
              </p>
              <p className="text-gray-300">
                <span className="text-orange-500">Location:</span>
                <br />
                Pakistan
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">© {new Date().getFullYear()} Tivuq. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-300 hover:text-orange-500 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-300 hover:text-orange-500 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-300 hover:text-orange-500 text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

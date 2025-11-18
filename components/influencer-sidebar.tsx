"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  User,
  Handshake,
  CheckCircle,
  Wallet,
  BarChart3,
  Settings,
  HelpCircle,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/influencer",
    icon: LayoutDashboard,
  },
  {
    title: "Profile Setup",
    href: "/influencer/profile",
    icon: User,
  },
  {
    title: "Collaboration Requests",
    href: "/influencer/collaborations",
    icon: Handshake,
  },
  {
    title: "Post Verification",
    href: "/influencer/verification",
    icon: CheckCircle,
  },
  {
    title: "Earnings & Withdrawals",
    href: "/influencer/earnings",
    icon: Wallet,
  },
  {
    title: "Insights Dashboard",
    href: "/influencer/insights",
    icon: BarChart3,
  },
]

const bottomNavItems = [
  {
    title: "Settings",
    href: "/influencer/settings",
    icon: Settings,
  },
  {
    title: "Help",
    href: "/influencer/help",
    icon: HelpCircle,
  },
]

export function InfluencerSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col glass-sidebar">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-lg font-semibold text-porchest-orange">Influencer Portal</h2>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {sidebarNavItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "default" : "ghost"}
              className={cn("w-full justify-start", pathname === item.href && "bg-porchest-orange text-white shadow-glow")}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-white/10">
        <div className="space-y-1">
          {bottomNavItems.map((item) => (
            <Button key={item.href} variant="ghost" className="w-full justify-start" asChild>
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, Search, Target, TrendingUp, BarChart3, Users, Settings, HelpCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/brand",
    icon: LayoutDashboard,
  },
  {
    title: "Influencer Search",
    href: "/brand/search",
    icon: Search,
  },
  {
    title: "Campaign Management",
    href: "/brand/campaigns",
    icon: Target,
  },
  {
    title: "ROI Predictions",
    href: "/brand/roi",
    icon: TrendingUp,
  },
  {
    title: "Analytics",
    href: "/brand/analytics",
    icon: BarChart3,
  },
  {
    title: "Influencers",
    href: "/brand/influencers",
    icon: Users,
  },
]

const bottomNavItems = [
  {
    title: "Settings",
    href: "/brand/settings",
    icon: Settings,
  },
  {
    title: "Help",
    href: "/brand/help",
    icon: HelpCircle,
  },
]

export function BrandSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-background border-r">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-primary">Brand Portal</h2>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {sidebarNavItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn("w-full justify-start", pathname === item.href && "bg-secondary")}
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

      <div className="p-3 border-t">
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

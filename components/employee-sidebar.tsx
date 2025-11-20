"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  User,
  ClipboardList,
  TrendingUp,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/employee",
    icon: LayoutDashboard,
  },
  {
    title: "Profile Setup",
    href: "/employee/profile",
    icon: User,
  },
  {
    title: "Daily Reporting",
    href: "/employee/reporting",
    icon: ClipboardList,
  },
  {
    title: "Performance Tracking",
    href: "/employee/performance",
    icon: TrendingUp,
  },
]

const bottomNavItems = [
  {
    title: "Settings",
    href: "/employee/settings",
    icon: Settings,
  },
  {
    title: "Help",
    href: "/employee/help",
    icon: HelpCircle,
  },
]

export function EmployeeSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col glass-sidebar">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-lg font-semibold text-porchest-orange">Employee Portal</h2>
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
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  UserCheck,
  UserPlus,
  DollarSign,
  TrendingUp,
  FolderKanban,
  Shield,
  FileText,
  LogOut
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "User Verification", href: "/admin/verification", icon: UserCheck, badge: "8" },
  { name: "Login Creation", href: "/admin/create-login", icon: UserPlus },
  { name: "Contracts & Payments", href: "/admin/payments", icon: DollarSign },
  { name: "Employee Reports", href: "/admin/employee-reports", icon: TrendingUp },
  { name: "Software Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Fraud Monitoring", href: "/admin/fraud", icon: Shield, badge: "3" },
  { name: "All Contracts", href: "/admin/contracts", icon: FileText },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full glass-sidebar">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-porchest-orange rounded-lg flex items-center justify-center shadow-glow">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-white">Admin Portal</h2>
            <p className="text-xs text-white/60">System Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn("w-full justify-start gap-3", isActive && "bg-porchest-orange text-white shadow-glow")}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1 text-left">{item.name}</span>
                {item.badge && (
                  <Badge variant={isActive ? "secondary" : "outline"} className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 glass border-glass-border rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">AD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-white/60">System Administrator</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}

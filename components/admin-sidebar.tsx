"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, Users, DollarSign, Shield, Activity, FileText, Settings, LogOut } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Contracts & Payments", href: "/admin/payments", icon: DollarSign, badge: "12" },
  { name: "Fraud Detection", href: "/admin/fraud", icon: Shield, badge: "3" },
  { name: "System Analytics", href: "/admin/analytics", icon: Activity },
  { name: "Reports", href: "/admin/reports", icon: FileText },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold">Admin Portal</h2>
            <p className="text-xs text-muted-foreground">System Management</p>
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
                className={cn("w-full justify-start gap-3", isActive && "bg-primary text-primary-foreground")}
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
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">AD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">System Administrator</p>
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

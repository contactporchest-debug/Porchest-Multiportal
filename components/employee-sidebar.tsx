"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, CheckSquare, MessageSquare, FileText, Calendar, Settings, LogOut } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/employee", icon: LayoutDashboard },
  { name: "Task Board", href: "/employee/tasks", icon: CheckSquare, badge: "4" },
  { name: "Team Chat", href: "/employee/chat", icon: MessageSquare, badge: "2" },
  { name: "Reports", href: "/employee/reports", icon: FileText },
  { name: "Calendar", href: "/employee/calendar", icon: Calendar },
  { name: "Settings", href: "/employee/settings", icon: Settings },
]

export default function EmployeeSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <CheckSquare className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold">Employee Portal</h2>
            <p className="text-xs text-muted-foreground">Task & Team Management</p>
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
            <span className="text-sm font-medium">JD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-muted-foreground">Software Developer</p>
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

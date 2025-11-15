"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, User } from "lucide-react"

function getInitials(name?: string | null, email?: string | null) {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }
  if (email) return email[0].toUpperCase()
  return "U"
}

function roleDisplay(role?: string | null) {
  if (!role) return ""
  const r = role.toUpperCase()
  const map: Record<string, string> = {
    BRAND: "Brand Manager",
    INFLUENCER: "Influencer",
    CLIENT: "Client",
    EMPLOYEE: "Employee",
    ADMIN: "Administrator",
  }
  return map[r] || r
}

export function UserNav() {
  const [user, setUser] = useState<{ email: string; role: string; name?: string } | null>(null)

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session", { credentials: "include" })
        if (!res.ok) throw new Error("Session not found")
        const data = await res.json()
        setUser(data.user)
      } catch (error) {
        // Session fetch failed, user will remain null
        setUser(null)
      }
    }

    fetchSession()
  }, [])

  const handleLogout = async () => {
    try {
      const { signOut } = await import("next-auth/react")
      await signOut({ callbackUrl: "/login" })
    } catch (err) {
      // Logout failed, but signOut will still redirect
    }
  }

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={"/placeholder-user.jpg"} alt={user?.name || user?.email} />
            <AvatarFallback>{getInitials(user?.name, user?.email)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || "User Account"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            <p className="text-xs leading-none text-muted-foreground">{roleDisplay(user?.role)}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

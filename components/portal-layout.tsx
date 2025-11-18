"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Bell } from "lucide-react"
import { UserNav } from "@/components/user-nav"

export interface PortalLayoutProps {
  children: React.ReactNode
  sidebar: React.ReactNode
  title?: string
  userRole?: string
  breadcrumbs?: { label: string; href?: string }[]
}

export function PortalLayout({
  children,
  sidebar,
  title,
  userRole,
  breadcrumbs,
}: PortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const roleDisplay = (r?: string) => {
    if (!r) return ""
    const map: Record<string, string> = {
      BRAND: "Brand Manager",
      INFLUENCER: "Influencer",
      CLIENT: "Client",
      EMPLOYEE: "Employee",
      ADMIN: "Administrator",
    }
    return map[(r || "").toUpperCase()] || r
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 w-full glass-navbar">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 px-3 py-1 rounded-md bg-porchest-orange text-white"
        >
          Skip to content
        </a>
        <div className="container flex h-16 items-center">
          {/* Sidebar trigger (mobile) */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              {sidebar}
            </SheetContent>
          </Sheet>

          <div className="flex items-center space-x-4">
            <div className="font-bold text-xl text-porchest-orange">Porchest</div>
            {userRole && (
              <div className="hidden sm:block">
                <span className="text-sm text-white/60">
                  {roleDisplay(userRole)} Portal
                </span>
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
            <UserNav />
          </div>
        </div>
      </header>

      {/* ===== BODY ===== */}
      <div className="flex">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 top-16 z-40">
          {sidebar}
        </aside>

        {/* Main content */}
        <main id="main" className="flex-1 md:ml-64">
          <div className="container py-6 space-y-4">
            {/* Page Title + Breadcrumbs */}
            {(title || breadcrumbs) && (
              <div className="mb-6">
                {breadcrumbs && breadcrumbs.length > 0 && (
                  <nav className="text-sm text-white/60 mb-1">
                    {breadcrumbs.map((b, i) => (
                      <span key={i}>
                        {b.href ? (
                          <a href={b.href} className="hover:text-porchest-orange transition-colors">
                            {b.label}
                          </a>
                        ) : (
                          b.label
                        )}
                        {i < breadcrumbs.length - 1 && " / "}
                      </span>
                    ))}
                  </nav>
                )}
                {title && <h1 className="text-2xl font-bold text-white">{title}</h1>}
              </div>
            )}

            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default PortalLayout

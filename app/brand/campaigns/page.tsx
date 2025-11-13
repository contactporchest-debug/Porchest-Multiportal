"use client"

import React from "react"
import Link from "next/link"

export interface PortalLayoutProps {
  children: React.ReactNode
  title: string
  userRole: string
  breadcrumbs?: { label: string; href?: string }[]
  sidebarContent?: React.ReactNode // ✅ Added this to fix TS error
}

export function PortalLayout({
  children,
  title,
  userRole,
  breadcrumbs,
  sidebarContent,
}: PortalLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* ✅ Sidebar Section */}
      {sidebarContent && (
        <aside className="w-64 border-r bg-muted/10 p-4 hidden md:block">
          {sidebarContent}
        </aside>
      )}

      {/* ✅ Main Content Section */}
      <main className="flex-1 p-6 space-y-6">
        <header className="border-b pb-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              <p className="text-sm text-muted-foreground">Role: {userRole}</p>
            </div>

            {/* ✅ Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="mt-4 sm:mt-0">
                <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  {breadcrumbs.map((crumb, index) => (
                    <li key={index} className="flex items-center">
                      {crumb.href ? (
                        <Link href={crumb.href} className="text-primary hover:underline">
                          {crumb.label}
                        </Link>
                      ) : (
                        <span>{crumb.label}</span>
                      )}
                      {index < breadcrumbs.length - 1 && (
                        <span className="mx-2 text-muted-foreground">/</span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </div>
        </header>

        {/* ✅ Main Page Children */}
        <div className="space-y-6">{children}</div>
      </main>
    </div>
  )
}

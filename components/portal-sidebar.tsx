"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function PortalSidebar({ role }: { role: "brand" | "influencer" | "client" | "employee" | "admin" }) {
  const pathname = usePathname()
  const itemsByRole: Record<string, Array<{ href: string; label: string }>> = {
    brand: [
      { href: "/brand", label: "Dashboard" },
      { href: "/brand#recommendations", label: "Recommendations" },
      { href: "/brand#campaigns", label: "Campaigns" },
      { href: "/brand#analytics", label: "Analytics" },
    ],
    influencer: [
      { href: "/influencer", label: "Dashboard" },
      { href: "/influencer#profile", label: "Profile" },
      { href: "/influencer#requests", label: "Requests" },
      { href: "/influencer#earnings", label: "Earnings" },
      { href: "/influencer#insights", label: "Insights" },
    ],
    client: [
      { href: "/client", label: "Projects" },
      { href: "/client#employees", label: "Assigned Team" },
      { href: "/client#payments", label: "Payments" },
      { href: "/client#issues", label: "Issues" },
    ],
    employee: [
      { href: "/employee", label: "Daily/Weekly" },
      { href: "/employee#timer", label: "WFH Timer" },
      { href: "/employee#auto", label: "Auto Reports" },
      { href: "/employee#performance", label: "Performance" },
    ],
    admin: [
      { href: "/admin", label: "Approvals" },
      { href: "/admin#accounts", label: "Create Logins" },
      { href: "/admin#contracts", label: "Contracts & Payments" },
      { href: "/admin#performance", label: "Employee Performance" },
      { href: "/admin#projects", label: "Project Oversight" },
      { href: "/admin#fraud", label: "Fraud Monitoring" },
    ],
  }

  const items = itemsByRole[role]
  return (
    <aside className="w-full md:w-64 shrink-0 border-r bg-background">
      <nav className="p-4 flex md:flex-col gap-2 overflow-x-auto">
        {items.map(({ href, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm ${active ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

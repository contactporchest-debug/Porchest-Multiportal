// @ts-nocheck
"use client"

import { Button } from "@/components/ui/button"

type Role = "ADMIN" | "BRAND" | "INFLUENCER" | "CLIENT" | "EMPLOYEE"

export default function DemoLogins({ className }: { className?: string }) {
  async function handleDemo(role: Role) {
    const callbackUrl =
      role === "ADMIN"
        ? "/admin"
        : role === "BRAND"
          ? "/brand"
          : role === "INFLUENCER"
            ? "/influencer"
            : role === "CLIENT"
              ? "/client"
              : "/employee"

    await signIn("credentials", {
      role,
      callbackUrl,
      redirect: true,
    })
  }

  return (
    <section className={className}>
      <h3 className="mb-3 text-sm font-medium text-muted-foreground">Demo logins</h3>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        <Button variant="secondary" onClick={() => handleDemo("ADMIN")} aria-label="Demo Admin Login">
          Admin
        </Button>
        <Button variant="secondary" onClick={() => handleDemo("BRAND")} aria-label="Demo Brand Login">
          Brand
        </Button>
        <Button variant="secondary" onClick={() => handleDemo("INFLUENCER")} aria-label="Demo Influencer Login">
          Influencer
        </Button>
        <Button variant="secondary" onClick={() => handleDemo("CLIENT")} aria-label="Demo Client Login">
          Client
        </Button>
        <Button variant="secondary" onClick={() => handleDemo("EMPLOYEE")} aria-label="Demo Employee Login">
          Employee
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Demo uses a temporary session. {/* TODO: replace with MongoDB/MySQL-backed roles later */}
      </p>
    </section>
  )
}

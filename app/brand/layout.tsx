import type React from "react"
import ProtectedLayout from "@/app/(shared)/ProtectedLayout"

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedLayout allowedRole="brand">{children}</ProtectedLayout>
}

import type React from "react"
import ProtectedLayout from "@/app/(shared)/ProtectedLayout"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedLayout allowedRole="admin">{children}</ProtectedLayout>
}

import type React from "react"
import ProtectedLayout from "@/app/(shared)/ProtectedLayout"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedLayout allowedRole="client">{children}</ProtectedLayout>
}

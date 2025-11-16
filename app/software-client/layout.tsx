import type React from "react"
import ProtectedLayout from "@/app/(shared)/ProtectedLayout"

export default function SoftwareClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedLayout allowedRole="software-client">{children}</ProtectedLayout>
}

import type React from "react"
import ProtectedLayout from "@/app/(shared)/ProtectedLayout"

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedLayout allowedRole="employee">{children}</ProtectedLayout>
}

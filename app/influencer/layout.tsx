import type React from "react"
import ProtectedLayout from "@/app/(shared)/ProtectedLayout"

export default function InfluencerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedLayout allowedRole="influencer">{children}</ProtectedLayout>
}

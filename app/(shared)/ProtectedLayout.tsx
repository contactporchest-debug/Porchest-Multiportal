// app/(shared)/ProtectedLayout.tsx
import { verifyToken } from "@/lib/verifyToken"
import { redirect } from "next/navigation"

export default function ProtectedLayout({
  children,
  allowedRole,
}: {
  children: React.ReactNode
  allowedRole: string
}) {
  // Verify the token from cookies (we made this in lib/verifyToken.ts)
  const session = verifyToken()

  // 🔒 If no session → user not logged in
  if (!session) {
    redirect("/login") // send them to login page
  }

  // 🔍 Check if role matches
  const userRole = session.role?.toLowerCase()
  if (userRole !== allowedRole.toLowerCase()) {
    redirect("/unauthorized") // redirect if wrong role
  }

  // ✅ If user is logged in and role matches, render the portal content
  return <>{children}</>
}

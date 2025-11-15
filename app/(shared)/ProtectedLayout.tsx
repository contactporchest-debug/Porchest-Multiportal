// app/(shared)/ProtectedLayout.tsx
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ProtectedLayout({
  children,
  allowedRole,
}: {
  children: React.ReactNode
  allowedRole: string
}) {
  // Verify authentication using NextAuth
  const session = await auth()

  // 🔒 If no session → user not logged in
  if (!session || !session.user) {
    redirect("/login")
  }

  // 🔍 Check if role matches
  const userRole = session.user.role?.toLowerCase()
  if (userRole !== allowedRole.toLowerCase()) {
    redirect("/unauthorized")
  }

  // ✅ If user is logged in and role matches, render the portal content
  return <>{children}</>
}

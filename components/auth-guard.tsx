"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode" // ✅ Correct import

type AuthGuardProps = {
  children: React.ReactNode
  allowedRoles?: string[]
  redirectTo?: string
}

export function AuthGuard({ children, allowedRoles = [], redirectTo = "/login" }: AuthGuardProps) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="))
        ?.split("=")[1]

      if (!token) {
        router.push(redirectTo)
        return
      }

      // ✅ Decode JWT token
      const decoded: any = jwtDecode(token)
      console.log("Decoded JWT:", decoded)
      const userRole = decoded.role?.toLowerCase()

      // ✅ Normalize allowedRoles and compare
      const allowedLower = allowedRoles.map((r) => r.toLowerCase())

      if (allowedLower.length > 0 && !allowedLower.includes(userRole)) {
        router.push("/unauthorized")
        return
      }

      setAuthorized(true)
    } catch (err) {
      console.error("AuthGuard error:", err)
      router.push("/login")
    } finally {
      setLoading(false)
    }
  }, [router, allowedRoles, redirectTo])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!authorized) return null

  return <>{children}</>
}

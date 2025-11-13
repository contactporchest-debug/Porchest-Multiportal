"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Loader2,
  ArrowLeft,
  Mail,
  UserCircle2,
  Briefcase,
  Megaphone,
  Users,
  Shield,
} from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingDemo, setIsLoadingDemo] = useState<string | null>(null)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // ensure cookie is set
      })

      const data = await res.json()

      // 🔹 If login failed, show the backend error message
      if (!res.ok) {
        throw new Error(data.error || "Login failed")
      }

      // ✅ Redirect only if backend sent redirect path
      if (data.redirectTo) {
        setTimeout(() => {
          window.location.href = data.redirectTo
        }, 500)
      }
    } catch (err: any) {
      // ✨ Friendly frontend error display
      setError(
        err.message.includes("under review")
          ? "Your account is under review and will be activated soon."
          : err.message || "Something went wrong"
      )
    } finally {
      setIsLoading(false)
    }
  }

  // 🔹 Demo role-based login (no password)
  const handleDemoLogin = async (role: string) => {
    setError("")
    setIsLoadingDemo(role)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
        credentials: "include",
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Login failed")
      }

      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoadingDemo(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-slate-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-between mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Welcome Back</CardTitle>
          <CardDescription className="text-slate-600">
            Sign in to access your portal
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-8 lg:grid-cols-2">
          {/* Demo Logins */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Demo logins</h3>
            <div className="grid gap-2">
              {[
                { label: "Admin", icon: <Shield />, role: "admin" },
                { label: "Brand", icon: <Briefcase />, role: "brand" },
                { label: "Influencer", icon: <Megaphone />, role: "influencer" },
                { label: "Client", icon: <Users />, role: "client" },
                { label: "Employee", icon: <UserCircle2 />, role: "employee" },
              ].map(({ label, icon, role }) => (
                <Button
                  key={role}
                  variant="outline"
                  onClick={() => handleDemoLogin(role)}
                  disabled={!!isLoadingDemo}
                  className="justify-start"
                >
                  {isLoadingDemo === role ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <span className="mr-2 h-4 w-4">{icon}</span>
                  )}
                  Demo {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Email Login */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" /> Continue with Email
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

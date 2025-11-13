"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Loader2,
  ArrowLeft,
  Mail,
  Chrome,
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
  const [error, setError] = useState<string>("")
  const [isLoadingEmail, setIsLoadingEmail] = useState(false)
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
  const [isLoadingDemo, setIsLoadingDemo] = useState<string | null>(null)

  // 🔹 Email/password login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoadingEmail(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ save JWT cookie
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      console.log("✅ Login response:", data)

      if (!res.ok) throw new Error(data?.error || "Login failed")

      // ✅ ensure cookie persistence before redirect
      if (data.redirectTo) {
        setTimeout(() => {
          window.location.href = data.redirectTo
        }, 400)
      } else {
        router.push("/")
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoadingEmail(false)
    }
  }

  // 🔹 Demo login (quick role login without credentials)
  const handleDemo = async (
    role: "admin" | "brand" | "influencer" | "client" | "employee"
  ) => {
    setError("")
    setIsLoadingDemo(role)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role }),
      })

      const data = await res.json()
      console.log("✅ Demo login response:", data)

      if (!res.ok) throw new Error(data?.error || "Demo login failed")

      // redirect after cookie persistence
      if (data.redirectTo) {
        setTimeout(() => {
          window.location.href = data.redirectTo
        }, 400)
      }
    } catch (err: any) {
      console.error("Demo login error:", err)
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoadingDemo(null)
    }
  }

  // 🔹 Google login placeholder (not implemented)
  const handleGoogle = async () => {
    setError("")
    setIsLoadingGoogle(true)
    setTimeout(() => {
      setError("Google login is not configured yet.")
      setIsLoadingGoogle(false)
    }, 1200)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-slate-100 p-4">
      <Card className="w-full max-w-2xl shadow-md border border-slate-200">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-slate-600">
            Sign in to access your portal
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-8 lg:grid-cols-2">
          {/* ✅ Left Column — Demo & OAuth */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Demo logins
            </h3>

            <div className="grid gap-2">
              {[
                { label: "Admin", icon: <Shield className="mr-2 h-4 w-4" />, role: "admin" },
                { label: "Brand", icon: <Briefcase className="mr-2 h-4 w-4" />, role: "brand" },
                { label: "Influencer", icon: <Megaphone className="mr-2 h-4 w-4" />, role: "influencer" },
                { label: "Client", icon: <Users className="mr-2 h-4 w-4" />, role: "client" },
                { label: "Employee", icon: <UserCircle2 className="mr-2 h-4 w-4" />, role: "employee" },
              ].map(({ label, icon, role }) => (
                <Button
                  key={role}
                  variant={role === "admin" ? "secondary" : "outline"}
                  className="justify-start"
                  disabled={!!isLoadingDemo}
                  onClick={() => handleDemo(role as any)}
                >
                  {isLoadingDemo === role ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    icon
                  )}
                  Demo {label}
                </Button>
              ))}
            </div>

            <div className="my-4 flex items-center">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="px-3 text-xs uppercase tracking-wide text-slate-500">
                or
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <Button
              type="button"
              onClick={handleGoogle}
              className="w-full"
              disabled={isLoadingGoogle || isLoadingEmail || !!isLoadingDemo}
            >
              {isLoadingGoogle ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Continuing with Google...
                </>
              ) : (
                <>
                  <Chrome className="mr-2 h-4 w-4" />
                  Continue with Google
                </>
              )}
            </Button>
          </div>

          {/* ✅ Right Column — Email/Password Login */}
          <div className="relative space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={
                    isLoadingGoogle || isLoadingEmail || !!isLoadingDemo
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={
                    isLoadingGoogle || isLoadingEmail || !!isLoadingDemo
                  }
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={
                  isLoadingGoogle || isLoadingEmail || !!isLoadingDemo
                }
              >
                {isLoadingEmail ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Continue with Email
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-slate-500">
              Emails are sent from{" "}
              <span className="font-medium">contact.porchest@gmail.com</span>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

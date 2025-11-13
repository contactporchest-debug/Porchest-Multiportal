"use client"

import type React from "react"
import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, ArrowLeft, Mail, Chrome, UserCircle2, Briefcase, Megaphone, Users, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SignInPage() {
  const [isPending, startTransition] = useTransition()
  const [email, setEmail] = useState("")
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
  const [isLoadingEmail, setIsLoadingEmail] = useState(false)
  const [error, setError] = useState<string>("")
  const [emailSent, setEmailSent] = useState(false)
  const [isLoadingDemo, setIsLoadingDemo] = useState<string | null>(null)
  const router = useRouter()

  // 🔹 Handle email login using custom API
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoadingEmail(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Login failed.")
      }

      setEmailSent(true)
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoadingEmail(false)
    }
  }

  // 🔹 Placeholder for Google login
  const handleGoogle = async () => {
    setError("")
    setIsLoadingGoogle(true)
    // Placeholder logic – implement actual Google OAuth later if required
    setTimeout(() => {
      setError("Google login is not configured yet.")
      setIsLoadingGoogle(false)
    }, 1200)
  }

  // 🔹 Demo login handler using custom JWT API
  const handleDemo = async (role: "admin" | "brand" | "influencer" | "client" | "employee") => {
    try {
      setError("")
      setIsLoadingDemo(role)

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Demo login failed.")
      }

      // Redirect based on role
      const redirectTo =
        role === "admin"
          ? "/admin"
          : role === "brand"
          ? "/brand"
          : role === "influencer"
          ? "/influencer"
          : role === "client"
          ? "/client"
          : "/employee"

      startTransition(() => router.push(redirectTo))
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoadingDemo(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-slate-100 p-4">
      <div className="w-full max-w-2xl rounded-xl border bg-background">
        <div className="p-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="text-xs text-muted-foreground">v1 UI preserved</div>
        </div>

        <div className="grid gap-8 p-6 lg:grid-cols-2">
          {/* Demo logins */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Demo logins</h3>
            <div className="grid gap-2">
              <Button
                variant="secondary"
                className="justify-start"
                onClick={() => handleDemo("admin")}
                disabled={!!isLoadingDemo}
              >
                {isLoadingDemo === "admin" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Shield className="mr-2 h-4 w-4" />
                )}
                Demo Admin
              </Button>

              <Button
                variant="outline"
                className="justify-start bg-transparent"
                onClick={() => handleDemo("brand")}
                disabled={!!isLoadingDemo}
              >
                {isLoadingDemo === "brand" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Briefcase className="mr-2 h-4 w-4" />
                )}
                Demo Brand
              </Button>

              <Button
                variant="outline"
                className="justify-start bg-transparent"
                onClick={() => handleDemo("influencer")}
                disabled={!!isLoadingDemo}
              >
                {isLoadingDemo === "influencer" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Megaphone className="mr-2 h-4 w-4" />
                )}
                Demo Influencer
              </Button>

              <Button
                variant="outline"
                className="justify-start bg-transparent"
                onClick={() => handleDemo("client")}
                disabled={!!isLoadingDemo}
              >
                {isLoadingDemo === "client" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Users className="mr-2 h-4 w-4" />
                )}
                Demo Client
              </Button>

              <Button
                variant="outline"
                className="justify-start bg-transparent"
                onClick={() => handleDemo("employee")}
                disabled={!!isLoadingDemo}
              >
                {isLoadingDemo === "employee" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UserCircle2 className="mr-2 h-4 w-4" />
                )}
                Demo Employee
              </Button>
            </div>

            {/* Divider */}
            <div className="my-4 flex items-center">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="px-3 text-xs uppercase tracking-wide text-slate-500">or</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Google OAuth */}
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

          {/* Email sign-in with watermark */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <span className="text-4xl md:text-6xl lg:text-7xl font-semibold text-slate-300/20 select-none text-center leading-tight">
                contact.porchest@gmail.com
              </span>
            </div>

            <div className="relative space-y-4">
              {error ? (
                <div className="rounded-lg border p-3 text-sm text-red-600 bg-red-50">{error}</div>
              ) : null}

              {emailSent ? (
                <div className="rounded-lg border p-4 text-sm text-slate-700 bg-slate-50">
                  We sent a secure sign-in link to <span className="font-medium">{email}</span>. Check your inbox to
                  continue.
                </div>
              ) : (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm opacity-80">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-md border bg-background px-3 py-2"
                      disabled={isLoadingGoogle || isLoadingEmail || !!isLoadingDemo}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoadingGoogle || isLoadingEmail || !!isLoadingDemo}
                  >
                    {isLoadingEmail ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending magic link...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Continue with Email
                      </>
                    )}
                  </Button>
                </form>
              )}

              <p className="text-xs text-slate-500">
                Emails are sent from <span className="font-medium">contact.porchest@gmail.com</span>.
              </p>
              {/* TODO: DB integration (MongoDB/MySQL): Replace email-only auth with full credentials sign-in and role lookup */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

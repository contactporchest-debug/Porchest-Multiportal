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
} from "lucide-react"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string>("")
  const [isLoadingEmail, setIsLoadingEmail] = useState(false)
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)

  // Email/password login using NextAuth
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoadingEmail(true)

    try {
      const { signIn } = await import("next-auth/react")
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/portal",
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      if (result?.ok) {
        // Use Next.js router for client-side navigation
        router.push("/portal")
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password. Please try again.")
      setIsLoadingEmail(false)
    }
  }

  // Google login using NextAuth
  const handleGoogle = async () => {
    setError("")
    setIsLoadingGoogle(true)
    try {
      const { signIn } = await import("next-auth/react")
      await signIn("google", { callbackUrl: "/portal" })
    } catch (err: any) {
      setError(err.message || "Google login failed.")
      setIsLoadingGoogle(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-md border border-slate-200">
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

        <CardContent className="space-y-6">
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
                disabled={isLoadingGoogle || isLoadingEmail}
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
                disabled={isLoadingGoogle || isLoadingEmail}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoadingGoogle || isLoadingEmail}
            >
              {isLoadingEmail ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Sign in with Email
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleGoogle}
            variant="outline"
            className="w-full"
            disabled={isLoadingGoogle || isLoadingEmail}
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

          <div className="text-center space-y-2">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <Link href="/register" className="font-medium text-orange-600 hover:text-orange-700">
                Sign up
              </Link>
            </p>
            <p className="text-xs text-slate-500">
              Emails are sent from{" "}
              <span className="font-medium">contact.porchest@gmail.com</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

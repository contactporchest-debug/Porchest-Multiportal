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
  Lock,
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient blobs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-porchest-orange opacity-15 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-porchest-orange-light opacity-10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

      {/* Glass card container */}
      <div className="glass-card w-full max-w-md p-8 rounded-3xl relative z-10">
        {/* Back to Home button */}
        <div className="mb-6">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400">
            Sign in to access your portal
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6 glass-card border-red-500/50">
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        {/* Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={isLoadingGoogle || isLoadingEmail}
                className="glass-input pl-10 py-6 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoadingGoogle || isLoadingEmail}
                className="glass-input pl-10 py-6 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            className="w-full glass-button-primary py-6 text-lg font-semibold"
            disabled={isLoadingGoogle || isLoadingEmail}
          >
            {isLoadingEmail ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-5 w-5" />
                Sign in with Email
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="glass-card px-3 py-1 text-gray-400 text-sm">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign In */}
        <Button
          type="button"
          onClick={handleGoogle}
          variant="outline"
          className="w-full glass-button py-6 text-lg font-semibold border-white/20"
          disabled={isLoadingGoogle || isLoadingEmail}
        >
          {isLoadingGoogle ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Continuing with Google...
            </>
          ) : (
            <>
              <Chrome className="mr-2 h-5 w-5" />
              Continue with Google
            </>
          )}
        </Button>

        {/* Sign Up Link */}
        <div className="text-center mt-8 space-y-3">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-porchest-orange hover:text-porchest-orange-light transition-colors"
            >
              Sign up
            </Link>
          </p>
          <p className="text-xs text-gray-500">
            Emails are sent from{" "}
            <span className="font-medium text-gray-400">contact.porchest@gmail.com</span>
          </p>
        </div>
      </div>

      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-porchest-orange/30 rounded-tl-3xl"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-porchest-orange/30 rounded-br-3xl"></div>
    </div>
  )
}

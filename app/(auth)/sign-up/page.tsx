"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft } from "lucide-react"

type UserRole = "brand" | "influencer" | "client" | "employee" | "admin"

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "" as UserRole | "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.role) {
      setError("Please select a role")
      return
    }

    try {
      setIsLoading(true)
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error || "Registration failed")
        return
      }

      // Expect { redirectTo } from API
      if (data?.redirectTo) {
        router.push(data.redirectTo)
        return
      }
      router.push("/portal")
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const roleDescriptions: Record<UserRole, string> = {
    brand: "Manage influencer campaigns and track ROI",
    influencer: "Connect with brands and manage collaborations",
    client: "Track software projects and deliverables",
    employee: "Manage tasks and collaborate with team",
    admin: "System administration and user management",
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Create your account</CardTitle>
          <CardDescription className="text-slate-600">Sign up to access your portal</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((s) => ({ ...s, name: e.target.value }))}
                placeholder="Enter your full name"
                required
                disabled={isLoading}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((s) => ({ ...s, email: e.target.value }))}
                placeholder="you@example.com"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-slate-500">Emails are sent from contact.porchest@gmail.com.</p>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) => setFormData((s) => ({ ...s, role: value }))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brand">Brand</SelectItem>
                  <SelectItem value="influencer">Influencer</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
              {formData.role && <p className="text-xs text-slate-600">{roleDescriptions[formData.role as UserRole]}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData((s) => ({ ...s, password: e.target.value }))}
                placeholder="Create a password"
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            {/* TODO: Replace /api/auth/register with DB-backed createUser and role persistence */}
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="text-orange-600 hover:text-orange-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

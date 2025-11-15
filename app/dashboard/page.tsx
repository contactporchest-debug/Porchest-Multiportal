"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Users, Briefcase, UserCheck, Shield, ArrowRight, Loader2 } from "lucide-react"

const portalInfo = {
  brand: {
    title: "Brand Portal",
    description: "Manage influencer campaigns and track ROI",
    icon: Building2,
    color: "bg-blue-500",
    path: "/brand",
  },
  influencer: {
    title: "Influencer Portal",
    description: "Connect with brands and manage collaborations",
    icon: Users,
    color: "bg-pink-500",
    path: "/influencer",
  },
  client: {
    title: "Client Portal",
    description: "Track software projects and deliverables",
    icon: Briefcase,
    color: "bg-green-500",
    path: "/client",
  },
  employee: {
    title: "Employee Portal",
    description: "Manage tasks and collaborate with team",
    icon: UserCheck,
    color: "bg-orange-500",
    path: "/employee",
  },
  admin: {
    title: "Admin Portal",
    description: "System administration and user management",
    icon: Shield,
    color: "bg-red-500",
    path: "/admin",
  },
}

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchUserAndRedirect() {
      try {
        const response = await fetch("/api/auth/session")
        if (!response.ok) {
          router.push("/login")
          return
        }

        const { user } = await response.json()
        setUser(user)

        // Auto-redirect to user's portal after a brief delay
        setTimeout(() => {
          const portalPath = portalInfo[(user as any).role as keyof typeof portalInfo].path
          router.push(portalPath)
        }, 2000)
      } catch (error) {
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserAndRedirect()
  }, [router])

  const handlePortalAccess = () => {
    if (user) {
      const portalPath = portalInfo[(user as any).role as keyof typeof portalInfo].path
      router.push(portalPath)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const userPortal = portalInfo[(user as any).role as keyof typeof portalInfo]
  const IconComponent = userPortal.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${userPortal.color}`}>
            <IconComponent className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Welcome, {(user as any).name}!</CardTitle>
          <CardDescription className="text-slate-600">Redirecting you to your portal...</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-semibold text-slate-900 mb-2">{userPortal.title}</h3>
            <p className="text-sm text-slate-600 mb-4">{userPortal.description}</p>
            <Button onClick={handlePortalAccess} className="w-full">
              Access Portal
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="text-xs text-slate-500">You will be automatically redirected in a few seconds...</div>
        </CardContent>
      </Card>
    </div>
  )
}

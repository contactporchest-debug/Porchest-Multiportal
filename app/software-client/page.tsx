"use client"

import { PortalLayout } from "@/components/portal-layout"
import { SoftwareClientSidebar } from "@/components/software-client-sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  FolderKanban,
  CreditCard,
  Clock,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Calendar,
  Users,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

export default function SoftwareClientDashboard() {
  return (
    <PortalLayout
      sidebar={<SoftwareClientSidebar />}
      title="Dashboard"
      userRole="Software Client"
      breadcrumbs={[{ label: "Dashboard" }]}
    >
      <div className="grid grid-cols-1 gap-6">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to Your Software Client Portal</CardTitle>
            <CardDescription className="text-blue-100">
              Track your projects, manage payments, and collaborate with the Porchest development team
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FolderKanban className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Progress</p>
                  <p className="text-2xl font-bold">53%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Team Members</p>
                  <p className="text-2xl font-bold">6</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Projects Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Projects</CardTitle>
                <CardDescription>Your ongoing development projects</CardDescription>
              </div>
              <Button asChild variant="outline">
                <Link href="/software-client/projects">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Card className="border-2">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">E-Commerce Platform</h4>
                    <p className="text-sm text-muted-foreground">Custom e-commerce solution with payment integration</p>
                  </div>
                  <Badge className="bg-blue-500">
                    <Clock className="h-3 w-3 mr-1" />
                    In Progress
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Phase</p>
                      <p className="font-medium">Development</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Due Date</p>
                      <p className="font-medium">Aug 15, 2025</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Days Left</p>
                      <p className="font-medium">45 days</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">Mobile App Development</h4>
                    <p className="text-sm text-muted-foreground">Cross-platform mobile application for iOS and Android</p>
                  </div>
                  <Badge className="bg-blue-500">
                    <Clock className="h-3 w-3 mr-1" />
                    In Progress
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">40%</span>
                  </div>
                  <Progress value={40} className="h-2" />
                  <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Phase</p>
                      <p className="font-medium">Design & Prototyping</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Due Date</p>
                      <p className="font-medium">Sep 30, 2025</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Days Left</p>
                      <p className="font-medium">75 days</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payment Summary</CardTitle>
                  <CardDescription>Overview of your invoices and payments</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/software-client/payments">
                    View Details
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Invoiced</p>
                    <p className="text-xl font-bold">$136.75K</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Paid</p>
                    <p className="text-xl font-bold">$88.75K</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Payment</p>
                    <p className="text-xl font-bold">$48K</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates on your projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FolderKanban className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">E-Commerce Platform - Development Phase</p>
                    <p className="text-xs text-muted-foreground">Backend integration completed</p>
                    <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Payment Received</p>
                    <p className="text-xs text-muted-foreground">Invoice INV-2025-002 paid - $30,250</p>
                    <p className="text-xs text-muted-foreground mt-1">5 days ago</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Team Update</p>
                    <p className="text-xs text-muted-foreground">Sarah Anderson assigned to new features</p>
                    <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Milestone Reached</p>
                    <p className="text-xs text-muted-foreground">Mobile App design phase completed</p>
                    <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Button asChild variant="outline" className="h-24 flex-col gap-2">
                <Link href="/software-client/projects">
                  <FolderKanban className="h-6 w-6" />
                  <span>View Projects</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex-col gap-2">
                <Link href="/software-client/payments">
                  <CreditCard className="h-6 w-6" />
                  <span>Payment History</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <Users className="h-6 w-6" />
                <span>Contact Team</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col gap-2">
                <Calendar className="h-6 w-6" />
                <span>Schedule Meeting</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  )
}

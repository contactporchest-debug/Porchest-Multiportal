"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn, UserPlus, Users, Building, UserCheck } from "lucide-react"
import Link from "next/link"

export function LoginSection() {
  return (
    <section id="login" className="py-20 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get <span className="text-orange-500">Started?</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Join thousands of businesses already using our platform to streamline their operations
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-4 rounded-lg transition-all duration-200 text-lg"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-medium px-8 py-4 rounded-lg transition-all duration-200 text-lg bg-transparent"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Sign Up
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="bg-gray-800/30 border-gray-700 transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-500" />
              </div>
              <CardTitle className="text-xl text-white">Client Portal</CardTitle>
              <CardDescription className="text-gray-400">
                Track your projects, view progress, and communicate with our team
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700 transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-blue-500" />
              </div>
              <CardTitle className="text-xl text-white">Employee Portal</CardTitle>
              <CardDescription className="text-gray-400">
                Access internal tools, manage tasks, and collaborate with your team
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/30 border-gray-700 transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-purple-500" />
              </div>
              <CardTitle className="text-xl text-white">Admin Portal</CardTitle>
              <CardDescription className="text-gray-400">
                Manage users, oversee operations, and access administrative tools
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">
            Need help getting started?{" "}
            <Link href="#contact" className="text-orange-500 hover:text-orange-400 transition-colors">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

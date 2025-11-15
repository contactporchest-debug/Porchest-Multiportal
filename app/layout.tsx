import type React from "react"
import type { Metadata } from "next"
// Temporarily disabled Google Fonts for offline builds
// import { Inter, Roboto } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

// Using system fonts for offline builds
// const inter = Inter({ subsets: ["latin"] })
// const roboto = Roboto({
//   weight: ["300", "400", "500", "700"],
//   subsets: ["latin"],
//   variable: "--font-roboto",
// })

export const metadata: Metadata = {
  title: "Porchest - Software Development & Influencer Marketing",
  description:
    "Transform your digital presence with our cutting-edge software development and powerful influencer marketing solutions. Your trusted partner for digital transformation.",
  keywords:
    "software development, web development, mobile apps, influencer marketing, digital marketing, Pakistan, Porchest",
  authors: [{ name: "Porchest Team" }],
  creator: "Porchest",
  publisher: "Porchest",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans overflow-x-hidden">
        {/* 🔸 SessionProvider removed (no next-auth) */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-black">{children}</div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

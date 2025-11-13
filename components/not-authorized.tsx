"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function NotAuthorized({
  title = "Not Authorized",
  message = "Please sign in with the correct role.",
}: { title?: string; message?: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      <p className="text-muted-foreground mt-2">{message}</p>
      <div className="mt-6">
        <Button asChild>
          <Link href="/signin">Go to Sign In</Link>
        </Button>
      </div>
    </div>
  )
}

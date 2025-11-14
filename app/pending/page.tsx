import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PendingPage() {
  return (
    <main className="main-content max-w-3xl mx-auto py-12">
      <h1 className="text-3xl font-semibold text-foreground text-balance">Your account is pending verification</h1>
      <p className="text-muted-foreground mt-3">
        Thanks for signing up! An admin will review and approve your account. You’ll receive access to your portal once
        approved.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/login">Switch Account</Link>
        </Button>
      </div>
    </main>
  )
}

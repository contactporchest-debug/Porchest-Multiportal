import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getPortalPath } from "@/lib/auth-helpers"

export default async function PortalRouterPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const portalPath = getPortalPath(session.user.role || "brand")
  redirect(portalPath)
}

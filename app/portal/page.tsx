import { redirect } from "next/navigation"
import { auth, getPortalPath } from "@/lib/auth"

export default async function PortalRouterPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const portalPath = getPortalPath(session.user.role || "brand")
  redirect(portalPath)
}

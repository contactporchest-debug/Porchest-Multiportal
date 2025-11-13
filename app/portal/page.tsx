import { redirect } from "next/navigation"
import { getUserFromCookies } from "@/lib/auth"
import { nextPathAfterLogin } from "@/lib/routes"

export default function PortalRouterPage() {
  const { role, status } = getUserFromCookies()
  if (!role) redirect("/signin")
  redirect(nextPathAfterLogin(role, status))
}

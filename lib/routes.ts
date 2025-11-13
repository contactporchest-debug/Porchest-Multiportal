import type { Role, Status } from "./auth"

export function nextPathAfterLogin(role: Role, status: Status | null) {
  if ((role === "brand" || role === "influencer") && status !== "active") {
    return "/pending"
  }
  switch (role) {
    case "brand":
      return "/brand"
    case "influencer":
      return "/influencer"
    case "client":
      return "/client"
    case "employee":
      return "/employee"
    case "admin":
      return "/admin"
    default:
      return "/signin"
  }
}

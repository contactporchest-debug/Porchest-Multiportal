// Force dynamic rendering
export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const fetchCache = "force-no-store"

import { NextRequest } from "next/server"
import { logger } from "@/lib/logger"

/**
 * POST /api/meta/deauthorize
 * Required by Meta for app compliance
 * Receives webhook when user deauthorizes app from Facebook settings
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    logger.info("Meta deauthorize webhook received", { body })

    // Parse the signed request if needed
    // For now, just log and return success
    // Meta requires 200 OK response

    return Response.json(
      {
        success: true,
        message: "Deauthorization received",
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error("Error in Meta deauthorize webhook", error)

    // Still return 200 OK to Meta
    return Response.json(
      {
        success: true,
        message: "Deauthorization received",
      },
      { status: 200 }
    )
  }
}

// Also support GET for Meta verification
export async function GET() {
  return Response.json(
    {
      success: true,
      message: "Meta deauthorize endpoint is active",
    },
    { status: 200 }
  )
}

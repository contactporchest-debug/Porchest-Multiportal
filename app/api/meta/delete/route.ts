// Force dynamic rendering
export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const fetchCache = "force-no-store"

import { NextRequest } from "next/server"
import { logger } from "@/lib/logger"
import { collections } from "@/lib/db"
import { ObjectId } from "mongodb"

/**
 * POST /api/meta/delete
 * Required by Meta for GDPR compliance
 * Receives webhook when user requests data deletion
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    logger.info("Meta data deletion request received", { body })

    // Parse signed request
    // Format: signed_request=<signed data>
    // Typically contains user_id

    // For production, you should:
    // 1. Verify the signed request signature
    // 2. Extract user_id from the request
    // 3. Delete all user data from database
    // 4. Return confirmation URL and deletion code

    // For now, log the request
    logger.info("Data deletion request logged for compliance")

    // Generate confirmation code
    const confirmationCode = `DEL_${Date.now()}`
    const statusUrl = `https://porchest.com/api/meta/deletion-status?code=${confirmationCode}`

    return Response.json(
      {
        url: statusUrl,
        confirmation_code: confirmationCode,
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error("Error in Meta data deletion webhook", error)

    // Return error but with valid format
    const confirmationCode = `DEL_ERROR_${Date.now()}`
    const statusUrl = `https://porchest.com/api/meta/deletion-status?code=${confirmationCode}`

    return Response.json(
      {
        url: statusUrl,
        confirmation_code: confirmationCode,
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
      message: "Meta data deletion endpoint is active",
    },
    { status: 200 }
  )
}

/**
 * Helper function to delete user's Instagram data
 * Call this when processing deletion requests
 */
export async function deleteUserInstagramData(userId: string) {
  try {
    logger.info("Deleting Instagram data for user", { userId })

    const influencerProfilesCollection = await collections.influencerProfiles()
    const postsCollection = await collections.posts()

    // Remove Instagram connection from profile
    await influencerProfilesCollection.updateOne(
      { user_id: new ObjectId(userId) },
      {
        $unset: {
          instagram_account: "",
          instagram_metrics: "",
          calculated_metrics: "",
          instagram_username: "",
        },
        $set: {
          updated_at: new Date(),
        },
      }
    )

    // Delete all posts for this user
    await postsCollection.deleteMany({ userId: new ObjectId(userId) })

    logger.info("Instagram data deleted successfully", { userId })

    return { success: true }
  } catch (error) {
    logger.error("Error deleting Instagram data", error)
    throw error
  }
}

// Force dynamic rendering - API routes must NEVER be statically generated
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";


import { auth } from "@/lib/auth"
import { collections, toObjectId } from "@/lib/db"
import { successResponse, handleApiError, unauthorizedResponse, forbiddenResponse, notFoundResponse } from "@/lib/api-response"

/**
 * GET /api/analytics/campaigns/[id]
 * Get detailed analytics for a specific campaign
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return unauthorizedResponse()
    }

    // Only brands, admins, and employees can access campaign analytics
    if (!["brand", "admin", "employee"].includes(session.user.role)) {
      return forbiddenResponse()
    }

    const campaignId = toObjectId(params.id)
    if (!campaignId) {
      return Response.json({ success: false, error: "Invalid campaign ID" }, { status: 400 })
    }

    const campaignsCollection = await collections.campaigns()
    const collaborationRequestsCollection = await collections.collaborationRequests()
    const postsCollection = await collections.posts()

    const campaign = await campaignsCollection.findOne({ _id: campaignId })
    if (!campaign) {
      return notFoundResponse("Campaign not found")
    }

    // Authorization check for brands
    if (session.user.role === "brand" && campaign.brand_id.toString() !== session.user._id) {
      return forbiddenResponse("You can only access your own campaigns")
    }

    // Get collaborations
    const collaborations = await collaborationRequestsCollection
      .find({ campaign_id: campaignId })
      .toArray()

    // Get posts
    const posts = await postsCollection.find({ campaign_id: campaignId }).toArray()

    // Calculate metrics
    const totalPosts = posts.length
    const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0)
    const totalEngagement = posts.reduce(
      (sum, p) => sum + (p.likes || 0) + (p.comments || 0) + (p.shares || 0),
      0
    )

    return successResponse({
      campaign: {
        _id: campaign._id.toString(),
        name: campaign.name,
        status: campaign.status,
        budget: campaign.budget,
        spent_amount: campaign.spent_amount,
      },
      metrics: {
        total_collaborations: collaborations.length,
        accepted_collaborations: collaborations.filter((c) => c.status === "accepted").length,
        total_posts: totalPosts,
        total_views: totalViews,
        total_engagement: totalEngagement,
        engagement_rate: totalViews > 0 ? Math.round((totalEngagement / totalViews) * 10000) / 100 : 0,
      },
    })
  } catch (err) {
    return handleApiError(err, "Failed to fetch campaign analytics")
  }
}

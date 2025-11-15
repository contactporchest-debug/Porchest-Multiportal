// Force dynamic rendering - API routes must NEVER be statically generated
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";


import { auth } from "@/lib/auth"
import { collections, toObjectId } from "@/lib/db"
import { successResponse, handleApiError, unauthorizedResponse, forbiddenResponse, notFoundResponse } from "@/lib/api-response"

/**
 * GET /api/analytics/influencers/[id]
 * Get detailed analytics for a specific influencer
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return unauthorizedResponse()
    }

    // Influencers can only see their own analytics
    const influencerId = toObjectId(params.id)
    if (!influencerId) {
      return Response.json({ success: false, error: "Invalid influencer ID" }, { status: 400 })
    }

    if (session.user.role === "influencer" && session.user._id !== params.id) {
      return forbiddenResponse("You can only access your own analytics")
    }

    if (!["influencer", "brand", "admin", "employee"].includes(session.user.role)) {
      return forbiddenResponse()
    }

    const influencerProfilesCollection = await collections.influencerProfiles()
    const collaborationRequestsCollection = await collections.collaborationRequests()
    const postsCollection = await collections.posts()
    const transactionsCollection = await collections.transactions()

    const profile = await influencerProfilesCollection.findOne({ user_id: influencerId })
    if (!profile) {
      return notFoundResponse("Influencer profile not found")
    }

    // Get collaborations
    const collaborations = await collaborationRequestsCollection
      .find({ influencer_id: influencerId })
      .toArray()

    // Get posts
    const posts = await postsCollection.find({ influencer_id: influencerId }).toArray()

    // Get transactions
    const transactions = await transactionsCollection
      .find({
        $or: [{ to_user_id: influencerId }, { user_id: influencerId }],
      })
      .toArray()

    // Calculate metrics
    const totalPosts = posts.length
    const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0)
    const totalEngagement = posts.reduce(
      (sum, p) => sum + (p.likes || 0) + (p.comments || 0) + (p.shares || 0),
      0
    )

    const earnings = transactions
      .filter((t) => t.type === "payment" && t.to_user_id?.toString() === params.id)
      .reduce((sum, t) => sum + (t.amount || 0), 0)

    return successResponse({
      profile: {
        _id: profile._id.toString(),
        full_name: profile.full_name,
        total_followers: profile.total_followers,
        avg_engagement_rate: profile.avg_engagement_rate,
        total_earnings: profile.total_earnings,
        available_balance: profile.available_balance,
      },
      metrics: {
        total_collaborations: collaborations.length,
        accepted_collaborations: collaborations.filter((c) => c.status === "accepted").length,
        total_posts: totalPosts,
        total_views: totalViews,
        total_engagement: totalEngagement,
        avg_engagement_rate:
          totalPosts > 0
            ? Math.round(
                (posts.reduce((sum, p) => sum + (p.engagement_rate || 0), 0) / totalPosts) * 100
              ) / 100
            : 0,
        total_earnings: earnings,
      },
    })
  } catch (err) {
    return handleApiError(err, "Failed to fetch influencer analytics")
  }
}

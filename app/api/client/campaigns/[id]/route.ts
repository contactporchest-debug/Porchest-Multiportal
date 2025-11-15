// Force dynamic rendering - API routes must NEVER be statically generated
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";


import { auth } from "@/lib/auth";
import { collections, getUserByEmail, sanitizeDocument, toObjectId } from "@/lib/db";
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  badRequestResponse,
  handleApiError,
} from "@/lib/api-response";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

/**
 * Client Campaign Detail API (Read-Only)
 * View detailed campaign information
 */

/**
 * GET /api/client/campaigns/[id]
 * Get detailed information about a specific campaign
 *
 * RATE LIMIT: 100 requests per minute per IP
 */
async function getCampaignDetailHandler(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required");
    }

    if (session.user.role !== "client") {
      return forbiddenResponse("Client access required");
    }

    // Find user to get their ID
    const user = await getUserByEmail(session.user.email!);
    if (!user) {
      return notFoundResponse("User");
    }

    // Validate campaign ID
    const campaignId = toObjectId(params.id);
    if (!campaignId) {
      return badRequestResponse("Invalid campaign ID");
    }

    // Get campaign
    const campaignsCollection = await collections.campaigns();
    const campaign = await campaignsCollection.findOne({ _id: campaignId });

    if (!campaign) {
      return notFoundResponse("Campaign");
    }

    // Get brand information
    const usersCollection = await collections.users();
    const brand = await usersCollection.findOne({
      _id: campaign.brand_id,
      role: "brand",
    });

    // Get influencers involved in this campaign
    const collaborationsCollection = await collections.collaborationRequests();
    const collaborations = await collaborationsCollection
      .find({
        campaign_id: campaignId,
        status: { $in: ["accepted", "completed"] },
      })
      .toArray();

    const influencerIds = collaborations.map((c) => c.influencer_id);
    const influencers = await usersCollection
      .find({
        _id: { $in: influencerIds },
        role: "influencer",
      })
      .toArray();

    // Get posts for this campaign
    const postsCollection = await collections.posts();
    const posts = await postsCollection
      .find({ campaign_id: campaignId })
      .sort({ created_at: -1 })
      .toArray();

    logger.debug("Client campaign detail retrieved", {
      userId: user._id.toString(),
      campaignId: params.id,
      influencersCount: influencers.length,
      postsCount: posts.length,
    });

    return successResponse({
      campaign: sanitizeDocument({
        ...campaign,
        brand_name: brand?.company || brand?.full_name || "Unknown Brand",
        brand_email: brand?.email,
      }),
      influencers: influencers.map((inf) => ({
        id: inf._id.toString(),
        name: inf.full_name,
        email: inf.email,
      })),
      posts: sanitizeDocument(posts),
      stats: {
        total_influencers: influencers.length,
        total_posts: posts.length,
        total_engagement: posts.reduce(
          (sum, p) => sum + (p.likes + p.comments + p.shares),
          0
        ),
        total_reach: campaign.metrics.total_reach,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Export with rate limiting applied
export const GET = withRateLimit(getCampaignDetailHandler, RATE_LIMIT_CONFIGS.default);

import { auth } from "@/lib/auth";
import { collections, getUserByEmail, sanitizeDocuments } from "@/lib/db";
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  handleApiError,
} from "@/lib/api-response";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

/**
 * Client Campaigns API (Read-Only)
 * Clients can view campaigns assigned to them
 */

/**
 * GET /api/client/campaigns
 * List campaigns assigned to the logged-in client
 * Query params: ?status=active&limit=20&page=1
 *
 * RATE LIMIT: 100 requests per minute per IP
 */
async function getClientCampaignsHandler(req: Request) {
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

    // Parse query parameters
    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const page = parseInt(url.searchParams.get("page") || "1");

    // Build filter
    // NOTE: In a real system, you'd have a client_id field on campaigns
    // or a separate mapping table for client-campaign assignments
    // For now, we'll return all campaigns the client has visibility to
    // This could be based on a "clients" array field on campaigns, or a separate table
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    // Get campaigns collection
    const campaignsCollection = await collections.campaigns();

    // Get total count
    const total = await campaignsCollection.countDocuments(filter);

    // Get campaigns with pagination
    const skip = (page - 1) * limit;
    const campaigns = await campaignsCollection
      .find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get brand information for each campaign
    const brandIds = [...new Set(campaigns.map((c) => c.brand_id))];
    const usersCollection = await collections.users();
    const brands = await usersCollection
      .find({
        _id: { $in: brandIds },
        role: "brand",
      })
      .toArray();

    const brandMap = new Map(brands.map((b) => [b._id.toString(), b]));

    // Enrich campaigns with brand info
    const enrichedCampaigns = campaigns.map((campaign) => {
      const brand = brandMap.get(campaign.brand_id.toString());
      return {
        ...campaign,
        brand_name: brand?.company || brand?.full_name || "Unknown Brand",
        brand_email: brand?.email,
      };
    });

    logger.debug("Client campaigns retrieved", {
      userId: user._id.toString(),
      count: campaigns.length,
      total,
    });

    return successResponse({
      campaigns: sanitizeDocuments(enrichedCampaigns),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Export with rate limiting applied
export const GET = withRateLimit(getClientCampaignsHandler, RATE_LIMIT_CONFIGS.default);

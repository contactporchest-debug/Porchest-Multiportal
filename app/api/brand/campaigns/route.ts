import { auth } from "@/lib/auth";
import { collections, getUserByEmail, sanitizeDocuments, createCampaign } from "@/lib/db";
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  badRequestResponse,
  createdResponse,
  handleApiError,
} from "@/lib/api-response";
import { validateRequest } from "@/lib/validations";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { z } from "zod";
import { ObjectId } from "mongodb";

/**
 * Brand Campaigns API
 * Manage campaigns for brand users
 */

// Validation schema for creating a campaign
const createCampaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required").max(200),
  description: z.string().optional().default(""),
  objectives: z.array(z.string()).optional().default([]),
  target_audience: z.record(z.any()).optional().default({}),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  budget: z.number().positive("Budget must be positive"),
});

/**
 * GET /api/brand/campaigns
 * List all campaigns for the logged-in brand
 *
 * RATE LIMIT: 100 requests per minute per IP
 */
async function getCampaignsHandler(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required");
    }

    if (session.user.role !== "brand") {
      return forbiddenResponse("Brand access required");
    }

    // Find user to get their ID
    const user = await getUserByEmail(session.user.email!);
    if (!user) {
      logger.error("User not found in database", undefined, {
        email: session.user.email,
      });
      return notFoundResponse("User");
    }

    const campaignsCollection = await collections.campaigns();

    // Get campaigns
    const campaigns = await campaignsCollection
      .find({ brand_id: user._id })
      .sort({ created_at: -1 })
      .toArray();

    logger.debug("Campaigns retrieved", {
      userId: user._id.toString(),
      count: campaigns.length,
    });

    // Sanitize documents
    const sanitized = sanitizeDocuments(campaigns);

    return successResponse({
      campaigns: sanitized,
      total: campaigns.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/brand/campaigns
 * Create a new campaign
 *
 * RATE LIMIT: 100 requests per minute per IP
 */
async function createCampaignHandler(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required");
    }

    if (session.user.role !== "brand") {
      return forbiddenResponse("Brand access required");
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = validateRequest(createCampaignSchema, body);

    // Find user to get their ID
    const user = await getUserByEmail(session.user.email!);
    if (!user) {
      logger.error("User not found in database", undefined, {
        email: session.user.email,
      });
      return notFoundResponse("User");
    }

    // Create campaign using type-safe helper
    const campaign = await createCampaign({
      brand_id: user._id,
      name: validatedData.name,
      description: validatedData.description,
      objectives: validatedData.objectives,
      target_audience: validatedData.target_audience,
      start_date: validatedData.start_date ? new Date(validatedData.start_date) : undefined,
      end_date: validatedData.end_date ? new Date(validatedData.end_date) : undefined,
      budget: validatedData.budget,
      spent_amount: 0,
      status: "draft",
      metrics: {
        total_reach: 0,
        total_impressions: 0,
        total_engagement: 0,
        total_clicks: 0,
        total_conversions: 0,
        engagement_rate: 0,
        estimated_roi: 0,
      },
      influencers: [],
      sentiment_analysis: {
        positive: 0,
        neutral: 0,
        negative: 0,
        total_comments_analyzed: 0,
      },
    });

    logger.info("Campaign created", {
      campaignId: campaign._id.toString(),
      brandId: user._id.toString(),
      campaignName: validatedData.name,
      budget: validatedData.budget,
    });

    return createdResponse({
      campaign: {
        _id: campaign._id.toString(),
        brand_id: user._id.toString(),
        name: validatedData.name,
        description: validatedData.description,
        budget: validatedData.budget,
        status: "draft",
        created_at: campaign.created_at.toISOString(),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Export with rate limiting applied
export const GET = withRateLimit(getCampaignsHandler, RATE_LIMIT_CONFIGS.default);
export const POST = withRateLimit(createCampaignHandler, RATE_LIMIT_CONFIGS.default);

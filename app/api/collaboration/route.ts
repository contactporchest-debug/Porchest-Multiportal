import { auth } from "@/lib/auth";
import {
  collections,
  getUserByEmail,
  toObjectId,
  sanitizeDocuments,
  createCollaborationRequest,
} from "@/lib/db";
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

/**
 * Collaboration Requests API
 * Manage collaboration requests between brands and influencers
 */

// Validation schema for creating a collaboration request
const createCollaborationSchema = z.object({
  campaign_id: z.string().min(1, "Campaign ID is required"),
  influencer_id: z.string().min(1, "Influencer ID is required"),
  offer_amount: z.number().positive("Offer amount must be positive"),
  deliverables: z.array(z.string()).optional().default([]),
  deadline: z.string().optional(),
  message: z.string().optional().default(""),
});

/**
 * GET /api/collaboration
 * List collaboration requests (for brands and influencers)
 *
 * RATE LIMIT: 100 requests per minute per IP
 */
async function getCollaborationsHandler(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required");
    }

    if (!["brand", "influencer"].includes(session.user.role)) {
      return forbiddenResponse("Brand or influencer access required");
    }

    // Find user to get their ID
    const user = await getUserByEmail(session.user.email!);
    if (!user) {
      logger.error("User not found in database", undefined, {
        email: session.user.email,
      });
      return notFoundResponse("User");
    }

    const collaborationRequestsCollection = await collections.collaborationRequests();

    // Filter based on role
    const filter = session.user.role === "brand"
      ? { brand_id: user._id }
      : { influencer_id: user._id };

    const requests = await collaborationRequestsCollection
      .find(filter)
      .sort({ created_at: -1 })
      .toArray();

    logger.debug("Collaboration requests retrieved", {
      userId: user._id.toString(),
      userRole: session.user.role,
      count: requests.length,
    });

    // Sanitize documents
    const sanitized = sanitizeDocuments(requests);

    return successResponse({
      requests: sanitized,
      total: requests.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/collaboration
 * Create collaboration request (brands only)
 *
 * RATE LIMIT: 100 requests per minute per IP
 */
async function createCollaborationHandler(req: Request) {
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
    const validatedData = validateRequest(createCollaborationSchema, body);

    // Validate ObjectIds
    const campaignObjectId = toObjectId(validatedData.campaign_id);
    if (!campaignObjectId) {
      return badRequestResponse("Invalid campaign ID format");
    }

    const influencerObjectId = toObjectId(validatedData.influencer_id);
    if (!influencerObjectId) {
      return badRequestResponse("Invalid influencer ID format");
    }

    // Find user to get their ID
    const user = await getUserByEmail(session.user.email!);
    if (!user) {
      logger.error("User not found in database", undefined, {
        email: session.user.email,
      });
      return notFoundResponse("User");
    }

    // Create collaboration request using type-safe helper
    const request = await createCollaborationRequest({
      campaign_id: campaignObjectId,
      brand_id: user._id,
      influencer_id: influencerObjectId,
      status: "pending",
      offer_amount: validatedData.offer_amount,
      deliverables: validatedData.deliverables,
      deadline: validatedData.deadline ? new Date(validatedData.deadline) : undefined,
      message: validatedData.message,
    });

    logger.info("Collaboration request created", {
      requestId: request._id.toString(),
      brandId: user._id.toString(),
      campaignId: validatedData.campaign_id,
      influencerId: validatedData.influencer_id,
      offerAmount: validatedData.offer_amount,
    });

    return createdResponse({
      request: {
        _id: request._id.toString(),
        campaign_id: validatedData.campaign_id,
        brand_id: user._id.toString(),
        influencer_id: validatedData.influencer_id,
        status: "pending",
        offer_amount: validatedData.offer_amount,
        created_at: request.created_at.toISOString(),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Export with rate limiting applied
export const GET = withRateLimit(getCollaborationsHandler, RATE_LIMIT_CONFIGS.default);
export const POST = withRateLimit(createCollaborationHandler, RATE_LIMIT_CONFIGS.default);

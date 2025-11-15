// Force dynamic rendering - API routes must NEVER be statically generated
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";


import { auth } from "@/lib/auth";
import { collections, getUserByEmail, toObjectId } from "@/lib/db";
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  badRequestResponse,
  handleApiError,
} from "@/lib/api-response";
import { validateRequest } from "@/lib/validations";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { z } from "zod";

/**
 * Collaboration Action API
 * Accept or reject collaboration requests (influencers only)
 */

// Validation schema for collaboration action
const collaborationActionSchema = z.object({
  action: z.enum(["accept", "reject"], {
    errorMap: () => ({ message: "Action must be 'accept' or 'reject'" }),
  }),
  response: z.string().optional().default(""),
});

/**
 * POST /api/collaboration/[id]/action
 * Accept or reject collaboration request (influencers only)
 *
 * RATE LIMIT: 100 requests per minute per IP
 */
async function collaborationActionHandler(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required");
    }

    if (session.user.role !== "influencer") {
      return forbiddenResponse("Influencer access required");
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = validateRequest(collaborationActionSchema, body);

    // Validate request ID
    const requestObjectId = toObjectId(params.id);
    if (!requestObjectId) {
      return badRequestResponse("Invalid request ID format");
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

    // Find request
    const request = await collaborationRequestsCollection.findOne({
      _id: requestObjectId,
      influencer_id: user._id,
    });

    if (!request) {
      logger.warn("Collaboration request not found", {
        requestId: params.id,
        userId: user._id.toString(),
      });
      return notFoundResponse("Collaboration request");
    }

    if (request.status !== "pending") {
      logger.warn("Attempt to process already processed request", {
        requestId: params.id,
        currentStatus: request.status,
        userId: user._id.toString(),
      });
      return badRequestResponse("Request already processed");
    }

    // Update request
    const updateData: any = {
      status: validatedData.action === "accept" ? "accepted" : "rejected",
      response_from_influencer: validatedData.response,
      updated_at: new Date(),
    };

    if (validatedData.action === "accept") {
      updateData.accepted_at = new Date();
    }

    const updateResult = await collaborationRequestsCollection.updateOne(
      { _id: requestObjectId },
      { $set: updateData }
    );

    if (updateResult.modifiedCount === 0) {
      logger.error("Failed to update collaboration request", undefined, {
        requestId: params.id,
        action: validatedData.action,
      });
      return badRequestResponse("Failed to update request");
    }

    logger.info(`Collaboration request ${validatedData.action}ed`, {
      requestId: params.id,
      action: validatedData.action,
      influencerId: user._id.toString(),
      influencerEmail: session.user.email,
    });

    return successResponse({
      message: `Request ${validatedData.action}ed successfully`,
      request: {
        _id: params.id,
        status: updateData.status,
        updated_at: updateData.updated_at.toISOString(),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Wrapper to make handler compatible with rate limiter
const wrappedHandler = (req: Request) => {
  const url = new URL(req.url);
  const id = url.pathname.split('/').slice(-2)[0];
  return collaborationActionHandler(req, { params: { id } });
};

// Export with rate limiting applied
export const POST = withRateLimit(wrappedHandler, RATE_LIMIT_CONFIGS.default);

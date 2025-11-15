// Force dynamic rendering - API routes must NEVER be statically generated
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";


import { auth } from "@/lib/auth";
import { collections, getUserByEmail, toObjectId, sanitizeDocument } from "@/lib/db";
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
 * Brand Campaign Invite API
 * Invite influencers to participate in campaigns
 */

// Validation schema for inviting influencers
const inviteInfluencersSchema = z.object({
  influencer_ids: z
    .array(
      z.string().refine((val) => ObjectId.isValid(val), {
        message: "Invalid influencer ID",
      })
    )
    .min(1, "At least one influencer must be selected")
    .max(50, "Maximum 50 influencers per batch"),
  offer_amount: z.number().positive("Offer amount must be positive"),
  deliverables: z
    .array(z.string().max(500))
    .min(1, "At least one deliverable is required"),
  deadline: z.string().datetime().optional(),
  message: z.string().max(1000).optional(),
});

/**
 * POST /api/brand/campaigns/[id]/invite
 * Invite influencers to a campaign
 *
 * RATE LIMIT: 100 requests per minute per IP
 */
async function inviteInfluencersHandler(
  req: Request,
  { params }: { params: { id: string } }
) {
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
      return notFoundResponse("User");
    }

    // Validate campaign ID
    const campaignId = toObjectId(params.id);
    if (!campaignId) {
      return badRequestResponse("Invalid campaign ID");
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = validateRequest(inviteInfluencersSchema, body);

    // Get campaign and verify ownership
    const campaignsCollection = await collections.campaigns();
    const campaign = await campaignsCollection.findOne({ _id: campaignId });

    if (!campaign) {
      return notFoundResponse("Campaign");
    }

    if (campaign.brand_id.toString() !== user._id.toString()) {
      return forbiddenResponse("You don't have access to this campaign");
    }

    // Convert influencer IDs to ObjectIds
    const influencerIds = validatedData.influencer_ids.map(
      (id) => new ObjectId(id)
    );

    // Verify all influencers exist and are active
    const usersCollection = await collections.users();
    const influencers = await usersCollection
      .find({
        _id: { $in: influencerIds },
        role: "influencer",
        status: "ACTIVE",
      })
      .toArray();

    if (influencers.length !== influencerIds.length) {
      return badRequestResponse(
        "Some influencers are invalid or not active"
      );
    }

    // Check for existing collaboration requests
    const collaborationsCollection = await collections.collaborationRequests();
    const existingCollaborations = await collaborationsCollection
      .find({
        campaign_id: campaignId,
        influencer_id: { $in: influencerIds },
      })
      .toArray();

    const existingInfluencerIds = new Set(
      existingCollaborations.map((c) => c.influencer_id.toString())
    );

    // Filter out influencers who already have a collaboration request
    const newInfluencerIds = influencerIds.filter(
      (id) => !existingInfluencerIds.has(id.toString())
    );

    if (newInfluencerIds.length === 0) {
      return badRequestResponse(
        "All selected influencers already have collaboration requests for this campaign"
      );
    }

    // Create collaboration requests
    const deadline = validatedData.deadline
      ? new Date(validatedData.deadline)
      : undefined;

    const collaborationRequests = newInfluencerIds.map((influencerId) => ({
      campaign_id: campaignId,
      brand_id: user._id,
      influencer_id: influencerId,
      status: "pending",
      offer_amount: validatedData.offer_amount,
      deliverables: validatedData.deliverables,
      deadline,
      message: validatedData.message,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    const result = await collaborationsCollection.insertMany(
      collaborationRequests as any
    );

    // Create notifications for each influencer
    const notificationsCollection = await collections.notifications();
    const notifications = newInfluencerIds.map((influencerId) => ({
      user_id: influencerId,
      type: "info",
      title: "New Campaign Invitation",
      message: `You've been invited to participate in "${campaign.name}" campaign. Offer: $${validatedData.offer_amount}`,
      read: false,
      action_url: `/influencer/collaborations`,
      action_label: "View Invitation",
      related_entity: {
        type: "campaign",
        id: campaignId,
      },
      created_at: new Date(),
    }));

    await notificationsCollection.insertMany(notifications as any);

    // Log audit trail
    const auditLogsCollection = await collections.auditLogs();
    await auditLogsCollection.insertOne({
      user_id: user._id,
      action: "campaign.invite_influencers",
      entity_type: "campaign",
      entity_id: campaignId,
      changes: {
        after: {
          invited_count: newInfluencerIds.length,
          offer_amount: validatedData.offer_amount,
          influencer_ids: newInfluencerIds.map((id) => id.toString()),
        },
      },
      success: true,
      timestamp: new Date(),
    } as any);

    logger.info("Influencers invited to campaign", {
      campaignId: params.id,
      brandId: user._id.toString(),
      invitedCount: newInfluencerIds.length,
      skippedCount: influencerIds.length - newInfluencerIds.length,
    });

    return createdResponse({
      message: `Successfully invited ${newInfluencerIds.length} influencer(s)`,
      invited_count: newInfluencerIds.length,
      skipped_count: influencerIds.length - newInfluencerIds.length,
      collaboration_ids: Object.values(result.insertedIds).map((id) =>
        id.toString()
      ),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Export with rate limiting applied
export const POST = withRateLimit(
  inviteInfluencersHandler,
  RATE_LIMIT_CONFIGS.default
);

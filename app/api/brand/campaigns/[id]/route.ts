import { auth } from "@/lib/auth";
import { collections, toObjectId, sanitizeDocument, getUserById } from "@/lib/db";
import {
  successResponse,
  unauthorizedResponse,
  notFoundResponse,
  forbiddenResponse,
  handleApiError,
  noContentResponse,
} from "@/lib/api-response";
import { validateRequest, updateCampaignSchema, objectIdSchema } from "@/lib/validations";

/**
 * GET /api/brand/campaigns/[id]
 * Get a single campaign by ID (brand only, must own the campaign)
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user.role !== "brand") {
      return unauthorizedResponse("Brand access required");
    }

    // Validate campaign ID
    const campaignId = toObjectId(params.id);
    if (!campaignId) {
      return notFoundResponse("Campaign");
    }

    // Get campaign
    const campaignsCollection = await collections.campaigns();
    const campaign = await campaignsCollection.findOne({ _id: campaignId });

    if (!campaign) {
      return notFoundResponse("Campaign");
    }

    // Verify ownership - check brand_id matches user's ID
    const user = await getUserById(session.user.id);
    if (!user || campaign.brand_id.toString() !== user._id.toString()) {
      return forbiddenResponse("You don't have access to this campaign");
    }

    // Sanitize and return
    return successResponse(sanitizeDocument(campaign));
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/brand/campaigns/[id]
 * Update a campaign (brand only, must own the campaign)
 */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user.role !== "brand") {
      return unauthorizedResponse("Brand access required");
    }

    // Validate campaign ID
    const campaignId = toObjectId(params.id);
    if (!campaignId) {
      return notFoundResponse("Campaign");
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = validateRequest(updateCampaignSchema, body);

    // Get campaign and verify ownership
    const campaignsCollection = await collections.campaigns();
    const campaign = await campaignsCollection.findOne({ _id: campaignId });

    if (!campaign) {
      return notFoundResponse("Campaign");
    }

    const user = await getUserById(session.user.id);
    if (!user || campaign.brand_id.toString() !== user._id.toString()) {
      return forbiddenResponse("You don't have access to this campaign");
    }

    // Update campaign with validated data only
    const result = await campaignsCollection.updateOne(
      { _id: campaignId },
      {
        $set: {
          ...validatedData,
          updated_at: new Date(),
        } as any,
      }
    );

    if (result.modifiedCount === 0) {
      return successResponse({ message: "No changes made" });
    }

    // Get updated campaign
    const updatedCampaign = await campaignsCollection.findOne({ _id: campaignId });

    return successResponse({
      message: "Campaign updated successfully",
      campaign: sanitizeDocument(updatedCampaign!),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/brand/campaigns/[id]
 * Delete a campaign (brand only, must own the campaign)
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user.role !== "brand") {
      return unauthorizedResponse("Brand access required");
    }

    // Validate campaign ID
    const campaignId = toObjectId(params.id);
    if (!campaignId) {
      return notFoundResponse("Campaign");
    }

    // Get campaign and verify ownership
    const campaignsCollection = await collections.campaigns();
    const campaign = await campaignsCollection.findOne({ _id: campaignId });

    if (!campaign) {
      return notFoundResponse("Campaign");
    }

    const user = await getUserById(session.user.id);
    if (!user || campaign.brand_id.toString() !== user._id.toString()) {
      return forbiddenResponse("You don't have access to this campaign");
    }

    // Delete campaign
    await campaignsCollection.deleteOne({ _id: campaignId });

    // Note: In production, you might want to:
    // - Soft delete instead of hard delete
    // - Check if campaign has active collaborations
    // - Clean up related data (collaboration requests, etc.)

    return noContentResponse();
  } catch (error) {
    return handleApiError(error);
  }
}

import { auth } from "@/lib/auth";
import { collections, getUserByEmail, sanitizeDocuments, toObjectId } from "@/lib/db";
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
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
 * Influencer Posts API
 * Manage influencer post submissions for campaigns
 */

// Validation schema for creating a post
const createPostSchema = z.object({
  campaign_id: z.string().refine((val) => ObjectId.isValid(val), {
    message: "Invalid campaign ID",
  }),
  platform: z.enum(["instagram", "youtube", "tiktok", "twitter", "facebook"]),
  post_url: z.string().url("Must be a valid URL"),
  post_type: z.enum(["image", "video", "story", "reel", "carousel"]),
  caption: z.string().max(5000).optional(),
  thumbnail_url: z.string().url().optional(),
  likes: z.number().int().nonnegative().default(0),
  comments: z.number().int().nonnegative().default(0),
  shares: z.number().int().nonnegative().default(0),
  views: z.number().int().nonnegative().default(0),
});

/**
 * GET /api/influencer/posts
 * List all posts submitted by the logged-in influencer
 *
 * RATE LIMIT: 100 requests per minute per IP
 */
async function getPostsHandler(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required");
    }

    if (session.user.role !== "influencer") {
      return forbiddenResponse("Influencer access required");
    }

    // Find user to get their ID
    const user = await getUserByEmail(session.user.email!);
    if (!user) {
      return badRequestResponse("User not found");
    }

    // Parse query parameters
    const url = new URL(req.url);
    const campaign_id = url.searchParams.get("campaign_id");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const page = parseInt(url.searchParams.get("page") || "1");

    // Build filter
    const filter: any = { influencer_id: user._id };
    if (campaign_id && ObjectId.isValid(campaign_id)) {
      filter.campaign_id = new ObjectId(campaign_id);
    }

    // Get posts collection
    const postsCollection = await collections.posts();

    // Get total count
    const total = await postsCollection.countDocuments(filter);

    // Get posts with pagination
    const skip = (page - 1) * limit;
    const posts = await postsCollection
      .find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    logger.debug("Posts retrieved", {
      userId: user._id.toString(),
      count: posts.length,
      total,
    });

    return successResponse({
      posts: sanitizeDocuments(posts),
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

/**
 * POST /api/influencer/posts
 * Submit a new post for a campaign
 *
 * RATE LIMIT: 100 requests per minute per IP
 */
async function createPostHandler(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required");
    }

    if (session.user.role !== "influencer") {
      return forbiddenResponse("Influencer access required");
    }

    // Find user to get their ID
    const user = await getUserByEmail(session.user.email!);
    if (!user) {
      return badRequestResponse("User not found");
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = validateRequest(createPostSchema, body);

    const campaignId = new ObjectId(validatedData.campaign_id);

    // Verify campaign exists
    const campaignsCollection = await collections.campaigns();
    const campaign = await campaignsCollection.findOne({ _id: campaignId });
    if (!campaign) {
      return badRequestResponse("Campaign not found");
    }

    // Verify influencer has an active collaboration for this campaign
    const collaborationsCollection = await collections.collaborationRequests();
    const collaboration = await collaborationsCollection.findOne({
      campaign_id: campaignId,
      influencer_id: user._id,
      status: { $in: ["accepted", "completed"] },
    });

    if (!collaboration) {
      return forbiddenResponse(
        "You must have an accepted collaboration for this campaign"
      );
    }

    // Calculate engagement rate
    const totalEngagement =
      validatedData.likes + validatedData.comments + validatedData.shares;
    const engagementRate =
      validatedData.views > 0
        ? (totalEngagement / validatedData.views) * 100
        : totalEngagement > 0
        ? 5.0 // Default if views not tracked
        : 0;

    // Create post document
    const postsCollection = await collections.posts();
    const post = {
      influencer_id: user._id,
      campaign_id: campaignId,
      platform: validatedData.platform,
      post_url: validatedData.post_url,
      post_type: validatedData.post_type,
      caption: validatedData.caption,
      thumbnail_url: validatedData.thumbnail_url,
      likes: validatedData.likes,
      comments: validatedData.comments,
      shares: validatedData.shares,
      views: validatedData.views,
      engagement_rate: Math.round(engagementRate * 100) / 100,
      posted_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await postsCollection.insertOne(post as any);

    // Update campaign metrics
    await campaignsCollection.updateOne(
      { _id: campaignId },
      {
        $inc: {
          "metrics.total_reach": validatedData.views,
          "metrics.total_impressions": validatedData.views,
          "metrics.total_engagement": totalEngagement,
          "metrics.total_clicks": validatedData.shares, // Approximate
        },
        $set: { updated_at: new Date() },
      }
    );

    // Update collaboration progress (optional)
    await collaborationsCollection.updateOne(
      { _id: collaboration._id },
      {
        $set: { updated_at: new Date() },
      }
    );

    logger.info("Post submitted", {
      postId: result.insertedId.toString(),
      influencerId: user._id.toString(),
      campaignId: campaignId.toString(),
      platform: validatedData.platform,
      engagement_rate: engagementRate,
    });

    // Create notification for brand
    const notificationsCollection = await collections.notifications();
    await notificationsCollection.insertOne({
      user_id: campaign.brand_id,
      type: "info",
      title: "New Post Submitted",
      message: `${user.full_name || "An influencer"} submitted a new ${
        validatedData.post_type
      } on ${validatedData.platform} for campaign "${campaign.name}"`,
      read: false,
      action_url: `/brand/campaigns/${campaignId.toString()}`,
      action_label: "View Campaign",
      related_entity: {
        type: "campaign",
        id: campaignId,
      },
      created_at: new Date(),
    } as any);

    return createdResponse({
      post: {
        _id: result.insertedId.toString(),
        campaign_id: campaignId.toString(),
        platform: validatedData.platform,
        post_url: validatedData.post_url,
        engagement_rate: engagementRate,
        created_at: post.created_at.toISOString(),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Export with rate limiting applied
export const GET = withRateLimit(getPostsHandler, RATE_LIMIT_CONFIGS.default);
export const POST = withRateLimit(createPostHandler, RATE_LIMIT_CONFIGS.default);

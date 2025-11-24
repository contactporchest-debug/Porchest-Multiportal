// Force dynamic rendering - API routes must NEVER be statically generated
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";

import { auth } from "@/lib/auth";
import { collections, sanitizeDocuments } from "@/lib/db";
import {
  successResponse,
  unauthorizedResponse,
  handleApiError,
} from "@/lib/api-response";
import { validateRequest } from "@/lib/validations";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { z } from "zod";
import { chatAndExtract, ChatCriteria } from "@/lib/ai-chat-parser";
import { buildMongoFilter, calculateRelevanceScore } from "@/lib/ai-helpers";
import { logger } from "@/lib/logger";

// Validation schema for chat recommendation request
const chatCriteriaSchema = z.object({
  niche: z.array(z.string()).default([]),
  platform: z.enum(["instagram", "youtube", "tiktok"]).nullable().default(null),
  locations: z.array(z.string()).default([]),
  min_followers: z.number().nullable().default(null),
  max_followers: z.number().nullable().default(null),
  min_engagement_rate: z.number().nullable().default(null),
  min_reach: z.number().nullable().default(null),
  budget: z.number().nullable().default(null),
  gender: z.enum(["male", "female"]).nullable().default(null),
  languages: z.array(z.string()).default([]),
});

const chatRecommendSchema = z.object({
  message: z.string().min(1, "Message is required"),
  criteria: chatCriteriaSchema.nullable().default(null),
});

/**
 * POST /api/brand/chat-recommend
 * Stateless conversational chat with criteria extraction
 * Brand-only endpoint
 *
 * RATE LIMIT: 10 requests per minute per IP
 */
async function chatRecommendHandler(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user || session.user.role !== "brand") {
      return unauthorizedResponse("Brand access required");
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = validateRequest(chatRecommendSchema, body);

    logger.info("Chat Recommend Started", {
      userId: session.user.id,
      message: validatedData.message,
      hasCriteria: !!validatedData.criteria,
    });

    // 💬 STEP 1: Chat and extract criteria
    let chatResult;
    let method = "llm";

    try {
      chatResult = await chatAndExtract(
        validatedData.message,
        validatedData.criteria
      );
      method = process.env.OPENAI_API_KEY ? "llm" : "regex-fallback";
    } catch (error: any) {
      logger.error("Chat extraction failed", { error: error.message });
      throw error;
    }

    logger.info("Chat Result", {
      needs_followup: chatResult.needs_followup,
      criteria: chatResult.criteria,
    });

    // 🔍 STEP 2: Check if we should query influencers
    let matches: any[] = [];

    const hasEnoughCriteria =
      !chatResult.needs_followup &&
      (chatResult.criteria.niche.length > 0 ||
        chatResult.criteria.min_followers !== null);

    if (hasEnoughCriteria) {
      // Convert ChatCriteria to InfluencerCriteria for buildMongoFilter
      const influencerCriteria = {
        niche: chatResult.criteria.niche.length > 0 ? chatResult.criteria.niche : undefined,
        platform: chatResult.criteria.platform || undefined,
        location: chatResult.criteria.locations.length > 0 ? chatResult.criteria.locations : undefined,
        minFollowers: chatResult.criteria.min_followers || undefined,
        maxFollowers: chatResult.criteria.max_followers || undefined,
        minEngagementRate: chatResult.criteria.min_engagement_rate || undefined,
        budget: chatResult.criteria.budget || undefined,
        gender: chatResult.criteria.gender || undefined,
        language: chatResult.criteria.languages.length > 0 ? chatResult.criteria.languages : undefined,
      };

      // Build MongoDB filter
      const mongoFilter = buildMongoFilter(influencerCriteria);
      logger.info("MongoDB Filter Built", { filter: mongoFilter });

      // Query influencer profiles
      const influencerProfilesCollection = await collections.influencerProfiles();
      const influencerProfiles = await influencerProfilesCollection
        .find(mongoFilter)
        .limit(50)
        .toArray();

      logger.info("Influencers Found", { count: influencerProfiles.length });

      // Get user data for each influencer
      const influencerIds = influencerProfiles.map((p) => p.user_id);
      const usersCollection = await collections.users();
      const users = await usersCollection
        .find({
          _id: { $in: influencerIds },
          status: "ACTIVE",
          role: "influencer",
        })
        .toArray();

      const userMap = new Map(users.map((u) => [u._id.toString(), u]));

      // Calculate relevance scores and build matches
      matches = influencerProfiles
        .map((profile) => {
          const user = userMap.get(profile.user_id.toString());
          if (!user) return null;

          const relevanceScore = calculateRelevanceScore(profile, influencerCriteria);

          const followers = profile.instagram_metrics?.followers_count || profile.total_followers || 0;
          const engagementRate = profile.calculated_metrics?.engagement_rate_30_days || profile.avg_engagement_rate || 0;

          return {
            id: profile._id.toString(),
            userId: user._id.toString(),
            name: profile.full_name || user.full_name,
            username: profile.instagram_account?.username || user.email?.split("@")[0],
            email: user.email,
            bio: profile.bio,
            niche: profile.niche,
            location: profile.location,
            languages: profile.languages,
            profilePicture: profile.profile_picture,
            instagramMetrics: profile.instagram_metrics
              ? {
                  followers: profile.instagram_metrics.followers_count,
                  engagement: profile.calculated_metrics?.engagement_rate_30_days,
                  reach: profile.instagram_metrics.reach,
                  avgLikes: profile.calculated_metrics?.avg_likes,
                  avgComments: profile.calculated_metrics?.avg_comments,
                }
              : null,
            totalFollowers: followers,
            engagementRate: engagementRate,
            primaryPlatform: "instagram",
            pricing: profile.pricing,
            rating: profile.rating,
            completedCampaigns: profile.completed_campaigns || 0,
            relevanceScore: relevanceScore,
          };
        })
        .filter((rec): rec is NonNullable<typeof rec> => rec !== null)
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 12); // Return top 12 recommendations

      logger.info("Matches Prepared", { count: matches.length });
    }

    // 📤 STEP 3: Return standardized response
    return successResponse({
      assistant_message: chatResult.assistant_message,
      criteria: chatResult.criteria,
      needs_followup: chatResult.needs_followup,
      followup_questions: chatResult.followup_questions,
      matches: matches,
      method: method,
    });
  } catch (error) {
    logger.error("Chat Recommend Error", error);
    return handleApiError(error);
  }
}

// Export handler with rate limiting applied
export const POST = withRateLimit(chatRecommendHandler, RATE_LIMIT_CONFIGS.ai);

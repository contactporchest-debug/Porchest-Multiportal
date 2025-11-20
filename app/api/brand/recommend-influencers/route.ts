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
import {
  parseInfluencerRequirements,
  buildMongoFilter,
  calculateRelevanceScore,
  InfluencerCriteria,
} from "@/lib/ai-helpers";
import { logger } from "@/lib/logger";

// Validation schema for influencer recommendation request
const recommendInfluencersSchema = z.object({
  query: z.string().min(1, "Query is required"),
  budget: z.number().positive().optional(),
  targetAudience: z.string().optional(),
  categories: z.array(z.string()).optional().default([]),
  platform: z.enum(["instagram", "tiktok", "youtube", "twitter", "linkedin"]).optional(),
});

/**
 * POST /api/brand/recommend-influencers
 * Get AI-powered influencer recommendations based on plain English criteria
 * Brand-only endpoint
 *
 * RATE LIMIT: 10 requests per minute per IP
 */
async function recommendHandler(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user || session.user.role !== "brand") {
      return unauthorizedResponse("Brand access required");
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = validateRequest(recommendInfluencersSchema, body);

    logger.info("AI Influencer Search Started", {
      userId: session.user.id,
      query: validatedData.query,
    });

    // 🤖 STEP 1: Use AI to parse plain English requirements
    let aiCriteria: InfluencerCriteria;
    try {
      aiCriteria = await parseInfluencerRequirements(validatedData.query);
      logger.info("AI Criteria Parsed", { criteria: aiCriteria });

      // Override AI-parsed budget if explicitly provided in request
      if (validatedData.budget) {
        aiCriteria.budget = validatedData.budget;
      }

      // Override AI-parsed platform if explicitly provided
      if (validatedData.platform) {
        aiCriteria.platform = validatedData.platform;
      }

      // Merge explicit categories with AI-parsed niche
      if (validatedData.categories && validatedData.categories.length > 0) {
        aiCriteria.niche = [
          ...(aiCriteria.niche || []),
          ...validatedData.categories,
        ];
      }
    } catch (aiError: any) {
      logger.error("AI Parsing Failed", { error: aiError.message });
      // Fall back to basic filtering if AI fails
      aiCriteria = {
        niche: validatedData.categories,
        platform: validatedData.platform,
        budget: validatedData.budget,
      };
    }

    // 🔍 STEP 2: Build MongoDB filter from AI-extracted criteria
    const mongoFilter = buildMongoFilter(aiCriteria);
    logger.info("MongoDB Filter Built", { filter: mongoFilter });

    // 📊 STEP 3: Query influencer profiles from database
    const influencerProfilesCollection = await collections.influencerProfiles();
    const influencerProfiles = await influencerProfilesCollection
      .find(mongoFilter)
      .limit(50) // Get more results for better ranking
      .toArray();

    logger.info("Influencers Found", { count: influencerProfiles.length });

    // 👥 STEP 4: Get user data for each influencer
    const influencerIds = influencerProfiles.map((p) => p.user_id);
    const usersCollection = await collections.users();
    const users = await usersCollection
      .find({
        _id: { $in: influencerIds },
        status: "ACTIVE",
        role: "influencer",
      })
      .toArray();

    // Create a map for quick user lookup
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    // 🎯 STEP 5: Calculate AI-powered relevance scores and combine data
    const recommendations = influencerProfiles
      .map((profile) => {
        const user = userMap.get(profile.user_id.toString());
        if (!user) return null;

        // Calculate AI-powered relevance score
        const relevanceScore = calculateRelevanceScore(profile, aiCriteria);

        // Calculate estimated ROI
        const followers = profile.instagram_metrics?.followers_count || profile.total_followers || 0;
        const engagementRate = profile.calculated_metrics?.engagement_rate_30_days || profile.avg_engagement_rate || 0;
        const estimatedEngagement = followers * (engagementRate / 100);
        const postPrice = profile.pricing?.post || 1;
        const estimatedROI = (estimatedEngagement / postPrice) * 100;

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
          demographics: profile.demographics,
          brandPreferences: profile.brand_preferences,
          predictedROI: Math.round(estimatedROI * 100) / 100,
          predictedReach: followers,
          relevanceScore: relevanceScore,
        };
      })
      .filter((rec): rec is NonNullable<typeof rec> => rec !== null)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 12); // Return top 12 recommendations

    logger.info("Recommendations Prepared", { count: recommendations.length });

    return successResponse({
      recommendations,
      total: recommendations.length,
      aiCriteria,
      filters: {
        query: validatedData.query,
        parsedCriteria: aiCriteria,
        budget: validatedData.budget,
        platform: validatedData.platform,
        categories: validatedData.categories,
      },
    });
  } catch (error) {
    logger.error("Recommend Influencers Error", error);
    return handleApiError(error);
  }
}

// Export handler with rate limiting applied
export const POST = withRateLimit(recommendHandler, RATE_LIMIT_CONFIGS.ai);

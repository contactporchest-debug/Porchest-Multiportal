import { auth } from "@/lib/auth";
import { collections, sanitizeDocuments } from "@/lib/db";
import {
  successResponse,
  unauthorizedResponse,
  handleApiError,
} from "@/lib/api-response";
import { validateRequest } from "@/lib/validations";
import { z } from "zod";

// Validation schema for influencer recommendation request
const recommendInfluencersSchema = z.object({
  query: z.string().optional(),
  budget: z.number().positive().optional(),
  targetAudience: z.string().optional(),
  categories: z.array(z.string()).optional().default([]),
  platform: z.enum(["instagram", "tiktok", "youtube", "twitter", "linkedin"]).optional(),
});

/**
 * POST /api/brand/recommend-influencers
 * Get AI-powered influencer recommendations based on criteria
 * Brand-only endpoint
 */
export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user || session.user.role !== "brand") {
      return unauthorizedResponse("Brand access required");
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = validateRequest(recommendInfluencersSchema, body);

    // Build MongoDB filter based on validated criteria
    const filter: Record<string, any> = {};

    // Filter by platform if specified
    if (validatedData.platform) {
      filter[`social_media.${validatedData.platform.toLowerCase()}.followers`] = { $gt: 0 };
    }

    // Filter by categories if specified
    if (validatedData.categories && validatedData.categories.length > 0) {
      filter.content_categories = { $in: validatedData.categories };
    }

    // Get influencer profiles from database
    const influencerProfilesCollection = await collections.influencerProfiles();
    const influencerProfiles = await influencerProfilesCollection
      .find(filter)
      .limit(20)
      .toArray();

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

    // Create a map for quick user lookup
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    // Combine profiles with user data and calculate relevance scores
    const recommendations = influencerProfiles
      .map((profile) => {
        const user = userMap.get(profile.user_id.toString());
        if (!user) return null;

        // --- RELEVANCE SCORE ALGORITHM --- //
        // Calculate a weighted score based on multiple factors (0-100)
        let score = 0;

        // 1. Budget match (30 points max)
        if (validatedData.budget && profile.pricing?.post) {
          if (profile.pricing.post <= validatedData.budget) {
            score += 30;
          } else {
            // Partial points if within 20% of budget
            const priceDiff = (profile.pricing.post - validatedData.budget) / validatedData.budget;
            if (priceDiff < 0.2) {
              score += 15;
            }
          }
        }

        // 2. Engagement rate (30 points max)
        // Higher engagement rates get more points
        if (profile.avg_engagement_rate) {
          score += Math.min(profile.avg_engagement_rate * 10, 30);
        }

        // 3. Follower count (20 points max)
        // Scaled logarithmically to balance micro and macro influencers
        if (profile.total_followers) {
          score += Math.min(Math.log10(profile.total_followers) * 5, 20);
        }

        // 4. Rating (20 points max)
        if (profile.rating) {
          score += profile.rating * 4; // Rating is 0-5, so * 4 = 0-20 points
        }

        // --- ESTIMATED ROI CALCULATION --- //
        const estimatedReach = profile.total_followers || 0;
        const engagementRate = profile.avg_engagement_rate || 0;
        const estimatedEngagement = estimatedReach * (engagementRate / 100);
        const postPrice = profile.pricing?.post || 1;
        const estimatedROI = profile.predicted_roi || (estimatedEngagement / postPrice) * 100;

        return {
          id: profile._id.toString(),
          userId: user._id.toString(),
          name: user.full_name,
          email: user.email,
          bio: profile.bio,
          profilePicture: profile.profile_picture,
          socialMedia: profile.social_media,
          totalFollowers: profile.total_followers,
          engagementRate: profile.avg_engagement_rate,
          categories: profile.content_categories,
          primaryPlatform: profile.primary_platform,
          pricing: profile.pricing,
          rating: profile.rating,
          completedCampaigns: profile.completed_campaigns,
          demographics: profile.demographics,
          predictedROI: Math.round(estimatedROI * 100) / 100, // Round to 2 decimals
          predictedReach: estimatedReach,
          relevanceScore: Math.round(score * 100) / 100, // Round to 2 decimals
        };
      })
      .filter((rec): rec is NonNullable<typeof rec> => rec !== null)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 12); // Return top 12 recommendations

    return successResponse({
      recommendations,
      total: recommendations.length,
      filters: {
        budget: validatedData.budget,
        platform: validatedData.platform,
        categories: validatedData.categories,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

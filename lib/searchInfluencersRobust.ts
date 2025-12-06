/**
 * MongoDB Influencer Search with Scoring & Auto-Retry
 * Production-ready search with fuzzy matching and filter relaxation
 */

import { collections } from "@/lib/db";
import { logger } from "@/lib/logger";
import type { SearchCriteria } from "@/lib/extractCriteriaWithGemini";

// ============================================================================
// TYPES
// ============================================================================

export interface InfluencerSearchResult {
  id: string;
  userId: string;
  name: string;
  username: string;
  niche: string;
  location: string;
  followers: number;
  engagementRate: number;
  avgViews: number;
  platforms: string[];
  pricePerPost: number;
  availability: string;
  languages: string[];
  profilePicture?: string;
  isVerified: boolean;
  rating: number;
  completedCampaigns: number;
  brandsWorkedWith: string[];
  lastActiveAt?: string;
  score?: number; // Relevance score
}

export interface SearchOptions {
  limit?: number;
  allowRelaxation?: boolean;
}

// ============================================================================
// MAIN SEARCH FUNCTION WITH AUTO-RETRY
// ============================================================================

/**
 * Search influencers with automatic filter relaxation retry
 */
export async function searchInfluencersWithRetry(
  criteria: SearchCriteria,
  options: SearchOptions = {}
): Promise<{ results: InfluencerSearchResult[]; relaxed: boolean }> {
  const { limit = 10, allowRelaxation = true } = options;

  logger.info("Search started", { criteria, options });

  // First attempt with exact criteria
  let results = await searchInfluencersScored(criteria, limit);

  logger.info("Initial search complete", { count: results.length });

  // If no results and relaxation allowed, retry with relaxed filters
  if (results.length === 0 && allowRelaxation) {
    logger.info("No results, applying filter relaxation");

    const relaxedCriteria = relaxFilters(criteria);

    logger.info("Relaxed criteria", { relaxedCriteria });

    results = await searchInfluencersScored(relaxedCriteria, limit);

    logger.info("Relaxed search complete", { count: results.length });

    return { results, relaxed: true };
  }

  return { results, relaxed: false };
}

// ============================================================================
// SCORED SEARCH WITH AGGREGATION
// ============================================================================

/**
 * Search with scoring and ranking using MongoDB aggregation
 */
async function searchInfluencersScored(
  criteria: SearchCriteria,
  limit: number
): Promise<InfluencerSearchResult[]> {
  try {
    const influencerProfilesCol = await collections.influencerProfiles();

    // Build match stage
    const matchStage: any = {
      profile_completed: true,
    };

    // Category filter (case-insensitive)
    if (criteria.category) {
      matchStage.niche = new RegExp(criteria.category, "i");
    }

    // Location filter (case-insensitive, fuzzy)
    if (criteria.location) {
      matchStage.location = new RegExp(criteria.location, "i");
    }

    // Follower range
    if (criteria.minFollowers !== undefined || criteria.maxFollowers !== undefined) {
      matchStage.followers = {};
      if (criteria.minFollowers !== undefined) {
        matchStage.followers.$gte = criteria.minFollowers;
      }
      if (criteria.maxFollowers !== undefined) {
        matchStage.followers.$lte = criteria.maxFollowers;
      }
    }

    // Engagement rate
    if (criteria.minEngagement !== undefined) {
      matchStage.engagement_rate = { $gte: criteria.minEngagement };
    }

    // Platforms
    if (criteria.platforms && criteria.platforms.length > 0) {
      matchStage.platforms = {
        $in: criteria.platforms.map((p) => new RegExp(p, "i")),
      };
    }

    // Verified status
    if (criteria.verified !== undefined) {
      matchStage.verified = criteria.verified;
    }

    logger.info("MongoDB match stage", { matchStage });

    // Aggregation pipeline with scoring
    const pipeline: any[] = [
      // Stage 1: Match filters
      { $match: matchStage },

      // Stage 2: Add relevance score
      {
        $addFields: {
          score: {
            $add: [
              // Category match bonus (+3 points)
              {
                $cond: {
                  if: criteria.category
                    ? {
                        $regexMatch: {
                          input: "$niche",
                          regex: criteria.category,
                          options: "i",
                        },
                      }
                    : false,
                  then: 3,
                  else: 0,
                },
              },

              // Location match bonus (+2 points)
              {
                $cond: {
                  if: criteria.location
                    ? {
                        $regexMatch: {
                          input: "$location",
                          regex: criteria.location,
                          options: "i",
                        },
                      }
                    : false,
                  then: 2,
                  else: 0,
                },
              },

              // Engagement weight (normalized to 0-2 points)
              {
                $multiply: [
                  { $divide: ["$engagement_rate", 10] }, // Assume max 10% engagement
                  2,
                ],
              },

              // Follower closeness weight (0-1 points)
              {
                $cond: {
                  if: criteria.minFollowers
                    ? { $gte: ["$followers", criteria.minFollowers] }
                    : true,
                  then: 0.5,
                  else: 0,
                },
              },

              // Verified bonus (+1 point)
              {
                $cond: {
                  if: "$verified",
                  then: 1,
                  else: 0,
                },
              },

              // Rating weight (0-1 points, assuming 5-star max)
              {
                $divide: ["$rating", 5],
              },
            ],
          },
        },
      },

      // Stage 3: Sort by score, engagement, followers, lastActive
      {
        $sort: {
          score: -1,
          engagement_rate: -1,
          followers: -1,
          updated_at: -1,
        },
      },

      // Stage 4: Limit results
      { $limit: limit },
    ];

    logger.info("Executing aggregation pipeline", {
      stages: pipeline.length,
    });

    const profiles = await influencerProfilesCol.aggregate(pipeline).toArray();

    logger.info("Aggregation complete", { count: profiles.length });

    // Get user data for ACTIVE users only
    const userIds = profiles.map((p) => p.user_id);
    const usersCol = await collections.users();

    const users = await usersCol
      .find({
        _id: { $in: userIds },
        status: "ACTIVE",
        role: "influencer",
      })
      .toArray();

    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    // Build safe results
    const results: InfluencerSearchResult[] = profiles
      .map((profile) => {
        const user = userMap.get(profile.user_id.toString());
        if (!user) return null;

        return {
          id: profile._id.toString(),
          userId: user._id.toString(),
          name: profile.full_name,
          username: profile.instagram_username || user.email?.split("@")[0] || "unknown",
          niche: profile.niche,
          location: profile.location,
          followers: profile.followers || 0,
          engagementRate: profile.engagement_rate || 0,
          avgViews: profile.average_views_monthly || 0,
          platforms: profile.platforms || ["Instagram"],
          pricePerPost: profile.price_per_post || 0,
          availability: profile.availability || "Unknown",
          languages: profile.languages || [],
          profilePicture: profile.profile_picture,
          isVerified: profile.verified || false,
          rating: profile.rating || 0,
          completedCampaigns: profile.completed_campaigns || 0,
          brandsWorkedWith: profile.brands_worked_with || [],
          lastActiveAt: profile.updated_at?.toISOString(),
          score: profile.score,
        };
      })
      .filter((r): r is InfluencerSearchResult => r !== null);

    logger.info("Results prepared", { count: results.length });

    return results;
  } catch (error) {
    logger.error("Search error", error);
    throw new Error(
      `Failed to search influencers: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

// ============================================================================
// FILTER RELAXATION
// ============================================================================

/**
 * Relax filters to broaden search
 * Strategy:
 * - Remove location filter
 * - Reduce minFollowers by 30%
 * - Keep category, platforms, verified
 */
function relaxFilters(criteria: SearchCriteria): SearchCriteria {
  const relaxed: SearchCriteria = { ...criteria };

  // Remove location constraint
  delete relaxed.location;

  // Reduce follower minimum by 30%
  if (relaxed.minFollowers) {
    relaxed.minFollowers = Math.floor(relaxed.minFollowers * 0.7);
  }

  // Remove max follower constraint
  delete relaxed.maxFollowers;

  // Reduce engagement minimum by 1%
  if (relaxed.minEngagement && relaxed.minEngagement > 1) {
    relaxed.minEngagement = Math.max(1, relaxed.minEngagement - 1);
  }

  logger.info("Filters relaxed", {
    original: criteria,
    relaxed,
  });

  return relaxed;
}

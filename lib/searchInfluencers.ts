/**
 * MongoDB Influencer Search Function
 * Dynamic query building for influencer discovery
 */

import { Filter } from "mongodb";
import { collections } from "@/lib/db";
import { logger } from "@/lib/logger";
import type { InfluencerProfile } from "@/lib/db-types";

// ============================================================================
// TYPES
// ============================================================================

export interface SearchFilters {
  categories?: string[];
  niche?: string[];
  location?: string | string[];
  minFollowers?: number;
  maxFollowers?: number;
  minEngagementRate?: number;
  maxEngagementRate?: number;
  platforms?: string[];
  verified?: boolean;
  minPricePerPost?: number;
  maxPricePerPost?: number;
  languages?: string[];
  availability?: string;
  minRating?: number;
}

export interface InfluencerSearchResult {
  id: string;
  userId: string;
  name: string;
  username: string;
  bio?: string;
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
}

// ============================================================================
// SEARCH FUNCTION
// ============================================================================

/**
 * Search influencers in MongoDB with dynamic filtering
 * @param filters - Search criteria
 * @param limit - Maximum results (default 10)
 * @returns Array of matching influencer profiles
 */
export async function searchInfluencers(
  filters: SearchFilters,
  limit: number = 10
): Promise<InfluencerSearchResult[]> {
  try {
    logger.info("Searching influencers", { filters, limit });

    // Build MongoDB filter
    const mongoFilter: Filter<InfluencerProfile> = {};

    // Category/Niche filtering (case-insensitive, supports multiple)
    if (filters.categories && filters.categories.length > 0) {
      mongoFilter.niche = {
        $in: filters.categories.map((cat) => new RegExp(cat, "i")),
      };
    } else if (filters.niche && filters.niche.length > 0) {
      mongoFilter.niche = {
        $in: filters.niche.map((n) => new RegExp(n, "i")),
      };
    }

    // Location filtering (exact or fuzzy match)
    if (filters.location) {
      if (Array.isArray(filters.location)) {
        // Multiple locations - case insensitive match
        mongoFilter.location = {
          $in: filters.location.map((loc) => new RegExp(loc, "i")),
        };
      } else {
        // Single location - fuzzy match
        mongoFilter.location = new RegExp(filters.location, "i");
      }
    }

    // Follower range
    if (filters.minFollowers !== undefined || filters.maxFollowers !== undefined) {
      mongoFilter.followers = {};
      if (filters.minFollowers !== undefined) {
        mongoFilter.followers.$gte = filters.minFollowers;
      }
      if (filters.maxFollowers !== undefined) {
        mongoFilter.followers.$lte = filters.maxFollowers;
      }
    }

    // Engagement rate range
    if (filters.minEngagementRate !== undefined || filters.maxEngagementRate !== undefined) {
      mongoFilter.engagement_rate = {};
      if (filters.minEngagementRate !== undefined) {
        mongoFilter.engagement_rate.$gte = filters.minEngagementRate;
      }
      if (filters.maxEngagementRate !== undefined) {
        mongoFilter.engagement_rate.$lte = filters.maxEngagementRate;
      }
    }

    // Platform filtering
    if (filters.platforms && filters.platforms.length > 0) {
      mongoFilter.platforms = {
        $in: filters.platforms.map((p) => new RegExp(p, "i")),
      };
    }

    // Verified status
    if (filters.verified !== undefined) {
      mongoFilter.verified = filters.verified;
    }

    // Price range
    if (filters.minPricePerPost !== undefined || filters.maxPricePerPost !== undefined) {
      mongoFilter.price_per_post = {};
      if (filters.minPricePerPost !== undefined) {
        mongoFilter.price_per_post.$gte = filters.minPricePerPost;
      }
      if (filters.maxPricePerPost !== undefined) {
        mongoFilter.price_per_post.$lte = filters.maxPricePerPost;
      }
    }

    // Languages filtering
    if (filters.languages && filters.languages.length > 0) {
      mongoFilter.languages = {
        $in: filters.languages.map((lang) => new RegExp(lang, "i")),
      };
    }

    // Availability filtering
    if (filters.availability) {
      mongoFilter.availability = new RegExp(filters.availability, "i");
    }

    // Rating filtering
    if (filters.minRating !== undefined) {
      mongoFilter.rating = { $gte: filters.minRating };
    }

    // Only get ACTIVE influencers with completed profiles
    mongoFilter.profile_completed = true;

    logger.info("MongoDB filter built", { mongoFilter });

    // Execute query
    const influencerProfilesCol = await collections.influencerProfiles();

    const profiles = await influencerProfilesCol
      .find(mongoFilter)
      .sort({
        engagement_rate: -1,       // Best engagement first
        followers: -1,              // More followers next
        rating: -1,                 // Higher rated
        completed_campaigns: -1,    // More experience
      })
      .limit(limit)
      .toArray();

    logger.info("Influencers found", { count: profiles.length });

    // Get user data for each influencer (to verify ACTIVE status)
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

    // Build results with safe fields only
    const results: InfluencerSearchResult[] = profiles
      .map((profile) => {
        const user = userMap.get(profile.user_id.toString());
        if (!user) return null; // Skip inactive users

        return {
          id: profile._id.toString(),
          userId: user._id.toString(),
          name: profile.full_name,
          username: profile.instagram_username || user.email?.split("@")[0] || "unknown",
          bio: `${profile.niche} influencer based in ${profile.location}`,
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
        };
      })
      .filter((result): result is InfluencerSearchResult => result !== null);

    logger.info("Search completed", { resultsCount: results.length });

    return results;
  } catch (error) {
    logger.error("Search influencers error", error);
    throw new Error(`Failed to search influencers: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Extract numeric value from string (e.g., "50k" -> 50000, "1.5m" -> 1500000)
 */
export function parseFollowerCount(input: string): number | null {
  const str = input.toLowerCase().trim();

  // Match patterns like "50k", "1.5m", "2M", "100K", etc.
  const match = str.match(/(\d+(?:\.\d+)?)\s*([km])?/);

  if (!match) return null;

  const num = parseFloat(match[1]);
  const multiplier = match[2];

  if (multiplier === "k") return Math.floor(num * 1000);
  if (multiplier === "m") return Math.floor(num * 1000000);

  return Math.floor(num);
}

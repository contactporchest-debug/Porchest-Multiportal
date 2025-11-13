import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    // Check if user is a brand
    const session = await auth();
    if (!session || session.user.role !== "brand") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { query, budget, targetAudience, categories, platform } = await req.json();

    const client = await clientPromise;
    const db = client.db("porchestDB");

    // Build filter based on criteria
    const filter: any = {};

    // Filter by platform if specified
    if (platform) {
      filter[`social_media.${platform.toLowerCase()}.followers`] = { $gt: 0 };
    }

    // Filter by categories if specified
    if (categories && categories.length > 0) {
      filter.content_categories = { $in: categories };
    }

    // Get influencer profiles
    const influencerProfiles = await db
      .collection("influencer_profiles")
      .find(filter)
      .limit(20)
      .toArray();

    // Get user data for each influencer
    const influencerIds = influencerProfiles.map((p) => p.user_id);
    const users = await db
      .collection("users")
      .find({
        _id: { $in: influencerIds },
        status: "ACTIVE",
        role: "influencer",
      })
      .toArray();

    // Create a map for quick user lookup
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    // Combine and score influencers
    const recommendations = influencerProfiles
      .map((profile) => {
        const user = userMap.get(profile.user_id.toString());
        if (!user) return null;

        // Calculate relevance score (simple algorithm)
        let score = 0;

        // Budget match
        if (budget && profile.pricing?.post) {
          if (profile.pricing.post <= budget) {
            score += 30;
          }
        }

        // Engagement rate score
        if (profile.avg_engagement_rate) {
          score += Math.min(profile.avg_engagement_rate * 10, 30);
        }

        // Follower count score
        if (profile.total_followers) {
          score += Math.min(profile.total_followers / 10000, 20);
        }

        // Rating score
        if (profile.rating) {
          score += profile.rating * 4;
        }

        // Calculate estimated ROI
        const estimatedReach = profile.total_followers || 0;
        const engagementRate = profile.avg_engagement_rate || 0;
        const estimatedEngagement = estimatedReach * (engagementRate / 100);
        const estimatedROI = profile.predicted_roi || (estimatedEngagement / (profile.pricing?.post || 1)) * 100;

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
          predictedROI: estimatedROI,
          predictedReach: estimatedReach,
          relevanceScore: score,
        };
      })
      .filter(Boolean)
      .sort((a, b) => (b?.relevanceScore || 0) - (a?.relevanceScore || 0))
      .slice(0, 12);

    return NextResponse.json({
      success: true,
      recommendations,
      total: recommendations.length,
    });
  } catch (error) {
    console.error("Influencer recommendation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

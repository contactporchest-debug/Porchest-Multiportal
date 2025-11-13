/**
 * Analytics Aggregation Utilities
 * MongoDB aggregation pipelines for real-time analytics
 */

import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export class AnalyticsService {
  /**
   * Get campaign performance metrics
   */
  static async getCampaignAnalytics(campaignId: string) {
    const client = await clientPromise;
    const db = client.db("porchestDB");

    const pipeline = [
      {
        $match: { _id: new ObjectId(campaignId) },
      },
      {
        $lookup: {
          from: "collaboration_requests",
          localField: "_id",
          foreignField: "campaign_id",
          as: "collaborations",
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "campaign_id",
          as: "posts",
        },
      },
      {
        $addFields: {
          total_collaborations: { $size: "$collaborations" },
          accepted_collaborations: {
            $size: {
              $filter: {
                input: "$collaborations",
                as: "collab",
                cond: { $eq: ["$$collab.status", "accepted"] },
              },
            },
          },
          total_posts: { $size: "$posts" },
          total_reach: { $sum: "$posts.reach" },
          total_impressions: { $sum: "$posts.impressions" },
          total_engagement: {
            $sum: {
              $add: ["$posts.likes", "$posts.comments", "$posts.shares"],
            },
          },
        },
      },
    ];

    const results = await db.collection("campaigns").aggregate(pipeline).toArray();
    return results[0] || null;
  }

  /**
   * Get influencer performance metrics
   */
  static async getInfluencerAnalytics(userId: string) {
    const client = await clientPromise;
    const db = client.db("porchestDB");

    const pipeline = [
      {
        $match: { user_id: new ObjectId(userId) },
      },
      {
        $lookup: {
          from: "collaboration_requests",
          localField: "user_id",
          foreignField: "influencer_id",
          as: "collaborations",
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "user_id",
          foreignField: "influencer_id",
          as: "posts",
        },
      },
      {
        $addFields: {
          total_campaigns: {
            $size: {
              $filter: {
                input: "$collaborations",
                as: "collab",
                cond: { $eq: ["$$collab.status", "completed"] },
              },
            },
          },
          pending_requests: {
            $size: {
              $filter: {
                input: "$collaborations",
                as: "collab",
                cond: { $eq: ["$$collab.status", "pending"] },
              },
            },
          },
          total_earnings: { $sum: "$collaborations.offer_amount" },
          avg_post_engagement: { $avg: "$posts.engagement_rate" },
          total_posts: { $size: "$posts" },
        },
      },
    ];

    const results = await db.collection("influencer_profiles").aggregate(pipeline).toArray();
    return results[0] || null;
  }

  /**
   * Get brand dashboard analytics
   */
  static async getBrandDashboard(userId: string) {
    const client = await clientPromise;
    const db = client.db("porchestDB");

    // Get campaigns summary
    const campaignStats = await db
      .collection("campaigns")
      .aggregate([
        { $match: { brand_id: new ObjectId(userId) } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            total_budget: { $sum: "$budget" },
            total_spent: { $sum: "$spent_amount" },
          },
        },
      ])
      .toArray();

    // Get collaboration stats
    const collabStats = await db
      .collection("collaboration_requests")
      .aggregate([
        { $match: { brand_id: new ObjectId(userId) } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            total_investment: { $sum: "$offer_amount" },
          },
        },
      ])
      .toArray();

    // Get overall metrics
    const overallMetrics = await db
      .collection("campaigns")
      .aggregate([
        { $match: { brand_id: new ObjectId(userId) } },
        {
          $group: {
            _id: null,
            total_campaigns: { $sum: 1 },
            total_reach: { $sum: "$metrics.total_reach" },
            total_engagement: { $sum: "$metrics.total_engagement" },
            avg_roi: { $avg: "$metrics.estimated_roi" },
          },
        },
      ])
      .toArray();

    return {
      campaigns: campaignStats,
      collaborations: collabStats,
      overall: overallMetrics[0] || {},
    };
  }

  /**
   * Get influencer growth trends (last 30 days)
   */
  static async getInfluencerGrowth(userId: string) {
    const client = await clientPromise;
    const db = client.db("porchestDB");

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const pipeline = [
      {
        $match: {
          influencer_id: new ObjectId(userId),
          created_at: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$created_at" },
          },
          followers: { $last: "$followers" },
          engagement_rate: { $avg: "$engagement_rate" },
        },
      },
      { $sort: { _id: 1 } },
    ];

    const results = await db.collection("influencer_metrics_history").aggregate(pipeline).toArray();
    return results;
  }

  /**
   * Get top performing influencers
   */
  static async getTopInfluencers(limit = 10) {
    const client = await clientPromise;
    const db = client.db("porchestDB");

    const pipeline = [
      {
        $match: {
          avg_engagement_rate: { $gt: 0 },
          total_followers: { $gt: 1000 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $match: {
          "user.status": "ACTIVE",
        },
      },
      {
        $project: {
          user_id: 1,
          full_name: "$user.full_name",
          email: "$user.email",
          total_followers: 1,
          avg_engagement_rate: 1,
          rating: 1,
          completed_campaigns: 1,
          predicted_roi: 1,
          primary_platform: 1,
          content_categories: 1,
          score: {
            $add: [
              { $multiply: ["$avg_engagement_rate", 10] },
              { $multiply: ["$rating", 10] },
              { $multiply: ["$completed_campaigns", 2] },
            ],
          },
        },
      },
      { $sort: { score: -1 } },
      { $limit: limit },
    ];

    const results = await db.collection("influencer_profiles").aggregate(pipeline).toArray();
    return results;
  }

  /**
   * Get engagement breakdown for a campaign
   */
  static async getCampaignEngagementBreakdown(campaignId: string) {
    const client = await clientPromise;
    const db = client.db("porchestDB");

    const pipeline = [
      {
        $match: { campaign_id: new ObjectId(campaignId) },
      },
      {
        $group: {
          _id: "$platform",
          total_likes: { $sum: "$likes" },
          total_comments: { $sum: "$comments" },
          total_shares: { $sum: "$shares" },
          total_saves: { $sum: "$saves" },
          post_count: { $sum: 1 },
        },
      },
    ];

    const results = await db.collection("posts").aggregate(pipeline).toArray();
    return results;
  }

  /**
   * Calculate platform-wise ROI
   */
  static async getPlatformROI(brandId: string) {
    const client = await clientPromise;
    const db = client.db("porchestDB");

    const pipeline = [
      {
        $match: { brand_id: new ObjectId(brandId) },
      },
      {
        $lookup: {
          from: "collaboration_requests",
          localField: "_id",
          foreignField: "campaign_id",
          as: "collaborations",
        },
      },
      {
        $unwind: "$collaborations",
      },
      {
        $lookup: {
          from: "influencer_profiles",
          localField: "collaborations.influencer_id",
          foreignField: "user_id",
          as: "influencer",
        },
      },
      {
        $unwind: "$influencer",
      },
      {
        $group: {
          _id: "$influencer.primary_platform",
          total_investment: { $sum: "$collaborations.offer_amount" },
          total_reach: { $sum: "$metrics.total_reach" },
          total_engagement: { $sum: "$metrics.total_engagement" },
          campaign_count: { $sum: 1 },
        },
      },
      {
        $addFields: {
          avg_roi: {
            $multiply: [
              {
                $divide: ["$total_engagement", "$total_investment"],
              },
              100,
            ],
          },
        },
      },
    ];

    const results = await db.collection("campaigns").aggregate(pipeline).toArray();
    return results;
  }
}

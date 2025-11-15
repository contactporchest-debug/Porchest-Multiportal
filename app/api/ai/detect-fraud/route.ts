import { auth } from "@/lib/auth";
import { collections, toObjectId, sanitizeDocuments } from "@/lib/db";
import {
  successResponse,
  unauthorizedResponse,
  forbiddenResponse,
  badRequestResponse,
  handleApiError,
} from "@/lib/api-response";
import { validateRequest, validateQuery } from "@/lib/validations";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { z } from "zod";

/**
 * Fraud Detection API
 * Detects suspicious activity in campaigns, influencer profiles, and engagement
 * In production, uses Isolation Forest or DBSCAN algorithms
 */

// Validation schema for fraud detection request
const fraudDetectionSchema = z.object({
  type: z.enum(["influencer_profile", "campaign", "collaboration"], {
    errorMap: () => ({ message: "Type must be 'influencer_profile', 'campaign', or 'collaboration'" }),
  }),
  entity_id: z.string().optional(),
  data: z.object({
    // Influencer profile fields
    followers: z.number().int().nonnegative().optional(),
    engagement_rate: z.number().min(0).max(100).optional(),
    follower_growth_rate: z.number().optional(),
    avg_likes: z.number().nonnegative().optional(),
    avg_comments: z.number().nonnegative().optional(),
    verified: z.boolean().optional(),

    // Campaign fields
    reach: z.number().nonnegative().optional(),
    impressions: z.number().nonnegative().optional(),
    engagement: z.number().nonnegative().optional(),
    clicks: z.number().nonnegative().optional(),
    conversions: z.number().nonnegative().optional(),
    spent_amount: z.number().nonnegative().optional(),
    duration_days: z.number().int().positive().optional(),

    // Collaboration fields
    influencer_followers: z.number().int().nonnegative().optional(),
    post_likes: z.number().nonnegative().optional(),
    post_comments: z.number().nonnegative().optional(),
    post_shares: z.number().nonnegative().optional(),
    time_to_results: z.number().nonnegative().optional(),
  }),
});

// Validation schema for GET query parameters
const getFraudDetectionsSchema = z.object({
  type: z.enum(["influencer_profile", "campaign", "collaboration"]).optional(),
  fraud: z.enum(["true", "false"]).optional(),
});

/**
 * POST /api/ai/detect-fraud
 * Detect fraud in campaigns, profiles, or collaborations (admin only)
 *
 * RATE LIMIT: 10 requests per minute per IP
 */
async function detectFraudHandler(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required");
    }

    if (session.user.role !== "admin") {
      return forbiddenResponse("Admin access required");
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = validateRequest(fraudDetectionSchema, body);

    logger.debug("Fraud detection requested", {
      type: validatedData.type,
      entityId: validatedData.entity_id,
      adminEmail: session.user.email,
    });

    // In production, call Python ML service with Isolation Forest:
    // const response = await fetch('http://ai-service:5000/detect-fraud', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ type, data })
    // });

    let fraudScore = 0;
    let flags: string[] = [];
    let severity = "low";

    // Fraud detection logic based on type
    switch (validatedData.type) {
      case "influencer_profile": {
        const {
          followers,
          engagement_rate,
          follower_growth_rate,
          avg_likes,
          avg_comments,
          verified,
        } = validatedData.data;

        // Suspicious engagement rate (too high or too low)
        if (engagement_rate !== undefined && engagement_rate > 20) {
          fraudScore += 30;
          flags.push("Unusually high engagement rate (>20%)");
        }
        if (engagement_rate !== undefined && followers !== undefined && engagement_rate < 0.5 && followers > 10000) {
          fraudScore += 20;
          flags.push("Suspiciously low engagement rate for follower count");
        }

        // Suspicious follower growth
        if (follower_growth_rate !== undefined && follower_growth_rate > 50) {
          fraudScore += 25;
          flags.push("Abnormal follower growth rate (>50% per month)");
        }

        // Engagement ratio analysis
        if (avg_comments !== undefined && avg_likes !== undefined) {
          const engagementRatio = avg_comments / (avg_likes || 1);
          if (engagementRatio < 0.01 || engagementRatio > 0.5) {
            fraudScore += 15;
            flags.push("Unusual likes-to-comments ratio");
          }
        }

        // Unverified account with high followers
        if (!verified && followers !== undefined && followers > 100000) {
          fraudScore += 10;
          flags.push("High follower count without platform verification");
        }

        break;
      }

      case "campaign": {
        const {
          reach,
          impressions,
          engagement,
          clicks,
          conversions,
          spent_amount,
          duration_days,
        } = validatedData.data;

        // Suspicious reach vs impressions
        if (reach !== undefined && impressions !== undefined) {
          const impressionRatio = impressions / (reach || 1);
          if (impressionRatio > 10) {
            fraudScore += 25;
            flags.push("Abnormally high impression-to-reach ratio");
          }
        }

        // Suspicious engagement rate
        if (engagement !== undefined && reach !== undefined && reach > 0) {
          const campaignEngagementRate = (engagement / reach) * 100;
          if (campaignEngagementRate > 25) {
            fraudScore += 30;
            flags.push("Suspiciously high campaign engagement rate");
          }
        }

        // Suspicious click-through rate
        if (clicks !== undefined && impressions !== undefined && impressions > 0) {
          const ctr = (clicks / impressions) * 100;
          if (ctr > 10) {
            fraudScore += 20;
            flags.push("Unusually high click-through rate (>10%)");
          }
        }

        // Suspicious conversion rate
        if (conversions !== undefined && clicks !== undefined && clicks > 0) {
          const conversionRate = (conversions / clicks) * 100;
          if (conversionRate > 15) {
            fraudScore += 20;
            flags.push("Abnormally high conversion rate (>15%)");
          }
        }

        // Spending pattern
        if (spent_amount !== undefined && duration_days !== undefined) {
          const dailySpend = spent_amount / (duration_days || 1);
          if (dailySpend > 10000) {
            fraudScore += 15;
            flags.push("Unusually high daily spending");
          }
        }

        break;
      }

      case "collaboration": {
        const {
          influencer_followers,
          post_likes,
          post_comments,
          post_shares,
          time_to_results,
        } = validatedData.data;

        // Engagement consistency check
        if (post_likes !== undefined && influencer_followers !== undefined && influencer_followers > 0) {
          const likeRatio = post_likes / influencer_followers;
          if (likeRatio > 0.3) {
            fraudScore += 30;
            flags.push("Post likes exceed 30% of follower count");
          }
        }

        // Comment quality (in production, use NLP)
        if (post_comments !== undefined && post_likes !== undefined && post_likes > 0) {
          if (post_comments > post_likes * 0.5) {
            fraudScore += 20;
            flags.push("Unusually high comment-to-like ratio");
          }
        }

        // Instant results (bot-like behavior)
        if (time_to_results !== undefined && time_to_results < 60) {
          // Less than 1 hour
          fraudScore += 35;
          flags.push("Results achieved suspiciously fast (<1 hour)");
        }

        break;
      }
    }

    // Determine severity
    if (fraudScore >= 70) {
      severity = "critical";
    } else if (fraudScore >= 50) {
      severity = "high";
    } else if (fraudScore >= 30) {
      severity = "medium";
    }

    const isFraud = fraudScore >= 50;

    // Log fraud detection result
    const fraudDetectionsCollection = await collections.fraudDetections();

    await fraudDetectionsCollection.insertOne({
      entity_type: validatedData.type,
      entity_id: validatedData.entity_id ? toObjectId(validatedData.entity_id) : null,
      fraud_score: fraudScore,
      is_fraud: isFraud,
      severity,
      flags,
      data: validatedData.data,
      detected_by: "ai_system",
      detected_at: new Date(),
    } as any);

    logger.info("Fraud detection completed", {
      type: validatedData.type,
      entityId: validatedData.entity_id,
      fraudScore,
      isFraud,
      severity,
      flagsCount: flags.length,
    });

    return successResponse({
      fraud_detected: isFraud,
      fraud_score: fraudScore,
      severity,
      flags,
      recommendation:
        fraudScore >= 70
          ? "URGENT: High fraud probability - Suspend immediately"
          : fraudScore >= 50
          ? "WARNING: Moderate fraud probability - Investigate"
          : fraudScore >= 30
          ? "CAUTION: Some suspicious patterns detected - Monitor closely"
          : "SAFE: No significant fraud indicators",
      note: "Using rule-based detection. In production, integrate Isolation Forest/DBSCAN model trained on fraud patterns.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * GET /api/ai/detect-fraud
 * View fraud detection history (admin only)
 *
 * RATE LIMIT: 100 requests per minute per IP
 */
async function getFraudDetectionsHandler(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required");
    }

    if (session.user.role !== "admin") {
      return forbiddenResponse("Admin access required");
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(req.url);
    const queryParams = validateQuery(getFraudDetectionsSchema, searchParams);

    // Build filter
    const filter: any = {};
    if (queryParams.type) {
      filter.entity_type = queryParams.type;
    }
    if (queryParams.fraud === "true") {
      filter.is_fraud = true;
    }

    const fraudDetectionsCollection = await collections.fraudDetections();

    const detections = await fraudDetectionsCollection
      .find(filter)
      .sort({ detected_at: -1 })
      .limit(100)
      .toArray();

    logger.debug("Fraud detections retrieved", {
      count: detections.length,
      filter: queryParams,
    });

    // Sanitize documents
    const sanitized = sanitizeDocuments(detections);

    return successResponse({
      detections: sanitized,
      total: detections.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Export with rate limiting applied
export const POST = withRateLimit(detectFraudHandler, RATE_LIMIT_CONFIGS.ai);
export const GET = withRateLimit(getFraudDetectionsHandler, RATE_LIMIT_CONFIGS.admin);

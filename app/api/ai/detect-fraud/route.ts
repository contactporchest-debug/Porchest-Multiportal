import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/**
 * Fraud Detection API
 * Detects suspicious activity in campaigns, influencer profiles, and engagement
 * In production, uses Isolation Forest or DBSCAN algorithms
 */

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admin only" }, { status: 403 });
    }

    const { type, data, entity_id } = await req.json();

    if (!type || !data) {
      return NextResponse.json(
        { error: "Type and data are required" },
        { status: 400 }
      );
    }

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
    switch (type) {
      case "influencer_profile": {
        const {
          followers,
          engagement_rate,
          follower_growth_rate,
          avg_likes,
          avg_comments,
          verified,
        } = data;

        // Suspicious engagement rate (too high or too low)
        if (engagement_rate > 20) {
          fraudScore += 30;
          flags.push("Unusually high engagement rate (>20%)");
        }
        if (engagement_rate < 0.5 && followers > 10000) {
          fraudScore += 20;
          flags.push("Suspiciously low engagement rate for follower count");
        }

        // Suspicious follower growth
        if (follower_growth_rate > 50) {
          fraudScore += 25;
          flags.push("Abnormal follower growth rate (>50% per month)");
        }

        // Engagement ratio analysis
        const engagementRatio = avg_comments / (avg_likes || 1);
        if (engagementRatio < 0.01 || engagementRatio > 0.5) {
          fraudScore += 15;
          flags.push("Unusual likes-to-comments ratio");
        }

        // Unverified account with high followers
        if (!verified && followers > 100000) {
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
        } = data;

        // Suspicious reach vs impressions
        const impressionRatio = impressions / (reach || 1);
        if (impressionRatio > 10) {
          fraudScore += 25;
          flags.push("Abnormally high impression-to-reach ratio");
        }

        // Suspicious engagement rate
        const campaignEngagementRate = (engagement / reach) * 100;
        if (campaignEngagementRate > 25) {
          fraudScore += 30;
          flags.push("Suspiciously high campaign engagement rate");
        }

        // Suspicious click-through rate
        const ctr = (clicks / impressions) * 100;
        if (ctr > 10) {
          fraudScore += 20;
          flags.push("Unusually high click-through rate (>10%)");
        }

        // Suspicious conversion rate
        const conversionRate = (conversions / clicks) * 100;
        if (conversionRate > 15) {
          fraudScore += 20;
          flags.push("Abnormally high conversion rate (>15%)");
        }

        // Spending pattern
        const dailySpend = spent_amount / (duration_days || 1);
        if (dailySpend > 10000) {
          fraudScore += 15;
          flags.push("Unusually high daily spending");
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
        } = data;

        // Engagement consistency check
        const likeRatio = post_likes / influencer_followers;
        if (likeRatio > 0.3) {
          fraudScore += 30;
          flags.push("Post likes exceed 30% of follower count");
        }

        // Comment quality (in production, use NLP)
        if (post_comments > post_likes * 0.5) {
          fraudScore += 20;
          flags.push("Unusually high comment-to-like ratio");
        }

        // Instant results (bot-like behavior)
        if (time_to_results < 60) {
          // Less than 1 hour
          fraudScore += 35;
          flags.push("Results achieved suspiciously fast (<1 hour)");
        }

        break;
      }

      default:
        return NextResponse.json(
          { error: "Invalid fraud detection type" },
          { status: 400 }
        );
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
    const client = await clientPromise;
    const db = client.db("porchestDB");

    await db.collection("fraud_detections").insertOne({
      entity_type: type,
      entity_id: entity_id ? new ObjectId(entity_id) : null,
      fraud_score: fraudScore,
      is_fraud: isFraud,
      severity,
      flags,
      data,
      detected_by: "ai_system",
      detected_at: new Date(),
    });

    return NextResponse.json({
      success: true,
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
    console.error("Fraud detection error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - View fraud detection history
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const entityType = searchParams.get("type");
    const onlyFraud = searchParams.get("fraud") === "true";

    const client = await clientPromise;
    const db = client.db("porchestDB");

    let filter: any = {};
    if (entityType) filter.entity_type = entityType;
    if (onlyFraud) filter.is_fraud = true;

    const detections = await db
      .collection("fraud_detections")
      .find(filter)
      .sort({ detected_at: -1 })
      .limit(100)
      .toArray();

    return NextResponse.json({
      success: true,
      detections: detections.map((d) => ({
        ...d,
        _id: d._id.toString(),
        entity_id: d.entity_id?.toString(),
      })),
      total: detections.length,
    });
  } catch (error) {
    console.error("Get fraud detections error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

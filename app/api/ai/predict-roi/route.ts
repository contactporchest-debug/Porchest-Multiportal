import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * ROI Prediction API
 * Predicts campaign ROI based on influencer metrics and campaign details
 * In production, this would use XGBoost or Random Forest model
 */

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !["brand", "admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const {
      followers,
      engagement_rate,
      post_count,
      campaign_budget,
      campaign_duration_days,
      influencer_rating,
      past_campaign_count,
      platform,
      content_category,
    } = await req.json();

    if (!followers || !engagement_rate || !campaign_budget) {
      return NextResponse.json(
        { error: "Followers, engagement rate, and budget are required" },
        { status: 400 }
      );
    }

    // In production, call Python ML service:
    // const response = await fetch('http://ai-service:5000/predict-roi', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ followers, engagement_rate, ... })
    // });

    // Simple rule-based ROI calculation
    const calculateROI = () => {
      // Base reach calculation
      const estimatedReach = followers * 0.3; // 30% of followers typically see posts
      const estimatedEngagement = estimatedReach * (engagement_rate / 100);

      // Platform multipliers
      const platformMultipliers: { [key: string]: number } = {
        instagram: 1.2,
        tiktok: 1.5,
        youtube: 1.8,
        twitter: 0.9,
        facebook: 0.8,
      };
      const platformMultiplier = platformMultipliers[platform?.toLowerCase()] || 1.0;

      // Category multipliers
      const categoryMultipliers: { [key: string]: number } = {
        fashion: 1.3,
        beauty: 1.4,
        tech: 1.5,
        fitness: 1.2,
        food: 1.1,
        travel: 1.0,
        gaming: 1.3,
      };
      const categoryMultiplier = categoryMultipliers[content_category?.toLowerCase()] || 1.0;

      // Quality score based on rating and past performance
      const qualityScore = (influencer_rating || 3.5) / 5.0;
      const experienceBonus = Math.min((past_campaign_count || 0) * 0.05, 0.5);

      // Estimated conversions (2-5% of engaged users)
      const conversionRate = 0.02 + (qualityScore * 0.03);
      const estimatedConversions = estimatedEngagement * conversionRate;

      // Average order value assumption ($50-200)
      const avgOrderValue = 100 + (qualityScore * 100);
      const estimatedRevenue = estimatedConversions * avgOrderValue;

      // Calculate ROI
      const roi = ((estimatedRevenue - campaign_budget) / campaign_budget) * 100;

      // Apply multipliers
      const adjustedROI = roi * platformMultiplier * categoryMultiplier * (1 + experienceBonus);

      return {
        estimated_reach: Math.round(estimatedReach),
        estimated_engagement: Math.round(estimatedEngagement),
        estimated_conversions: Math.round(estimatedConversions),
        estimated_revenue: Math.round(estimatedRevenue),
        predicted_roi: Math.round(adjustedROI * 10) / 10,
        confidence_score: 0.70 + (qualityScore * 0.2),
        breakdown: {
          base_roi: Math.round(roi),
          platform_boost: Math.round((platformMultiplier - 1) * 100),
          category_boost: Math.round((categoryMultiplier - 1) * 100),
          experience_boost: Math.round(experienceBonus * 100),
        },
      };
    };

    const prediction = calculateROI();

    // Risk assessment
    const riskLevel =
      prediction.predicted_roi > 200
        ? "low"
        : prediction.predicted_roi > 100
        ? "medium"
        : "high";

    const recommendation =
      prediction.predicted_roi > 150
        ? "Highly recommended - Strong ROI potential"
        : prediction.predicted_roi > 100
        ? "Recommended - Good ROI potential"
        : prediction.predicted_roi > 50
        ? "Consider - Moderate ROI potential"
        : "Not recommended - Low ROI potential";

    return NextResponse.json({
      success: true,
      ...prediction,
      risk_level: riskLevel,
      recommendation,
      note: "Using statistical model. In production, integrate XGBoost/Random Forest trained on historical data.",
    });
  } catch (error) {
    console.error("ROI prediction error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

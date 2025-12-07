/**
 * Deterministic Influencer Results Formatting
 * Build formatted list WITHOUT Gemini hallucination
 */

import type { InfluencerSearchResult } from "@/lib/searchInfluencersRobust";
import type { SearchCriteria } from "@/lib/extractCriteriaWithGemini";

/**
 * Format influencer results as a deterministic string list
 * This prevents AI from inventing influencer data
 */
export function formatInfluencerList(
  influencers: InfluencerSearchResult[]
): string {
  if (influencers.length === 0) {
    return "No influencers found.";
  }

  let formatted = `Found ${influencers.length} influencer${influencers.length === 1 ? "" : "s"}:\n\n`;

  influencers.forEach((inf, index) => {
    const followers = formatNumber(inf.followers);
    const engagement = inf.engagementRate.toFixed(1);
    const platforms = inf.platforms.join(", ");
    const verified = inf.isVerified ? " ✓" : "";
    const price = inf.pricePerPost > 0 ? ` | $${inf.pricePerPost}/post` : "";

    formatted += `${index + 1}. **${inf.name}** (@${inf.username})${verified}\n`;
    formatted += `   📍 ${inf.location} | 🎯 ${inf.niche}\n`;
    formatted += `   👥 ${followers} followers | 💬 ${engagement}% engagement\n`;
    formatted += `   📱 ${platforms}${price}\n`;

    if (inf.completedCampaigns > 0) {
      formatted += `   ⭐ ${inf.rating.toFixed(1)}/5 rating | ${inf.completedCampaigns} campaigns completed\n`;
    }

    formatted += "\n";
  });

  return formatted.trim();
}

/**
 * Format criteria summary for transparency
 */
export function formatCriteriaSummary(criteria: SearchCriteria): string {
  const parts: string[] = [];

  if (criteria.category) {
    parts.push(`Category: ${criteria.category}`);
  }

  if (criteria.location) {
    parts.push(`Location: ${criteria.location}`);
  }

  if (criteria.minFollowers || criteria.maxFollowers) {
    if (criteria.minFollowers && criteria.maxFollowers) {
      parts.push(
        `Followers: ${formatNumber(criteria.minFollowers)} - ${formatNumber(criteria.maxFollowers)}`
      );
    } else if (criteria.minFollowers) {
      parts.push(`Followers: ${formatNumber(criteria.minFollowers)}+`);
    } else if (criteria.maxFollowers) {
      parts.push(`Followers: up to ${formatNumber(criteria.maxFollowers)}`);
    }
  }

  if (criteria.minEngagement) {
    parts.push(`Min Engagement: ${criteria.minEngagement}%`);
  }

  if (criteria.platforms && criteria.platforms.length > 0) {
    parts.push(`Platforms: ${criteria.platforms.join(", ")}`);
  }

  if (criteria.verified) {
    parts.push("Verified only");
  }

  return parts.length > 0 ? parts.join(" | ") : "No specific criteria";
}

/**
 * Format number with K/M suffix
 */
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + "K";
  }
  return num.toString();
}

/**
 * Generate follow-up questions when filters are missing
 */
export function generateFollowUpQuestions(criteria: SearchCriteria): string[] {
  const questions: string[] = [];

  if (!criteria.category) {
    questions.push("What category or niche are you interested in? (e.g., Fashion, Tech, Beauty, Fitness)");
  }

  if (!criteria.location) {
    questions.push("Which location or region do you prefer?");
  }

  if (!criteria.minFollowers && !criteria.maxFollowers) {
    questions.push("What's your ideal follower count range?");
  }

  if (!criteria.platforms || criteria.platforms.length === 0) {
    questions.push("Which platform? (Instagram, YouTube, TikTok)");
  }

  return questions.slice(0, 2); // Max 2 questions
}

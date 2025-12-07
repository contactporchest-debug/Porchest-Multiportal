import OpenAI from "openai";

// Lazy initialization of OpenAI client
let openai: OpenAI | null = null;

function getOpenAIClient() {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        "OPENAI_API_KEY is not set. Please add it to your environment variables."
      );
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

export interface InfluencerCriteria {
  industry?: string[];
  minFollowers?: number;
  maxFollowers?: number;
  minEngagementRate?: number;
  maxEngagementRate?: number;
  location?: string[];
  language?: string[];
  budget?: number;
  platform?: string;
  gender?: string;
  ageRange?: string;
  contentStyle?: string[];
  brandValues?: string[];
  campaignType?: string;
}

/**
 * Parses plain English brand requirements into structured criteria using OpenAI
 * @param plainEnglishQuery - Natural language description of requirements
 * @returns Structured criteria object
 */
export async function parseInfluencerRequirements(
  plainEnglishQuery: string
): Promise<InfluencerCriteria> {
  try {
    const systemPrompt = `You are an AI assistant that helps brands find influencers.
Your job is to extract structured criteria from plain English requirements.

Extract the following fields from the user's query:
- industry: array of content industries - MUST be one or more of: Fitness, Food, Fashion, Family, Vlogging, Entertainment, Educational, Comedy, Music
- minFollowers: minimum follower count (number)
- maxFollowers: maximum follower count (number)
- minEngagementRate: minimum engagement rate percentage (number, e.g., 3.5 for 3.5%)
- maxEngagementRate: maximum engagement rate percentage (number)
- location: array of locations/countries (e.g., ["United States", "Pakistan"])
- language: array of languages (e.g., ["English", "Urdu"])
- budget: maximum budget per post in USD (number)
- platform: preferred social media platform (e.g., "instagram", "youtube", "tiktok")
- gender: preferred gender (e.g., "female", "male", "any")
- ageRange: age range of influencer (e.g., "18-25", "25-35")
- contentStyle: array of content style preferences (e.g., ["Professional", "Casual", "Humorous"])
- brandValues: array of brand values or themes (e.g., ["Sustainability", "Innovation"])
- campaignType: type of campaign (e.g., "Product Launch", "Brand Awareness", "Giveaway")

Only include fields that are explicitly mentioned or can be reasonably inferred from the query.
Return the result as a JSON object. Use null for fields that aren't specified.

Examples:
Query: "I need a beauty influencer in Pakistan with at least 50k followers for a makeup campaign"
Response: {"industry": ["Fashion"], "minFollowers": 50000, "location": ["Pakistan"], "campaignType": "Product Launch"}

Query: "Looking for tech YouTubers with 100k-500k subscribers and good engagement for a gadget review"
Response: {"industry": ["Educational"], "platform": "youtube", "minFollowers": 100000, "maxFollowers": 500000, "minEngagementRate": 3, "campaignType": "Product Review"}

Query: "Need female fashion influencers aged 20-30 in the US who speak English, budget is $500 per post"
Response: {"industry": ["Fashion"], "gender": "female", "ageRange": "20-30", "location": ["United States"], "language": ["English"], "budget": 500}`;

    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: plainEnglishQuery,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const criteria: InfluencerCriteria = JSON.parse(content);

    // Clean up null values
    Object.keys(criteria).forEach((key) => {
      if (criteria[key as keyof InfluencerCriteria] === null) {
        delete criteria[key as keyof InfluencerCriteria];
      }
    });

    return criteria;
  } catch (error: any) {
    console.error("Error parsing influencer requirements:", error);
    throw new Error(
      `Failed to parse requirements: ${error.message || "Unknown error"}`
    );
  }
}

/**
 * Generates a MongoDB filter from structured criteria
 * @param criteria - Structured influencer criteria
 * @returns MongoDB filter object
 */
export function buildMongoFilter(criteria: InfluencerCriteria): Record<string, any> {
  const filter: Record<string, any> = {};

  // Industry filter
  if (criteria.industry && criteria.industry.length > 0) {
    filter.industry = { $in: criteria.industry };
  }

  // Follower count filter (checking Instagram followers specifically)
  if (criteria.minFollowers !== undefined || criteria.maxFollowers !== undefined) {
    const followersFilter: Record<string, any> = {};
    if (criteria.minFollowers !== undefined) {
      followersFilter.$gte = criteria.minFollowers;
    }
    if (criteria.maxFollowers !== undefined) {
      followersFilter.$lte = criteria.maxFollowers;
    }

    // Check based on platform or use total followers
    if (criteria.platform === "instagram") {
      filter["instagram_metrics.followers_count"] = followersFilter;
    } else {
      filter.total_followers = followersFilter;
    }
  }

  // Engagement rate filter
  if (criteria.minEngagementRate !== undefined || criteria.maxEngagementRate !== undefined) {
    const engagementFilter: Record<string, any> = {};
    if (criteria.minEngagementRate !== undefined) {
      engagementFilter.$gte = criteria.minEngagementRate;
    }
    if (criteria.maxEngagementRate !== undefined) {
      engagementFilter.$lte = criteria.maxEngagementRate;
    }

    if (criteria.platform === "instagram") {
      filter["calculated_metrics.engagement_rate_30_days"] = engagementFilter;
    } else {
      filter.avg_engagement_rate = engagementFilter;
    }
  }

  // Location filter
  if (criteria.location && criteria.location.length > 0) {
    filter.location = { $in: criteria.location };
  }

  // Language filter
  if (criteria.language && criteria.language.length > 0) {
    filter.languages = { $in: criteria.language };
  }

  return filter;
}

/**
 * Calculates a relevance score for an influencer based on criteria match
 * @param influencer - Influencer profile data
 * @param criteria - Search criteria
 * @returns Relevance score (0-100)
 */
export function calculateRelevanceScore(
  influencer: any,
  criteria: InfluencerCriteria
): number {
  let score = 0;
  let totalWeight = 0;

  // Industry match (weight: 25)
  if (criteria.industry && criteria.industry.length > 0) {
    totalWeight += 25;
    if (criteria.industry.includes(influencer.industry || influencer.niche)) {
      score += 25;
    }
  }

  // Follower count match (weight: 20)
  if (criteria.minFollowers !== undefined || criteria.maxFollowers !== undefined) {
    totalWeight += 20;
    const followers = influencer.instagram_metrics?.followers_count || influencer.total_followers || 0;

    const min = criteria.minFollowers || 0;
    const max = criteria.maxFollowers || Number.MAX_SAFE_INTEGER;

    if (followers >= min && followers <= max) {
      score += 20;
    } else {
      // Partial score if close
      const distance = Math.min(Math.abs(followers - min), Math.abs(followers - max));
      const relativeDistance = distance / max;
      if (relativeDistance < 0.5) {
        score += 10;
      }
    }
  }

  // Engagement rate match (weight: 20)
  if (criteria.minEngagementRate !== undefined) {
    totalWeight += 20;
    const engagementRate =
      influencer.calculated_metrics?.engagement_rate_30_days ||
      influencer.avg_engagement_rate ||
      0;

    if (engagementRate >= criteria.minEngagementRate) {
      score += 20;
    } else if (engagementRate >= criteria.minEngagementRate * 0.8) {
      score += 10;
    }
  }

  // Location match (weight: 15)
  if (criteria.location && criteria.location.length > 0) {
    totalWeight += 15;
    if (criteria.location.some(loc =>
      influencer.location?.toLowerCase().includes(loc.toLowerCase())
    )) {
      score += 15;
    }
  }

  // Language match (weight: 10)
  if (criteria.language && criteria.language.length > 0) {
    totalWeight += 10;
    const matchingLanguages = criteria.language.filter(lang =>
      influencer.languages?.includes(lang)
    );
    if (matchingLanguages.length > 0) {
      score += 10 * (matchingLanguages.length / criteria.language.length);
    }
  }

  // Budget match (weight: 10)
  if (criteria.budget !== undefined) {
    totalWeight += 10;
    const rate = influencer.pricing?.post || influencer.rate || 0;
    if (rate <= criteria.budget) {
      score += 10;
    } else if (rate <= criteria.budget * 1.2) {
      score += 5;
    }
  }

  // If no criteria specified, return base score of 50
  if (totalWeight === 0) {
    return 50;
  }

  // Normalize score to 0-100
  return Math.round((score / totalWeight) * 100);
}

/**
 * FREE Alternative: Rule-based requirement parser (no OpenAI needed)
 * Extracts structured criteria from plain English using pattern matching
 */

export interface InfluencerCriteria {
  industry?: string[];
  niche?: string[]; // Keep for backward compatibility during transition
  minFollowers?: number;
  maxFollowers?: number;
  minEngagementRate?: number;
  location?: string[];
  language?: string[];
  budget?: number;
  platform?: string;
  gender?: string;
}

/**
 * Parse plain English requirements without AI (FREE)
 */
export function parseRequirementsFree(query: string): InfluencerCriteria {
  const criteria: InfluencerCriteria = {};
  const lowerQuery = query.toLowerCase();

  // Extract industry/categories (using the 9 fixed industries)
  const industries = ["fitness", "food", "fashion", "family", "vlogging", "entertainment", "educational", "comedy", "music"];
  const foundIndustries = industries.filter(ind => lowerQuery.includes(ind));

  // Capitalize first letter of each industry
  criteria.industry = foundIndustries.map(ind => ind.charAt(0).toUpperCase() + ind.slice(1));

  // Extract follower counts
  const followerPatterns = [
    /(\d+)k[\s\-]*(?:to|-)[\s\-]*(\d+)k/i,  // "50k-100k" or "50k to 100k"
    /(?:at least|minimum|min|above)\s+(\d+)k/i,  // "at least 50k"
    /(?:under|below|max|maximum)\s+(\d+)k/i,      // "under 100k"
    /(\d+)k\+/i,                                   // "50k+"
  ];

  const rangeMatch = lowerQuery.match(followerPatterns[0]);
  if (rangeMatch) {
    criteria.minFollowers = parseInt(rangeMatch[1]) * 1000;
    criteria.maxFollowers = parseInt(rangeMatch[2]) * 1000;
  } else {
    const minMatch = lowerQuery.match(followerPatterns[1]);
    if (minMatch) {
      criteria.minFollowers = parseInt(minMatch[1]) * 1000;
    }
    const maxMatch = lowerQuery.match(followerPatterns[2]);
    if (maxMatch) {
      criteria.maxFollowers = parseInt(maxMatch[1]) * 1000;
    }
    const plusMatch = lowerQuery.match(followerPatterns[3]);
    if (plusMatch) {
      criteria.minFollowers = parseInt(plusMatch[1]) * 1000;
    }
  }

  // Extract engagement rate
  const engagementMatch = lowerQuery.match(/(\d+)%?\s+engagement/i);
  if (engagementMatch) {
    criteria.minEngagementRate = parseInt(engagementMatch[1]);
  }

  // Extract location/country
  const locations = ["pakistan", "usa", "us", "united states", "uk", "india", "canada", "lahore", "karachi", "islamabad"];
  const foundLocations = locations.filter(loc => lowerQuery.includes(loc));
  if (foundLocations.length > 0) {
    criteria.location = foundLocations.map(loc => {
      if (loc === "usa" || loc === "us") return "United States";
      if (loc === "uk") return "United Kingdom";
      return loc.charAt(0).toUpperCase() + loc.slice(1);
    });
  }

  // Extract languages
  const languages = ["english", "urdu", "punjabi", "hindi", "arabic", "spanish"];
  const foundLanguages = languages.filter(lang => lowerQuery.includes(lang));
  if (foundLanguages.length > 0) {
    criteria.language = foundLanguages.map(lang => lang.charAt(0).toUpperCase() + lang.slice(1));
  }

  // Extract budget
  const budgetMatch = lowerQuery.match(/\$(\d+)/);
  if (budgetMatch) {
    criteria.budget = parseInt(budgetMatch[1]);
  }

  // Extract platform
  if (lowerQuery.includes("instagram") || lowerQuery.includes("insta")) {
    criteria.platform = "instagram";
  } else if (lowerQuery.includes("youtube") || lowerQuery.includes("yt")) {
    criteria.platform = "youtube";
  } else if (lowerQuery.includes("tiktok")) {
    criteria.platform = "tiktok";
  }

  // Extract gender
  if (lowerQuery.includes("female") || lowerQuery.includes("women")) {
    criteria.gender = "female";
  } else if (lowerQuery.includes("male") || lowerQuery.includes("men")) {
    criteria.gender = "male";
  }

  return criteria;
}

/**
 * Example usage:
 *
 * const query = "I need fashion influencers in Pakistan with 50k+ followers who speak Urdu, budget $300";
 * const criteria = parseRequirementsFree(query);
 *
 * Result:
 * {
 *   industry: ["Fashion"],
 *   minFollowers: 50000,
 *   location: ["Pakistan"],
 *   language: ["Urdu"],
 *   budget: 300
 * }
 */

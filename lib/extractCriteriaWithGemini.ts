/**
 * Criteria Extraction with Gemini + Zod Validation
 * 2-step extraction: Gemini JSON → Zod validation → Regex fallback
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { logger } from "@/lib/logger";

// ============================================================================
// ZOD SCHEMA
// ============================================================================

export const SearchCriteriaSchema = z.object({
  category: z.string().optional(),
  location: z.string().optional(),
  minFollowers: z.number().optional(),
  maxFollowers: z.number().optional(),
  minEngagement: z.number().optional(),
  platforms: z.array(z.string()).optional(),
  verified: z.boolean().optional(),
});

export type SearchCriteria = z.infer<typeof SearchCriteriaSchema>;

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

// ============================================================================
// GEMINI EXTRACTION
// ============================================================================

const EXTRACTION_SYSTEM_PROMPT = `You are a criteria extraction AI.
Extract influencer search criteria from the user's message and conversation history.

**CRITICAL RULES:**
1. Return ONLY valid JSON - NO markdown, NO explanations
2. Use EXACT field names: category, location, minFollowers, maxFollowers, minEngagement, platforms, verified
3. Convert follower text to numbers: "50k" = 50000, "1.5m" = 1500000
4. Platforms array: ["Instagram"], ["YouTube"], ["TikTok"] or combinations
5. If user doesn't mention a field, omit it from JSON

**Examples:**
User: "Find fashion influencers in NYC with 100k followers"
Output: {"category":"Fashion","location":"New York","minFollowers":100000,"platforms":["Instagram"]}

User: "Show me verified tech creators"
Output: {"category":"Tech","verified":true}

User: "Influencers in Pakistan with good engagement"
Output: {"location":"Pakistan","minEngagement":3.0}

Return ONLY the JSON object, nothing else.`;

/**
 * Extract criteria using Gemini with strict JSON validation
 */
export async function extractCriteriaWithGemini(
  message: string,
  chatHistory: ChatMessage[] = []
): Promise<SearchCriteria> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    logger.warn("GEMINI_API_KEY not set, using regex fallback");
    return extractCriteriaWithRegex(message);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: EXTRACTION_SYSTEM_PROMPT,
    });

    // Build context from history
    let prompt = "";
    if (chatHistory.length > 0) {
      prompt += "Previous conversation:\n";
      chatHistory.slice(-3).forEach((msg) => {
        prompt += `${msg.role}: ${msg.text}\n`;
      });
      prompt += "\n";
    }
    prompt += `Current message: ${message}\n\nExtract criteria as JSON:`;

    logger.info("Gemini extraction started", { message });

    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text().trim();

    // Clean markdown code blocks if present
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    logger.info("Gemini raw response", { text });

    // Parse JSON
    const parsed = JSON.parse(text);

    // Validate with Zod
    const validated = SearchCriteriaSchema.parse(parsed);

    logger.info("Gemini extraction successful", { criteria: validated });

    return validated;
  } catch (error) {
    logger.error("Gemini extraction failed, using regex fallback", {
      error: error instanceof Error ? error.message : "Unknown",
    });

    // Fallback to regex
    return extractCriteriaWithRegex(message);
  }
}

// ============================================================================
// REGEX FALLBACK EXTRACTION
// ============================================================================

/**
 * Regex-based criteria extraction fallback
 */
export function extractCriteriaWithRegex(message: string): SearchCriteria {
  const lowerMsg = message.toLowerCase();
  const criteria: SearchCriteria = {};

  logger.info("Regex extraction started", { message });

  // Category extraction
  const categories = [
    "fashion",
    "tech",
    "technology",
    "beauty",
    "makeup",
    "fitness",
    "gym",
    "health",
    "travel",
    "food",
    "cooking",
    "gaming",
    "lifestyle",
    "sports",
    "music",
    "art",
    "education",
    "business",
    "finance",
    "parenting",
    "photography",
  ];

  for (const cat of categories) {
    if (lowerMsg.includes(cat)) {
      criteria.category = cat.charAt(0).toUpperCase() + cat.slice(1);
      break;
    }
  }

  // Location extraction - look for "in [location]" or "from [location]"
  const locationMatch = lowerMsg.match(/\b(?:in|from|based in|located in)\s+([a-z\s]+?)(?:\s+with|\s+who|\s+that|$)/i);
  if (locationMatch) {
    const loc = locationMatch[1].trim();
    criteria.location = loc
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  } else {
    // Try common locations
    const locations = [
      "United States",
      "USA",
      "Pakistan",
      "India",
      "United Kingdom",
      "UK",
      "Canada",
      "Australia",
      "New York",
      "Los Angeles",
      "London",
      "Dubai",
      "Karachi",
      "Lahore",
      "Mumbai",
      "Delhi",
      "California",
      "Texas",
    ];

    for (const location of locations) {
      if (lowerMsg.includes(location.toLowerCase())) {
        criteria.location = location;
        break;
      }
    }
  }

  // Follower count extraction
  // Patterns: "100k followers", "over 50k", "at least 20000", "50k-500k"

  // Range pattern: "50k-500k" or "50000-500000"
  const rangeMatch = lowerMsg.match(/(\d+\.?\d*)\s*([km])?\s*-\s*(\d+\.?\d*)\s*([km])?/i);
  if (rangeMatch) {
    criteria.minFollowers = parseFollowerCount(rangeMatch[1] + (rangeMatch[2] || ""));
    criteria.maxFollowers = parseFollowerCount(rangeMatch[3] + (rangeMatch[4] || ""));
  } else {
    // Single number patterns
    const overMatch = lowerMsg.match(/(?:over|above|more than|at least|minimum)\s+(\d+\.?\d*)\s*([km])?/i);
    if (overMatch) {
      criteria.minFollowers = parseFollowerCount(overMatch[1] + (overMatch[2] || ""));
    }

    const underMatch = lowerMsg.match(/(?:under|below|less than|maximum)\s+(\d+\.?\d*)\s*([km])?/i);
    if (underMatch) {
      criteria.maxFollowers = parseFollowerCount(underMatch[1] + (underMatch[2] || ""));
    }

    // General follower mention: "100k followers"
    if (!criteria.minFollowers && !criteria.maxFollowers) {
      const followerMatch = lowerMsg.match(/(\d+\.?\d*)\s*([km])?\s*(?:followers?|subs?|subscribers?)/i);
      if (followerMatch) {
        const count = parseFollowerCount(followerMatch[1] + (followerMatch[2] || ""));
        // If they say "100k followers", treat as minimum
        criteria.minFollowers = count;
      }
    }
  }

  // Engagement rate extraction
  const engagementMatch = lowerMsg.match(/(\d+\.?\d*)\s*%?\s*(?:engagement|engaged|engagement rate)/i);
  if (engagementMatch) {
    criteria.minEngagement = parseFloat(engagementMatch[1]);
  } else if (lowerMsg.includes("good engagement") || lowerMsg.includes("high engagement")) {
    criteria.minEngagement = 3.0; // Default good engagement
  }

  // Platform extraction
  const platforms: string[] = [];
  if (lowerMsg.includes("instagram") || lowerMsg.includes("insta")) {
    platforms.push("Instagram");
  }
  if (lowerMsg.includes("youtube") || lowerMsg.includes("yt")) {
    platforms.push("YouTube");
  }
  if (lowerMsg.includes("tiktok") || lowerMsg.includes("tik tok")) {
    platforms.push("TikTok");
  }
  if (platforms.length > 0) {
    criteria.platforms = platforms;
  }

  // Verified status
  if (lowerMsg.includes("verified") || lowerMsg.includes("blue check") || lowerMsg.includes("blue tick")) {
    criteria.verified = true;
  }

  logger.info("Regex extraction complete", { criteria });

  return criteria;
}

/**
 * Parse follower count from string
 * Examples: "50k" → 50000, "1.5m" → 1500000
 */
function parseFollowerCount(input: string): number {
  const str = input.toLowerCase().trim();
  const match = str.match(/(\d+\.?\d*)\s*([km])?/);

  if (!match) return 0;

  const num = parseFloat(match[1]);
  const multiplier = match[2];

  if (multiplier === "k") return Math.floor(num * 1000);
  if (multiplier === "m") return Math.floor(num * 1000000);

  return Math.floor(num);
}

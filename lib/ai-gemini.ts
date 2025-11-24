import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseRequirementsFree } from "./ai-helpers-free";

export interface ChatCriteria {
  niche: string[];
  platform: "instagram" | "youtube" | "tiktok" | null;
  locations: string[];
  min_followers: number | null;
  max_followers: number | null;
  min_engagement_rate: number | null;
  min_reach: number | null;
  budget: number | null;
  gender: "male" | "female" | null;
  languages: string[];
}

export interface ChatAndExtractResult {
  assistant_message: string;
  criteria_update: ChatCriteria;
  needs_followup: boolean;
  followup_questions: string[];
}

const GEMINI_SYSTEM_PROMPT = `You are a brand-to-influencer strategist.
Have a natural conversation.
Ask follow-up questions if needed.
ALSO output strict JSON in this exact format:
{
assistant_message: string,
criteria: {
niche: string[],
platform: "instagram"|"youtube"|"tiktok"|null,
locations: string[],
min_followers: number|null,
max_followers: number|null,
min_engagement_rate: number|null,
min_reach: number|null,
budget: number|null,
gender: "male"|"female"|null,
languages: string[]
},
needs_followup: boolean,
followup_questions: string[]
}
Return ONLY valid JSON. No markdown.`;

/**
 * Chat and extract criteria using Google Gemini
 * @param message - User's message
 * @param currentCriteria - Current criteria from client (or null)
 * @returns Chat result with assistant message and updated criteria
 */
export async function chatAndExtractGemini(
  message: string,
  currentCriteria: ChatCriteria | null
): Promise<ChatAndExtractResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Build context from current criteria
  const criteriaContext = currentCriteria
    ? `\n\nCurrent extracted criteria: ${JSON.stringify(currentCriteria, null, 2)}\n\nUpdate these criteria based on the new message. Preserve existing values unless the user explicitly changes them.`
    : "\n\nNo criteria extracted yet. Start fresh.";

  const prompt = `${GEMINI_SYSTEM_PROMPT}${criteriaContext}\n\nUser message: ${message}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Remove markdown code blocks if present
    let jsonText = text.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/^```json\n/, "").replace(/\n```$/, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```\n/, "").replace(/\n```$/, "");
    }

    // Parse JSON
    const parsed = JSON.parse(jsonText);

    // Validate structure
    if (!parsed.assistant_message || !parsed.criteria || typeof parsed.needs_followup !== "boolean") {
      throw new Error("Invalid response structure from Gemini");
    }

    // Ensure criteria has all required fields with defaults
    const criteria: ChatCriteria = {
      niche: parsed.criteria.niche || [],
      platform: parsed.criteria.platform || null,
      locations: parsed.criteria.locations || [],
      min_followers: parsed.criteria.min_followers ?? null,
      max_followers: parsed.criteria.max_followers ?? null,
      min_engagement_rate: parsed.criteria.min_engagement_rate ?? null,
      min_reach: parsed.criteria.min_reach ?? null,
      budget: parsed.criteria.budget ?? null,
      gender: parsed.criteria.gender || null,
      languages: parsed.criteria.languages || [],
    };

    return {
      assistant_message: parsed.assistant_message,
      criteria_update: criteria,
      needs_followup: parsed.needs_followup,
      followup_questions: parsed.followup_questions || [],
    };
  } catch (error: any) {
    console.error("Gemini API error:", error);
    throw new Error(`Gemini parsing failed: ${error.message}`);
  }
}

/**
 * Detect if message is a greeting or small talk
 */
function isGreeting(message: string): boolean {
  const lowerMsg = message.toLowerCase().trim();
  const greetingPatterns = /^(hi|hello|hey|assalam|salam|good morning|good evening|good afternoon|thanks|thank you|how are you|what's up|whats up|howdy)\b/i;
  return greetingPatterns.test(lowerMsg);
}

/**
 * Fallback: Use regex parser + hardcoded friendly responses
 */
export function chatAndExtractFallback(
  message: string,
  currentCriteria: ChatCriteria | null
): ChatAndExtractResult {
  // Check for greetings first
  if (isGreeting(message)) {
    return {
      assistant_message: "Hello! 👋 I'm here to help you find the perfect influencers for your brand campaign.\n\nTo get started, please tell me:\n• What niche or category? (e.g., Fashion, Tech, Beauty, Fitness)\n• Which location? (e.g., United States, Pakistan, India)\n• Follower range? (e.g., 50k-500k)\n• Your budget per post? (e.g., $500)\n• Preferred platform? (Instagram, YouTube, TikTok)",
      criteria_update: {
        niche: [],
        platform: null,
        locations: [],
        min_followers: null,
        max_followers: null,
        min_engagement_rate: null,
        min_reach: null,
        budget: null,
        gender: null,
        languages: [],
      },
      needs_followup: true,
      followup_questions: [
        "What niche or category are you interested in? (e.g., Fashion, Tech, Beauty)",
        "Which location do you prefer?",
        "What's your ideal follower count range?",
        "What's your budget per post?",
        "Which platform would you prefer? (Instagram, YouTube, TikTok)"
      ],
    };
  }

  // Use existing regex parser
  const parsed = parseRequirementsFree(message);

  // Convert to ChatCriteria format
  const newCriteria: ChatCriteria = {
    niche: parsed.niche || [],
    platform: (parsed.platform as any) || null,
    locations: parsed.location || [],
    min_followers: parsed.minFollowers || null,
    max_followers: parsed.maxFollowers || null,
    min_engagement_rate: parsed.minEngagementRate || null,
    min_reach: null,
    budget: parsed.budget || null,
    gender: (parsed.gender as any) || null,
    languages: parsed.language || [],
  };

  // Merge with current criteria
  const mergedCriteria: ChatCriteria = currentCriteria
    ? {
        niche: newCriteria.niche.length > 0 ? [...new Set([...currentCriteria.niche, ...newCriteria.niche])] : currentCriteria.niche,
        platform: newCriteria.platform || currentCriteria.platform,
        locations: newCriteria.locations.length > 0 ? [...new Set([...currentCriteria.locations, ...newCriteria.locations])] : currentCriteria.locations,
        min_followers: newCriteria.min_followers ?? currentCriteria.min_followers,
        max_followers: newCriteria.max_followers ?? currentCriteria.max_followers,
        min_engagement_rate: newCriteria.min_engagement_rate ?? currentCriteria.min_engagement_rate,
        min_reach: newCriteria.min_reach ?? currentCriteria.min_reach,
        budget: newCriteria.budget ?? currentCriteria.budget,
        gender: newCriteria.gender || currentCriteria.gender,
        languages: newCriteria.languages.length > 0 ? [...new Set([...currentCriteria.languages, ...newCriteria.languages])] : currentCriteria.languages,
      }
    : newCriteria;

  // Generate friendly response
  let assistantMessage = "Got it! ";
  const parts: string[] = [];

  if (mergedCriteria.niche.length > 0) {
    parts.push(`I'll look for ${mergedCriteria.niche.join(", ")} influencers`);
  }
  if (mergedCriteria.platform) {
    parts.push(`on ${mergedCriteria.platform}`);
  }
  if (mergedCriteria.min_followers) {
    parts.push(`with at least ${(mergedCriteria.min_followers / 1000).toFixed(0)}k followers`);
  }
  if (mergedCriteria.locations.length > 0) {
    parts.push(`in ${mergedCriteria.locations.join(", ")}`);
  }
  if (mergedCriteria.budget) {
    parts.push(`within your $${mergedCriteria.budget} budget`);
  }

  if (parts.length > 0) {
    assistantMessage += parts.join(" ") + ". ";
  } else {
    // No criteria found - ask for requirements
    assistantMessage = "I'd love to help you find the perfect influencers! Please share your requirements:\n\n• What niche or category? (e.g., Fashion, Tech, Beauty, Fitness)\n• Which location?\n• Follower range?\n• Your budget per post?\n• Preferred platform? (Instagram, YouTube, TikTok)";
  }

  // Check if we have enough criteria
  const hasEnoughCriteria =
    mergedCriteria.niche.length > 0 || mergedCriteria.min_followers !== null;

  const needsFollowup = !hasEnoughCriteria;
  const followupQuestions: string[] = [];

  if (mergedCriteria.niche.length === 0) {
    followupQuestions.push("What niche or category are you interested in? (e.g., Fashion, Tech, Beauty)");
  }
  if (!mergedCriteria.platform) {
    followupQuestions.push("Which platform would you prefer? (Instagram, YouTube, TikTok)");
  }
  if (mergedCriteria.min_followers === null) {
    followupQuestions.push("What's your ideal follower count range?");
  }

  if (needsFollowup && followupQuestions.length > 0) {
    assistantMessage += "\n\n" + followupQuestions[0];
  } else if (!needsFollowup) {
    assistantMessage += "Let me find the best matches for you!";
  }

  return {
    assistant_message: assistantMessage,
    criteria_update: mergedCriteria,
    needs_followup: needsFollowup,
    followup_questions: followupQuestions,
  };
}

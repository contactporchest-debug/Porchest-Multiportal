import OpenAI from "openai";
import { parseRequirementsFree, InfluencerCriteria } from "./ai-helpers-free";

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

export interface ChatResult {
  assistant_message: string;
  criteria: ChatCriteria;
  needs_followup: boolean;
  followup_questions: string[];
}

const SYSTEM_PROMPT = `You are a brand-to-influencer strategist. Have a natural conversation. Ask follow-up questions if needed. ALSO output strict JSON in this exact format: { assistant_message: string, criteria: { niche: string[], platform: "instagram"|"youtube"|"tiktok"|null, locations: string[], min_followers: number|null, max_followers: number|null, min_engagement_rate: number|null, min_reach: number|null, budget: number|null, gender: "male"|"female"|null, languages: string[] }, needs_followup: boolean, followup_questions: string[] } Return ONLY valid JSON. No markdown.`;

/**
 * Stateless chat function that extracts criteria from conversation
 * @param message - User's message
 * @param currentCriteria - Current criteria from client (or null)
 * @returns Chat result with assistant message and updated criteria
 */
export async function chatAndExtract(
  message: string,
  currentCriteria: ChatCriteria | null
): Promise<ChatResult> {
  try {
    // Use OpenAI if available
    if (process.env.OPENAI_API_KEY) {
      const client = getOpenAIClient();

      // Build context from current criteria
      const criteriaContext = currentCriteria
        ? `\n\nCurrent extracted criteria: ${JSON.stringify(currentCriteria, null, 2)}\n\nUpdate these criteria based on the new message. Preserve existing values unless the user explicitly changes them.`
        : "\n\nNo criteria extracted yet. Start fresh.";

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT + criteriaContext,
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No response from OpenAI");
      }

      const result: ChatResult = JSON.parse(content);

      // Merge with existing criteria (server-side merge)
      if (currentCriteria) {
        result.criteria = {
          niche: result.criteria.niche.length > 0 ? result.criteria.niche : currentCriteria.niche,
          platform: result.criteria.platform || currentCriteria.platform,
          locations: result.criteria.locations.length > 0 ? result.criteria.locations : currentCriteria.locations,
          min_followers: result.criteria.min_followers ?? currentCriteria.min_followers,
          max_followers: result.criteria.max_followers ?? currentCriteria.max_followers,
          min_engagement_rate: result.criteria.min_engagement_rate ?? currentCriteria.min_engagement_rate,
          min_reach: result.criteria.min_reach ?? currentCriteria.min_reach,
          budget: result.criteria.budget ?? currentCriteria.budget,
          gender: result.criteria.gender || currentCriteria.gender,
          languages: result.criteria.languages.length > 0 ? result.criteria.languages : currentCriteria.languages,
        };
      }

      return result;
    } else {
      // Fallback to regex parser
      return chatAndExtractFallback(message, currentCriteria);
    }
  } catch (error: any) {
    console.error("Error in chatAndExtract:", error);
    // Fallback on error
    return chatAndExtractFallback(message, currentCriteria);
  }
}

/**
 * Fallback: Use regex parser + hardcoded friendly responses
 */
function chatAndExtractFallback(
  message: string,
  currentCriteria: ChatCriteria | null
): ChatResult {
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
    assistantMessage = "I'm here to help! ";
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
    criteria: mergedCriteria,
    needs_followup: needsFollowup,
    followup_questions: followupQuestions,
  };
}

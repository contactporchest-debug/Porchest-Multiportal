/**
 * Google Gemini Function Calling for Brand Discovery
 * Production-ready AI chatbot with tool calling
 */

import { GoogleGenerativeAI, FunctionDeclarationSchemaType } from "@google/generative-ai";
import { logger } from "@/lib/logger";
import { searchInfluencers, SearchFilters, InfluencerSearchResult, parseFollowerCount } from "@/lib/searchInfluencers";

// ============================================================================
// TYPES
// ============================================================================

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export interface BrandChatRequest {
  message: string;
  chatHistory?: ChatMessage[];
}

export interface BrandChatResponse {
  reply: string;
  influencers?: InfluencerSearchResult[];
  functionCalled?: boolean;
  searchFilters?: SearchFilters;
}

// ============================================================================
// GEMINI FUNCTION DECLARATION
// ============================================================================

/**
 * Gemini Tool Schema for searchInfluencers function
 * This tells Gemini what parameters are available for searching
 */
const searchInfluencersTool = {
  name: "searchInfluencers",
  description: `Search for influencers in the database based on brand requirements.
    Use this function whenever the user asks for influencer recommendations,
    influencer discovery, or finding creators. Extract criteria from conversation
    and call this function with appropriate filters.`,
  parameters: {
    type: FunctionDeclarationSchemaType.OBJECT,
    properties: {
      categories: {
        type: FunctionDeclarationSchemaType.ARRAY,
        description: "Content categories/niches (e.g., ['Fashion', 'Tech', 'Beauty', 'Fitness', 'Travel', 'Food'])",
        items: {
          type: FunctionDeclarationSchemaType.STRING,
        },
      },
      location: {
        type: FunctionDeclarationSchemaType.STRING,
        description: "Geographic location (e.g., 'United States', 'Pakistan', 'India', 'United Kingdom')",
      },
      minFollowers: {
        type: FunctionDeclarationSchemaType.NUMBER,
        description: "Minimum follower count (e.g., 50000 for 50k)",
      },
      maxFollowers: {
        type: FunctionDeclarationSchemaType.NUMBER,
        description: "Maximum follower count (e.g., 500000 for 500k)",
      },
      minEngagementRate: {
        type: FunctionDeclarationSchemaType.NUMBER,
        description: "Minimum engagement rate as percentage (e.g., 3.5 for 3.5%)",
      },
      platforms: {
        type: FunctionDeclarationSchemaType.ARRAY,
        description: "Social media platforms (e.g., ['Instagram', 'YouTube', 'TikTok'])",
        items: {
          type: FunctionDeclarationSchemaType.STRING,
        },
      },
      verified: {
        type: FunctionDeclarationSchemaType.BOOLEAN,
        description: "Whether the influencer must be verified (true/false)",
      },
      maxPricePerPost: {
        type: FunctionDeclarationSchemaType.NUMBER,
        description: "Maximum budget per post in USD (e.g., 500)",
      },
      languages: {
        type: FunctionDeclarationSchemaType.ARRAY,
        description: "Languages spoken (e.g., ['English', 'Spanish', 'Urdu'])",
        items: {
          type: FunctionDeclarationSchemaType.STRING,
        },
      },
      minRating: {
        type: FunctionDeclarationSchemaType.NUMBER,
        description: "Minimum rating (1-5 scale)",
      },
    },
    required: [], // No required fields - flexible search
  },
};

// ============================================================================
// SYSTEM PROMPT
// ============================================================================

const SYSTEM_INSTRUCTION = `You are an expert Brand-to-Influencer Marketing Strategist AI.

**YOUR ROLE:**
- Help brands find perfect influencer matches for their campaigns
- Extract search criteria from natural conversation
- Provide personalized, data-driven recommendations

**CRITICAL RULES:**
1. **ALWAYS call searchInfluencers** when user requests influencer recommendations
2. **NEVER invent or hallucinate influencer data** - only use real database results
3. **ASK follow-up questions** if critical filters are missing (category, location)
4. **SUMMARIZE criteria** before presenting results
5. **Be concise and friendly** - avoid overly long responses

**CONVERSATION FLOW:**
1. User asks for influencers → Extract criteria → Call searchInfluencers()
2. If results found → Present top matches with key metrics
3. If no results → Suggest relaxing filters or ask clarifying questions
4. If filters insufficient → Ask 1-2 specific follow-up questions

**DATA INTERPRETATION:**
- Follower counts: "50k" = 50000, "1.5m" = 1500000
- Engagement rate: Presented as percentage (e.g., "4.2%")
- Categories: Fashion, Tech, Beauty, Fitness, Travel, Food, Gaming, Lifestyle, etc.
- Platforms: Instagram, YouTube, TikTok

**RESPONSE STYLE:**
- Professional yet conversational
- Bullet points for clarity
- Highlight unique strengths of each influencer
- Focus on ROI and campaign fit

**Example responses:**
- "Great! I found 8 Fashion influencers in New York with 50k-200k followers..."
- "To find the best match, could you share: What's your budget per post?"
- "No exact matches found. Would you like to expand to nearby regions?"

Remember: You are a strategic advisor helping brands make smart influencer partnership decisions.`;

// ============================================================================
// MAIN CHAT FUNCTION
// ============================================================================

/**
 * Handle brand chat with Gemini function calling
 * @param request - Chat request with message and history
 * @returns Response with AI reply and optional influencer results
 */
export async function handleBrandChat(request: BrandChatRequest): Promise<BrandChatResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // Initialize model with function calling
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
    tools: [{ functionDeclarations: [searchInfluencersTool] }],
    toolConfig: {
      functionCallingConfig: {
        mode: "AUTO", // Let Gemini decide when to call functions
      },
    },
  });

  try {
    logger.info("Brand chat started", {
      message: request.message,
      historyLength: request.chatHistory?.length || 0,
    });

    // Build chat session with history
    const chat = model.startChat({
      history: request.chatHistory?.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      })) || [],
    });

    // Send user message
    const result = await chat.sendMessage(request.message);
    const response = result.response;

    logger.info("Gemini response received", {
      functionCalls: response.functionCalls()?.length || 0,
    });

    // Check if Gemini wants to call a function
    const functionCalls = response.functionCalls();

    if (functionCalls && functionCalls.length > 0) {
      logger.info("Function call detected", { calls: functionCalls });

      // Process each function call
      const functionResponses = await Promise.all(
        functionCalls.map(async (call) => {
          if (call.name === "searchInfluencers") {
            try {
              const filters = call.args as SearchFilters;

              logger.info("Executing searchInfluencers", { filters });

              // Call our MongoDB search function
              const influencers = await searchInfluencers(filters, 10);

              logger.info("Search completed", {
                resultsCount: influencers.length,
              });

              return {
                functionResponse: {
                  name: "searchInfluencers",
                  response: {
                    success: true,
                    count: influencers.length,
                    influencers: influencers,
                  },
                },
              };
            } catch (error) {
              logger.error("searchInfluencers error", error);

              return {
                functionResponse: {
                  name: "searchInfluencers",
                  response: {
                    success: false,
                    error: error instanceof Error ? error.message : "Unknown error",
                    influencers: [],
                  },
                },
              };
            }
          }

          return {
            functionResponse: {
              name: call.name,
              response: { error: "Unknown function" },
            },
          };
        })
      );

      // Send function results back to Gemini for final response
      const finalResult = await chat.sendMessage(functionResponses);
      const finalResponse = finalResult.response;
      const finalText = finalResponse.text();

      // Extract influencers from the first function call response
      const firstCall = functionResponses[0]?.functionResponse?.response;
      const influencers = firstCall?.influencers || [];
      const searchFilters = functionCalls[0]?.args as SearchFilters;

      return {
        reply: finalText,
        influencers: influencers,
        functionCalled: true,
        searchFilters: searchFilters,
      };
    }

    // No function call - just return the text response
    const text = response.text();

    return {
      reply: text,
      functionCalled: false,
    };
  } catch (error) {
    logger.error("Gemini function calling error", error);
    throw new Error(
      `Gemini chat failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

// ============================================================================
// REGEX FALLBACK FOR CRITERIA EXTRACTION
// ============================================================================

/**
 * Fallback regex-based criteria extraction when Gemini is unavailable
 * @param message - User message
 * @returns Extracted search filters
 */
export function extractCriteriaWithRegex(message: string): SearchFilters {
  const lowerMsg = message.toLowerCase();
  const filters: SearchFilters = {};

  // Categories/Niches
  const niches = [
    "fashion",
    "tech",
    "technology",
    "beauty",
    "fitness",
    "travel",
    "food",
    "gaming",
    "lifestyle",
    "health",
    "sports",
    "music",
    "art",
    "education",
    "business",
  ];

  const foundNiches: string[] = [];
  niches.forEach((niche) => {
    if (lowerMsg.includes(niche)) {
      foundNiches.push(niche.charAt(0).toUpperCase() + niche.slice(1));
    }
  });
  if (foundNiches.length > 0) {
    filters.categories = foundNiches;
  }

  // Location extraction
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
  ];

  for (const location of locations) {
    if (lowerMsg.includes(location.toLowerCase())) {
      filters.location = location;
      break;
    }
  }

  // Follower count extraction
  const followerMatch = lowerMsg.match(/(\d+(?:\.\d+)?)\s*([km])?\s*(?:followers?|subs?|subscribers?)/i);
  if (followerMatch) {
    const count = parseFollowerCount(followerMatch[0]);
    if (count) {
      filters.minFollowers = count;
    }
  }

  // Follower range extraction (e.g., "50k-500k followers")
  const rangeMatch = lowerMsg.match(/(\d+(?:\.\d+)?)\s*([km])?\s*-\s*(\d+(?:\.\d+)?)\s*([km])?/i);
  if (rangeMatch) {
    const min = parseFollowerCount(rangeMatch[1] + (rangeMatch[2] || ""));
    const max = parseFollowerCount(rangeMatch[3] + (rangeMatch[4] || ""));
    if (min) filters.minFollowers = min;
    if (max) filters.maxFollowers = max;
  }

  // Budget/Price extraction
  const budgetMatch = lowerMsg.match(/\$?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:budget|per post|price)/i);
  if (budgetMatch) {
    const budget = parseFloat(budgetMatch[1].replace(/,/g, ""));
    if (!isNaN(budget)) {
      filters.maxPricePerPost = budget;
    }
  }

  // Platform extraction
  if (lowerMsg.includes("instagram")) {
    filters.platforms = ["Instagram"];
  } else if (lowerMsg.includes("youtube")) {
    filters.platforms = ["YouTube"];
  } else if (lowerMsg.includes("tiktok")) {
    filters.platforms = ["TikTok"];
  }

  // Verified status
  if (lowerMsg.includes("verified") || lowerMsg.includes("blue check")) {
    filters.verified = true;
  }

  // Engagement rate
  const engagementMatch = lowerMsg.match(/(\d+(?:\.\d+)?)\s*%?\s*engagement/i);
  if (engagementMatch) {
    const rate = parseFloat(engagementMatch[1]);
    if (!isNaN(rate)) {
      filters.minEngagementRate = rate;
    }
  }

  logger.info("Regex criteria extraction", { filters });

  return filters;
}

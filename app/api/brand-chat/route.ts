/**
 * Brand Discovery Chatbot API Route
 * POST /api/brand-chat
 *
 * Production-ready chatbot with Google Gemini function calling
 * for intelligent influencer discovery
 */

// Force dynamic rendering - API routes must NEVER be statically generated
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";

import { auth } from "@/lib/auth";
import {
  successResponse,
  unauthorizedResponse,
  handleApiError,
  badRequestResponse,
} from "@/lib/api-response";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { handleBrandChat, extractCriteriaWithRegex, ChatMessage } from "@/lib/gemini-function-calling";
import { searchInfluencers } from "@/lib/searchInfluencers";
import { z } from "zod";

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const chatMessageSchema = z.object({
  role: z.enum(["user", "model"]),
  text: z.string(),
});

const brandChatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(2000, "Message too long"),
  chatHistory: z.array(chatMessageSchema).optional().default([]),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Detect if user is asking for influencers (intent detection)
 */
function isInfluencerSearchIntent(message: string): boolean {
  const lowerMsg = message.toLowerCase();

  const searchKeywords = [
    "find influencer",
    "show me influencer",
    "looking for influencer",
    "recommend influencer",
    "suggest influencer",
    "influencer",
    "creator",
    "content creator",
    "brand ambassador",
    "need influencer",
    "want influencer",
  ];

  return searchKeywords.some((keyword) => lowerMsg.includes(keyword));
}

/**
 * Detect if message is a greeting
 */
function isGreeting(message: string): boolean {
  const lowerMsg = message.toLowerCase().trim();
  const greetingPatterns = /^(hi|hello|hey|assalam|salam|good morning|good evening|good afternoon|what's up|whats up|howdy)\b/i;
  return greetingPatterns.test(lowerMsg);
}

/**
 * Generate greeting response
 */
function getGreetingResponse(): string {
  return `Hello! 👋 I'm your AI Brand Discovery Assistant.

I can help you find the perfect influencers for your campaign!

**Just tell me what you're looking for:**
• Category or niche (Fashion, Tech, Beauty, etc.)
• Location (United States, Pakistan, India, etc.)
• Follower range (e.g., 50k-500k)
• Budget per post
• Platform preference (Instagram, YouTube, TikTok)

Example: *"Find me fashion influencers in New York with 100k+ followers"*

What are you looking for?`;
}

// ============================================================================
// API HANDLER
// ============================================================================

/**
 * POST /api/brand-chat
 * Main chatbot endpoint with Gemini function calling
 *
 * @body message - User's chat message
 * @body chatHistory - Optional previous conversation
 * @returns AI reply with optional influencer results
 */
async function brandChatHandler(req: Request) {
  try {
    // 🔐 AUTHENTICATION CHECK
    const session = await auth();

    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required");
    }

    // Brand-only access
    if (session.user.role !== "brand") {
      return unauthorizedResponse("Brand access required");
    }

    logger.info("Brand chat request", {
      userId: session.user.id,
      userRole: session.user.role,
    });

    // 📥 PARSE & VALIDATE REQUEST
    const body = await req.json();
    const validationResult = brandChatRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return badRequestResponse(
        `Validation error: ${validationResult.error.errors.map((e) => e.message).join(", ")}`
      );
    }

    const { message, chatHistory } = validationResult.data;

    logger.info("Chat message received", {
      message,
      historyLength: chatHistory.length,
    });

    // 👋 HANDLE GREETINGS
    if (isGreeting(message) && chatHistory.length === 0) {
      return successResponse({
        reply: getGreetingResponse(),
        influencers: [],
        functionCalled: false,
      });
    }

    // 🤖 GEMINI FUNCTION CALLING (PRIMARY PATH)
    if (process.env.GEMINI_API_KEY) {
      try {
        logger.info("Using Gemini function calling");

        const result = await handleBrandChat({
          message,
          chatHistory,
        });

        logger.info("Gemini response generated", {
          functionCalled: result.functionCalled,
          influencerCount: result.influencers?.length || 0,
        });

        return successResponse({
          reply: result.reply,
          influencers: result.influencers || [],
          functionCalled: result.functionCalled,
          searchFilters: result.searchFilters,
          method: "gemini-function-calling",
        });
      } catch (geminiError) {
        // Log Gemini error but continue to fallback
        logger.error("Gemini function calling failed, using fallback", geminiError);
      }
    }

    // 🔧 REGEX FALLBACK (SECONDARY PATH)
    logger.info("Using regex fallback");

    // Check if user is asking for influencers
    if (isInfluencerSearchIntent(message)) {
      // Extract criteria using regex
      const filters = extractCriteriaWithRegex(message);

      logger.info("Regex criteria extracted", { filters });

      // Check if we have enough criteria to search
      const hasMinimumCriteria =
        (filters.categories && filters.categories.length > 0) || filters.location;

      if (hasMinimumCriteria) {
        // Execute search
        const influencers = await searchInfluencers(filters, 10);

        logger.info("Fallback search completed", {
          resultsCount: influencers.length,
        });

        // Generate response
        let reply = "";

        if (influencers.length > 0) {
          reply = `Great! I found **${influencers.length} influencer${influencers.length === 1 ? "" : "s"}** matching your criteria:\n\n`;

          if (filters.categories && filters.categories.length > 0) {
            reply += `📌 Category: ${filters.categories.join(", ")}\n`;
          }
          if (filters.location) {
            reply += `📍 Location: ${filters.location}\n`;
          }
          if (filters.minFollowers) {
            reply += `👥 Min Followers: ${(filters.minFollowers / 1000).toFixed(0)}k\n`;
          }

          reply += `\nCheck out the recommendations below! 👇`;
        } else {
          reply = `I couldn't find any influencers matching those exact criteria.\n\n`;
          reply += `**Would you like to:**\n`;
          reply += `• Expand the location search?\n`;
          reply += `• Adjust the follower range?\n`;
          reply += `• Try a different category?`;
        }

        return successResponse({
          reply,
          influencers,
          functionCalled: false,
          searchFilters: filters,
          method: "regex-fallback",
        });
      } else {
        // Not enough criteria - ask for more info
        const reply = `I'd love to help you find influencers! To get the best matches, please provide:

**Required:**
• Category/Niche (e.g., Fashion, Tech, Beauty)
• Location (e.g., United States, Pakistan)

**Optional:**
• Follower range (e.g., 50k-500k)
• Budget per post (e.g., $500)
• Platform (Instagram, YouTube, TikTok)

Example: *"Find fitness influencers in Los Angeles with 100k+ followers"*`;

        return successResponse({
          reply,
          influencers: [],
          functionCalled: false,
          method: "regex-fallback",
        });
      }
    } else {
      // Not a search intent - generic response
      const reply = `I'm here to help you discover influencers for your brand campaigns.

Try asking something like:
• "Find fashion influencers in New York"
• "Show me tech creators with 100k+ followers"
• "I need beauty influencers for my campaign"

What kind of influencers are you looking for?`;

      return successResponse({
        reply,
        influencers: [],
        functionCalled: false,
        method: "regex-fallback",
      });
    }
  } catch (error) {
    logger.error("Brand chat error", error);
    return handleApiError(error);
  }
}

// ============================================================================
// EXPORT WITH RATE LIMITING
// ============================================================================

/**
 * Apply AI rate limiting (10 requests per minute)
 */
export const POST = withRateLimit(brandChatHandler, RATE_LIMIT_CONFIGS.ai);

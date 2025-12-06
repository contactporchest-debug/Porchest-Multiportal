/**
 * Brand Discovery Chatbot API Route - FIXED VERSION
 * POST /api/brand-chat
 *
 * FIXES:
 * - Intent gate runs on EVERY message (mandatory)
 * - Fresh criteria extraction every time
 * - Smart merge with overwrite rules
 * - MongoDB search on every influencer intent
 * - Auto-retry with relaxation
 * - Comprehensive logging
 */

// Force dynamic rendering
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
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Import our modules
import {
  extractCriteriaWithGemini,
  type ChatMessage,
  type SearchCriteria,
} from "@/lib/extractCriteriaWithGemini";
import { mergeCriteria, isIntentChange } from "@/lib/mergeCriteria";
import { searchInfluencersWithRetry } from "@/lib/searchInfluencersRobust";
import { isInfluencerSearchIntent, isGreeting } from "@/lib/intentDetection";
import {
  formatInfluencerList,
  formatCriteriaSummary,
  generateFollowUpQuestions,
} from "@/lib/formatInfluencerResults";

// ============================================================================
// VALIDATION SCHEMA
// ============================================================================

const brandChatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(2000, "Message too long"),
  chatHistory: z
    .array(
      z.object({
        role: z.enum(["user", "model"]),
        text: z.string(),
      })
    )
    .optional()
    .default([]),
  previousCriteria: z
    .object({
      category: z.string().optional(),
      location: z.string().optional(),
      minFollowers: z.number().optional(),
      maxFollowers: z.number().optional(),
      minEngagement: z.number().optional(),
      platforms: z.array(z.string()).optional(),
      verified: z.boolean().optional(),
    })
    .optional()
    .nullable(),
});

// ============================================================================
// SYSTEM PROMPT
// ============================================================================

const CHATBOT_SYSTEM_PROMPT = `You are an expert Brand-to-Influencer Marketing Strategist AI.

**CRITICAL RULES:**
1. When user asks for influencers, they will be provided from DATABASE - NEVER invent data
2. You will receive a formatted list of REAL influencers - use ONLY that data
3. NEVER make up influencer names, usernames, followers, or metrics
4. If list is empty, ask follow-up questions to refine criteria
5. Always summarize search criteria before presenting results
6. Be concise, professional, and data-driven

**RESPONSE STYLE:**
- Professional yet friendly
- Focus on ROI and campaign fit
- Highlight unique strengths
- Keep responses under 200 words

Remember: Use REAL data only. You are a strategic advisor.`;

// ============================================================================
// HELPER: GENERATE NATURAL RESPONSE
// ============================================================================

async function generateNaturalResponse(
  message: string,
  chatHistory: ChatMessage[],
  influencerList: string,
  criteriaSummary: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return influencerList;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: CHATBOT_SYSTEM_PROMPT,
    });

    const chat = model.startChat({
      history: chatHistory.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      })),
    });

    const prompt = `User asked: "${message}"

Search criteria: ${criteriaSummary}

Database results:
${influencerList}

Provide a natural, concise response using ONLY this real data. Do NOT invent influencers.`;

    const result = await chat.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    logger.error("Gemini natural response failed", error);
    return influencerList;
  }
}

// ============================================================================
// MAIN API HANDLER
// ============================================================================

async function brandChatHandler(req: Request) {
  const requestId = Math.random().toString(36).substring(7);

  try {
    logger.info(`[${requestId}] === NEW REQUEST ===`);

    // 🔐 AUTHENTICATION
    const session = await auth();

    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required");
    }

    if (session.user.role !== "brand") {
      return unauthorizedResponse("Brand access required");
    }

    logger.info(`[${requestId}] User authenticated`, { userId: session.user.id });

    // 📥 VALIDATE REQUEST
    const body = await req.json();
    const validationResult = brandChatRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return badRequestResponse(
        `Validation error: ${validationResult.error.errors.map((e) => e.message).join(", ")}`
      );
    }

    const { message, chatHistory, previousCriteria } = validationResult.data;

    logger.info(`[${requestId}] Request parsed`, {
      message,
      historyLength: chatHistory.length,
      hasPreviousCriteria: !!previousCriteria,
      previousCriteria,
    });

    // 👋 HANDLE GREETINGS
    if (isGreeting(message) && chatHistory.length === 0) {
      logger.info(`[${requestId}] Greeting detected`);

      const greetingResponse = `Hello! 👋 I'm your AI Brand Discovery Assistant.

I can help you find the perfect influencers for your campaigns!

**Just tell me what you're looking for:**
• Category (Fashion, Tech, Beauty, Fitness, Travel, Food, etc.)
• Location (United States, Pakistan, India, UK, etc.)
• Follower range (e.g., 50k-500k)
• Platform (Instagram, YouTube, TikTok)

**Example:** *"Find fashion influencers in Los Angeles with 100k+ followers"*

What are you looking for?`;

      return successResponse({
        reply: greetingResponse,
        influencers: [],
        intent: "greeting",
        criteria: null,
      });
    }

    // ============================================================================
    // MANDATORY INTENT GATE (RUNS ON EVERY MESSAGE)
    // ============================================================================

    const hasSearchIntent = isInfluencerSearchIntent(message);

    logger.info(`[${requestId}] Intent detection`, { hasSearchIntent });

    // ============================================================================
    // PATH 1: INFLUENCER SEARCH (DETERMINISTIC)
    // ============================================================================

    if (hasSearchIntent) {
      logger.info(`[${requestId}] === INFLUENCER SEARCH PATH ===`);

      // STEP 1: Extract criteria from current message
      const newCriteria = await extractCriteriaWithGemini(message, chatHistory);

      logger.info(`[${requestId}] New criteria extracted`, { newCriteria });

      // STEP 2: Merge with previous criteria (smart overwrite rules)
      const finalCriteria = mergeCriteria(previousCriteria || null, newCriteria, message);

      logger.info(`[${requestId}] Final criteria after merge`, { finalCriteria });

      // STEP 3: Detect if this is an intent change
      const isChange = isIntentChange(previousCriteria || null, newCriteria, message);

      if (isChange) {
        logger.info(`[${requestId}] INTENT CHANGE DETECTED - user switched topics`);
      }

      // STEP 4: Check minimum criteria
      const hasMinimumCriteria =
        finalCriteria.category || finalCriteria.location || finalCriteria.minFollowers;

      if (!hasMinimumCriteria) {
        logger.info(`[${requestId}] Insufficient criteria, asking follow-up`);

        const followUpQuestions = generateFollowUpQuestions(finalCriteria);

        const followUpResponse = `I'd love to help you find influencers! To get the best matches, please provide:

${followUpQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

**Example:** *"Find tech influencers in Pakistan with 50k+ followers on Instagram"*`;

        return successResponse({
          reply: followUpResponse,
          influencers: [],
          criteria: finalCriteria,
          intent: "search",
          needsMoreInfo: true,
        });
      }

      // STEP 5: Search MongoDB with auto-retry relaxation
      const { results, relaxed } = await searchInfluencersWithRetry(finalCriteria, {
        limit: 10,
        allowRelaxation: true,
      });

      logger.info(`[${requestId}] Search complete`, {
        count: results.length,
        relaxed,
        finalCriteria,
      });

      // STEP 6: Format results deterministically
      const criteriaSummary = formatCriteriaSummary(finalCriteria);
      const influencerList = formatInfluencerList(results);

      logger.info(`[${requestId}] Results formatted`, {
        listLength: influencerList.length,
        criteriaSummary,
      });

      // STEP 7: Handle no results
      if (results.length === 0) {
        logger.info(`[${requestId}] No results found`);

        const noResultsResponse = `I couldn't find any influencers matching your criteria${relaxed ? " (even after expanding the search)" : ""}.

**Your search:**
${criteriaSummary}

**Suggestions:**
• Try a broader location (e.g., entire country instead of city)
• Reduce minimum follower requirements
• Expand to multiple categories
• Remove platform restrictions

Would you like to adjust your search?`;

        return successResponse({
          reply: noResultsResponse,
          influencers: [],
          criteria: finalCriteria,
          relaxed,
          intent: "search",
        });
      }

      // STEP 8: Generate natural response using REAL data
      const naturalResponse = await generateNaturalResponse(
        message,
        chatHistory,
        influencerList,
        criteriaSummary
      );

      logger.info(`[${requestId}] Natural response generated`);

      // Add relaxation notice if applicable
      let finalResponse = naturalResponse;
      if (relaxed) {
        finalResponse = `ℹ️ *I expanded your search to find more matches.*\n\n` + finalResponse;
      }

      return successResponse({
        reply: finalResponse,
        influencers: results,
        criteria: finalCriteria,
        relaxed,
        intent: "search",
        intentChange: isChange,
        method: "robust-fixed",
      });
    }

    // ============================================================================
    // PATH 2: GENERAL CHAT (NON-SEARCH)
    // ============================================================================

    logger.info(`[${requestId}] === GENERAL CHAT PATH ===`);

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const fallbackResponse = `I'm here to help you discover influencers for your campaigns!

Try asking:
• "Find fashion influencers in New York with 100k+ followers"
• "Show me verified tech creators on YouTube"
• "I need beauty influencers in Los Angeles"

What kind of influencers are you looking for?`;

      return successResponse({
        reply: fallbackResponse,
        influencers: [],
        intent: "general",
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: CHATBOT_SYSTEM_PROMPT,
      });

      const chat = model.startChat({
        history: chatHistory.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.text }],
        })),
      });

      const result = await chat.sendMessage(message);

      return successResponse({
        reply: result.response.text(),
        influencers: [],
        intent: "general",
      });
    } catch (geminiError) {
      logger.error(`[${requestId}] Gemini chat failed`, geminiError);

      const fallbackResponse = `I'm your Brand Discovery Assistant. I can help you find influencers!

Try asking:
• "Find [category] influencers in [location] with [X] followers"
• "Show me [platform] creators in [niche]"

What are you looking for?`;

      return successResponse({
        reply: fallbackResponse,
        influencers: [],
        intent: "general",
      });
    }
  } catch (error) {
    logger.error(`[${requestId}] Request failed`, error);
    return handleApiError(error);
  }
}

// ============================================================================
// EXPORT WITH RATE LIMITING
// ============================================================================

export const POST = withRateLimit(brandChatHandler, RATE_LIMIT_CONFIGS.ai);

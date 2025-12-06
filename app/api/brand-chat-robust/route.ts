/**
 * Brand Discovery Chatbot API - Production Robust Version
 * POST /api/brand-chat-robust
 *
 * Features:
 * - Intent detection gate (force DB search)
 * - 2-step criteria extraction (Gemini JSON + Zod + regex fallback)
 * - Fuzzy MongoDB search with scoring
 * - Auto-retry with filter relaxation
 * - Deterministic formatting (no hallucinations)
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

// Import our robust modules
import {
  extractCriteriaWithGemini,
  type ChatMessage,
  type SearchCriteria,
} from "@/lib/extractCriteriaWithGemini";
import { searchInfluencersWithRetry } from "@/lib/searchInfluencersRobust";
import {
  isInfluencerSearchIntent,
  isGreeting,
  isQuestion,
} from "@/lib/intentDetection";
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
});

// ============================================================================
// SYSTEM PROMPT
// ============================================================================

const BRAND_CHATBOT_SYSTEM_PROMPT = `You are an expert Brand-to-Influencer Marketing Strategist AI.

**CRITICAL RULES:**
1. When user asks for influencers, they will be provided from the DATABASE - NEVER invent influencer data
2. NEVER make up influencer names, usernames, followers, or metrics
3. You will receive a formatted list of REAL influencers - use ONLY that data
4. If the list is empty, ask follow-up questions to refine search criteria
5. Always summarize the search criteria before presenting results
6. Be concise, professional, and helpful

**YOUR ROLE:**
- Help brands understand the influencer matches
- Explain why these influencers fit their criteria
- Suggest refinements if needed
- Be conversational but data-driven

**RESPONSE STYLE:**
- Professional yet friendly
- Focus on ROI and campaign fit
- Use bullet points for clarity
- Highlight unique strengths

Remember: You are a strategic advisor using REAL data to help brands make smart decisions.`;

// ============================================================================
// HELPER: GENERATE GEMINI RESPONSE
// ============================================================================

async function generateNaturalResponse(
  message: string,
  chatHistory: ChatMessage[],
  influencerList: string,
  criteriaSummary: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Fallback without Gemini
    return influencerList;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: BRAND_CHATBOT_SYSTEM_PROMPT,
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

Provide a natural, helpful response about these REAL influencers. Do NOT add fake influencers or make up data.`;

    const result = await chat.sendMessage(prompt);
    const response = result.response;

    return response.text();
  } catch (error) {
    logger.error("Gemini natural response failed", error);
    // Fallback to raw list
    return influencerList;
  }
}

// ============================================================================
// MAIN API HANDLER
// ============================================================================

async function brandChatRobustHandler(req: Request) {
  const requestId = Math.random().toString(36).substring(7);

  try {
    logger.info(`[${requestId}] Request started`);

    // 🔐 AUTHENTICATION CHECK
    const session = await auth();

    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required");
    }

    if (session.user.role !== "brand") {
      return unauthorizedResponse("Brand access required");
    }

    logger.info(`[${requestId}] User authenticated`, {
      userId: session.user.id,
      role: session.user.role,
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

    logger.info(`[${requestId}] Request validated`, {
      message,
      historyLength: chatHistory.length,
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
      });
    }

    // 🎯 INTENT DETECTION GATE
    const hasSearchIntent = isInfluencerSearchIntent(message);

    logger.info(`[${requestId}] Intent detection`, { hasSearchIntent });

    // ============================================================================
    // PATH 1: INFLUENCER SEARCH (DETERMINISTIC)
    // ============================================================================

    if (hasSearchIntent) {
      logger.info(`[${requestId}] INFLUENCER SEARCH PATH`);

      // STEP 1: Extract criteria (Gemini JSON + Zod + regex fallback)
      const criteria = await extractCriteriaWithGemini(message, chatHistory);

      logger.info(`[${requestId}] Criteria extracted`, { criteria });

      // STEP 2: Validate minimum criteria
      const hasMinimumCriteria =
        criteria.category || criteria.location || criteria.minFollowers;

      if (!hasMinimumCriteria) {
        logger.info(`[${requestId}] Insufficient criteria, asking follow-up`);

        const followUpQuestions = generateFollowUpQuestions(criteria);

        const followUpResponse = `I'd love to help you find influencers! To get the best matches, please provide:

${followUpQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

**Example:** *"Find tech influencers in Pakistan with 50k+ followers on Instagram"*`;

        return successResponse({
          reply: followUpResponse,
          influencers: [],
          criteria,
          intent: "search",
          needsMoreInfo: true,
        });
      }

      // STEP 3: Search MongoDB with scoring + auto-retry relaxation
      const { results, relaxed } = await searchInfluencersWithRetry(criteria, {
        limit: 10,
        allowRelaxation: true,
      });

      logger.info(`[${requestId}] Search complete`, {
        count: results.length,
        relaxed,
      });

      // STEP 4: Format results deterministically
      const criteriaSummary = formatCriteriaSummary(criteria);
      const influencerList = formatInfluencerList(results);

      logger.info(`[${requestId}] Results formatted`, {
        listLength: influencerList.length,
      });

      // STEP 5: Handle no results
      if (results.length === 0) {
        logger.info(`[${requestId}] No results after relaxation`);

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
          criteria,
          relaxed,
          intent: "search",
        });
      }

      // STEP 6: Generate natural response with Gemini (using REAL data only)
      const naturalResponse = await generateNaturalResponse(
        message,
        chatHistory,
        influencerList,
        criteriaSummary
      );

      logger.info(`[${requestId}] Natural response generated`);

      // Add relaxation notice if filters were relaxed
      let finalResponse = naturalResponse;
      if (relaxed) {
        finalResponse =
          `ℹ️ *I expanded your search criteria to find more matches.*\n\n` + finalResponse;
      }

      return successResponse({
        reply: finalResponse,
        influencers: results,
        criteria,
        relaxed,
        intent: "search",
        method: "robust-deterministic",
      });
    }

    // ============================================================================
    // PATH 2: GENERAL CHAT (NON-SEARCH)
    // ============================================================================

    logger.info(`[${requestId}] GENERAL CHAT PATH`);

    // Use Gemini for general conversation
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const fallbackResponse = `I'm here to help you discover influencers for your brand campaigns!

Try asking something like:
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
        systemInstruction: BRAND_CHATBOT_SYSTEM_PROMPT,
      });

      const chat = model.startChat({
        history: chatHistory.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.text }],
        })),
      });

      const result = await chat.sendMessage(message);
      const response = result.response;

      return successResponse({
        reply: response.text(),
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

export const POST = withRateLimit(brandChatRobustHandler, RATE_LIMIT_CONFIGS.ai);

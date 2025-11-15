import { auth } from "@/lib/auth";
import {
  successResponse,
  unauthorizedResponse,
  badRequestResponse,
  handleApiError,
} from "@/lib/api-response";
import { validateRequest } from "@/lib/validations";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { z } from "zod";

/**
 * Sentiment Analysis API
 * Analyzes comments/text for sentiment (positive, neutral, negative)
 * In production, this would call a Python microservice with BERT/DistilBERT
 */

// Validation schema for sentiment analysis request
const sentimentAnalysisSchema = z.object({
  text: z.string().optional(),
  comments: z.array(z.string()).optional(),
}).refine(
  (data) => data.text || (data.comments && data.comments.length > 0),
  {
    message: "Either text or comments array is required",
  }
);

/**
 * POST /api/ai/sentiment-analysis
 * Analyze sentiment of text or comments (authenticated users only)
 *
 * RATE LIMIT: 10 requests per minute per IP
 */
async function sentimentAnalysisHandler(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return unauthorizedResponse("Authentication required");
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = validateRequest(sentimentAnalysisSchema, body);

    logger.debug("Sentiment analysis requested", {
      userId: session.user.id,
      userRole: session.user.role,
      hasText: !!validatedData.text,
      commentsCount: validatedData.comments?.length || 0,
    });

    // In production, this would call Python microservice:
    // const response = await fetch('http://ai-service:5000/analyze-sentiment', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ text, comments })
    // });

    // For now, use a simple rule-based approach
    const analyzeSentiment = (text: string) => {
      const positive = [
        "love", "great", "amazing", "excellent", "awesome", "fantastic",
        "wonderful", "good", "best", "beautiful", "perfect", "happy",
        "excited", "grateful", "impressed", "outstanding"
      ];
      const negative = [
        "hate", "bad", "terrible", "awful", "horrible", "worst", "poor",
        "disappointing", "sad", "angry", "annoyed", "frustrated", "useless"
      ];

      const lowerText = text.toLowerCase();
      let positiveScore = 0;
      let negativeScore = 0;

      positive.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = lowerText.match(regex);
        if (matches) positiveScore += matches.length;
      });

      negative.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = lowerText.match(regex);
        if (matches) negativeScore += matches.length;
      });

      if (positiveScore > negativeScore) return "positive";
      if (negativeScore > positiveScore) return "negative";
      return "neutral";
    };

    let results: any = {};

    if (validatedData.text) {
      // Single text analysis
      const sentiment = analyzeSentiment(validatedData.text);
      const confidence = 0.75 + Math.random() * 0.2; // Mock confidence

      results = {
        sentiment,
        confidence: Math.round(confidence * 100) / 100,
      };

      logger.info("Single text sentiment analyzed", {
        sentiment,
        confidence,
        textLength: validatedData.text.length,
      });
    } else if (validatedData.comments) {
      // Batch analysis
      const analyzed = validatedData.comments.map((comment: string) => ({
        text: comment,
        sentiment: analyzeSentiment(comment),
        confidence: Math.round((0.75 + Math.random() * 0.2) * 100) / 100,
      }));

      const sentimentCounts = {
        positive: analyzed.filter((a: any) => a.sentiment === "positive").length,
        neutral: analyzed.filter((a: any) => a.sentiment === "neutral").length,
        negative: analyzed.filter((a: any) => a.sentiment === "negative").length,
      };

      results = {
        total_analyzed: validatedData.comments.length,
        sentiment_breakdown: sentimentCounts,
        positive_percentage: Math.round((sentimentCounts.positive / validatedData.comments.length) * 100 * 10) / 10,
        negative_percentage: Math.round((sentimentCounts.negative / validatedData.comments.length) * 100 * 10) / 10,
        neutral_percentage: Math.round((sentimentCounts.neutral / validatedData.comments.length) * 100 * 10) / 10,
        overall_sentiment:
          sentimentCounts.positive > sentimentCounts.negative
            ? "positive"
            : sentimentCounts.negative > sentimentCounts.positive
            ? "negative"
            : "neutral",
        analyzed_comments: analyzed,
      };

      logger.info("Batch sentiment analysis completed", {
        totalAnalyzed: validatedData.comments.length,
        overallSentiment: results.overall_sentiment,
        breakdown: sentimentCounts,
      });
    }

    return successResponse({
      ...results,
      note: "Using rule-based analysis. In production, integrate BERT/DistilBERT model.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Export with rate limiting applied
export const POST = withRateLimit(sentimentAnalysisHandler, RATE_LIMIT_CONFIGS.ai);

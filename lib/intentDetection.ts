/**
 * Intent Detection for Influencer Search
 * Determines if user wants to search for influencers
 */

import { logger } from "@/lib/logger";

/**
 * Detect if message has influencer search intent
 * Uses keyword matching to force DB search
 */
export function isInfluencerSearchIntent(message: string): boolean {
  const lowerMsg = message.toLowerCase();

  // Search keywords that indicate influencer discovery intent
  const searchKeywords = [
    "influencer",
    "influencers",
    "creator",
    "creators",
    "content creator",
    "brand ambassador",
    "instagram",
    "tiktok",
    "youtube",
    "find",
    "search",
    "discover",
    "show me",
    "looking for",
    "need",
    "want",
    "recommend",
    "suggest",
    "who has",
    "with followers",
    "with engagement",
  ];

  const hasIntent = searchKeywords.some((keyword) => lowerMsg.includes(keyword));

  logger.info("Intent detection", { message, hasIntent });

  return hasIntent;
}

/**
 * Detect if message is a greeting
 */
export function isGreeting(message: string): boolean {
  const lowerMsg = message.toLowerCase().trim();

  const greetingPatterns = /^(hi|hello|hey|greetings|good morning|good evening|good afternoon|what's up|whats up|howdy|assalam|salam)\b/i;

  return greetingPatterns.test(lowerMsg);
}

/**
 * Detect if message is asking a question (not searching)
 */
export function isQuestion(message: string): boolean {
  const lowerMsg = message.toLowerCase().trim();

  // Question words that don't indicate search intent
  const questionWords = ["how", "what", "when", "where", "why", "can you", "could you", "would you"];

  // Check if starts with question word but doesn't include search keywords
  const startsWithQuestion = questionWords.some((word) => lowerMsg.startsWith(word));

  // If it's a question but also mentions influencers/search, it's still search intent
  if (startsWithQuestion && !isInfluencerSearchIntent(message)) {
    return true;
  }

  return false;
}

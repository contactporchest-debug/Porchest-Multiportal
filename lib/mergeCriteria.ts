/**
 * Smart Criteria Merging with Overwrite Rules
 * Fixes the "stuck on old criteria" bug
 */

import { logger } from "@/lib/logger";
import type { SearchCriteria } from "@/lib/extractCriteriaWithGemini";

/**
 * Merge old and new criteria with smart overwrite rules
 *
 * RULES:
 * 1. New category WITHOUT "also" → OVERWRITE old category
 * 2. New category WITH "also" → MERGE categories (keep both)
 * 3. New location → OVERWRITE old location
 * 4. "any location/worldwide" → REMOVE location filter
 * 5. New followers → OVERWRITE old followers
 * 6. New engagement → OVERWRITE old engagement
 * 7. New platforms → OVERWRITE old platforms (unless "also")
 */
export function mergeCriteria(
  oldCriteria: SearchCriteria | null,
  newCriteria: SearchCriteria,
  message: string
): SearchCriteria {
  // If no old criteria, just return new
  if (!oldCriteria) {
    logger.info("No old criteria, using new criteria", { newCriteria });
    return newCriteria;
  }

  const lowerMsg = message.toLowerCase();

  // Detect merge intent keywords
  const hasMergeIntent =
    lowerMsg.includes("also") ||
    lowerMsg.includes("add") ||
    lowerMsg.includes("plus") ||
    lowerMsg.includes("along with") ||
    lowerMsg.includes("as well") ||
    lowerMsg.includes("and");

  // Detect location removal intent
  const hasLocationRemoval =
    lowerMsg.includes("any location") ||
    lowerMsg.includes("anywhere") ||
    lowerMsg.includes("worldwide") ||
    lowerMsg.includes("all locations") ||
    lowerMsg.includes("no location") ||
    lowerMsg.includes("remove location");

  const merged: SearchCriteria = {};

  // ============================================================================
  // CATEGORY MERGING
  // ============================================================================

  if (newCriteria.category) {
    if (hasMergeIntent && oldCriteria.category && oldCriteria.category !== newCriteria.category) {
      // Merge: keep both categories
      merged.category = `${oldCriteria.category}, ${newCriteria.category}`;
      logger.info("Category merge (also detected)", {
        old: oldCriteria.category,
        new: newCriteria.category,
        merged: merged.category,
      });
    } else {
      // Overwrite: new category replaces old
      merged.category = newCriteria.category;
      if (oldCriteria.category && oldCriteria.category !== newCriteria.category) {
        logger.info("Category overwrite (no 'also')", {
          old: oldCriteria.category,
          new: newCriteria.category,
        });
      }
    }
  } else {
    // No new category mentioned, keep old
    merged.category = oldCriteria.category;
  }

  // ============================================================================
  // LOCATION MERGING
  // ============================================================================

  if (hasLocationRemoval) {
    // Explicitly remove location
    merged.location = undefined;
    logger.info("Location removed (any location/worldwide)", {
      old: oldCriteria.location,
    });
  } else if (newCriteria.location) {
    // New location always overwrites old
    merged.location = newCriteria.location;
    if (oldCriteria.location && oldCriteria.location !== newCriteria.location) {
      logger.info("Location overwrite", {
        old: oldCriteria.location,
        new: newCriteria.location,
      });
    }
  } else {
    // No new location, keep old
    merged.location = oldCriteria.location;
  }

  // ============================================================================
  // FOLLOWER RANGE MERGING
  // ============================================================================

  // New values overwrite old
  if (newCriteria.minFollowers !== undefined) {
    merged.minFollowers = newCriteria.minFollowers;
  } else {
    merged.minFollowers = oldCriteria.minFollowers;
  }

  if (newCriteria.maxFollowers !== undefined) {
    merged.maxFollowers = newCriteria.maxFollowers;
  } else {
    merged.maxFollowers = oldCriteria.maxFollowers;
  }

  // ============================================================================
  // ENGAGEMENT MERGING
  // ============================================================================

  if (newCriteria.minEngagement !== undefined) {
    merged.minEngagement = newCriteria.minEngagement;
  } else {
    merged.minEngagement = oldCriteria.minEngagement;
  }

  // ============================================================================
  // PLATFORMS MERGING
  // ============================================================================

  if (newCriteria.platforms && newCriteria.platforms.length > 0) {
    if (hasMergeIntent && oldCriteria.platforms && oldCriteria.platforms.length > 0) {
      // Merge: combine unique platforms
      const combined = [...new Set([...oldCriteria.platforms, ...newCriteria.platforms])];
      merged.platforms = combined;
      logger.info("Platforms merge (also detected)", {
        old: oldCriteria.platforms,
        new: newCriteria.platforms,
        merged: combined,
      });
    } else {
      // Overwrite
      merged.platforms = newCriteria.platforms;
    }
  } else {
    // Keep old
    merged.platforms = oldCriteria.platforms;
  }

  // ============================================================================
  // VERIFIED MERGING
  // ============================================================================

  if (newCriteria.verified !== undefined) {
    merged.verified = newCriteria.verified;
  } else {
    merged.verified = oldCriteria.verified;
  }

  logger.info("Criteria merged", {
    old: oldCriteria,
    new: newCriteria,
    merged,
    hasMergeIntent,
    hasLocationRemoval,
  });

  return merged;
}

/**
 * Detect if user is changing intent (switching to a different niche)
 * This helps UI reset the conversation when user pivots
 */
export function isIntentChange(
  oldCriteria: SearchCriteria | null,
  newCriteria: SearchCriteria,
  message: string
): boolean {
  if (!oldCriteria || !oldCriteria.category) {
    return false;
  }

  const lowerMsg = message.toLowerCase();
  const hasMergeIntent = lowerMsg.includes("also") || lowerMsg.includes("add");

  // User changed category without "also" = intent change
  if (
    newCriteria.category &&
    oldCriteria.category !== newCriteria.category &&
    !hasMergeIntent
  ) {
    return true;
  }

  return false;
}

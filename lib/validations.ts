/**
 * Zod Validation Schemas
 * Input validation for all API routes
 */

import { z } from "zod";
import { ObjectId } from "mongodb";

// ============================================================================
// COMMON VALIDATORS
// ============================================================================

/**
 * MongoDB ObjectId validator
 */
export const objectIdSchema = z.string().refine(
  (val) => {
    try {
      new ObjectId(val);
      return true;
    } catch {
      return false;
    }
  },
  { message: "Invalid ObjectId format" }
);

/**
 * Email validator
 */
export const emailSchema = z
  .string()
  .email("Invalid email format")
  .toLowerCase()
  .trim();

/**
 * Password validator
 * Relaxed requirements for better UX - minimum 6 characters
 */
export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters");

/**
 * Phone validator
 */
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
  .optional();

/**
 * URL validator
 */
export const urlSchema = z.string().url("Invalid URL format").optional();

/**
 * Positive number validator
 */
export const positiveNumberSchema = z
  .number()
  .positive("Must be a positive number");

/**
 * Non-negative number validator
 */
export const nonNegativeNumberSchema = z
  .number()
  .min(0, "Must be non-negative");

// ============================================================================
// USER VALIDATION SCHEMAS
// ============================================================================

export const userRoleSchema = z.enum([
  "brand",
  "influencer",
  "client",
  "employee",
  "admin",
]);

export const userStatusSchema = z.enum([
  "PENDING",
  "ACTIVE",
  "REJECTED",
  "SUSPENDED",
]);

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).trim(),
  email: emailSchema,
  password: passwordSchema,
  role: userRoleSchema,
  phone: phoneSchema,
  company: z.string().max(200).optional(),
});

export const updateUserSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  phone: phoneSchema,
  company: z.string().max(200).optional(),
  profile_completed: z.boolean().optional(),
});

export const verifyUserSchema = z.object({
  userId: objectIdSchema,
  action: z.enum(["approve", "reject"]),
  reason: z.string().max(500).optional(),
});

export const getUsersFilterSchema = z.object({
  role: userRoleSchema.optional(),
  status: userStatusSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// ============================================================================
// CAMPAIGN VALIDATION SCHEMAS
// ============================================================================

export const campaignStatusSchema = z.enum([
  "draft",
  "active",
  "paused",
  "completed",
  "cancelled",
]);

export const createCampaignSchema = z.object({
  name: z.string().min(3, "Campaign name must be at least 3 characters").max(200),
  description: z.string().max(2000).optional(),
  objectives: z.array(z.string().max(200)).max(10).optional(),
  target_audience: z
    .object({
      age_range: z
        .object({
          min: z.number().int().min(13).max(100),
          max: z.number().int().min(13).max(100),
        })
        .refine((data) => data.min <= data.max, {
          message: "Min age must be less than or equal to max age",
        })
        .optional(),
      gender: z.array(z.string()).optional(),
      locations: z.array(z.string().max(100)).max(50).optional(),
      interests: z.array(z.string().max(100)).max(50).optional(),
    })
    .optional(),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  budget: positiveNumberSchema,
  status: campaignStatusSchema.optional(),
});

export const updateCampaignSchema = z.object({
  name: z.string().min(3).max(200).optional(),
  description: z.string().max(2000).optional(),
  objectives: z.array(z.string().max(200)).max(10).optional(),
  target_audience: createCampaignSchema.shape.target_audience,
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  budget: positiveNumberSchema.optional(),
  spent_amount: nonNegativeNumberSchema.optional(),
  status: campaignStatusSchema.optional(),
  metrics: z
    .object({
      total_reach: nonNegativeNumberSchema.optional(),
      total_impressions: nonNegativeNumberSchema.optional(),
      total_engagement: nonNegativeNumberSchema.optional(),
      total_clicks: nonNegativeNumberSchema.optional(),
      total_conversions: nonNegativeNumberSchema.optional(),
      engagement_rate: z.number().min(0).max(100).optional(),
      estimated_roi: z.number().optional(),
    })
    .optional(),
});

export const getCampaignsFilterSchema = z.object({
  status: campaignStatusSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// ============================================================================
// INFLUENCER VALIDATION SCHEMAS
// ============================================================================

export const platformSchema = z.enum([
  "instagram",
  "youtube",
  "tiktok",
  "twitter",
  "facebook",
]);

export const influencerProfileSetupSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters").max(100).trim(),
  instagram_username: z.string().max(100).optional(),
  profile_picture: urlSchema,
  niche: z.string().min(2, "Niche must be at least 2 characters").max(100).trim(),
  location: z.string().min(2, "Location must be at least 2 characters").max(200).trim(),
  followers: nonNegativeNumberSchema.optional(),
  following: nonNegativeNumberSchema.optional(),
  verified: z.boolean().optional(),
  engagement_rate: z.number().min(0).max(100).optional(),
  average_views_monthly: nonNegativeNumberSchema.optional(),
  last_post_views: nonNegativeNumberSchema.optional(),
  last_post_engagement: nonNegativeNumberSchema.optional(),
  last_post_date: z.coerce.date().optional(),
  price_per_post: positiveNumberSchema.optional(),
  availability: z.string().max(50).optional(),
  languages: z.array(z.string().max(50)).max(20).optional(),
  platforms: z.array(z.string().max(50)).max(10).optional(),
  brands_worked_with: z.array(z.string().max(100)).max(50).optional(),
});

export const updateInfluencerProfileSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  instagram_username: z.string().max(100).optional(),
  profile_picture: urlSchema,
  niche: z.string().min(2).max(100).optional(),
  location: z.string().min(2).max(200).optional(),
  followers: nonNegativeNumberSchema.optional(),
  following: nonNegativeNumberSchema.optional(),
  verified: z.boolean().optional(),
  engagement_rate: z.number().min(0).max(100).optional(),
  average_views_monthly: nonNegativeNumberSchema.optional(),
  last_post_views: nonNegativeNumberSchema.optional(),
  last_post_engagement: nonNegativeNumberSchema.optional(),
  last_post_date: z.coerce.date().optional(),
  price_per_post: positiveNumberSchema.optional(),
  availability: z.string().max(50).optional(),
  languages: z.array(z.string().max(50)).max(20).optional(),
  platforms: z.array(z.string().max(50)).max(10).optional(),
  brands_worked_with: z.array(z.string().max(100)).max(50).optional(),
});

/**
 * Influencer Basic Info Setup Schema
 * For the new profile setup flow at /influencer/profile/setup
 */
export const influencerBasicInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).trim(),
  category: z.string().min(2, "Category must be at least 2 characters").max(100).trim(),
  bio: z.string().min(10, "Bio must be at least 10 characters").max(500).trim(),
  country: z.string().min(2, "Country must be at least 2 characters").max(100).trim(),
  city: z.string().min(2, "City must be at least 2 characters").max(100).trim(),
  languages: z.array(z.string().max(50)).min(1, "Select at least one language").max(10),
  email: emailSchema,
  brand_preferences: z.array(z.string().max(100)).max(20).default([]),
});

export const recommendInfluencersSchema = z.object({
  campaign_id: objectIdSchema.optional(),
  budget: positiveNumberSchema.optional(),
  platform: platformSchema.optional(),
  min_followers: nonNegativeNumberSchema.optional(),
  max_followers: nonNegativeNumberSchema.optional(),
  categories: z.array(z.string().max(50)).max(20).optional(),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

// ============================================================================
// COLLABORATION VALIDATION SCHEMAS
// ============================================================================

export const collaborationStatusSchema = z.enum([
  "pending",
  "accepted",
  "rejected",
  "completed",
  "cancelled",
]);

export const createCollaborationSchema = z.object({
  campaign_id: objectIdSchema,
  influencer_id: objectIdSchema,
  offer_amount: positiveNumberSchema,
  deliverables: z.array(z.string().max(500)).min(1, "At least one deliverable is required"),
  deadline: z.coerce.date().optional(),
  message: z.string().max(1000).optional(),
});

export const updateCollaborationSchema = z.object({
  action: z.enum(["accept", "reject", "complete", "cancel"]),
  response: z.string().max(1000).optional(),
});

export const getCollaborationsFilterSchema = z.object({
  status: collaborationStatusSchema.optional(),
  campaign_id: objectIdSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// ============================================================================
// TRANSACTION VALIDATION SCHEMAS
// ============================================================================

export const transactionTypeSchema = z.enum([
  "withdrawal",
  "payment",
  "refund",
  "bonus",
  "adjustment",
]);

export const paymentMethodSchema = z.enum([
  "bank_transfer",
  "paypal",
  "stripe",
  "other",
]);

export const createWithdrawalSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be positive")
    .min(10, "Minimum withdrawal amount is $10")
    .max(100000, "Maximum withdrawal amount is $100,000"),
  payment_method: paymentMethodSchema,
  payment_details: z
    .object({
      account_number: z.string().max(50).optional(),
      account_name: z.string().max(100).optional(),
      bank_name: z.string().max(100).optional(),
      routing_number: z.string().max(50).optional(),
      paypal_email: emailSchema.optional(),
    })
    .refine(
      (data) => {
        // At least one payment detail must be provided
        return Object.values(data).some((val) => val !== undefined);
      },
      { message: "Payment details are required" }
    ),
});

// ============================================================================
// DAILY REPORT VALIDATION SCHEMAS
// ============================================================================

export const createDailyReportSchema = z.object({
  date: z.coerce.date(),
  tasks_completed: z
    .array(z.string().max(500))
    .min(1, "At least one completed task is required")
    .max(20, "Maximum 20 tasks per report"),
  hours_worked: z
    .number()
    .min(0, "Hours worked must be non-negative")
    .max(24, "Hours worked cannot exceed 24 in a day"),
  projects_worked_on: z.array(objectIdSchema).max(10).optional(),
  achievements: z.string().max(1000).optional(),
  blockers: z.string().max(1000).optional(),
  next_day_plan: z.string().max(1000).optional(),
  productivity_rating: z.number().int().min(1).max(5).optional(),
  mood: z.enum(["excellent", "good", "neutral", "poor"]).optional(),
});

// ============================================================================
// AI VALIDATION SCHEMAS
// ============================================================================

export const predictROISchema = z.object({
  campaign_id: objectIdSchema.optional(),
  influencer_id: objectIdSchema.optional(),
  budget: positiveNumberSchema,
  followers: nonNegativeNumberSchema,
  engagement_rate: z.number().min(0).max(100),
  platform: platformSchema,
  content_type: z.enum(["post", "story", "video", "reel"]).optional(),
});

export const sentimentAnalysisSchema = z.object({
  campaign_id: objectIdSchema,
  texts: z.array(z.string().max(5000)).min(1).max(100),
});

export const detectFraudSchema = z.object({
  entity_type: z.enum(["user", "campaign", "transaction", "influencer"]),
  entity_id: objectIdSchema,
  additional_data: z.record(z.any()).optional(),
});

// ============================================================================
// BRAND PROFILE VALIDATION SCHEMAS
// ============================================================================

export const brandProfileSetupSchema = z.object({
  brand_name: z.string().min(2, "Brand name must be at least 2 characters").max(200).trim(),
  contact_email: emailSchema,
  representative_name: z.string().min(2, "Representative name must be at least 2 characters").max(100).trim(),
  niche: z.string().min(2, "Niche must be at least 2 characters").max(100).trim(),
  industry: z.string().min(2, "Industry must be at least 2 characters").max(100).trim(),
  location: z.string().min(2, "Location must be at least 2 characters").max(200).trim(),
  website: urlSchema,
  company_description: z.string().max(2000).optional(),
  preferred_platforms: z.array(z.string().max(50)).max(20).optional(),
});

export const updateBrandProfileSchema = z.object({
  brand_name: z.string().min(2).max(200).optional(),
  representative_name: z.string().min(2).max(100).optional(),
  contact_email: emailSchema.optional(),
  niche: z.string().min(2).max(100).optional(),
  industry: z.string().min(2).max(100).optional(),
  location: z.string().min(2).max(200).optional(),
  website: urlSchema,
  company_description: z.string().max(2000).optional(),
  preferred_platforms: z.array(z.string().max(50)).max(20).optional(),
});

// ============================================================================
// ADMIN VALIDATION SCHEMAS
// ============================================================================

export const approveUserSchema = z.object({
  user_id: objectIdSchema,
  action: z.enum(["approve", "reject"]),
  reason: z.string().max(500).optional(),
});

// ============================================================================
// PAGINATION VALIDATION
// ============================================================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Parse and validate request body
 * @param schema - Zod schema
 * @param data - Request body data
 * @returns Validated and parsed data
 * @throws ZodError if validation fails
 */
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Parse and validate query parameters
 * @param schema - Zod schema
 * @param params - Query parameters from URL
 * @returns Validated and parsed params
 */
export function validateQuery<T>(
  schema: z.ZodSchema<T>,
  params: URLSearchParams | Record<string, any>
): T {
  const data = params instanceof URLSearchParams ? Object.fromEntries(params) : params;
  return schema.parse(data);
}

/**
 * Safe validation that returns result object instead of throwing
 * @param schema - Zod schema
 * @param data - Data to validate
 * @returns Object with success boolean and either data or error
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

/**
 * Format Zod error for API response
 * @param error - Zod error
 * @returns Formatted error object
 */
export function formatValidationError(error: z.ZodError): {
  message: string;
  errors: Array<{ field: string; message: string }>;
} {
  return {
    message: "Validation failed",
    errors: error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    })),
  };
}

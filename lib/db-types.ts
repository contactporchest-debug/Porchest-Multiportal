/**
 * Database Type Definitions
 * TypeScript interfaces for all MongoDB collections
 */

import { ObjectId } from "mongodb";

// ============================================================================
// USER TYPES
// ============================================================================

export type UserRole = "admin" | "brand" | "influencer" | "client" | "employee";
export type UserStatus = "PENDING" | "ACTIVE" | "REJECTED" | "SUSPENDED";

export interface User {
  _id: ObjectId;
  full_name?: string;
  email: string;
  password_hash?: string;
  role: UserRole;

  // Admin verification
  status: UserStatus;
  verified: boolean;
  verified_at?: Date;
  approved_by?: ObjectId;
  approved_at?: Date;
  rejection_reason?: string;

  // OAuth fields (Auth.js compatibility)
  image?: string;
  emailVerified?: Date;

  // Additional info
  phone?: string;
  company?: string;
  profile_completed: boolean;

  // Timestamps
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
}

export interface UserCreateInput {
  full_name?: string;
  email: string;
  password_hash?: string;
  role: UserRole;
  status?: UserStatus;
  verified?: boolean;
  phone?: string;
  company?: string;
  profile_completed?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================================================
// CAMPAIGN TYPES
// ============================================================================

export type CampaignStatus = "draft" | "active" | "paused" | "completed" | "cancelled";

export interface Campaign {
  _id: ObjectId;
  brand_id: ObjectId;
  name: string;
  description?: string;
  objectives?: string[];
  target_audience?: {
    age_range?: { min: number; max: number };
    gender?: string[];
    locations?: string[];
    interests?: string[];
  };
  start_date?: Date;
  end_date?: Date;
  budget: number;
  spent_amount: number;
  status: CampaignStatus;

  // Performance metrics
  metrics: {
    total_reach: number;
    total_impressions: number;
    total_engagement: number;
    total_clicks: number;
    total_conversions: number;
    engagement_rate: number;
    estimated_roi: number;
  };

  // Influencers
  influencers?: ObjectId[];

  // Sentiment analysis
  sentiment_analysis?: {
    positive: number;
    neutral: number;
    negative: number;
    total_comments_analyzed: number;
    last_analyzed?: Date;
  };

  created_at: Date;
  updated_at: Date;
}

export interface CampaignCreateInput {
  brand_id: ObjectId;
  name: string;
  description?: string;
  objectives?: string[];
  target_audience?: Campaign["target_audience"];
  start_date?: Date;
  end_date?: Date;
  budget: number;
  spent_amount?: number;
  status?: CampaignStatus;
  metrics?: Partial<Campaign["metrics"]>;
  influencers?: ObjectId[];
  sentiment_analysis?: Campaign["sentiment_analysis"];
  created_at?: Date;
  updated_at?: Date;
}

// ============================================================================
// INFLUENCER PROFILE TYPES
// ============================================================================

export interface InstagramAccount {
  instagram_user_id?: string;
  instagram_business_account_id?: string;
  username?: string;
  access_token?: string;
  token_type?: "short" | "long";
  token_expires_at?: Date;
  page_id?: string;
  is_connected: boolean;
  last_synced_at?: Date;
}

export interface InstagramMetrics {
  followers_count?: number;
  follows_count?: number;
  media_count?: number;
  profile_views?: number;
  reach?: number;
  impressions?: number;
  engagement_rate?: number;
  website_clicks?: number;
  email_contacts?: number;
  phone_call_clicks?: number;
  get_directions_clicks?: number;
  text_message_clicks?: number;
}

export interface InstagramDemographics {
  audience_city?: Record<string, number>;
  audience_country?: Record<string, number>;
  audience_gender_age?: Record<string, number>;
  audience_locale?: Record<string, number>;
}

export interface InfluencerProfile {
  _id: ObjectId;
  user_id: ObjectId;

  // Basic Information
  full_name: string;
  instagram_username?: string;
  profile_picture?: string;
  niche: string;
  location: string;

  // Social Media Metrics
  followers: number;
  following: number;
  verified: boolean;
  engagement_rate: number; // Percentage
  average_views_monthly: number;

  // Recent Post Stats
  last_post_views?: number;
  last_post_engagement?: number;
  last_post_date?: Date;

  // Pricing & Availability
  price_per_post: number;
  availability: string; // e.g., "Available", "Busy", "Not Available"

  // Additional Info
  languages: string[]; // Array of languages
  platforms: string[]; // Array of platforms (e.g., ["Instagram", "TikTok"])
  brands_worked_with: string[]; // Array of brand names

  // Instagram Integration
  instagram_account?: InstagramAccount;
  instagram_metrics?: InstagramMetrics;
  instagram_demographics?: InstagramDemographics;

  // Financials (kept from original)
  total_earnings: number;
  available_balance: number;

  // Performance (kept from original)
  completed_campaigns: number;
  rating: number;
  reviews_count: number;

  // Profile Status
  profile_completed: boolean;

  // Timestamps
  created_at: Date;
  updated_at: Date;
}

export interface InfluencerProfileCreateInput {
  user_id: ObjectId;
  full_name: string;
  instagram_username?: string;
  profile_picture?: string;
  niche: string;
  location: string;
  followers?: number;
  following?: number;
  verified?: boolean;
  engagement_rate?: number;
  average_views_monthly?: number;
  last_post_views?: number;
  last_post_engagement?: number;
  last_post_date?: Date;
  price_per_post?: number;
  availability?: string;
  languages?: string[];
  platforms?: string[];
  brands_worked_with?: string[];
  total_earnings?: number;
  available_balance?: number;
  completed_campaigns?: number;
  rating?: number;
  reviews_count?: number;
  profile_completed?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================================================
// BRAND PROFILE TYPES
// ============================================================================

export interface BrandProfile {
  _id: ObjectId;
  user_id: ObjectId;

  // Core Brand Information
  brand_name: string;
  brand_id: string; // Auto-generated unique identifier
  contact_email: string;
  representative_name: string;
  niche: string;
  industry: string;
  location: string;

  // Optional Information
  website?: string;
  company_description?: string;
  preferred_platforms?: string[];

  // Campaign Tracking
  active_campaigns: any[]; // Array of campaign references

  // Profile Status
  profile_completed: boolean;

  // Timestamps
  created_at: Date;
  updated_at: Date;
}

export interface BrandProfileCreateInput {
  user_id: ObjectId;
  brand_name: string;
  brand_id: string;
  contact_email: string;
  representative_name: string;
  niche: string;
  industry: string;
  location: string;
  website?: string;
  company_description?: string;
  preferred_platforms?: string[];
  active_campaigns?: any[];
  profile_completed?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================================================
// COLLABORATION REQUEST TYPES
// ============================================================================

export type CollaborationStatus = "pending" | "accepted" | "rejected" | "completed" | "cancelled";

export interface CollaborationRequest {
  _id: ObjectId;
  campaign_id: ObjectId;
  brand_id: ObjectId;
  influencer_id: ObjectId;

  status: CollaborationStatus;
  offer_amount: number;
  deliverables: string[];
  deadline?: Date;
  message?: string;

  // Response
  influencer_response?: string;
  responded_at?: Date;

  // Completion
  completed_at?: Date;
  payment_status?: "pending" | "paid" | "failed";
  payment_date?: Date;

  created_at: Date;
  updated_at: Date;
}

export interface CollaborationRequestCreateInput {
  campaign_id: ObjectId;
  brand_id: ObjectId;
  influencer_id: ObjectId;
  status?: CollaborationStatus;
  offer_amount: number;
  deliverables: string[];
  deadline?: Date;
  message?: string;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================================================
// PROJECT TYPES (For Client Portal)
// ============================================================================

export type ProjectStatus = "planning" | "active" | "on-hold" | "completed" | "cancelled";

export interface Project {
  _id: ObjectId;
  client_id: ObjectId;
  name: string;
  description?: string;

  status: ProjectStatus;
  priority?: "low" | "medium" | "high" | "urgent";

  // Timeline
  start_date?: Date;
  end_date?: Date;
  estimated_completion?: Date;

  // Budget
  budget?: number;
  spent?: number;

  // Team
  assigned_employees?: ObjectId[];
  project_manager?: ObjectId;

  // Progress
  progress_percentage: number;
  milestones?: Array<{
    name: string;
    description?: string;
    due_date?: Date;
    completed: boolean;
    completed_at?: Date;
  }>;

  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// DAILY REPORT TYPES (For Employee Portal)
// ============================================================================

export interface DailyReport {
  _id: ObjectId;
  employee_id: ObjectId;
  date: Date;

  // Work summary
  tasks_completed: string[];
  hours_worked: number;
  projects_worked_on?: ObjectId[];

  // Progress
  achievements?: string;
  blockers?: string;
  next_day_plan?: string;

  // Status
  productivity_rating?: number; // 1-5
  mood?: "excellent" | "good" | "neutral" | "poor";

  submitted_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface DailyReportCreateInput {
  employee_id: ObjectId;
  date: Date;
  tasks_completed: string[];
  hours_worked: number;
  projects_worked_on?: ObjectId[];
  achievements?: string;
  blockers?: string;
  next_day_plan?: string;
  productivity_rating?: number;
  mood?: DailyReport["mood"];
  submitted_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================================================
// TRANSACTION TYPES
// ============================================================================

export type TransactionType = "withdrawal" | "payment" | "refund" | "bonus" | "adjustment";
export type TransactionStatus = "pending" | "processing" | "completed" | "failed" | "cancelled";

export interface Transaction {
  _id: ObjectId;
  user_id: ObjectId;
  type: TransactionType;
  amount: number;

  status: TransactionStatus;

  // Details
  description?: string;
  reference_id?: string; // External payment reference

  // Related entities
  campaign_id?: ObjectId;
  collaboration_id?: ObjectId;

  // Payment method
  payment_method?: "bank_transfer" | "paypal" | "stripe" | "other";
  payment_details?: {
    account_number?: string;
    account_name?: string;
    bank_name?: string;
    routing_number?: string;
    paypal_email?: string;
  };

  // Processing
  processed_at?: Date;
  processed_by?: ObjectId;

  // Failure
  failure_reason?: string;
  failed_at?: Date;

  created_at: Date;
  updated_at: Date;
}

export interface TransactionCreateInput {
  user_id: ObjectId;
  type: TransactionType;
  amount: number;
  status?: TransactionStatus;
  description?: string;
  reference_id?: string;
  campaign_id?: ObjectId;
  collaboration_id?: ObjectId;
  payment_method?: Transaction["payment_method"];
  payment_details?: Transaction["payment_details"];
  created_at?: Date;
  updated_at?: Date;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export type NotificationType = "info" | "success" | "warning" | "error" | "alert";

export interface Notification {
  _id: ObjectId;
  user_id: ObjectId;

  type: NotificationType;
  title: string;
  message: string;

  // Status
  read: boolean;
  read_at?: Date;

  // Action
  action_url?: string;
  action_label?: string;

  // Related entities
  related_entity?: {
    type: "campaign" | "collaboration" | "transaction" | "user" | "project";
    id: ObjectId;
  };

  created_at: Date;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface Analytics {
  _id: ObjectId;
  entity_type: "campaign" | "influencer" | "brand" | "platform";
  entity_id: ObjectId;

  date: Date;

  // Metrics
  metrics: {
    impressions?: number;
    reach?: number;
    engagement?: number;
    clicks?: number;
    conversions?: number;
    revenue?: number;
    cost?: number;
    roi?: number;
  };

  // Breakdown
  by_platform?: Record<string, number>;
  by_demographic?: Record<string, number>;
  by_region?: Record<string, number>;

  created_at: Date;
}

// ============================================================================
// AUDIT LOG TYPES
// ============================================================================

export interface AuditLog {
  _id: ObjectId;
  user_id?: ObjectId;

  action: string;
  entity_type: string;
  entity_id?: ObjectId;

  // Request details
  ip_address?: string;
  user_agent?: string;

  // Changes
  changes?: {
    before?: any;
    after?: any;
  };

  // Result
  success: boolean;
  error_message?: string;

  timestamp: Date;
}

// ============================================================================
// PAYMENT TYPES
// ============================================================================

export interface Payment {
  _id: ObjectId;
  from_user_id: ObjectId;
  to_user_id: ObjectId;

  amount: number;
  currency: string;

  // Related
  campaign_id?: ObjectId;
  collaboration_id?: ObjectId;

  // Status
  status: "pending" | "completed" | "failed" | "refunded";

  // Payment gateway
  gateway: "stripe" | "paypal" | "bank_transfer" | "manual";
  gateway_transaction_id?: string;

  // Timestamps
  completed_at?: Date;
  failed_at?: Date;
  refunded_at?: Date;

  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// POST TYPES (Content Posts)
// ============================================================================

export interface Post {
  _id: ObjectId;
  influencer_id: ObjectId;
  campaign_id?: ObjectId;

  platform: "instagram" | "youtube" | "tiktok" | "twitter" | "facebook";
  post_url: string;
  post_type: "image" | "video" | "story" | "reel" | "carousel";

  // Content
  caption?: string;
  thumbnail_url?: string;

  // Metrics
  likes: number;
  comments: number;
  shares: number;
  views: number;
  engagement_rate: number;

  // Analysis
  sentiment?: "positive" | "neutral" | "negative";
  sentiment_score?: number;

  posted_at: Date;
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// FRAUD DETECTION TYPES
// ============================================================================

export interface FraudDetection {
  _id: ObjectId;
  entity_type: "user" | "campaign" | "transaction" | "influencer";
  entity_id: ObjectId;

  is_fraud: boolean;
  fraud_probability: number;

  // Reasons
  fraud_indicators: string[];
  risk_score: number;

  // Details
  detection_method: "manual" | "ai" | "rule-based";
  detected_by?: ObjectId;

  // Action taken
  action_taken?: "flagged" | "suspended" | "banned" | "cleared";
  action_notes?: string;

  detected_at: Date;
  reviewed_at?: Date;
  reviewed_by?: ObjectId;
}

// ============================================================================
// HELPER TYPES
// ============================================================================

// For sanitizing ObjectIds to strings in API responses
export type Sanitized<T> = {
  [K in keyof T]: T[K] extends ObjectId
    ? string
    : T[K] extends ObjectId | undefined
    ? string | undefined
    : T[K] extends Date
    ? string
    : T[K] extends Date | undefined
    ? string | undefined
    : T[K] extends Array<infer U>
    ? Array<Sanitized<U>>
    : T[K] extends object
    ? Sanitized<T[K]>
    : T[K];
};

// For API responses with pagination
export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

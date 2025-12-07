/**
 * Database Type Definitions - REFACTORED
 * Clean master identity table + portal-specific profiles
 */

import { ObjectId } from "mongodb";

// ============================================================================
// USER TYPES (MASTER IDENTITY TABLE)
// ============================================================================

export type UserRole = "admin" | "brand" | "influencer" | "client" | "employee";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

/**
 * User - Master Identity Table
 * Stores ONLY authentication and role info
 * Portal-specific data lives in BrandProfile, InfluencerProfile, etc.
 */
export interface User {
  _id: ObjectId;
  full_name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  profile_completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserCreateInput {
  full_name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  status?: UserStatus;
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
  };

  created_at: Date;
  updated_at: Date;
}

export interface CampaignCreateInput {
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
  spent_amount?: number;
  status?: CampaignStatus;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================================================
// INSTAGRAM INTEGRATION TYPES
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
}

export interface InstagramDemographics {
  audience_city?: Record<string, number>;
  audience_country?: Record<string, number>;
  audience_gender_age?: Record<string, number>;
  audience_locale?: Record<string, number>;
}

// ============================================================================
// INFLUENCER PROFILE TYPES
// ============================================================================

export type Industry =
  | "Fitness"
  | "Food"
  | "Fashion"
  | "Family"
  | "Vlogging"
  | "Entertainment"
  | "Educational"
  | "Comedy"
  | "Music";

export interface InfluencerProfile {
  _id: ObjectId;
  user_id: ObjectId; // References users._id

  // Basic Information
  full_name: string;
  instagram_username?: string;
  profile_picture?: string;
  industry: Industry;
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

  // Calculated Metrics (from recent posts)
  calculated_metrics?: {
    avg_likes: number;
    avg_comments: number;
    avg_reach: number;
    engagement_rate_30_days: number;
    followers_growth_rate: number;
    posting_frequency: number; // posts per week
    story_frequency: number; // stories per week
  };

  // Financials
  total_earnings: number;
  available_balance: number;

  // Performance
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
  full_name?: string;
  industry?: Industry;
  location?: string;
  followers?: number;
  following?: number;
  verified?: boolean;
  engagement_rate?: number;
  average_views_monthly?: number;
  price_per_post?: number;
  availability?: string;
  languages?: string[];
  platforms?: string[];
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
  user_id: ObjectId; // References users._id

  // Brand-specific fields (moved from users)
  brand_name?: string;
  company?: string; // Moved from users
  phone?: string; // Moved from users
  representative_name?: string;
  website?: string;
  industry?: string;
  location?: string;
  company_description?: string;

  // Unique identifier
  unique_brand_id?: string;

  // Campaign tracking
  total_campaigns: number;
  active_campaigns: number;
  total_spent: number;

  // Profile Status
  profile_completed: boolean;

  // Timestamps
  created_at: Date;
  updated_at: Date;
}

export interface BrandProfileCreateInput {
  user_id: ObjectId;
  brand_name?: string;
  company?: string;
  phone?: string;
  representative_name?: string;
  website?: string;
  industry?: string;
  location?: string;
  company_description?: string;
  unique_brand_id?: string;
  total_campaigns?: number;
  active_campaigns?: number;
  total_spent?: number;
  profile_completed?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================================================
// EMPLOYEE PROFILE TYPES
// ============================================================================

export interface EmployeeProfile {
  _id: ObjectId;
  user_id: ObjectId; // References users._id

  // Employee-specific fields
  employee_id?: string;
  department?: string;
  position?: string;
  phone?: string; // Moved from users
  hire_date?: Date;
  manager_id?: ObjectId;

  // Performance
  total_reports_submitted: number;
  average_rating: number;

  // Profile Status
  profile_completed: boolean;

  // Timestamps
  created_at: Date;
  updated_at: Date;
}

export interface EmployeeProfileCreateInput {
  user_id: ObjectId;
  employee_id?: string;
  department?: string;
  position?: string;
  phone?: string;
  hire_date?: Date;
  manager_id?: ObjectId;
  total_reports_submitted?: number;
  average_rating?: number;
  profile_completed?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================================================
// CLIENT PROFILE TYPES
// ============================================================================

export interface ClientProfile {
  _id: ObjectId;
  user_id: ObjectId; // References users._id

  // Client-specific fields
  company?: string; // Moved from users
  phone?: string; // Moved from users
  industry?: string;
  location?: string;
  company_size?: string;

  // Project tracking
  total_projects: number;
  active_projects: number;
  total_paid: number;

  // Profile Status
  profile_completed: boolean;

  // Timestamps
  created_at: Date;
  updated_at: Date;
}

export interface ClientProfileCreateInput {
  user_id: ObjectId;
  company?: string;
  phone?: string;
  industry?: string;
  location?: string;
  company_size?: string;
  total_projects?: number;
  active_projects?: number;
  total_paid?: number;
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
  budget: number;
  spent_amount: number;
  start_date?: Date;
  end_date?: Date;
  deliverables: string[];
  team_members: ObjectId[];
  created_at: Date;
  updated_at: Date;
}

export interface ProjectCreateInput {
  client_id: ObjectId;
  name: string;
  description?: string;
  status?: ProjectStatus;
  budget: number;
  spent_amount?: number;
  start_date?: Date;
  end_date?: Date;
  deliverables?: string[];
  team_members?: ObjectId[];
  created_at?: Date;
  updated_at?: Date;
}

// ============================================================================
// DAILY REPORT TYPES (For Employee Portal)
// ============================================================================

export type ReportStatus = "draft" | "submitted" | "approved" | "rejected";

export interface DailyReport {
  _id: ObjectId;
  employee_id: ObjectId;
  date: Date;
  projects_worked_on: string[];
  summary: string;
  blockers?: string;
  achievements?: string;
  next_day_plan?: string;
  total_hours: number;
  status: ReportStatus;
  approved_by?: ObjectId;
  approved_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface DailyReportCreateInput {
  employee_id: ObjectId;
  date: Date;
  projects_worked_on: string[];
  summary: string;
  blockers?: string;
  achievements?: string;
  next_day_plan?: string;
  total_hours: number;
  status?: ReportStatus;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================================================
// TRANSACTION TYPES
// ============================================================================

export type TransactionType = "withdrawal" | "payment" | "refund" | "bonus";
export type TransactionStatus = "pending" | "approved" | "rejected" | "completed" | "failed";

export interface Transaction {
  _id: ObjectId;
  user_id: ObjectId;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  payment_method?: string;
  payment_details?: Record<string, any>;
  reference_id?: string;
  campaign_id?: ObjectId;
  notes?: string;
  processed_by?: ObjectId;
  processed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface TransactionCreateInput {
  user_id: ObjectId;
  type: TransactionType;
  amount: number;
  currency?: string;
  status?: TransactionStatus;
  payment_method?: string;
  payment_details?: Record<string, any>;
  reference_id?: string;
  campaign_id?: ObjectId;
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export type NotificationType =
  | "campaign_invite"
  | "payment_received"
  | "report_approved"
  | "account_approved"
  | "message"
  | "system";

export interface Notification {
  _id: ObjectId;
  user_id: ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  read_at?: Date;
  action_url?: string;
  metadata?: Record<string, any>;
  created_at: Date;
}

export interface NotificationCreateInput {
  user_id: ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  read?: boolean;
  action_url?: string;
  metadata?: Record<string, any>;
  created_at?: Date;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface Analytics {
  _id: ObjectId;
  user_id: ObjectId;
  date: Date;
  page_views: number;
  unique_visitors: number;
  bounce_rate: number;
  avg_session_duration: number;
  top_pages: Array<{ url: string; views: number }>;
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// AUDIT LOG TYPES
// ============================================================================

export type AuditAction = "create" | "update" | "delete" | "login" | "logout" | "approve" | "reject";

export interface AuditLog {
  _id: ObjectId;
  user_id: ObjectId;
  action: AuditAction;
  resource_type: string;
  resource_id?: ObjectId;
  changes?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

export interface AuditLogCreateInput {
  user_id: ObjectId;
  action: AuditAction;
  resource_type: string;
  resource_id?: ObjectId;
  changes?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at?: Date;
}

// ============================================================================
// PAYMENT TYPES
// ============================================================================

export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded";

export interface Payment {
  _id: ObjectId;
  transaction_id: ObjectId;
  user_id: ObjectId;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_gateway?: string;
  gateway_transaction_id?: string;
  payment_method?: string;
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface PaymentCreateInput {
  transaction_id: ObjectId;
  user_id: ObjectId;
  amount: number;
  currency: string;
  status?: PaymentStatus;
  payment_gateway?: string;
  gateway_transaction_id?: string;
  payment_method?: string;
  metadata?: Record<string, any>;
  created_at?: Date;
  updated_at?: Date;
}

// ============================================================================
// POST TYPES (Instagram/Social Media)
// ============================================================================

export interface PostMetrics {
  likes: number;
  comments: number;
  saves?: number;
  shares?: number;
  reach?: number;
  impressions?: number;
  plays?: number; // for reels
  engagement_rate: number;
}

export interface Post {
  _id: ObjectId;
  post_id: string; // Instagram media ID
  user_id: ObjectId;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM" | "STORY";
  caption?: string;
  permalink?: string;
  timestamp: Date;
  metrics: PostMetrics;
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
  fraud_score: number;
  is_fraud: boolean;
  severity: "low" | "medium" | "high" | "critical";
  flags: string[];
  data: Record<string, any>;
  detected_by: "system" | "admin" | "ai";
  detected_at: Date;
  resolved: boolean;
  resolved_by?: ObjectId;
  resolved_at?: Date;
  created_at: Date;
}

export interface FraudDetectionCreateInput {
  entity_type: "user" | "campaign" | "transaction" | "influencer";
  entity_id: ObjectId;
  fraud_score: number;
  is_fraud: boolean;
  severity: "low" | "medium" | "high" | "critical";
  flags: string[];
  data: Record<string, any>;
  detected_by: "system" | "admin" | "ai";
  detected_at?: Date;
  resolved?: boolean;
  created_at?: Date;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Sanitized type - removes sensitive fields and converts ObjectId to string
 */
export type Sanitized<T> = Omit<
  {
    [K in keyof T]: T[K] extends ObjectId
      ? string
      : T[K] extends Date
      ? string
      : T[K] extends Array<infer U>
      ? U extends ObjectId
        ? string[]
        : U extends object
        ? Sanitized<U>[]
        : U[]
      : T[K] extends object
      ? Sanitized<T[K]>
      : T[K];
  },
  "password_hash" | "payment_details"
>;

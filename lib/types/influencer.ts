import { ObjectId } from "mongodb"

// ============================================================================
// INFLUENCER PROFILE TYPES
// ============================================================================

export interface BasicInfo {
  name: string
  category: string // niche
  bio: string
  country: string
  city: string
  languages: string[]
  email: string
  brand_preferences: string[]
}

export interface OnlineFollowers {
  [hour: string]: number // "0", "1", "2", ... "23"
}

export interface AudienceDemographics {
  audience_country?: Record<string, number> // { "US": 5000, "UK": 2000 }
  audience_city?: Record<string, number> // { "New York": 1000, "Los Angeles": 800 }
  audience_gender?: Record<string, number> // { "M": 6000, "F": 4000 }
  audience_age?: Record<string, number> // { "18-24": 3000, "25-34": 5000 }
  audience_gender_age?: Record<string, number> // { "M.18-24": 1500, "F.18-24": 1500 }
  audience_locale?: Record<string, number> // { "en_US": 8000, "es_ES": 2000 }
}

export interface CalculatedMetrics {
  avg_likes: number
  avg_comments: number
  avg_reach: number
  engagement_rate_30_days: number
  followers_growth_rate: number
  posting_frequency: number // posts per week
  story_frequency: number // stories per week
}

export interface InstagramAccount {
  account_id: string
  username: string
  followers_count: number
  follows_count: number
  media_count: number
  profile_views?: number
  website_clicks?: number
  email_contacts?: number
  phone_call_clicks?: number
  reach?: number
  impressions?: number
  engagement?: number
  online_followers?: OnlineFollowers
  demographics: AudienceDemographics
  calculated: CalculatedMetrics
}

export interface InfluencerProfile {
  _id?: ObjectId
  userId: ObjectId
  basic_info: BasicInfo
  instagram?: InstagramAccount
  access_token?: string
  access_token_expires_at?: Date
  token_type?: "short" | "long"
  last_synced_at?: Date
  created_at: Date
  updated_at: Date
}

// ============================================================================
// POSTS TYPES
// ============================================================================

export interface PostMetrics {
  likes: number
  comments: number
  saves?: number
  shares?: number
  reach?: number
  impressions?: number
  plays?: number // for reels
  taps_forward?: number // for stories
  taps_back?: number // for stories
  exits?: number // for stories
  link_clicks?: number // for stories
  watch_time?: number // total watch time in seconds
  avg_watch_time?: number // average watch time per view
  engagement_rate: number
}

export interface Post {
  _id?: ObjectId
  post_id: string // Instagram media ID
  userId: ObjectId
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM" | "STORY"
  caption?: string
  permalink?: string
  timestamp: Date
  metrics: PostMetrics
  created_at: Date
  updated_at: Date
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface MetaAuthResponse {
  authUrl: string
}

export interface MetaTokenResponse {
  access_token: string
  token_type: string
  expires_in?: number
}

export interface InstagramBusinessAccount {
  id: string
  username: string
  name?: string
  profile_picture_url?: string
  followers_count: number
  follows_count: number
  media_count: number
}

export interface InstagramInsight {
  name: string
  period: string
  values: Array<{
    value: number | Record<string, number>
    end_time: string
  }>
  title?: string
  description?: string
  id?: string
}

export interface InstagramMedia {
  id: string
  caption?: string
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"
  media_url?: string
  permalink: string
  timestamp: string
  username: string
  like_count?: number
  comments_count?: number
}

// ============================================================================
// FORM VALIDATION TYPES
// ============================================================================

export interface ProfileSetupFormData {
  name: string
  category: string
  bio: string
  country: string
  city: string
  languages: string[]
  email: string
  brand_preferences: string[]
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface SaveProfileRequest {
  basic_info: BasicInfo
}

export interface SaveProfileResponse {
  success: boolean
  data?: {
    profile: InfluencerProfile
  }
  error?: {
    message: string
    code?: string
  }
}

export interface SyncInstagramRequest {
  // No body needed
}

export interface SyncInstagramResponse {
  success: boolean
  data?: {
    profile: InfluencerProfile
    posts_synced: number
  }
  error?: {
    message: string
    code?: string
  }
}

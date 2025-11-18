/**
 * SWR Hooks for Influencer Profile Data
 * React hooks for fetching and managing influencer profile data
 */

import useSWR from "swr"
import { InfluencerProfile, Post } from "@/lib/types/influencer"

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json())

// ============================================================================
// PROFILE HOOKS
// ============================================================================

/**
 * Hook to fetch influencer profile setup data
 */
export function useInfluencerProfileSetup() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/influencer/profile-setup",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  return {
    profile: data?.data?.profile as InfluencerProfile | null,
    hasProfile: data?.data?.hasProfile as boolean,
    hasInstagram: data?.data?.hasInstagram as boolean,
    isLoading,
    isError: error,
    mutate,
  }
}

/**
 * Hook to fetch full influencer profile (with Instagram data)
 */
export function useInfluencerProfile() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/influencer/profile",
    fetcher,
    {
      refreshInterval: 0, // Don't auto-refresh
      revalidateOnFocus: false,
    }
  )

  return {
    profile: data?.data?.profile as InfluencerProfile | null,
    isLoading,
    isError: error,
    mutate,
  }
}

// ============================================================================
// INSTAGRAM METRICS HOOKS
// ============================================================================

/**
 * Hook to get Instagram account status
 */
export function useInstagramConnection() {
  const { profile, isLoading } = useInfluencerProfile()

  return {
    isConnected: !!profile?.instagram?.account_id,
    username: profile?.instagram?.username,
    lastSynced: profile?.last_synced_at,
    tokenExpiresAt: profile?.access_token_expires_at,
    isLoading,
  }
}

/**
 * Hook to get Instagram metrics
 */
export function useInstagramMetrics() {
  const { profile, isLoading } = useInfluencerProfile()

  return {
    metrics: profile?.instagram || null,
    followers: profile?.instagram?.followers_count || 0,
    followersCount: profile?.instagram?.followers_count || 0,
    followsCount: profile?.instagram?.follows_count || 0,
    mediaCount: profile?.instagram?.media_count || 0,
    engagementRate: profile?.instagram?.calculated?.engagement_rate_30_days || 0,
    avgLikes: profile?.instagram?.calculated?.avg_likes || 0,
    avgComments: profile?.instagram?.calculated?.avg_comments || 0,
    avgReach: profile?.instagram?.calculated?.avg_reach || 0,
    postingFrequency: profile?.instagram?.calculated?.posting_frequency || 0,
    storyFrequency: profile?.instagram?.calculated?.story_frequency || 0,
    growthRate: profile?.instagram?.calculated?.followers_growth_rate || 0,
    isLoading,
  }
}

/**
 * Hook to get demographics data
 */
export function useDemographics() {
  const { profile, isLoading } = useInfluencerProfile()

  return {
    demographics: profile?.instagram?.demographics || null,
    countries: profile?.instagram?.demographics?.audience_country || {},
    cities: profile?.instagram?.demographics?.audience_city || {},
    genders: profile?.instagram?.demographics?.audience_gender || {},
    ages: profile?.instagram?.demographics?.audience_age || {},
    genderAge: profile?.instagram?.demographics?.audience_gender_age || {},
    locales: profile?.instagram?.demographics?.audience_locale || {},
    isLoading,
  }
}

// ============================================================================
// POSTS HOOKS
// ============================================================================

/**
 * Hook to fetch influencer posts
 */
export function useInfluencerPosts(limit = 50) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/influencer/posts?limit=${limit}`,
    fetcher,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
    }
  )

  return {
    posts: (data?.data?.posts || []) as Post[],
    totalPosts: data?.data?.total || 0,
    isLoading,
    isError: error,
    mutate,
  }
}

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Save profile basic info
 */
export async function saveProfileSetup(data: any) {
  const response = await fetch("/api/influencer/profile-setup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || "Failed to save profile")
  }

  return response.json()
}

/**
 * Sync Instagram metrics
 */
export async function syncInstagramMetrics() {
  const response = await fetch("/api/influencer/instagram/sync", {
    method: "POST",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || "Failed to sync Instagram metrics")
  }

  return response.json()
}

/**
 * Disconnect Instagram account
 */
export async function disconnectInstagram() {
  const response = await fetch("/api/influencer/instagram/disconnect", {
    method: "POST",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || "Failed to disconnect Instagram")
  }

  return response.json()
}

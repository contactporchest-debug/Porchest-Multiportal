/**
 * Meta (Facebook/Instagram) API Utilities
 * Functions to interact with Meta Graph API for Instagram Business accounts
 */

import { logger } from "@/lib/logger"
import {
  MetaTokenResponse,
  InstagramBusinessAccount,
  InstagramInsight,
  InstagramMedia,
} from "@/lib/types/influencer"

const META_GRAPH_API_VERSION = "v20.0"
const META_GRAPH_API_BASE_URL = `https://graph.facebook.com/${META_GRAPH_API_VERSION}`

// ============================================================================
// ENVIRONMENT VARIABLES
// ============================================================================

const getMetaAppId = () => process.env.META_APP_ID!
const getMetaAppSecret = () => process.env.META_APP_SECRET!
const getMetaRedirectUri = () => process.env.META_REDIRECT_URI!

// ============================================================================
// OAUTH FUNCTIONS
// ============================================================================

export function getOAuthUrl(state: string): string {
  const appId = getMetaAppId()
  const redirectUri = getMetaRedirectUri()

  const scopes = [
    "instagram_basic",
    "instagram_manage_insights",
    "pages_show_list",
    "business_management",
    "pages_read_engagement",
  ]

  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    scope: scopes.join(","),
    response_type: "code",
    state,
  })

  return `https://www.facebook.com/v20.0/dialog/oauth?${params.toString()}`
}

export async function exchangeCodeForToken(code: string): Promise<MetaTokenResponse> {
  const appId = getMetaAppId()
  const appSecret = getMetaAppSecret()
  const redirectUri = getMetaRedirectUri()

  const url = `${META_GRAPH_API_BASE_URL}/oauth/access_token?` +
    `client_id=${appId}&` +
    `client_secret=${appSecret}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `code=${code}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to exchange code for token")
    }

    return data as MetaTokenResponse
  } catch (error) {
    logger.error("Error exchanging code for token", error)
    throw error
  }
}

export async function exchangeForLongLivedToken(
  shortLivedToken: string
): Promise<MetaTokenResponse> {
  const appId = getMetaAppId()
  const appSecret = getMetaAppSecret()

  const url = `${META_GRAPH_API_BASE_URL}/oauth/access_token?` +
    `grant_type=fb_exchange_token&` +
    `client_id=${appId}&` +
    `client_secret=${appSecret}&` +
    `fb_exchange_token=${shortLivedToken}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to exchange for long-lived token")
    }

    return data as MetaTokenResponse
  } catch (error) {
    logger.error("Error exchanging for long-lived token", error)
    throw error
  }
}

// ============================================================================
// INSTAGRAM ACCOUNT FUNCTIONS
// ============================================================================

export async function getFacebookPages(accessToken: string): Promise<any[]> {
  const url = `${META_GRAPH_API_BASE_URL}/me/accounts?` +
    `fields=id,name,access_token,instagram_business_account&` +
    `access_token=${accessToken}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch Facebook pages")
    }

    return data.data || []
  } catch (error) {
    logger.error("Error fetching Facebook pages", error)
    throw error
  }
}

export async function getInstagramBusinessAccount(
  pageAccessToken: string,
  igAccountId: string
): Promise<InstagramBusinessAccount> {
  const fields = [
    "id",
    "username",
    "name",
    "profile_picture_url",
    "followers_count",
    "follows_count",
    "media_count",
  ].join(",")

  const url = `${META_GRAPH_API_BASE_URL}/${igAccountId}?` +
    `fields=${fields}&` +
    `access_token=${pageAccessToken}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch Instagram account")
    }

    return data as InstagramBusinessAccount
  } catch (error) {
    logger.error("Error fetching Instagram account", error)
    throw error
  }
}

// ============================================================================
// INSIGHTS FUNCTIONS
// ============================================================================

export async function getAccountInsights(
  igAccountId: string,
  accessToken: string,
  metrics: string[],
  period: "day" | "week" | "days_28" | "lifetime" = "day"
): Promise<InstagramInsight[]> {
  const metricsParam = metrics.join(",")
  const url = `${META_GRAPH_API_BASE_URL}/${igAccountId}/insights?` +
    `metric=${metricsParam}&` +
    `period=${period}&` +
    `access_token=${accessToken}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      logger.warn("Account insights unavailable", { metrics, error: data.error })
      return []
    }

    return data.data || []
  } catch (error) {
    logger.warn("Error fetching account insights", { metrics, error })
    return []
  }
}

export async function getProfileMetrics(
  igAccountId: string,
  accessToken: string
): Promise<Record<string, any>> {
  const metrics: Record<string, any> = {}

  try {
    const dailyMetrics = [
      "impressions",
      "reach",
      "profile_views",
      "website_clicks",
      "email_contacts",
      "phone_call_clicks",
    ]

    const insights = await getAccountInsights(igAccountId, accessToken, dailyMetrics, "day")

    insights.forEach((insight) => {
      if (insight.values && insight.values.length > 0) {
        const total = insight.values.reduce((sum, val) => {
          const value = typeof val.value === "number" ? val.value : 0
          return sum + value
        }, 0)
        metrics[insight.name] = total
      }
    })
  } catch (error) {
    logger.warn("Daily metrics unavailable", { error })
  }

  try {
    const demographicMetrics = [
      "audience_country",
      "audience_city",
      "audience_gender_age",
      "audience_locale",
    ]

    const demographics = await getAccountInsights(
      igAccountId,
      accessToken,
      demographicMetrics,
      "lifetime"
    )

    demographics.forEach((insight) => {
      if (insight.values && insight.values.length > 0) {
        metrics[insight.name] = insight.values[0].value
      }
    })
  } catch (error) {
    logger.warn("Demographics unavailable", { error })
  }

  try {
    const onlineFollowers = await getAccountInsights(
      igAccountId,
      accessToken,
      ["online_followers"],
      "lifetime"
    )

    if (onlineFollowers.length > 0 && onlineFollowers[0].values) {
      metrics.online_followers = onlineFollowers[0].values[0]?.value || {}
    }
  } catch (error) {
    logger.warn("Online followers unavailable", { error })
  }

  const engagementMetrics = ["engagement"]
  try {
    const engagement = await getAccountInsights(igAccountId, accessToken, engagementMetrics, "day")

    if (engagement.length > 0 && engagement[0].values) {
      const total = engagement[0].values.reduce((sum, val) => {
        const value = typeof val.value === "number" ? val.value : 0
        return sum + value
      }, 0)
      metrics.engagement = total
    }
  } catch (error) {
    logger.warn("Engagement metric unavailable", { error })
  }

  return metrics
}

// ============================================================================
// MEDIA FUNCTIONS
// ============================================================================

export async function getInstagramMedia(
  igAccountId: string,
  accessToken: string,
  limit = 100
): Promise<InstagramMedia[]> {
  const fields = [
    "id",
    "caption",
    "media_type",
    "media_url",
    "permalink",
    "timestamp",
    "username",
    "like_count",
    "comments_count",
  ].join(",")

  let allMedia: InstagramMedia[] = []
  let url = `${META_GRAPH_API_BASE_URL}/${igAccountId}/media?` +
    `fields=${fields}&` +
    `limit=${Math.min(limit, 100)}&` +
    `access_token=${accessToken}`

  try {
    while (url && allMedia.length < limit) {
      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to fetch media")
      }

      if (data.data) {
        allMedia = allMedia.concat(data.data)
      }

      if (data.paging && data.paging.next && allMedia.length < limit) {
        url = data.paging.next
      } else {
        break
      }
    }

    return allMedia.slice(0, limit)
  } catch (error) {
    logger.error("Error fetching Instagram media", error)
    return []
  }
}

export async function getMediaInsights(
  mediaId: string,
  accessToken: string,
  mediaType: string
): Promise<Record<string, any>> {
  let metrics: string[] = []

  if (mediaType === "VIDEO") {
    metrics = [
      "impressions",
      "reach",
      "saved",
      "video_views",
      "plays",
      "total_interactions",
    ]
  } else if (mediaType === "CAROUSEL_ALBUM") {
    metrics = [
      "impressions",
      "reach",
      "saved",
      "engagement",
      "carousel_album_impressions",
      "carousel_album_reach",
      "carousel_album_engagement",
    ]
  } else if (mediaType === "IMAGE") {
    metrics = [
      "impressions",
      "reach",
      "saved",
      "engagement",
    ]
  } else {
    return {}
  }

  const metricsParam = metrics.join(",")
  const url = `${META_GRAPH_API_BASE_URL}/${mediaId}/insights?` +
    `metric=${metricsParam}&` +
    `access_token=${accessToken}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      return {}
    }

    const insights: Record<string, any> = {}
    if (data.data) {
      data.data.forEach((insight: InstagramInsight) => {
        if (insight.values && insight.values.length > 0) {
          insights[insight.name] = insight.values[0].value
        }
      })
    }

    return insights
  } catch (error) {
    return {}
  }
}

export async function getReelInsights(
  mediaId: string,
  accessToken: string
): Promise<Record<string, any>> {
  const metrics = [
    "plays",
    "reach",
    "total_interactions",
    "likes",
    "comments",
    "shares",
    "saves",
  ]

  const metricsParam = metrics.join(",")
  const url = `${META_GRAPH_API_BASE_URL}/${mediaId}/insights?` +
    `metric=${metricsParam}&` +
    `access_token=${accessToken}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      return {}
    }

    const insights: Record<string, any> = {}
    if (data.data) {
      data.data.forEach((insight: InstagramInsight) => {
        if (insight.values && insight.values.length > 0) {
          insights[insight.name] = insight.values[0].value
        }
      })
    }

    return insights
  } catch (error) {
    return {}
  }
}

export async function getStoryInsights(
  mediaId: string,
  accessToken: string
): Promise<Record<string, any>> {
  const metrics = [
    "impressions",
    "reach",
    "taps_forward",
    "taps_back",
    "exits",
    "replies",
  ]

  const metricsParam = metrics.join(",")
  const url = `${META_GRAPH_API_BASE_URL}/${mediaId}/insights?` +
    `metric=${metricsParam}&` +
    `access_token=${accessToken}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      return {}
    }

    const insights: Record<string, any> = {}
    if (data.data) {
      data.data.forEach((insight: InstagramInsight) => {
        if (insight.values && insight.values.length > 0) {
          insights[insight.name] = insight.values[0].value
        }
      })
    }

    return insights
  } catch (error) {
    return {}
  }
}

export async function getAllMediaWithInsights(
  igAccountId: string,
  accessToken: string,
  limit = 50
): Promise<Array<InstagramMedia & { insights: Record<string, any> }>> {
  const media = await getInstagramMedia(igAccountId, accessToken, limit)

  const mediaWithInsights = []

  for (const item of media) {
    let insights: Record<string, any> = {}

    if (item.media_type === "STORY") {
      const timestamp = new Date(item.timestamp)
      const hoursSince = (Date.now() - timestamp.getTime()) / (1000 * 60 * 60)

      if (hoursSince <= 24) {
        insights = await getStoryInsights(item.id, accessToken)
      }
    } else if (item.media_type === "VIDEO" && item.media_url?.includes("reel")) {
      insights = await getReelInsights(item.id, accessToken)
      item.media_type = "REEL" as any
    } else if (item.media_type === "VIDEO") {
      insights = await getMediaInsights(item.id, accessToken, "VIDEO")
    } else {
      insights = await getMediaInsights(item.id, accessToken, item.media_type)
    }

    mediaWithInsights.push({
      ...item,
      insights,
    })

    await new Promise((resolve) => setTimeout(resolve, 50))
  }

  return mediaWithInsights
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

export class MetaAPIError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = "MetaAPIError"
  }
}

/**
 * Metric Calculation Utilities
 * Functions to calculate derived metrics for influencer profiles
 */

import { Post, PostMetrics, CalculatedMetrics } from "@/lib/types/influencer"

// ============================================================================
// ENGAGEMENT CALCULATIONS
// ============================================================================

/**
 * Calculate engagement rate for a single post
 * Formula: (likes + comments + saves + shares) / reach * 100
 */
export function calculatePostEngagementRate(metrics: PostMetrics, followers: number): number {
  const {
    likes = 0,
    comments = 0,
    saves = 0,
    shares = 0,
    reach = followers,
  } = metrics

  if (reach === 0) return 0

  const totalEngagement = likes + comments + saves + shares
  const rate = (totalEngagement / reach) * 100

  return Number(rate.toFixed(2))
}

/**
 * Calculate average engagement rate from multiple posts
 */
export function calculateAverageEngagementRate(posts: Post[], followers: number): number {
  if (posts.length === 0) return 0

  const totalRate = posts.reduce((sum, post) => {
    return sum + calculatePostEngagementRate(post.metrics, followers)
  }, 0)

  return Number((totalRate / posts.length).toFixed(2))
}

/**
 * Calculate engagement rate for last 30 days
 */
export function calculateEngagementRate30Days(posts: Post[], followers: number): number {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const recentPosts = posts.filter((post) => {
    const postDate = new Date(post.timestamp)
    return postDate >= thirtyDaysAgo
  })

  return calculateAverageEngagementRate(recentPosts, followers)
}

// ============================================================================
// AVERAGE CALCULATIONS
// ============================================================================

/**
 * Calculate average likes from posts
 */
export function calculateAverageLikes(posts: Post[]): number {
  if (posts.length === 0) return 0

  const totalLikes = posts.reduce((sum, post) => sum + (post.metrics.likes || 0), 0)
  return Math.round(totalLikes / posts.length)
}

/**
 * Calculate average comments from posts
 */
export function calculateAverageComments(posts: Post[]): number {
  if (posts.length === 0) return 0

  const totalComments = posts.reduce((sum, post) => sum + (post.metrics.comments || 0), 0)
  return Math.round(totalComments / posts.length)
}

/**
 * Calculate average reach from posts
 */
export function calculateAverageReach(posts: Post[]): number {
  if (posts.length === 0) return 0

  const postsWithReach = posts.filter((post) => post.metrics.reach && post.metrics.reach > 0)
  if (postsWithReach.length === 0) return 0

  const totalReach = postsWithReach.reduce((sum, post) => sum + (post.metrics.reach || 0), 0)
  return Math.round(totalReach / postsWithReach.length)
}

/**
 * Calculate average impressions from posts
 */
export function calculateAverageImpressions(posts: Post[]): number {
  if (posts.length === 0) return 0

  const postsWithImpressions = posts.filter(
    (post) => post.metrics.impressions && post.metrics.impressions > 0
  )
  if (postsWithImpressions.length === 0) return 0

  const totalImpressions = postsWithImpressions.reduce(
    (sum, post) => sum + (post.metrics.impressions || 0),
    0
  )
  return Math.round(totalImpressions / postsWithImpressions.length)
}

/**
 * Calculate average saves from posts
 */
export function calculateAverageSaves(posts: Post[]): number {
  if (posts.length === 0) return 0

  const postsWithSaves = posts.filter((post) => post.metrics.saves && post.metrics.saves > 0)
  if (postsWithSaves.length === 0) return 0

  const totalSaves = postsWithSaves.reduce((sum, post) => sum + (post.metrics.saves || 0), 0)
  return Math.round(totalSaves / postsWithSaves.length)
}

// ============================================================================
// GROWTH CALCULATIONS
// ============================================================================

/**
 * Calculate follower growth rate
 * Requires historical follower data (we'll estimate based on recent posts)
 */
export function calculateFollowersGrowthRate(
  currentFollowers: number,
  posts: Post[]
): number {
  if (posts.length < 10) return 0

  // Sort posts by date (oldest first)
  const sortedPosts = [...posts].sort((a, b) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  })

  // Get oldest and newest posts
  const oldestPost = sortedPosts[0]
  const newestPost = sortedPosts[sortedPosts.length - 1]

  // Calculate days between posts
  const daysDiff =
    (new Date(newestPost.timestamp).getTime() - new Date(oldestPost.timestamp).getTime()) /
    (1000 * 60 * 60 * 24)

  if (daysDiff === 0) return 0

  // Estimate follower growth (this is approximate)
  // Better implementation would use historical snapshots
  const avgReach = calculateAverageReach(posts)
  const estimatedGrowthPerDay = avgReach * 0.01 // Assume 1% of reach converts to followers

  const totalEstimatedGrowth = estimatedGrowthPerDay * daysDiff
  const growthRate = (totalEstimatedGrowth / currentFollowers) * 100

  return Number(growthRate.toFixed(2))
}

// ============================================================================
// FREQUENCY CALCULATIONS
// ============================================================================

/**
 * Calculate posting frequency (posts per week)
 */
export function calculatePostingFrequency(posts: Post[]): number {
  if (posts.length === 0) return 0

  // Filter out stories
  const regularPosts = posts.filter((post) => post.media_type !== "STORY")

  if (regularPosts.length < 2) return 0

  // Sort by date
  const sortedPosts = [...regularPosts].sort((a, b) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  })

  // Calculate time range in weeks
  const oldestDate = new Date(sortedPosts[0].timestamp)
  const newestDate = new Date(sortedPosts[sortedPosts.length - 1].timestamp)
  const weeksDiff = (newestDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24 * 7)

  if (weeksDiff === 0) return regularPosts.length

  return Number((regularPosts.length / weeksDiff).toFixed(2))
}

/**
 * Calculate story frequency (stories per week)
 */
export function calculateStoryFrequency(posts: Post[]): number {
  if (posts.length === 0) return 0

  // Filter stories only
  const stories = posts.filter((post) => post.media_type === "STORY")

  if (stories.length < 2) return 0

  // Sort by date
  const sortedStories = [...stories].sort((a, b) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  })

  // Calculate time range in weeks
  const oldestDate = new Date(sortedStories[0].timestamp)
  const newestDate = new Date(sortedStories[sortedStories.length - 1].timestamp)
  const weeksDiff = (newestDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24 * 7)

  if (weeksDiff === 0) return stories.length

  return Number((stories.length / weeksDiff).toFixed(2))
}

// ============================================================================
// COMPREHENSIVE METRICS CALCULATION
// ============================================================================

/**
 * Calculate all derived metrics for an influencer
 */
export function calculateAllMetrics(posts: Post[], currentFollowers: number): CalculatedMetrics {
  return {
    avg_likes: calculateAverageLikes(posts),
    avg_comments: calculateAverageComments(posts),
    avg_reach: calculateAverageReach(posts),
    engagement_rate_30_days: calculateEngagementRate30Days(posts, currentFollowers),
    followers_growth_rate: calculateFollowersGrowthRate(currentFollowers, posts),
    posting_frequency: calculatePostingFrequency(posts),
    story_frequency: calculateStoryFrequency(posts),
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Safe divide that returns null if denominator is 0 or either value is null/undefined
 * Prevents fake zeros and division by zero errors
 */
export function safeDivide(
  numerator: number | null | undefined,
  denominator: number | null | undefined,
  decimals: number = 2
): number | null {
  if (numerator == null || denominator == null || denominator === 0) {
    return null
  }
  const result = numerator / denominator
  return Number(result.toFixed(decimals))
}

/**
 * Safe percentage calculation (numerator / denominator * 100)
 * Returns null if calculation is not possible
 */
export function safePercentage(
  numerator: number | null | undefined,
  denominator: number | null | undefined,
  decimals: number = 2
): number | null {
  const divided = safeDivide(numerator, denominator, decimals + 2)
  if (divided === null) return null
  return Number((divided * 100).toFixed(decimals))
}

/**
 * Get value or null (never return 0 for missing data)
 */
export function valueOrNull(value: any): number | null {
  if (value === null || value === undefined || value === '') {
    return null
  }
  const num = typeof value === 'number' ? value : parseFloat(value)
  return isNaN(num) ? null : num
}

/**
 * Format large numbers (e.g., 1500 -> "1.5K", 1500000 -> "1.5M")
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

/**
 * Format percentage with 2 decimal places
 */
export function formatPercentage(num: number): string {
  return num.toFixed(2) + "%"
}

/**
 * Get engagement tier based on engagement rate
 */
export function getEngagementTier(engagementRate: number): string {
  if (engagementRate >= 6) return "Excellent"
  if (engagementRate >= 3) return "Good"
  if (engagementRate >= 1) return "Average"
  return "Low"
}

/**
 * Calculate best time to post based on online followers
 */
export function getBestTimeToPost(onlineFollowers: Record<string, number>): string[] {
  if (!onlineFollowers || Object.keys(onlineFollowers).length === 0) {
    return []
  }

  // Sort hours by follower count
  const sortedHours = Object.entries(onlineFollowers)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3) // Top 3 hours
    .map(([hour]) => {
      const h = parseInt(hour)
      const period = h >= 12 ? "PM" : "AM"
      const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h
      return `${displayHour}:00 ${period}`
    })

  return sortedHours
}

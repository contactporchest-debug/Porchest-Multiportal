/**
 * Influencer Profile Database Utilities
 * Database operations for influencer profiles and posts
 */

import { ObjectId } from "mongodb"
import { collections, toObjectId } from "@/lib/db"
import {
  InfluencerProfile,
  Post,
  BasicInfo,
  InstagramAccount,
} from "@/lib/types/influencer"

// ============================================================================
// PROFILE OPERATIONS
// ============================================================================

/**
 * Get influencer profile by user ID
 */
export async function getInfluencerProfileByUserId(
  userId: string | ObjectId
): Promise<InfluencerProfile | null> {
  const profilesCollection = await collections.influencerProfiles()
  const userObjectId = toObjectId(userId)

  if (!userObjectId) return null

  const profile = await profilesCollection.findOne({
    userId: userObjectId,
  })

  return profile as InfluencerProfile | null
}

/**
 * Create new influencer profile with basic info
 */
export async function createInfluencerProfile(
  userId: string | ObjectId,
  basicInfo: BasicInfo
): Promise<InfluencerProfile> {
  const profilesCollection = await collections.influencerProfiles()
  const userObjectId = toObjectId(userId)

  if (!userObjectId) {
    throw new Error("Invalid user ID")
  }

  const now = new Date()
  const newProfile: InfluencerProfile = {
    userId: userObjectId,
    basic_info: basicInfo,
    created_at: now,
    updated_at: now,
  }

  const result = await profilesCollection.insertOne(newProfile as any)

  return {
    ...newProfile,
    _id: result.insertedId,
  }
}

/**
 * Update influencer basic info
 */
export async function updateInfluencerBasicInfo(
  userId: string | ObjectId,
  basicInfo: Partial<BasicInfo>
): Promise<boolean> {
  const profilesCollection = await collections.influencerProfiles()
  const userObjectId = toObjectId(userId)

  if (!userObjectId) return false

  const update: any = {}
  Object.keys(basicInfo).forEach((key) => {
    update[`basic_info.${key}`] = basicInfo[key as keyof BasicInfo]
  })

  const result = await profilesCollection.updateOne(
    { userId: userObjectId },
    {
      $set: {
        ...update,
        updated_at: new Date(),
      },
    }
  )

  return result.modifiedCount > 0
}

/**
 * Update Instagram account data
 */
export async function updateInstagramAccount(
  userId: string | ObjectId,
  instagram: InstagramAccount,
  accessToken: string,
  expiresIn?: number
): Promise<boolean> {
  const profilesCollection = await collections.influencerProfiles()
  const userObjectId = toObjectId(userId)

  if (!userObjectId) return false

  const tokenExpiresAt = expiresIn
    ? new Date(Date.now() + expiresIn * 1000)
    : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days default for long-lived tokens

  const result = await profilesCollection.updateOne(
    { userId: userObjectId },
    {
      $set: {
        instagram,
        access_token: accessToken,
        access_token_expires_at: tokenExpiresAt,
        token_type: expiresIn && expiresIn < 24 * 60 * 60 ? "short" : "long",
        last_synced_at: new Date(),
        updated_at: new Date(),
      },
    }
  )

  return result.modifiedCount > 0
}

/**
 * Check if user has completed profile setup
 */
export async function hasCompletedProfileSetup(
  userId: string | ObjectId
): Promise<boolean> {
  const profile = await getInfluencerProfileByUserId(userId)

  if (!profile || !profile.basic_info) return false

  // Check required fields are filled
  const { name, category, bio, country, city, languages, email } = profile.basic_info

  return !!(name && category && bio && country && city && languages?.length > 0 && email)
}

/**
 * Check if Instagram is connected
 */
export async function hasInstagramConnected(
  userId: string | ObjectId
): Promise<boolean> {
  const profile = await getInfluencerProfileByUserId(userId)
  return !!(profile?.instagram?.account_id)
}

// ============================================================================
// POST OPERATIONS
// ============================================================================

/**
 * Save or update a post
 */
export async function upsertPost(post: Post): Promise<ObjectId> {
  const postsCollection = await collections.posts()

  const result = await postsCollection.updateOne(
    { post_id: post.post_id, userId: post.userId },
    {
      $set: {
        ...post,
        updated_at: new Date(),
      },
      $setOnInsert: {
        created_at: new Date(),
      },
    },
    { upsert: true }
  )

  return result.upsertedId as ObjectId || post._id!
}

/**
 * Bulk upsert posts
 */
export async function bulkUpsertPosts(posts: Post[]): Promise<number> {
  if (posts.length === 0) return 0

  const postsCollection = await collections.posts()
  const now = new Date()

  const operations = posts.map((post) => ({
    updateOne: {
      filter: { post_id: post.post_id, userId: post.userId },
      update: {
        $set: {
          ...post,
          updated_at: now,
        },
        $setOnInsert: {
          created_at: now,
        },
      },
      upsert: true,
    },
  }))

  const result = await postsCollection.bulkWrite(operations)
  return result.upsertedCount + result.modifiedCount
}

/**
 * Get posts for a user
 */
export async function getPostsByUserId(
  userId: string | ObjectId,
  limit = 100
): Promise<Post[]> {
  const postsCollection = await collections.posts()
  const userObjectId = toObjectId(userId)

  if (!userObjectId) return []

  const posts = await postsCollection
    .find({ userId: userObjectId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray()

  return posts as Post[]
}

/**
 * Delete old posts (older than 90 days)
 */
export async function deleteOldPosts(
  userId: string | ObjectId,
  daysToKeep = 90
): Promise<number> {
  const postsCollection = await collections.posts()
  const userObjectId = toObjectId(userId)

  if (!userObjectId) return 0

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

  const result = await postsCollection.deleteMany({
    userId: userObjectId,
    timestamp: { $lt: cutoffDate },
  })

  return result.deletedCount
}

/**
 * Get post count for user
 */
export async function getPostCount(userId: string | ObjectId): Promise<number> {
  const postsCollection = await collections.posts()
  const userObjectId = toObjectId(userId)

  if (!userObjectId) return 0

  return await postsCollection.countDocuments({ userId: userObjectId })
}

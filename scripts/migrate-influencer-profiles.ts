/**
 * Migration Script for Influencer Profiles
 * Migrates existing influencer profiles to new schema with basic_info structure
 *
 * Run with: npx tsx scripts/migrate-influencer-profiles.ts
 */

import { MongoClient, ObjectId } from "mongodb"
import * as dotenv from "dotenv"
import path from "path"

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const MONGODB_URI = process.env.MONGODB_URI!
const DB_NAME = "porchest_db"

interface OldInfluencerProfile {
  _id: ObjectId
  user_id: ObjectId
  full_name?: string
  instagram_username?: string
  profile_picture?: string
  niche?: string
  location?: string
  followers?: number
  following?: number
  verified?: boolean
  engagement_rate?: number
  average_views_monthly?: number
  last_post_views?: number
  last_post_engagement?: number
  last_post_date?: Date
  price_per_post?: number
  availability?: string
  languages?: string[]
  platforms?: string[]
  brands_worked_with?: string[]
  instagram_account?: any
  instagram_metrics?: any
  instagram_demographics?: any
  created_at: Date
  updated_at: Date
}

async function migrateProfiles() {
  const client = new MongoClient(MONGODB_URI)

  try {
    console.log("Connecting to MongoDB...")
    await client.connect()
    const db = client.db(DB_NAME)
    const collection = db.collection("influencer_profiles")

    console.log("Fetching existing profiles...")
    const profiles = await collection.find({}).toArray()

    console.log(`Found ${profiles.length} profiles to migrate`)

    let migrated = 0
    let skipped = 0
    let errors = 0

    for (const profile of profiles as OldInfluencerProfile[]) {
      try {
        // Check if already migrated (has basic_info field)
        if ((profile as any).basic_info) {
          console.log(`Skipping profile ${profile._id} - already migrated`)
          skipped++
          continue
        }

        // Extract location parts
        let city = ""
        let country = ""
        if (profile.location) {
          const parts = profile.location.split(",").map((s) => s.trim())
          if (parts.length === 2) {
            city = parts[0]
            country = parts[1]
          } else if (parts.length === 1) {
            city = parts[0]
          }
        }

        // Build basic_info structure
        const basicInfo = {
          name: profile.full_name || "",
          category: profile.niche || "",
          bio: "", // This will need to be filled by user
          country: country,
          city: city,
          languages: profile.languages || [],
          email: "", // This will need to be filled by user
          brand_preferences: profile.brands_worked_with || [],
        }

        // Build instagram structure if it exists
        let instagram: any = null
        if (profile.instagram_account) {
          instagram = {
            account_id: profile.instagram_account.instagram_business_account_id || "",
            username: profile.instagram_account.username || profile.instagram_username || "",
            followers_count: profile.instagram_metrics?.followers_count || profile.followers || 0,
            follows_count: profile.instagram_metrics?.follows_count || profile.following || 0,
            media_count: profile.instagram_metrics?.media_count || 0,
            profile_views: profile.instagram_metrics?.profile_views || 0,
            website_clicks: profile.instagram_metrics?.website_clicks || 0,
            email_contacts: profile.instagram_metrics?.email_contacts || 0,
            phone_call_clicks: profile.instagram_metrics?.phone_call_clicks || 0,
            reach: profile.instagram_metrics?.reach || 0,
            impressions: profile.instagram_metrics?.impressions || 0,
            engagement: profile.instagram_metrics?.engagement || 0,
            online_followers: profile.instagram_metrics?.online_followers || {},
            demographics: {
              audience_country: profile.instagram_demographics?.audience_country || {},
              audience_city: profile.instagram_demographics?.audience_city || {},
              audience_gender: profile.instagram_demographics?.audience_gender || {},
              audience_age: profile.instagram_demographics?.audience_age || {},
              audience_gender_age: profile.instagram_demographics?.audience_gender_age || {},
              audience_locale: profile.instagram_demographics?.audience_locale || {},
            },
            calculated: {
              avg_likes: 0,
              avg_comments: 0,
              avg_reach: 0,
              engagement_rate_30_days: profile.engagement_rate || 0,
              followers_growth_rate: 0,
              posting_frequency: 0,
              story_frequency: 0,
            },
          }
        }

        // Update document
        const update: any = {
          $set: {
            basic_info: basicInfo,
            updated_at: new Date(),
          },
        }

        if (instagram) {
          update.$set.instagram = instagram
        }

        // Remove old fields
        update.$unset = {
          full_name: "",
          niche: "",
          location: "",
          followers: "",
          following: "",
          verified: "",
          engagement_rate: "",
          average_views_monthly: "",
          last_post_views: "",
          last_post_engagement: "",
          last_post_date: "",
          price_per_post: "",
          availability: "",
          platforms: "",
          brands_worked_with: "",
          instagram_metrics: "",
          instagram_demographics: "",
        }

        await collection.updateOne({ _id: profile._id }, update)

        console.log(`✓ Migrated profile ${profile._id}`)
        migrated++
      } catch (error: any) {
        console.error(`✗ Error migrating profile ${profile._id}:`, error.message)
        errors++
      }
    }

    console.log("\n=== Migration Summary ===")
    console.log(`Total profiles: ${profiles.length}`)
    console.log(`Migrated: ${migrated}`)
    console.log(`Skipped (already migrated): ${skipped}`)
    console.log(`Errors: ${errors}`)
  } catch (error) {
    console.error("Migration failed:", error)
    throw error
  } finally {
    await client.close()
    console.log("\nDatabase connection closed")
  }
}

// Run migration
migrateProfiles()
  .then(() => {
    console.log("\nMigration completed successfully!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\nMigration failed:", error)
    process.exit(1)
  })

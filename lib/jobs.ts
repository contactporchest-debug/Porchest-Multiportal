/**
 * Background Jobs & Scheduled Tasks
 * Utilities for running periodic background jobs
 *
 * In production, integrate with:
 * - BullMQ for Redis-based job queues
 * - Agenda for MongoDB-based job scheduling
 * - node-cron for simple cron-like tasks
 * - Vercel Cron for serverless cron jobs
 */

import { collections } from "./db"
import { logger } from "./logger"

export interface JobOptions {
  name: string
  schedule?: string // Cron expression
  enabled?: boolean
  lastRun?: Date
  nextRun?: Date
}

export interface JobResult {
  success: boolean
  executedAt: Date
  duration: number
  error?: string
  metadata?: Record<string, any>
}

/**
 * Job: Cleanup expired notifications (older than 90 days)
 */
export async function cleanupExpiredNotifications(): Promise<JobResult> {
  const startTime = Date.now()

  try {
    const notificationsCollection = await collections.notifications()

    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    const result = await notificationsCollection.deleteMany({
      created_at: { $lt: ninetyDaysAgo },
      read: true,
    })

    logger.info("Expired notifications cleaned up", {
      deletedCount: result.deletedCount,
      threshold: ninetyDaysAgo,
    })

    return {
      success: true,
      executedAt: new Date(),
      duration: Date.now() - startTime,
      metadata: {
        deletedCount: result.deletedCount,
      },
    }
  } catch (error) {
    logger.error("Cleanup expired notifications failed", { error })
    return {
      success: false,
      executedAt: new Date(),
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Job: Update influencer profile aggregated stats
 */
export async function updateInfluencerStats(): Promise<JobResult> {
  const startTime = Date.now()

  try {
    const influencerProfilesCollection = await collections.influencerProfiles()
    const postsCollection = await collections.posts()
    const collaborationRequestsCollection = await collections.collaborationRequests()

    const profiles = await influencerProfilesCollection.find({}).toArray()
    let updatedCount = 0

    for (const profile of profiles) {
      // Calculate stats from posts
      const posts = await postsCollection.find({ influencer_id: profile.user_id }).toArray()

      if (posts.length > 0) {
        const avgEngagementRate =
          posts.reduce((sum, p) => sum + (p.engagement_rate || 0), 0) / posts.length

        // Calculate completed campaigns
        const completedCollaborations = await collaborationRequestsCollection.countDocuments({
          influencer_id: profile.user_id,
          status: "completed",
        })

        await influencerProfilesCollection.updateOne(
          { _id: profile._id },
          {
            $set: {
              avg_engagement_rate: Math.round(avgEngagementRate * 100) / 100,
              completed_campaigns: completedCollaborations,
              updated_at: new Date(),
            },
          }
        )

        updatedCount++
      }
    }

    logger.info("Influencer stats updated", {
      profilesProcessed: profiles.length,
      profilesUpdated: updatedCount,
    })

    return {
      success: true,
      executedAt: new Date(),
      duration: Date.now() - startTime,
      metadata: {
        profilesProcessed: profiles.length,
        profilesUpdated: updatedCount,
      },
    }
  } catch (error) {
    logger.error("Update influencer stats failed", { error })
    return {
      success: false,
      executedAt: new Date(),
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Job: Update campaign metrics from posts
 */
export async function updateCampaignMetrics(): Promise<JobResult> {
  const startTime = Date.now()

  try {
    const campaignsCollection = await collections.campaigns()
    const postsCollection = await collections.posts()

    const activeCampaigns = await campaignsCollection
      .find({ status: { $in: ["active", "draft"] } })
      .toArray()

    let updatedCount = 0

    for (const campaign of activeCampaigns) {
      const posts = await postsCollection.find({ campaign_id: campaign._id }).toArray()

      if (posts.length > 0) {
        const totalReach = posts.reduce((sum, p) => sum + (p.views || 0), 0)
        const totalImpressions = totalReach // Simplified assumption
        const totalEngagement = posts.reduce(
          (sum, p) => sum + (p.likes || 0) + (p.comments || 0) + (p.shares || 0),
          0
        )
        const engagementRate =
          totalReach > 0 ? (totalEngagement / totalReach) * 100 : 0

        await campaignsCollection.updateOne(
          { _id: campaign._id },
          {
            $set: {
              "metrics.total_reach": totalReach,
              "metrics.total_impressions": totalImpressions,
              "metrics.total_engagement": totalEngagement,
              "metrics.engagement_rate": Math.round(engagementRate * 100) / 100,
              updated_at: new Date(),
            },
          }
        )

        updatedCount++
      }
    }

    logger.info("Campaign metrics updated", {
      campaignsProcessed: activeCampaigns.length,
      campaignsUpdated: updatedCount,
    })

    return {
      success: true,
      executedAt: new Date(),
      duration: Date.now() - startTime,
      metadata: {
        campaignsProcessed: activeCampaigns.length,
        campaignsUpdated: updatedCount,
      },
    }
  } catch (error) {
    logger.error("Update campaign metrics failed", { error })
    return {
      success: false,
      executedAt: new Date(),
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Job: Archive completed campaigns (after 180 days)
 */
export async function archiveCompletedCampaigns(): Promise<JobResult> {
  const startTime = Date.now()

  try {
    const campaignsCollection = await collections.campaigns()

    const sixMonthsAgo = new Date()
    sixMonthsAgo.setDate(sixMonthsAgo.getDate() - 180)

    const result = await campaignsCollection.updateMany(
      {
        status: "completed",
        end_date: { $lt: sixMonthsAgo },
      },
      {
        $set: {
          status: "archived",
          archived_at: new Date(),
          updated_at: new Date(),
        },
      }
    )

    logger.info("Completed campaigns archived", {
      archivedCount: result.modifiedCount,
      threshold: sixMonthsAgo,
    })

    return {
      success: true,
      executedAt: new Date(),
      duration: Date.now() - startTime,
      metadata: {
        archivedCount: result.modifiedCount,
      },
    }
  } catch (error) {
    logger.error("Archive completed campaigns failed", { error })
    return {
      success: false,
      executedAt: new Date(),
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Job: Send reminder notifications for pending collaborations
 */
export async function sendCollaborationReminders(): Promise<JobResult> {
  const startTime = Date.now()

  try {
    const collaborationRequestsCollection = await collections.collaborationRequests()
    const notificationsCollection = await collections.notifications()

    // Find collaborations pending for more than 3 days
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

    const pendingCollaborations = await collaborationRequestsCollection
      .find({
        status: "pending",
        created_at: { $lt: threeDaysAgo },
      })
      .toArray()

    let remindersSent = 0

    for (const collab of pendingCollaborations) {
      // Check if we already sent a reminder
      const existingReminder = await notificationsCollection.findOne({
        user_id: collab.influencer_id,
        metadata: { collaboration_id: collab._id.toString() },
        type: "info",
        title: { $regex: /Reminder/ },
      })

      if (!existingReminder) {
        await notificationsCollection.insertOne({
          user_id: collab.influencer_id,
          type: "info",
          title: "Reminder: Pending Campaign Invitation",
          message: "You have a campaign invitation waiting for your response.",
          read: false,
          metadata: {
            collaboration_id: collab._id.toString(),
            campaign_id: collab.campaign_id.toString(),
          },
          created_at: new Date(),
        } as any)

        remindersSent++
      }
    }

    logger.info("Collaboration reminders sent", {
      pendingCount: pendingCollaborations.length,
      remindersSent,
    })

    return {
      success: true,
      executedAt: new Date(),
      duration: Date.now() - startTime,
      metadata: {
        pendingCount: pendingCollaborations.length,
        remindersSent,
      },
    }
  } catch (error) {
    logger.error("Send collaboration reminders failed", { error })
    return {
      success: false,
      executedAt: new Date(),
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Job Registry
 */
export const jobs = {
  cleanupExpiredNotifications: {
    handler: cleanupExpiredNotifications,
    schedule: "0 2 * * *", // Daily at 2 AM
    description: "Clean up read notifications older than 90 days",
  },
  updateInfluencerStats: {
    handler: updateInfluencerStats,
    schedule: "0 3 * * *", // Daily at 3 AM
    description: "Update aggregated stats for influencer profiles",
  },
  updateCampaignMetrics: {
    handler: updateCampaignMetrics,
    schedule: "*/30 * * * *", // Every 30 minutes
    description: "Update campaign metrics from posts",
  },
  archiveCompletedCampaigns: {
    handler: archiveCompletedCampaigns,
    schedule: "0 4 * * 0", // Weekly on Sunday at 4 AM
    description: "Archive campaigns completed > 180 days ago",
  },
  sendCollaborationReminders: {
    handler: sendCollaborationReminders,
    schedule: "0 10 * * *", // Daily at 10 AM
    description: "Send reminders for pending collaborations > 3 days old",
  },
}

/**
 * Execute a specific job by name
 */
export async function executeJob(jobName: keyof typeof jobs): Promise<JobResult> {
  const job = jobs[jobName]

  if (!job) {
    return {
      success: false,
      executedAt: new Date(),
      duration: 0,
      error: `Job "${jobName}" not found`,
    }
  }

  logger.info("Executing job", { jobName })

  const result = await job.handler()

  logger.info("Job completed", {
    jobName,
    success: result.success,
    duration: result.duration,
  })

  return result
}

/**
 * Execute all jobs (for testing or manual triggers)
 */
export async function executeAllJobs(): Promise<Record<string, JobResult>> {
  const results: Record<string, JobResult> = {}

  for (const [jobName, job] of Object.entries(jobs)) {
    results[jobName] = await job.handler()
  }

  return results
}

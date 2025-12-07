/**
 * Automation & Event Triggers
 * Handles automated actions based on platform events
 *
 * Events:
 * - user.verified: Triggered when admin approves user
 * - campaign.invite: Triggered when brand invites influencers
 * - post.submitted: Triggered when influencer submits post
 * - withdrawal.approved: Triggered when admin approves withdrawal
 * - withdrawal.rejected: Triggered when admin rejects withdrawal
 * - collaboration.accepted: Triggered when influencer accepts invitation
 */

import { ObjectId } from "mongodb"
import { collections } from "./db"
import { sendTemplatedEmail, emailTemplates } from "./email"
import { logger } from "./logger"

export type EventType =
  | "user.verified"
  | "user.rejected"
  | "campaign.invite"
  | "post.submitted"
  | "withdrawal.approved"
  | "withdrawal.rejected"
  | "collaboration.accepted"
  | "collaboration.rejected"
  | "payment.received"

export interface EventData {
  type: EventType
  userId?: string | ObjectId
  entityId?: string | ObjectId
  metadata?: Record<string, any>
}

/**
 * Trigger automation based on event
 */
export async function triggerEvent(event: EventData): Promise<void> {
  logger.info("Event triggered", {
    type: event.type,
    userId: event.userId?.toString(),
    entityId: event.entityId?.toString(),
  })

  try {
    switch (event.type) {
      case "user.verified":
        await handleUserVerified(event)
        break

      case "user.rejected":
        await handleUserRejected(event)
        break

      case "campaign.invite":
        await handleCampaignInvite(event)
        break

      case "post.submitted":
        await handlePostSubmitted(event)
        break

      case "withdrawal.approved":
        await handleWithdrawalApproved(event)
        break

      case "withdrawal.rejected":
        await handleWithdrawalRejected(event)
        break

      case "collaboration.accepted":
        await handleCollaborationAccepted(event)
        break

      case "payment.received":
        await handlePaymentReceived(event)
        break

      default:
        logger.warn("Unknown event type", { type: event.type })
    }
  } catch (error) {
    logger.error("Event handler failed", { event, error })
  }
}

/**
 * Handle user verification approval
 */
async function handleUserVerified(event: EventData): Promise<void> {
  if (!event.userId) return

  const usersCollection = await collections.users()
  const user = await usersCollection.findOne({ _id: new ObjectId(event.userId) })

  if (!user) {
    logger.warn("User not found for verification event", { userId: event.userId })
    return
  }

  // Send welcome email
  const template = emailTemplates.accountApproved(user.full_name || user.email, user.role)
  await sendTemplatedEmail(user.email, template)

  logger.info("User verification email sent", { email: user.email })
}

/**
 * Handle user rejection
 */
async function handleUserRejected(event: EventData): Promise<void> {
  if (!event.userId) return

  const usersCollection = await collections.users()
  const user = await usersCollection.findOne({ _id: new ObjectId(event.userId) })

  if (!user || !user.email) return

  const template = emailTemplates.notification(
    user.full_name || user.email,
    "Account Application Status",
    `We're sorry, but your application for a ${user.role} account has not been approved at this time. If you believe this is an error, please contact our support team.`
  )

  await sendTemplatedEmail(user.email, template)

  logger.info("User rejection email sent", { email: user.email })
}

/**
 * Handle campaign invitation
 */
async function handleCampaignInvite(event: EventData): Promise<void> {
  const { influencerIds, campaignId, brandId, offerAmount } = event.metadata || {}

  if (!influencerIds || !campaignId) return

  const usersCollection = await collections.users()
  const campaignsCollection = await collections.campaigns()
  const influencerProfilesCollection = await collections.influencerProfiles()
  const brandProfilesCollection = await collections.brandProfiles()

  const campaign = await campaignsCollection.findOne({ _id: new ObjectId(campaignId) })
  const brand = await usersCollection.findOne({ _id: new ObjectId(brandId) })
  const brandProfile = await brandProfilesCollection.findOne({ user_id: new ObjectId(brandId) })

  if (!campaign || !brand) return

  const brandName = brandProfile?.brand_name || brand.full_name || "A brand"

  // Send email to each invited influencer
  for (const influencerId of influencerIds as string[]) {
    const influencer = await usersCollection.findOne({ _id: new ObjectId(influencerId) })
    const profile = await influencerProfilesCollection.findOne({
      user_id: new ObjectId(influencerId),
    })

    if (!influencer?.email) continue

    const template = emailTemplates.campaignInvite(
      profile?.full_name || influencer.full_name || influencer.email,
      campaign.name,
      brandName,
      offerAmount || 0
    )

    await sendTemplatedEmail(influencer.email, template)

    logger.info("Campaign invitation email sent", {
      influencer: influencer.email,
      campaign: campaign.name,
    })
  }
}

/**
 * Handle post submission
 */
async function handlePostSubmitted(event: EventData): Promise<void> {
  const { postId, campaignId, influencerId } = event.metadata || {}

  if (!postId || !campaignId) return

  const usersCollection = await collections.users()
  const campaignsCollection = await collections.campaigns()
  const postsCollection = await collections.posts()
  const influencerProfilesCollection = await collections.influencerProfiles()
  const brandProfilesCollection = await collections.brandProfiles()

  const post = await postsCollection.findOne({ _id: new ObjectId(postId) })
  const campaign = await campaignsCollection.findOne({ _id: new ObjectId(campaignId) })

  if (!post || !campaign) return

  const brand = await usersCollection.findOne({ _id: campaign.brand_id })
  const brandProfile = await brandProfilesCollection.findOne({ user_id: campaign.brand_id })
  const influencer = await usersCollection.findOne({ _id: new ObjectId(influencerId) })
  const influencerProfile = await influencerProfilesCollection.findOne({
    user_id: new ObjectId(influencerId),
  })

  if (!brand?.email || !influencer) return

  const template = emailTemplates.postSubmitted(
    brandProfile?.brand_name || brand.full_name || "Brand",
    influencerProfile?.full_name || influencer.full_name || influencer.email,
    campaign.name,
    post.post_url
  )

  await sendTemplatedEmail(brand.email, template)

  logger.info("Post submission notification sent", {
    brand: brand.email,
    campaign: campaign.name,
  })
}

/**
 * Handle withdrawal approval
 */
async function handleWithdrawalApproved(event: EventData): Promise<void> {
  const { transactionId, userId, amount } = event.metadata || {}

  if (!userId || !amount) return

  const usersCollection = await collections.users()
  const influencerProfilesCollection = await collections.influencerProfiles()

  const user = await usersCollection.findOne({ _id: new ObjectId(userId) })
  const profile = await influencerProfilesCollection.findOne({ user_id: new ObjectId(userId) })

  if (!user?.email) return

  const template = emailTemplates.withdrawalApproved(
    profile?.full_name || user.full_name || user.email,
    amount
  )

  await sendTemplatedEmail(user.email, template)

  logger.info("Withdrawal approval email sent", {
    email: user.email,
    amount,
  })
}

/**
 * Handle withdrawal rejection
 */
async function handleWithdrawalRejected(event: EventData): Promise<void> {
  const { transactionId, userId, amount, reason } = event.metadata || {}

  if (!userId || !amount) return

  const usersCollection = await collections.users()
  const influencerProfilesCollection = await collections.influencerProfiles()

  const user = await usersCollection.findOne({ _id: new ObjectId(userId) })
  const profile = await influencerProfilesCollection.findOne({ user_id: new ObjectId(userId) })

  if (!user?.email) return

  const template = emailTemplates.withdrawalRejected(
    profile?.full_name || user.full_name || user.email,
    amount,
    reason
  )

  await sendTemplatedEmail(user.email, template)

  logger.info("Withdrawal rejection email sent", {
    email: user.email,
    amount,
  })
}

/**
 * Handle collaboration acceptance
 */
async function handleCollaborationAccepted(event: EventData): Promise<void> {
  const { collaborationId, influencerId, campaignId } = event.metadata || {}

  if (!collaborationId || !campaignId) return

  const usersCollection = await collections.users()
  const campaignsCollection = await collections.campaigns()
  const influencerProfilesCollection = await collections.influencerProfiles()
  const brandProfilesCollection = await collections.brandProfiles()

  const campaign = await campaignsCollection.findOne({ _id: new ObjectId(campaignId) })
  if (!campaign) return

  const brand = await usersCollection.findOne({ _id: campaign.brand_id })
  const brandProfile = await brandProfilesCollection.findOne({ user_id: campaign.brand_id })
  const influencer = await usersCollection.findOne({ _id: new ObjectId(influencerId) })
  const profile = await influencerProfilesCollection.findOne({
    user_id: new ObjectId(influencerId),
  })

  if (!brand?.email || !influencer) return

  const template = emailTemplates.notification(
    brandProfile?.brand_name || brand.full_name || "Brand",
    "Collaboration Accepted",
    `Great news! ${profile?.full_name || influencer.full_name || "An influencer"} has accepted your invitation for the "${campaign.name}" campaign.`,
    `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/brand/campaigns/${campaign._id}`
  )

  await sendTemplatedEmail(brand.email, template)

  logger.info("Collaboration acceptance notification sent", {
    brand: brand.email,
    campaign: campaign.name,
  })
}

/**
 * Handle payment received
 */
async function handlePaymentReceived(event: EventData): Promise<void> {
  const { transactionId, userId, amount } = event.metadata || {}

  if (!userId || !amount) return

  const usersCollection = await collections.users()
  const influencerProfilesCollection = await collections.influencerProfiles()

  const user = await usersCollection.findOne({ _id: new ObjectId(userId) })
  const profile = await influencerProfilesCollection.findOne({ user_id: new ObjectId(userId) })

  if (!user?.email) return

  const template = emailTemplates.notification(
    profile?.full_name || user.full_name || user.email,
    "Payment Received",
    `You've received a payment of $${amount.toLocaleString()}. The funds are now available in your account balance.`,
    `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/influencer/earnings`
  )

  await sendTemplatedEmail(user.email, template)

  logger.info("Payment notification sent", {
    email: user.email,
    amount,
  })
}

/**
 * Batch trigger events
 */
export async function triggerBulkEvents(events: EventData[]): Promise<void> {
  for (const event of events) {
    await triggerEvent(event)
  }
}

/**
 * Schedule delayed event (for future implementation with job queue)
 */
export async function scheduleEvent(event: EventData, delayMs: number): Promise<void> {
  // In production, use a job queue like Bull, BullMQ, or Agenda
  // For now, just log the intent
  logger.info("Event scheduled (stub)", {
    event,
    delayMs,
    executeAt: new Date(Date.now() + delayMs).toISOString(),
  })

  // Simple setTimeout for demonstration (not production-ready)
  // In production, persist to database and use a job processor
  if (delayMs < 60000) {
    // Only for delays < 1 minute
    setTimeout(() => {
      triggerEvent(event)
    }, delayMs)
  }
}

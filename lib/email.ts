/**
 * Email Notification Utility
 * Provides helpers for sending email notifications
 *
 * In production, integrate with:
 * - NodeMailer for SMTP
 * - SendGrid API
 * - AWS SES
 * - Resend
 */

import { logger } from "./logger"

export interface EmailOptions {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  from?: string
  cc?: string[]
  bcc?: string[]
  replyTo?: string
}

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

/**
 * Send an email (stub for production implementation)
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // In production, use NodeMailer or email service:
    // const transporter = nodemailer.createTransport({ ... })
    // await transporter.sendMail(options)

    logger.info("Email sent (stub)", {
      to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
      subject: options.subject,
      from: options.from || process.env.EMAIL_FROM,
    })

    // Simulate async email sending
    return true
  } catch (error) {
    logger.error("Email send failed", { error, options })
    return false
  }
}

/**
 * Email Templates
 */
export const emailTemplates = {
  /**
   * Welcome email for new users
   */
  welcome: (userName: string, userRole: string): EmailTemplate => ({
    subject: "Welcome to Porchest - Your Account is Ready!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to Porchest!</h1>
        <p>Hi ${userName},</p>
        <p>Your ${userRole} account has been created successfully.</p>
        <p>You can now:</p>
        <ul>
          <li>Access your personalized dashboard</li>
          <li>Explore platform features</li>
          <li>Connect with brands and influencers</li>
        </ul>
        <p style="margin-top: 30px;">
          <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login"
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Get Started
          </a>
        </p>
        <p style="color: #666; font-size: 12px; margin-top: 40px;">
          If you didn't create this account, please contact support immediately.
        </p>
      </div>
    `,
    text: `Welcome to Porchest!\n\nHi ${userName},\n\nYour ${userRole} account has been created successfully.\n\nGet started at: ${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login`,
  }),

  /**
   * Account verification approved
   */
  accountApproved: (userName: string, userRole: string): EmailTemplate => ({
    subject: "Your Porchest Account Has Been Approved!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4CAF50;">Account Approved!</h1>
        <p>Hi ${userName},</p>
        <p>Great news! Your ${userRole} account has been approved by our team.</p>
        <p>You now have full access to all platform features.</p>
        <p style="margin-top: 30px;">
          <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login"
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Access Your Dashboard
          </a>
        </p>
      </div>
    `,
    text: `Account Approved!\n\nHi ${userName},\n\nYour ${userRole} account has been approved. You now have full access to the platform.\n\nLogin at: ${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login`,
  }),

  /**
   * Campaign invitation
   */
  campaignInvite: (
    influencerName: string,
    campaignName: string,
    brandName: string,
    offerAmount: number
  ): EmailTemplate => ({
    subject: `New Campaign Invitation: ${campaignName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">New Campaign Invitation</h1>
        <p>Hi ${influencerName},</p>
        <p><strong>${brandName}</strong> has invited you to participate in their campaign:</p>
        <h2 style="color: #4CAF50;">${campaignName}</h2>
        <p><strong>Offer Amount:</strong> $${offerAmount.toLocaleString()}</p>
        <p style="margin-top: 30px;">
          <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/influencer/collaborations"
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            View Invitation
          </a>
        </p>
      </div>
    `,
    text: `New Campaign Invitation\n\nHi ${influencerName},\n\n${brandName} has invited you to participate in "${campaignName}".\n\nOffer Amount: $${offerAmount}\n\nView details at: ${process.env.NEXTAUTH_URL || "http://localhost:3000"}/influencer/collaborations`,
  }),

  /**
   * Withdrawal approved
   */
  withdrawalApproved: (userName: string, amount: number): EmailTemplate => ({
    subject: `Withdrawal Approved - $${amount.toLocaleString()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4CAF50;">Withdrawal Approved</h1>
        <p>Hi ${userName},</p>
        <p>Your withdrawal request for <strong>$${amount.toLocaleString()}</strong> has been approved and processed.</p>
        <p>The funds should arrive in your account within 3-5 business days.</p>
        <p style="margin-top: 30px;">
          <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/influencer/earnings"
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            View Earnings
          </a>
        </p>
      </div>
    `,
    text: `Withdrawal Approved\n\nHi ${userName},\n\nYour withdrawal request for $${amount} has been approved and processed.\n\nView your earnings at: ${process.env.NEXTAUTH_URL || "http://localhost:3000"}/influencer/earnings`,
  }),

  /**
   * Withdrawal rejected
   */
  withdrawalRejected: (userName: string, amount: number, reason?: string): EmailTemplate => ({
    subject: `Withdrawal Request Declined - $${amount.toLocaleString()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f44336;">Withdrawal Request Declined</h1>
        <p>Hi ${userName},</p>
        <p>Unfortunately, your withdrawal request for <strong>$${amount.toLocaleString()}</strong> has been declined.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
        <p>The amount has been refunded to your available balance.</p>
        <p>If you have questions, please contact our support team.</p>
      </div>
    `,
    text: `Withdrawal Request Declined\n\nHi ${userName},\n\nYour withdrawal request for $${amount} has been declined.${reason ? `\n\nReason: ${reason}` : ""}\n\nThe amount has been refunded to your available balance.`,
  }),

  /**
   * Post submitted notification for brands
   */
  postSubmitted: (
    brandName: string,
    influencerName: string,
    campaignName: string,
    postUrl: string
  ): EmailTemplate => ({
    subject: `New Post Submitted for ${campaignName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">New Post Submitted</h1>
        <p>Hi ${brandName},</p>
        <p><strong>${influencerName}</strong> has submitted a new post for your campaign: <strong>${campaignName}</strong></p>
        <p><strong>Post URL:</strong> <a href="${postUrl}" target="_blank">${postUrl}</a></p>
        <p style="margin-top: 30px;">
          <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/brand/campaigns"
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            View Campaign
          </a>
        </p>
      </div>
    `,
    text: `New Post Submitted\n\nHi ${brandName},\n\n${influencerName} has submitted a new post for "${campaignName}".\n\nPost URL: ${postUrl}\n\nView campaign at: ${process.env.NEXTAUTH_URL || "http://localhost:3000"}/brand/campaigns`,
  }),

  /**
   * Generic notification email
   */
  notification: (userName: string, title: string, message: string, actionUrl?: string): EmailTemplate => ({
    subject: title,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">${title}</h1>
        <p>Hi ${userName},</p>
        <p>${message}</p>
        ${
          actionUrl
            ? `
        <p style="margin-top: 30px;">
          <a href="${actionUrl}"
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            View Details
          </a>
        </p>
        `
            : ""
        }
      </div>
    `,
    text: `${title}\n\nHi ${userName},\n\n${message}${actionUrl ? `\n\nView details at: ${actionUrl}` : ""}`,
  }),
}

/**
 * Send templated email
 */
export async function sendTemplatedEmail(
  to: string | string[],
  template: EmailTemplate,
  options?: Partial<EmailOptions>
): Promise<boolean> {
  return sendEmail({
    to,
    subject: template.subject,
    html: template.html,
    text: template.text,
    ...options,
  })
}

/**
 * Batch send emails
 */
export async function sendBulkEmails(emails: EmailOptions[]): Promise<{ sent: number; failed: number }> {
  let sent = 0
  let failed = 0

  for (const email of emails) {
    const success = await sendEmail(email)
    if (success) {
      sent++
    } else {
      failed++
    }
  }

  logger.info("Bulk email send completed", { sent, failed, total: emails.length })

  return { sent, failed }
}

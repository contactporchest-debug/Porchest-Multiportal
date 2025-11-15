# Porchest Multiportal User Guide

Complete guide for all user roles in the Porchest Multiportal platform.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Admin Portal Guide](#admin-portal-guide)
3. [Brand Portal Guide](#brand-portal-guide)
4. [Influencer Portal Guide](#influencer-portal-guide)
5. [Client Portal Guide](#client-portal-guide)
6. [Employee Portal Guide](#employee-portal-guide)

---

## Getting Started

### Registration

1. Navigate to the registration page: `/register`
2. Fill out the registration form:
   - Full Name
   - Email Address
   - Password (minimum 6 characters)
   - Select your role: Admin, Brand, Influencer, Client, or Employee
3. Click "Register"
4. Wait for admin approval (you'll receive an email notification)

### Login

1. Navigate to the login page: `/login`
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to your role-specific dashboard

### Account Approval

- All new accounts require admin approval before access is granted
- You'll receive an email once your account is approved or rejected
- Approved users can immediately log in
- Rejected users will receive an explanation

---

## Admin Portal Guide

**Access**: `/admin`

### Dashboard

The admin dashboard provides a complete overview of the platform:

- **Total Users**: Count of all registered users
- **Active Campaigns**: Number of campaigns currently running
- **Pending Approvals**: Users waiting for verification
- **Total Revenue**: Platform-wide revenue metrics
- **Recent Activity**: Latest system actions

### User Management

#### Pending User Approvals

**Location**: `/admin/pending-users`

View and manage user registration requests:

1. Navigate to "Pending Users" from the sidebar
2. Review user details:
   - Full Name
   - Email
   - Requested Role
   - Registration Date
3. Click "Approve" to grant access
   - User receives approval email
   - Profile auto-created (brand_profiles or influencer_profiles)
   - User can immediately log in
4. Click "Reject" to deny access
   - User receives rejection email
   - Account marked as rejected

**Best Practices**:
- Verify email domains for brand accounts
- Check influencer social media links if provided
- Look for duplicate registrations

#### All Users

**Location**: `/admin/users`

View and search all platform users:

1. Navigate to "All Users"
2. Use filters:
   - Role filter (Admin, Brand, Influencer, Client, Employee)
   - Status filter (Active, Pending, Rejected)
   - Search by name or email
3. View user details:
   - Account creation date
   - Last login
   - Account status
   - Associated campaigns (for brands/influencers)

### Campaign Oversight

**Location**: `/admin/campaigns`

Monitor all campaigns across the platform:

1. Navigate to "Campaigns"
2. View campaign list with:
   - Campaign name and description
   - Brand name
   - Status (Draft, Active, Completed, Cancelled)
   - Budget and spending
   - Start and end dates
   - Number of collaborations
3. Click on a campaign to view details:
   - Full campaign information
   - Invited influencers
   - Submitted posts
   - Performance metrics

**Actions**:
- View detailed analytics
- Monitor for suspicious activity
- Review campaign compliance

### Transaction Management

**Location**: `/admin/transactions`

Approve or reject influencer withdrawal requests:

1. Navigate to "Transactions"
2. View pending withdrawals:
   - Influencer name
   - Withdrawal amount
   - Current balance
   - Request date
   - Payment method
3. Click "Approve" to process:
   - Transaction marked as approved
   - Influencer receives confirmation email
   - Balance is already deducted (happens on request)
4. Click "Reject" to deny:
   - Transaction marked as rejected
   - Amount refunded to influencer balance
   - Rejection reason sent via email

**Important**:
- Verify influencer has sufficient completed campaigns
- Check for fraud flags before approving large amounts
- Document rejection reasons clearly

### Audit Logs

**Location**: `/admin/audit-logs`

View complete system activity history:

1. Navigate to "Audit Logs"
2. Filter logs by:
   - Action type (user.created, campaign.created, etc.)
   - Date range
   - User email
3. View log entries:
   - Timestamp
   - User who performed action
   - Action type
   - IP address
   - Additional metadata
4. Use for:
   - Security investigations
   - Compliance audits
   - User activity tracking
   - Troubleshooting issues

**Common Actions Logged**:
- `user.created` - New user registration
- `user.verified` - Account approval
- `user.rejected` - Account rejection
- `campaign.created` - New campaign
- `campaign.invite` - Influencer invited
- `collaboration.accepted` - Invitation accepted
- `post.submitted` - Content posted
- `withdrawal.requested` - Withdrawal request
- `withdrawal.approved` - Withdrawal approved

### Analytics & Reports

View platform-wide analytics:

- **User Growth**: Registration trends over time
- **Campaign Performance**: Success rates, average ROI
- **Revenue Metrics**: Total transactions, average values
- **Engagement Stats**: Platform usage patterns
- **Fraud Detection**: Suspicious activity alerts

---

## Brand Portal Guide

**Access**: `/brand`

### Dashboard

The brand dashboard shows your campaign overview:

- **Active Campaigns**: Currently running campaigns
- **Total Collaborations**: Influencer partnerships
- **Total Spend**: Campaign budget used
- **Average Engagement**: Performance across campaigns
- **Pending Invitations**: Influencers yet to respond
- **Recent Posts**: Latest content from influencers

### Profile Management

**Location**: `/brand/profile`

Set up and manage your brand profile:

1. Navigate to "Profile"
2. Fill out brand information:
   - **Brand Name**: Your company name
   - **Industry**: Select from dropdown (Fashion, Tech, Beauty, etc.)
   - **Website**: Your brand website URL
   - **Description**: Brief company description
   - **Logo URL**: Link to your brand logo
   - **Contact Email**: Primary contact
   - **Contact Phone**: Optional phone number
3. Click "Save Profile"

**Tips**:
- Complete profile increases influencer trust
- Professional logo and description attract better influencers
- Keep contact information up to date

### Campaign Management

#### View Campaigns

**Location**: `/brand/campaigns`

See all your campaigns:

1. Navigate to "Campaigns"
2. View campaign cards with:
   - Campaign name and description
   - Status badge (Draft, Active, Completed)
   - Budget and remaining balance
   - Number of collaborations
   - Start and end dates
3. Filter by status or search by name
4. Click on a campaign to view details

#### Create Campaign

**Location**: `/brand/campaigns/new`

Create a new influencer marketing campaign:

1. Navigate to "Campaigns" → "Create Campaign"
2. Fill out campaign details:
   - **Campaign Name**: Clear, descriptive name
   - **Description**: Campaign goals and requirements
   - **Budget**: Total campaign budget (USD)
   - **Start Date**: Campaign launch date
   - **End Date**: Campaign completion date
   - **Target Audience**: Demographics (optional)
   - **Content Guidelines**: What influencers should post
   - **Hashtags**: Required campaign hashtags
   - **Platform**: Instagram, TikTok, YouTube, etc.
3. Click "Create Campaign"
4. Campaign starts in "Draft" status

**Best Practices**:
- Set realistic budgets based on influencer rates
- Provide clear content guidelines
- Allow sufficient time for content creation
- Include specific deliverables

#### Campaign Details

**Location**: `/brand/campaigns/[id]`

View and manage a specific campaign:

**Overview Section**:
- Campaign name, description, dates
- Budget and spending
- Status and progress

**Collaborations Tab**:
- List of invited influencers
- Invitation status (Pending, Accepted, Rejected)
- Offer amount per influencer
- Deliverables

**Posts Tab**:
- Submitted content from influencers
- Post metrics (likes, comments, shares, views)
- Engagement rate
- Post URLs and screenshots

**Analytics Tab**:
- Total reach and impressions
- Total engagement
- Engagement rate
- ROI metrics
- Top-performing influencers

**Actions**:
- Invite more influencers
- Edit campaign details
- Mark campaign as completed

### Influencer Discovery

**Location**: `/brand/discover`

Find and invite influencers:

1. Navigate to "Discover Influencers"
2. Use filters:
   - Platform (Instagram, TikTok, etc.)
   - Category (Fashion, Tech, Beauty, etc.)
   - Follower range
   - Engagement rate
   - Rating
3. View influencer cards:
   - Profile picture and name
   - Bio and social links
   - Follower count
   - Engagement rate
   - Average post likes
   - Rating (1-5 stars)
4. Click "View Profile" to see full details
5. Click "Invite to Campaign" to send invitation

### Inviting Influencers

**From Campaign Page**:

1. Open your campaign
2. Click "Invite Influencers"
3. Select influencers from discovery or search
4. Set offer details:
   - **Offer Amount**: Payment per influencer (USD)
   - **Deliverables**: What you expect (e.g., "1 Instagram post", "3 TikTok videos")
   - **Message**: Personal invitation message
5. Click "Send Invitations"
6. Influencers receive email notifications

**Tips**:
- Personalize invitation messages
- Be clear about deliverables
- Offer fair compensation based on follower count
- Review influencer past performance

### ROI Prediction

**Location**: `/brand/roi-predictor`

Predict campaign ROI before launching:

1. Navigate to "ROI Predictor"
2. Enter campaign parameters:
   - Influencer follower count
   - Engagement rate (%)
   - Campaign budget (USD)
   - Platform
   - Content category
   - Influencer rating (if known)
3. Click "Predict ROI"
4. Review prediction:
   - **Estimated Reach**: Expected audience size
   - **Estimated Engagement**: Likes, comments, shares
   - **Estimated Conversions**: Expected sales
   - **Estimated Revenue**: Projected income
   - **Predicted ROI**: Return percentage
   - **Confidence Score**: Prediction reliability
   - **Risk Level**: Low, Medium, High

**Use Cases**:
- Evaluate influencer proposals
- Budget allocation decisions
- Compare multiple influencer options
- Set realistic campaign goals

---

## Influencer Portal Guide

**Access**: `/influencer`

### Dashboard

The influencer dashboard shows your performance:

- **Total Earnings**: Lifetime earnings from campaigns
- **Available Balance**: Withdrawable amount
- **Active Collaborations**: Current campaign partnerships
- **Total Posts**: Content submitted
- **Average Engagement**: Your engagement rate
- **Pending Invitations**: Campaign offers awaiting response
- **Recent Earnings**: Latest payments received

### Profile Management

**Location**: `/influencer/profile`

Set up your influencer profile:

1. Navigate to "Profile"
2. Fill out your information:
   - **Display Name**: Public name
   - **Bio**: Brief description (max 500 chars)
   - **Category**: Your niche (Fashion, Tech, Gaming, etc.)
   - **Platform**: Primary social platform
   - **Social Links**:
     - Instagram URL
     - TikTok URL
     - YouTube URL
     - Twitter URL
   - **Follower Count**: Total followers
   - **Engagement Rate**: Your average engagement % (calculate from recent posts)
   - **Rate Per Post**: Your standard rate (USD)
   - **Profile Picture**: URL to your photo
   - **Portfolio**: Examples of past work
3. Click "Save Profile"

**Profile Tips**:
- Keep follower count updated
- Calculate engagement rate accurately
- Link all active social accounts
- Add portfolio examples of best work
- Set competitive but fair rates

**Engagement Rate Calculation**:
```
Engagement Rate = (Likes + Comments + Shares) / Followers × 100

Example:
- Followers: 50,000
- Average Likes: 2,500
- Average Comments: 150
- Average Shares: 50
- Engagement Rate = (2,500 + 150 + 50) / 50,000 × 100 = 5.4%
```

### Campaign Invitations

**Location**: `/influencer/invitations`

Manage campaign invitations:

1. Navigate to "Invitations"
2. View pending invitations:
   - Campaign name and description
   - Brand name
   - Offer amount (USD)
   - Deliverables required
   - Campaign dates
   - Personal message from brand
3. Review campaign details carefully
4. Click "Accept" to join campaign:
   - Collaboration activated
   - Brand receives notification
   - You can now submit posts
5. Click "Reject" to decline:
   - Brand receives notification
   - Invitation removed from list

**Acceptance Checklist**:
- ✅ Offer amount is fair for deliverables
- ✅ Campaign aligns with your brand
- ✅ Deliverables are achievable
- ✅ Timeline works with your schedule
- ✅ Brand is reputable
- ✅ Content guidelines are acceptable

### Active Collaborations

**Location**: `/influencer/collaborations`

View your active campaigns:

1. Navigate to "Collaborations"
2. See all accepted campaigns:
   - Campaign name and brand
   - Offer amount
   - Deliverables status
   - Campaign dates
   - Submitted posts
3. Click on collaboration to view details
4. Submit content posts

### Post Submission

**Location**: `/influencer/posts` or from collaboration page

Submit campaign content:

1. Navigate to "Submit Post" or click "Add Post" in collaboration
2. Fill out post details:
   - **Campaign**: Select the campaign (if not pre-selected)
   - **Post URL**: Link to your published content (Instagram, TikTok, etc.)
   - **Screenshot URL**: Image of the post (optional but recommended)
   - **Caption**: Your post caption/description
   - **Platform**: Where you posted (Instagram, TikTok, YouTube, etc.)
   - **Post Metrics**:
     - Views: Total post views
     - Likes: Number of likes
     - Comments: Number of comments
     - Shares: Number of shares
   - **Posted At**: When you published (defaults to now)
3. Click "Submit Post"
4. Post is recorded and brand is notified
5. Earnings are added to your balance

**Important**:
- Submit posts within campaign timeframe
- Provide accurate metrics
- Include all required hashtags
- Follow brand content guidelines
- Update metrics if post performance grows

### Managing Posts

**Location**: `/influencer/posts`

View all your submitted posts:

1. Navigate to "My Posts"
2. View post history:
   - Post thumbnail/screenshot
   - Campaign name
   - Platform
   - Metrics (views, likes, comments, shares)
   - Engagement rate
   - Posted date
3. Filter by campaign or platform
4. Click on post to view full details

### Earnings & Withdrawals

#### View Balance

**Location**: `/influencer/earnings`

Track your earnings:

1. Navigate to "Earnings"
2. View:
   - **Total Earnings**: All-time earnings
   - **Available Balance**: Withdrawable amount
   - **Pending**: From active collaborations
   - **Withdrawn**: Total withdrawn to date
3. See earnings history:
   - Campaign name
   - Amount earned
   - Date earned
   - Status

#### Request Withdrawal

**Location**: `/influencer/withdraw`

Withdraw your earnings:

1. Navigate to "Withdraw"
2. Check your available balance
3. Enter withdrawal details:
   - **Amount**: How much to withdraw (must be ≤ available balance)
   - **Payment Method**: PayPal, Bank Transfer, etc.
   - **Payment Details**: Email, account number, etc.
4. Click "Request Withdrawal"
5. Balance is immediately deducted (held pending approval)
6. Admin reviews request
7. Receive email notification when approved/rejected

**Withdrawal Rules**:
- Minimum withdrawal: Typically $50-100 (check platform policy)
- Balance must be from completed campaigns
- Processing time: 3-7 business days after approval
- Rejected withdrawals are refunded to balance

**Withdrawal Status**:
- **Pending**: Awaiting admin review
- **Approved**: Payment processing
- **Rejected**: Amount refunded to balance
- **Completed**: Payment sent

### Performance Analytics

**Location**: `/influencer/analytics`

View your performance metrics:

1. Navigate to "Analytics"
2. See statistics:
   - Total campaigns completed
   - Total posts submitted
   - Total engagement (likes + comments + shares)
   - Average engagement rate
   - Earnings over time
   - Top-performing posts
   - Platform breakdown
3. Use insights to:
   - Optimize pricing
   - Identify best-performing content types
   - Show brands your value
   - Track growth over time

---

## Client Portal Guide

**Access**: `/client`

### Dashboard

The client dashboard shows project overview:

- **Active Projects**: Current projects
- **Total Campaigns**: Campaigns you're monitoring
- **Projects Completed**: Finished projects
- **Overall Progress**: Average project completion
- **Recent Updates**: Latest project activity

### Project Management

#### View Projects

**Location**: `/client/projects`

See all your projects:

1. Navigate to "Projects"
2. View project cards:
   - Project name and description
   - Status (Planning, Active, Completed)
   - Progress percentage
   - Number of associated campaigns
   - Budget and timeline
3. Click on project to view details

#### Create Project

**Location**: `/client/projects/new`

Create a new project:

1. Navigate to "Projects" → "Create Project"
2. Fill out project details:
   - **Project Name**: Descriptive name
   - **Description**: Project goals and scope
   - **Status**: Planning, Active, or Completed
   - **Budget**: Total project budget (optional)
   - **Start Date**: Project start
   - **End Date**: Expected completion
   - **Deliverables**: List of expected outputs
   - **Associated Campaigns**: Link existing campaigns (optional)
3. Click "Create Project"

#### Project Details

**Location**: `/client/projects/[id]`

View and manage a specific project:

**Overview Section**:
- Project name, description, dates
- Status and progress bar
- Budget information
- Deliverables checklist

**Campaigns Tab**:
- Linked campaigns
- Campaign status
- Budget spent per campaign
- Performance metrics

**Updates Tab**:
- Project timeline
- Recent changes
- Milestone completions

**Documents Tab** (if implemented):
- Contracts
- Reports
- Assets

**Actions**:
- Update project status
- Add/remove campaigns
- Edit project details
- Mark deliverables as complete

### Campaign Monitoring

**Location**: `/client/campaigns` (if viewing access granted)

Monitor associated campaigns:

1. View campaigns linked to your projects
2. See campaign metrics:
   - Reach and engagement
   - Content submissions
   - Budget utilization
3. Track campaign progress
4. View submitted posts

**Note**: Clients have read-only access to campaign data

---

## Employee Portal Guide

**Access**: `/employee`

### Dashboard

The employee dashboard shows:

- **Reports Submitted**: Total daily reports
- **Reports This Month**: Current month's reports
- **Average Rating**: Your performance rating
- **Tasks Completed**: Completed assignments
- **Upcoming Deadlines**: Due tasks

### Daily Reports

**Location**: `/employee/reports`

Submit and manage daily work reports:

#### Submit Report

1. Navigate to "Reports" → "Submit Report"
2. Fill out report form:
   - **Date**: Report date (defaults to today)
   - **Hours Worked**: Time spent (e.g., 8.5)
   - **Tasks Completed**: List of what you accomplished
   - **Blockers**: Issues or obstacles
   - **Notes**: Additional comments
   - **Project**: Associated project (if applicable)
3. Click "Submit Report"
4. Report saved and visible to managers

#### View Reports

1. Navigate to "Reports"
2. View your report history:
   - Date submitted
   - Hours worked
   - Tasks summary
   - Manager feedback (if provided)
3. Filter by date range or project
4. Edit recent reports if needed

### Internal Tools

**Location**: `/employee/tools`

Access employee resources:

- **Knowledge Base**: Documentation and guides
- **Team Directory**: Contact information
- **Resources**: Templates and tools
- **Announcements**: Company updates

---

## Common Tasks

### Changing Password

1. Go to your profile settings
2. Click "Change Password"
3. Enter current password
4. Enter new password (min 6 characters)
5. Confirm new password
6. Click "Update Password"

### Updating Email

1. Contact admin to update email
2. Email changes require verification
3. Admin updates email manually
4. You'll receive confirmation

### Notifications

**Managing Notifications**:

1. Click the bell icon (🔔) in header
2. View recent notifications
3. Click notification to view details
4. Mark as read
5. Notifications auto-delete after 90 days (if read)

**Notification Types**:
- Account approved/rejected
- Campaign invitation
- Post submitted
- Withdrawal approved/rejected
- Payment received
- Collaboration accepted

### Troubleshooting

#### Can't Login

1. Verify email and password
2. Check if account is approved (admin must approve)
3. Try "Forgot Password" if needed
4. Clear browser cache
5. Contact admin if still blocked

#### Missing Data

1. Refresh the page
2. Check filters (you might be filtering out data)
3. Verify you're in the correct portal
4. Log out and log back in
5. Report to admin if data truly missing

#### Email Not Received

1. Check spam/junk folder
2. Verify email address is correct in profile
3. Contact admin to resend
4. Add noreply@porchest.com to contacts

---

## Best Practices

### For All Users

- **Security**: Never share your password
- **Profile**: Keep profile information up to date
- **Communication**: Respond to notifications promptly
- **Data**: Report suspicious activity to admin

### For Brands

- **Campaigns**: Plan campaigns with clear goals
- **Budgets**: Set realistic budgets
- **Influencers**: Choose influencers aligned with your brand
- **Communication**: Provide clear content guidelines
- **Payments**: Pay influencers promptly

### For Influencers

- **Profile**: Maintain accurate metrics
- **Content**: Follow campaign guidelines
- **Deadlines**: Submit content on time
- **Quality**: Maintain high engagement rates
- **Transparency**: Report accurate post metrics

### For Admins

- **Approvals**: Review registrations within 24 hours
- **Transactions**: Process withdrawals within 3-5 days
- **Monitoring**: Check audit logs regularly
- **Security**: Watch for fraud indicators
- **Communication**: Keep users informed

---

## Support

### Getting Help

- **Email**: support@porchest.com
- **In-App**: Use the help icon (?) in navigation
- **Documentation**: Check docs at `/docs`

### Reporting Issues

1. Document the issue:
   - What you were doing
   - What happened
   - Expected behavior
   - Screenshots (if applicable)
2. Contact support with details
3. Provide your user ID/email
4. Wait for response (typically 24-48 hours)

---

## Appendix

### Keyboard Shortcuts

- `Ctrl/Cmd + K`: Search
- `Ctrl/Cmd + /`: Help menu
- `Esc`: Close modals

### Platform Limits

- **Campaign Budget**: $100 - $1,000,000
- **Withdrawal Minimum**: $50
- **Post Description**: 2000 characters max
- **Campaign Duration**: 1 day - 365 days
- **File Uploads**: Images up to 5MB

### API Rate Limits

- **Standard Endpoints**: 100 requests/minute
- **AI Endpoints**: 10 requests/minute
- **Admin Endpoints**: 100 requests/minute

---

**Last Updated**: 2025-11-15
**Version**: 1.0.0

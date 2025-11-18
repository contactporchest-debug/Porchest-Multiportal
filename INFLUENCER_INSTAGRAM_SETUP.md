# Influencer Instagram Integration Setup Guide

This guide explains how to set up and use the comprehensive Instagram integration for influencers in the Porchest Multiportal platform.

## Features

### ✅ Profile Setup
- Manual entry of basic information (name, category, bio, location, languages, brand preferences)
- Email validation and collection
- Multi-language support
- Brand preference tagging

### ✅ Instagram OAuth Integration
- Facebook/Instagram OAuth 2.0 flow
- Automatic token exchange (short-lived → long-lived)
- Secure token storage with expiration tracking

### ✅ Comprehensive Metrics Collection
Automatically fetches and stores:

**Profile Metrics:**
- Followers count, Following count, Media count
- Profile views, Website clicks
- Email contacts, Phone call clicks
- Reach, Impressions, Engagement
- Online followers (hourly breakdown)
- Demographics (country, city, gender, age, locale)

**Post Metrics (per post):**
- Likes, Comments, Saves, Shares
- Reach, Impressions
- Plays (for videos/reels)
- Story-specific metrics (taps_forward, taps_back, exits)
- Watch time and average watch time

**Calculated Metrics:**
- Average likes, comments, reach
- Engagement rate (30-day)
- Follower growth rate
- Posting frequency (posts per week)
- Story frequency (stories per week)

### ✅ Database Storage
- `influencer_profiles` collection with comprehensive schema
- `posts` collection for individual post metrics
- Automatic data syncing and updates

---

## Setup Instructions

### 1. Meta (Facebook) App Configuration

#### Step 1: Create a Meta App
1. Go to [Facebook Developers](https://developers.facebook.com/apps/)
2. Click "Create App"
3. Select "Business" as app type
4. Fill in app details:
   - App Name: "Porchest Instagram Integration"
   - App Contact Email: your-email@example.com

#### Step 2: Add Facebook Login Product
1. In your app dashboard, click "Add Product"
2. Select "Facebook Login" → "Set Up"
3. Choose "Web" as platform
4. Enter Site URL: `http://localhost:3000` (for development)

#### Step 3: Configure OAuth Redirect URIs
1. Go to **Facebook Login → Settings**
2. Add Valid OAuth Redirect URIs:
   ```
   http://localhost:3000/api/meta/callback
   https://your-production-domain.com/api/meta/callback
   ```
3. Save changes

#### Step 4: Get App Credentials
1. Go to **Settings → Basic**
2. Copy:
   - **App ID**
   - **App Secret** (click "Show" to reveal)

#### Step 5: Configure Permissions
1. Go to **App Review → Permissions and Features**
2. Request the following permissions:
   - `instagram_basic` (required)
   - `public_profile` (required)
   - Additional permissions may be requested later for advanced features

### 2. Environment Variables

Add these to your `.env.local` file:

```bash
# Meta/Facebook App Configuration
META_APP_ID=your-app-id-here
META_APP_SECRET=your-app-secret-here
META_REDIRECT_URI=http://localhost:3000/api/meta/callback

# For production
# META_REDIRECT_URI=https://your-domain.com/api/meta/callback
```

### 3. Instagram Business Account Setup

**Requirements for influencers:**
1. Convert Instagram account to **Business** or **Creator** account
2. Create a **Facebook Page**
3. **Link Instagram Business account to Facebook Page**:
   - Go to Instagram Settings → Account → Linked Accounts
   - Link to your Facebook Page
4. Ensure the user has **Admin** access to the Facebook Page

---

## Usage

### For Influencers

#### 1. Profile Setup
1. Navigate to `/influencer/profile/setup`
2. Fill in basic information:
   - Full Name
   - Category (Niche)
   - Bio
   - Country & City
   - Languages
   - Email
   - Brand Preferences (optional)
3. Click "Save Profile"

#### 2. Connect Instagram
1. On the profile setup page, click "Connect Instagram"
2. You'll be redirected to Facebook OAuth
3. Log in with your Facebook account
4. Grant permissions to access Instagram data
5. You'll be redirected back to the dashboard

#### 3. View Metrics
- Metrics are automatically synced after connection
- Dashboard shows comprehensive analytics
- Posts are fetched and stored with individual metrics

### For Developers

#### API Routes

**Profile Setup:**
- `GET /api/influencer/profile-setup` - Get profile data
- `POST /api/influencer/profile-setup` - Save basic info

**OAuth Flow:**
- `GET /api/meta/auth` - Initiate OAuth flow
- `GET /api/meta/callback` - Handle OAuth callback

**Instagram Sync:**
- `POST /api/influencer/instagram/sync` - Manual sync metrics
- `POST /api/influencer/instagram/disconnect` - Disconnect account

#### Database Schema

**influencer_profiles:**
```typescript
{
  _id: ObjectId
  userId: ObjectId
  basic_info: {
    name: string
    category: string
    bio: string
    country: string
    city: string
    languages: string[]
    email: string
    brand_preferences: string[]
  }
  instagram: {
    account_id: string
    username: string
    followers_count: number
    follows_count: number
    media_count: number
    profile_views: number
    website_clicks: number
    email_contacts: number
    phone_call_clicks: number
    reach: number
    impressions: number
    engagement: number
    online_followers: { [hour: string]: number }
    demographics: {
      audience_country: Record<string, number>
      audience_city: Record<string, number>
      audience_gender: Record<string, number>
      audience_age: Record<string, number>
      audience_gender_age: Record<string, number>
      audience_locale: Record<string, number>
    }
    calculated: {
      avg_likes: number
      avg_comments: number
      avg_reach: number
      engagement_rate_30_days: number
      followers_growth_rate: number
      posting_frequency: number
      story_frequency: number
    }
  }
  access_token: string
  access_token_expires_at: Date
  token_type: "short" | "long"
  last_synced_at: Date
  created_at: Date
  updated_at: Date
}
```

**posts:**
```typescript
{
  _id: ObjectId
  post_id: string
  userId: ObjectId
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM" | "STORY"
  caption: string
  permalink: string
  timestamp: Date
  metrics: {
    likes: number
    comments: number
    saves: number
    shares: number
    reach: number
    impressions: number
    plays: number
    taps_forward: number
    taps_back: number
    exits: number
    link_clicks: number
    watch_time: number
    avg_watch_time: number
    engagement_rate: number
  }
  created_at: Date
  updated_at: Date
}
```

---

## Migration

If you have existing influencer profiles, run the migration script:

```bash
npx tsx scripts/migrate-influencer-profiles.ts
```

This will:
- Transform old profile structure to new `basic_info` schema
- Migrate existing Instagram data to new format
- Preserve all existing data

---

## Utility Functions

### Database Utils (`lib/utils/influencer-db.ts`)
- `getInfluencerProfileByUserId(userId)` - Get profile
- `createInfluencerProfile(userId, basicInfo)` - Create new profile
- `updateInfluencerBasicInfo(userId, basicInfo)` - Update profile
- `updateInstagramAccount(userId, instagram, token)` - Update Instagram data
- `bulkUpsertPosts(posts)` - Save multiple posts
- `getPostsByUserId(userId)` - Get user posts

### Meta API Utils (`lib/utils/meta-api.ts`)
- `getOAuthUrl(state)` - Generate OAuth URL
- `exchangeCodeForToken(code)` - Get access token
- `exchangeForLongLivedToken(token)` - Get long-lived token
- `getFacebookPages(token)` - Get user's Facebook pages
- `getInstagramBusinessAccount(token, igId)` - Get Instagram account
- `getProfileMetrics(igId, token)` - Get comprehensive metrics
- `getAllMediaWithInsights(igId, token)` - Get posts with metrics

### Calculation Utils (`lib/utils/calculations.ts`)
- `calculatePostEngagementRate(metrics, followers)` - Per-post engagement
- `calculateAverageEngagementRate(posts, followers)` - Average engagement
- `calculateEngagementRate30Days(posts, followers)` - 30-day engagement
- `calculateAllMetrics(posts, followers)` - All derived metrics
- `getEngagementTier(rate)` - Tier classification
- `getBestTimeToPost(onlineFollowers)` - Optimal posting times

### SWR Hooks (`hooks/use-influencer-profile.ts`)
- `useInfluencerProfileSetup()` - Profile setup data
- `useInfluencerProfile()` - Full profile with Instagram
- `useInstagramConnection()` - Connection status
- `useInstagramMetrics()` - Instagram metrics
- `useDemographics()` - Audience demographics
- `useInfluencerPosts(limit)` - Posts data
- `saveProfileSetup(data)` - Save profile action
- `syncInstagramMetrics()` - Sync action
- `disconnectInstagram()` - Disconnect action

---

## Troubleshooting

### Common Issues

**1. "No Facebook pages found"**
- **Solution**: Create a Facebook Page first, then link your Instagram Business account to it

**2. "No Instagram Business Account found"**
- **Solution**: Convert your Instagram account to Business/Creator account and link it to a Facebook Page

**3. "Permissions error"**
- **Solution**: Ensure your Meta app has `instagram_basic` and `public_profile` permissions

**4. "Token expired"**
- **Solution**: Long-lived tokens expire after 60 days. Implement automatic refresh or ask users to reconnect

**5. "Insights not available"**
- **Solution**: Some metrics require the account to be older than 24 hours or have recent activity

### Debug Mode

Enable detailed logging:
```typescript
// In lib/logger.ts
export const logger = {
  info: console.log,
  warn: console.warn,
  error: console.error,
}
```

---

## Security Considerations

1. **Never expose** `META_APP_SECRET` in client-side code
2. **Always validate** user authentication before fetching Instagram data
3. **Store tokens securely** in the database (consider encryption)
4. **Implement rate limiting** on API routes
5. **Validate state parameter** in OAuth callback to prevent CSRF
6. **Use HTTPS** in production for all OAuth redirects

---

## Roadmap

Future enhancements:
- [ ] Automatic token refresh before expiration
- [ ] Historical data tracking (follower growth over time)
- [ ] Webhook integration for real-time updates
- [ ] Multi-account support
- [ ] Instagram Story analytics
- [ ] Competitor analysis
- [ ] AI-powered content recommendations

---

## Support

For issues or questions:
- Check the troubleshooting section
- Review Meta's [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api/)
- Contact support at support@porchest.com

---

## License

Proprietary - Porchest Platform © 2025

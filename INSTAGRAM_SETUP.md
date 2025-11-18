# Instagram Integration Setup Guide

This guide explains how to set up Instagram integration for the influencer portal.

## Prerequisites

1. Meta Developer Account
2. Facebook Page connected to Instagram Business Account
3. Admin access to the Facebook Page

## Step 1: Create a Meta App

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Choose "Business" as the app type
4. Fill in app details:
   - App Name: Your App Name
   - Contact Email: Your email
   - Business Account: Select or create one

## Step 2: Configure App Products

Add the following products to your app:

### Facebook Login
1. Go to "Add Products"
2. Select "Facebook Login" → "Set Up"
3. Choose "Web" as the platform
4. Enter your Site URL (e.g., `https://your-domain.com`)

### Instagram Basic Display (Optional)
1. Add "Instagram Basic Display" product if needed

## Step 3: Configure OAuth Settings

1. Go to "Facebook Login" → "Settings"
2. Add Valid OAuth Redirect URIs:
   ```
   https://your-domain.com/api/influencer/instagram/callback
   http://localhost:3000/api/influencer/instagram/callback (for development)
   ```

## Step 4: Get App Credentials

1. Go to "Settings" → "Basic"
2. Copy the following:
   - **App ID**
   - **App Secret** (click "Show" to reveal)

## Step 5: Request Permissions

### Required Permissions:
- `instagram_basic` - Basic Instagram data
- `instagram_manage_insights` - Access to insights
- `pages_show_list` - List Facebook Pages
- `pages_read_engagement` - Read Page engagement
- `business_management` - Business account management

### How to Request:
1. Go to "App Review" → "Permissions and Features"
2. Request the permissions listed above
3. Provide use case and screencast if required
4. Wait for Meta approval (usually takes a few days)

## Step 6: Configure Environment Variables

Add the following to your `.env` or `.env.local` file:

```env
# Meta/Facebook App Configuration
META_APP_ID=your_app_id_here
META_APP_SECRET=your_app_secret_here
META_REDIRECT_URI=https://your-domain.com/api/influencer/instagram/callback

# For development, use:
# META_REDIRECT_URI=http://localhost:3000/api/influencer/instagram/callback
```

## Step 7: Test the Integration

### Development Testing:
1. Go to "Roles" → "Test Users"
2. Create a test user or use an existing one
3. Link a test Instagram account to the test Facebook Page
4. Use the test user to connect Instagram

### Production Testing:
1. Submit your app for review
2. Once approved, regular users can connect their Instagram accounts
3. Make sure users have Instagram Business or Creator accounts
4. Users must have a Facebook Page linked to their Instagram account

## How It Works

### User Flow:
1. User clicks "Connect Instagram Account" button
2. Redirected to Facebook OAuth dialog
3. User logs in and grants permissions
4. Facebook redirects back to callback URL with authorization code
5. Backend exchanges code for access token
6. Backend fetches Instagram account info and metrics
7. Data is saved to MongoDB
8. User sees success message and connected account

### Token Management:
- **Short-lived tokens**: Valid for ~1 hour
- **Long-lived tokens**: Valid for 60 days
- **Token refresh**: Automatically handled every 50-55 days (implement cron job)

### Data Synced:
- Account info: Username, profile picture, followers, following
- Insights: Impressions, reach, profile views, engagement rate
- Demographics: Audience by city, country, gender, age, locale
- Post metrics: Likes, comments, shares, reach, impressions

## API Endpoints

### Connect Instagram
```
GET /api/influencer/instagram/connect
```
Initiates OAuth flow and returns authorization URL.

### OAuth Callback
```
GET /api/influencer/instagram/callback?code=xxx&state=xxx
```
Handles OAuth callback, exchanges tokens, and saves data.

### Sync Metrics
```
POST /api/influencer/instagram/sync
```
Fetches latest Instagram metrics and updates profile.

## Database Schema

### MongoDB Collections

#### influencer_profiles
```typescript
{
  instagram_account: {
    instagram_user_id: string
    instagram_business_account_id: string
    username: string
    access_token: string (encrypted)
    token_type: "short" | "long"
    token_expires_at: Date
    page_id: string
    is_connected: boolean
    last_synced_at: Date
  },
  instagram_metrics: {
    followers_count: number
    follows_count: number
    media_count: number
    profile_views: number
    reach: number
    impressions: number
    engagement_rate: number
    website_clicks: number
    email_contacts: number
    phone_call_clicks: number
    get_directions_clicks: number
    text_message_clicks: number
  },
  instagram_demographics: {
    audience_city: Record<string, number>
    audience_country: Record<string, number>
    audience_gender_age: Record<string, number>
    audience_locale: Record<string, number>
  }
}
```

## Troubleshooting

### "No Facebook pages found"
- User needs to create a Facebook Page
- Link the Page to their Instagram Business account
- Grant admin access to the Page

### "No Instagram Business Account found"
- User needs to convert personal Instagram to Business account
- Go to Instagram → Settings → Account → Switch to Professional Account
- Link the Instagram Business account to a Facebook Page

### "Failed to fetch Instagram data"
- Check if access token is valid
- Verify permissions are granted
- Check if Instagram account is still linked to Facebook Page
- Token may have expired (refresh it)

### "Invalid OAuth response"
- Check redirect URI matches exactly in Meta app settings
- Verify app is not in development mode (unless testing)
- Check if user cancelled the OAuth flow

## Security Best Practices

1. **Never expose App Secret**: Keep it in environment variables only
2. **Encrypt tokens**: Store access tokens encrypted in database
3. **Validate state parameter**: Prevent CSRF attacks in OAuth flow
4. **Rate limiting**: Implement rate limits on API endpoints
5. **Token rotation**: Refresh long-lived tokens before expiry
6. **Audit logging**: Log all Instagram API calls for monitoring

## Maintenance

### Regular Tasks:
- Monitor token expiration dates
- Set up cron job to refresh tokens every 50 days
- Sync Instagram metrics daily or weekly
- Handle token invalidation (user disconnected Facebook/Instagram)
- Update permissions if Meta changes requirements

### Cron Jobs (Recommended):
```typescript
// Refresh tokens every 50 days
Schedule: 0 0 */50 * *

// Sync metrics daily at 2 AM
Schedule: 0 2 * * *

// Check for expired tokens daily
Schedule: 0 1 * * *
```

## Resources

- [Meta for Developers](https://developers.facebook.com/)
- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api)
- [Instagram Insights API](https://developers.facebook.com/docs/instagram-api/reference/ig-user/insights)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)
- [OAuth 2.0 Specification](https://oauth.net/2/)

## Support

For issues or questions:
1. Check Meta Developer Community
2. Review error logs in application
3. Test with Meta Graph API Explorer
4. Contact Meta Developer Support

---

**Last Updated:** 2025-11-18

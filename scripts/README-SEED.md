# MongoDB Sample Data Seeding

This document explains how to populate your MongoDB Atlas database with comprehensive sample data for development and testing.

## Overview

The `seed-sample-data.ts` script creates a complete, production-like dataset with **fully relational data** across all 14 collections in the Porchest Multiportal system.

## What Gets Created

### Users (10 accounts)
- **2 Admins** - Sarah Johnson, Michael Chen
- **2 Brands** - Jessica Martinez (TechStyle Fashion), David Thompson (FitLife Nutrition)
- **2 Influencers** - Emma Williams, Alex Rodriguez
- **2 Employees** - Olivia Brown, James Wilson
- **2 Clients** - Sophia Lee (Global Corp), Noah Davis (Startup Ventures)

All users have the password: `Password123!`

### Profiles
- **2 Brand Profiles** - Complete company info, industry, preferences, budgets
- **2 Influencer Profiles** - Social media accounts, followers, engagement rates, pricing, demographics

### Campaigns (5 campaigns)
- Sustainable Summer Collection Launch (TechStyle Fashion)
- Fall Fashion Trends 2024 (TechStyle Fashion)
- New Year Fitness Challenge (FitLife Nutrition) - Completed
- Summer Body Transformation (FitLife Nutrition)
- Black Friday Mega Sale (TechStyle Fashion) - Completed

### Relationships
- **8 Collaboration Requests** - Linking brands, influencers, and campaigns
- **10 Posts** - Instagram, TikTok, YouTube content with real metrics
- **5 Analytics Records** - Campaign performance data
- **10 Payments** - Between brands and influencers
- **8 Transactions** - Withdrawals, payments, bonuses, refunds
- **5 Daily Reports** - Employee work logs
- **10 Notifications** - Across all user types
- **5 Fraud Detections** - AI and manual detection samples
- **3 Projects** - For client portal
- **5 Audit Logs** - System activity tracking

## Prerequisites

1. **MongoDB Atlas** connection string configured in `.env.local`
2. **ts-node** installed (included in dev dependencies)
3. **Database access** - Ensure MONGODB_URI is set correctly

## Running the Script

### Option 1: Using ts-node (Recommended)

```bash
npx ts-node scripts/seed-sample-data.ts
```

### Option 2: Using tsx

```bash
npx tsx scripts/seed-sample-data.ts
```

### Option 3: Add to package.json scripts

Add this to your `package.json`:

```json
{
  "scripts": {
    "seed": "ts-node scripts/seed-sample-data.ts"
  }
}
```

Then run:

```bash
npm run seed
```

## Expected Output

```
🌱 Starting database seeding...

✅ Password hashed for all users

📋 Creating Users...
✅ Admin user created (Sarah Johnson - 673a2f...)
✅ Admin user created (Michael Chen - 673a2f...)
✅ Brand user created (Jessica Martinez - 673a2f...)
...

📋 Creating Brand Profiles...
✅ Brand profile created (TechStyle Fashion - 673a2f...)
...

📋 Creating Influencer Profiles...
✅ Influencer profile created (Emma Williams - 673a2f...)
...

📋 Creating Campaigns...
✅ Campaign created (Sustainable Summer Collection - 673a2f...)
...

[... continues for all collections ...]

============================================================
🎉 Database seeding completed successfully!
============================================================

📊 Summary:
  ✓ 10 Users created (2 admins, 2 brands, 2 influencers, 2 employees, 2 clients)
  ✓ 2 Brand Profiles created
  ✓ 2 Influencer Profiles created
  ✓ 5 Campaigns created
  ✓ 8 Collaboration Requests created
  ✓ 10 Posts created
  ✓ 5 Analytics records created
  ✓ 10 Payments created
  ✓ 8 Transactions created
  ✓ 5 Daily Reports created
  ✓ 10 Notifications created
  ✓ 5 Fraud Detections created
  ✓ 3 Projects created
  ✓ 5 Audit Logs created

📝 Login Credentials:
  Email: Any email above
  Password: Password123!

🔗 All relationships verified:
  - Users → Profiles (brand_profiles, influencer_profiles)
  - Brand Profiles → Campaigns
  - Campaigns → Collaboration Requests
  - Collaboration Requests → Influencers + Brands
  - Posts → Influencers + Campaigns
  - Analytics → Campaigns
  - Payments → Brands + Influencers + Campaigns
  - Transactions → Users + Campaigns
  - Daily Reports → Employees
  - Notifications → Users
  - Projects → Clients + Employees

✅ All data is production-ready and fully relational!
```

## Login Credentials

After seeding, you can login with any of these accounts:

### Admin
- `sarah.johnson@porchest.com` / `Password123!`
- `michael.chen@porchest.com` / `Password123!`

### Brand
- `jessica@techstyle.com` / `Password123!`
- `david@fitlife.com` / `Password123!`

### Influencer
- `emma@instagram.com` / `Password123!`
- `alex@tiktok.com` / `Password123!`

### Employee
- `olivia.brown@porchest.com` / `Password123!`
- `james.wilson@porchest.com` / `Password123!`

### Client
- `sophia@globalcorp.com` / `Password123!`
- `noah@startupventures.com` / `Password123!`

## Verifying Data in MongoDB Atlas

After running the script:

1. Go to **MongoDB Atlas Console**
2. Select your cluster
3. Click **Browse Collections**
4. Select database: `porchestDB`
5. Verify all collections exist and have data:
   - `users` (10 documents)
   - `brand_profiles` (2 documents)
   - `influencer_profiles` (2 documents)
   - `campaigns` (5 documents)
   - `collaboration_requests` (8 documents)
   - `posts` (10 documents)
   - `analytics` (5 documents)
   - `payments` (10 documents)
   - `transactions` (8 documents)
   - `daily_reports` (5 documents)
   - `notifications` (10 documents)
   - `fraud_detections` (5 documents)
   - `projects` (3 documents)
   - `audit_logs` (5 documents)

## Relationship Verification

You can verify relationships by checking ObjectId references:

### Example: Campaign → Brand Profile
```javascript
// In campaigns collection
{
  "_id": ObjectId("..."),
  "brand_id": ObjectId("..."), // References brand_profiles._id
  "name": "Sustainable Summer Collection",
  ...
}
```

### Example: Post → Influencer + Campaign
```javascript
// In posts collection
{
  "_id": ObjectId("..."),
  "influencer_id": ObjectId("..."), // References influencer_profiles._id
  "campaign_id": ObjectId("..."),   // References campaigns._id
  "platform": "instagram",
  ...
}
```

### Example: Payment → Brand + Influencer
```javascript
// In payments collection
{
  "_id": ObjectId("..."),
  "from_user_id": ObjectId("..."),  // References users._id (brand)
  "to_user_id": ObjectId("..."),    // References users._id (influencer)
  "campaign_id": ObjectId("..."),   // References campaigns._id
  ...
}
```

## Clearing Data

If you need to re-seed, first clear existing data:

### Option 1: Drop Collections via MongoDB Atlas
1. Go to Atlas Console → Browse Collections
2. For each collection, click the trash icon

### Option 2: Use MongoDB Shell
```bash
mongosh "mongodb+srv://your-connection-string"
use porchestDB
db.users.deleteMany({})
db.brand_profiles.deleteMany({})
db.influencer_profiles.deleteMany({})
db.campaigns.deleteMany({})
db.collaboration_requests.deleteMany({})
db.posts.deleteMany({})
db.analytics.deleteMany({})
db.payments.deleteMany({})
db.transactions.deleteMany({})
db.daily_reports.deleteMany({})
db.notifications.deleteMany({})
db.fraud_detections.deleteMany({})
db.projects.deleteMany({})
db.audit_logs.deleteMany({})
```

## Troubleshooting

### Error: "Cannot find module '@/lib/db'"
- Make sure you're running the script from the project root
- The script uses relative imports (`../lib/db`)

### Error: "MONGODB_URI is not defined"
- Check `.env.local` file exists
- Verify `MONGODB_URI` is set correctly
- Try: `echo $MONGODB_URI` to verify environment variable

### Error: "MongoServerError: user is not allowed to do action"
- Check your MongoDB Atlas user has write permissions
- Go to Database Access → Edit User → Set role to "Atlas Admin" or "Read and write to any database"

### Error: "Connection timeout"
- Verify your IP address is whitelisted in Atlas
- Go to Network Access → Add your current IP address

## Data Characteristics

This seed script creates **realistic, production-like data**:

✅ **No Lorem Ipsum** - All text is realistic and contextual
✅ **Real Metrics** - Engagement rates, follower counts, ROI calculations
✅ **Proper Dates** - Realistic timeline (1 month ago → ongoing → future)
✅ **Valid Relationships** - All ObjectId references are correct
✅ **Diverse Scenarios** - Pending/accepted/rejected/completed states
✅ **Edge Cases** - Failed payments, fraud detection, account suspensions

## Next Steps

After seeding:

1. **Test Login** - Try logging in with any account
2. **Explore Portals** - Each role sees different portal
3. **Check Relationships** - View campaigns, posts, payments
4. **Test Features** - Analytics, notifications, fraud detection
5. **Verify Auth** - Role-based access control working

## Notes

- **Idempotent**: You can run the script multiple times (will create duplicates)
- **Password**: All users use the same password for testing convenience
- **Status**: All users are ACTIVE (no pending approvals)
- **Verified**: All accounts are pre-verified
- **Realistic**: Data follows actual business logic and workflows

## Support

If you encounter issues:
1. Check the error message carefully
2. Verify MongoDB connection in `.env.local`
3. Ensure all dependencies are installed: `npm install`
4. Check MongoDB Atlas permissions and IP whitelist

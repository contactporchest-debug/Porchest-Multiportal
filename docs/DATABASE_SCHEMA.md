# Database Schema Documentation

Complete MongoDB database schema for Porchest Multiportal.

---

## Overview

**Database**: `porchest_db` (MongoDB 6+)
**Collections**: 14
**Total Indexes**: 29
**Driver**: MongoDB Native Driver (not Mongoose)

---

## Table of Contents

1. [Collections Overview](#collections-overview)
2. [Detailed Schemas](#detailed-schemas)
3. [Indexes](#indexes)
4. [Relationships](#relationships)
5. [Data Integrity](#data-integrity)
6. [Query Patterns](#query-patterns)
7. [Migration Scripts](#migration-scripts)

---

## Collections Overview

| Collection | Purpose | Documents (avg) | Size (avg) |
|-----------|---------|----------------|------------|
| `users` | User authentication and accounts | 100-10,000 | ~500 bytes |
| `brand_profiles` | Brand company information | 50-5,000 | ~1 KB |
| `influencer_profiles` | Influencer details and metrics | 100-50,000 | ~2 KB |
| `campaigns` | Marketing campaigns | 100-10,000 | ~1 KB |
| `collaboration_requests` | Brand-influencer partnerships | 500-100,000 | ~500 bytes |
| `posts` | Influencer content submissions | 1,000-500,000 | ~1 KB |
| `transactions` | Withdrawal requests and payments | 500-50,000 | ~500 bytes |
| `notifications` | User notifications | 1,000-100,000 | ~300 bytes |
| `audit_logs` | System activity logs | 10,000-1M | ~400 bytes |
| `analytics` | Cached analytics data | 100-10,000 | ~2 KB |
| `fraud_detections` | AI fraud detection results | 50-5,000 | ~800 bytes |
| `projects` | Client project tracking | 50-5,000 | ~1 KB |
| `payments` | Payment history records | 500-50,000 | ~500 bytes |
| `daily_reports` | Employee daily reports | 1,000-100,000 | ~600 bytes |

---

## Detailed Schemas

### 1. users

**Purpose**: Authentication and user account management

```typescript
{
  _id: ObjectId,
  email: string,              // Unique, indexed
  password: string,           // bcrypt hashed (10 rounds)
  full_name: string,
  role: enum,                 // "admin" | "brand" | "influencer" | "client" | "employee"
  verified: boolean,          // Admin approval status
  created_at: Date,           // Registration timestamp
  updated_at: Date,           // Last modification
  last_login?: Date           // Optional: Last login timestamp
}
```

**Constraints**:
- `email`: Unique, required, valid email format
- `password`: Min 6 characters (hashed)
- `role`: Must be one of the 5 roles
- `verified`: Defaults to `false`, set to `true` by admin

**Indexes**:
```javascript
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
db.users.createIndex({ verified: 1 })
db.users.createIndex({ created_at: -1 })
```

**Sample Document**:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "email": "john@example.com",
  "password": "$2b$10$N9qo8uLOickgx2ZMRZoMye",
  "full_name": "John Doe",
  "role": "influencer",
  "verified": true,
  "created_at": ISODate("2025-01-15T10:30:00Z"),
  "updated_at": ISODate("2025-01-15T10:30:00Z"),
  "last_login": ISODate("2025-01-16T08:15:00Z")
}
```

---

### 2. brand_profiles

**Purpose**: Brand company information and settings

```typescript
{
  _id: ObjectId,
  user_id: ObjectId,          // Foreign key to users._id (unique)
  brand_name: string,
  industry?: string,          // Optional: "Fashion", "Tech", "Beauty", etc.
  website?: string,           // Optional: Company website URL
  description?: string,       // Optional: Brand description (max 1000 chars)
  logo_url?: string,          // Optional: Logo image URL
  contact_email?: string,     // Optional: Business contact email
  contact_phone?: string,     // Optional: Business phone
  created_at: Date,
  updated_at: Date
}
```

**Constraints**:
- `user_id`: Unique (one profile per brand user)
- Auto-created when brand user is verified

**Indexes**:
```javascript
db.brand_profiles.createIndex({ user_id: 1 }, { unique: true })
db.brand_profiles.createIndex({ brand_name: 1 })
db.brand_profiles.createIndex({ industry: 1 })
```

**Sample Document**:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "user_id": ObjectId("507f1f77bcf86cd799439011"),
  "brand_name": "TechCorp Inc",
  "industry": "Technology",
  "website": "https://techcorp.com",
  "description": "Leading technology brand specializing in consumer electronics",
  "logo_url": "https://cdn.example.com/logos/techcorp.png",
  "contact_email": "partnerships@techcorp.com",
  "contact_phone": "+1-555-0123",
  "created_at": ISODate("2025-01-15T10:30:00Z"),
  "updated_at": ISODate("2025-01-16T14:20:00Z")
}
```

---

### 3. influencer_profiles

**Purpose**: Influencer details, metrics, and social links

```typescript
{
  _id: ObjectId,
  user_id: ObjectId,          // Foreign key to users._id (unique)
  display_name?: string,      // Public display name
  bio?: string,               // Bio/description (max 500 chars)
  profile_picture?: string,   // Profile image URL
  category?: string,          // "Fashion", "Gaming", "Fitness", etc.
  platform?: string,          // Primary platform: "instagram", "tiktok", "youtube", etc.

  // Social links
  instagram_url?: string,
  tiktok_url?: string,
  youtube_url?: string,
  twitter_url?: string,

  // Metrics
  followers?: number,         // Total follower count
  engagement_rate?: number,   // Average engagement % (0-100)
  rate_per_post?: number,     // Standard rate in USD

  // Performance (calculated by system)
  total_campaigns?: number,   // Completed campaigns
  total_earnings?: number,    // Lifetime earnings (USD)
  balance?: number,           // Current withdrawable balance (USD)
  rating?: number,            // Average rating (0-5)

  created_at: Date,
  updated_at: Date
}
```

**Constraints**:
- `user_id`: Unique (one profile per influencer user)
- Auto-created when influencer user is verified
- `balance`: Defaults to 0, updated on post submission and withdrawals

**Indexes**:
```javascript
db.influencer_profiles.createIndex({ user_id: 1 }, { unique: true })
db.influencer_profiles.createIndex({ category: 1 })
db.influencer_profiles.createIndex({ platform: 1 })
db.influencer_profiles.createIndex({ followers: -1 })
db.influencer_profiles.createIndex({ engagement_rate: -1 })
db.influencer_profiles.createIndex({ rating: -1 })
```

**Sample Document**:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439013"),
  "user_id": ObjectId("507f1f77bcf86cd799439011"),
  "display_name": "JohnDoeInfluencer",
  "bio": "Tech reviewer and gadget enthusiast. Sharing honest reviews.",
  "profile_picture": "https://cdn.example.com/profiles/john.jpg",
  "category": "Technology",
  "platform": "youtube",
  "instagram_url": "https://instagram.com/johndoe",
  "youtube_url": "https://youtube.com/@johndoe",
  "followers": 125000,
  "engagement_rate": 5.8,
  "rate_per_post": 500,
  "total_campaigns": 12,
  "total_earnings": 6500,
  "balance": 1200,
  "rating": 4.7,
  "created_at": ISODate("2025-01-15T10:30:00Z"),
  "updated_at": ISODate("2025-01-20T09:45:00Z")
}
```

---

### 4. campaigns

**Purpose**: Marketing campaign management

```typescript
{
  _id: ObjectId,
  brand_id: ObjectId,         // Foreign key to users._id (brand role)
  name: string,               // Campaign name
  description?: string,       // Campaign details and goals
  budget: number,             // Total budget in USD
  status: enum,               // "draft" | "active" | "completed" | "cancelled"
  start_date: Date,
  end_date: Date,

  // Optional targeting
  target_audience?: string,   // Demographics description
  content_guidelines?: string, // Content requirements
  hashtags?: string[],        // Required hashtags
  platform?: string,          // Target platform

  // Calculated fields
  total_spent?: number,       // Amount spent on influencers
  total_collaborations?: number, // Number of influencers invited

  created_at: Date,
  updated_at: Date
}
```

**Constraints**:
- `budget`: Must be positive
- `end_date`: Must be after `start_date`
- `status`: Defaults to "draft"

**Indexes**:
```javascript
db.campaigns.createIndex({ brand_id: 1 })
db.campaigns.createIndex({ status: 1 })
db.campaigns.createIndex({ start_date: -1 })
db.campaigns.createIndex({ end_date: -1 })
db.campaigns.createIndex({ created_at: -1 })
```

**Sample Document**:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439014"),
  "brand_id": ObjectId("507f1f77bcf86cd799439012"),
  "name": "Holiday Tech Gift Guide",
  "description": "Promote our latest gadgets for the holiday season",
  "budget": 10000,
  "status": "active",
  "start_date": ISODate("2025-12-01T00:00:00Z"),
  "end_date": ISODate("2025-12-31T23:59:59Z"),
  "target_audience": "Tech enthusiasts aged 25-45",
  "content_guidelines": "Create unboxing and review videos highlighting key features",
  "hashtags": ["#TechCorpGifts", "#HolidayTech2025"],
  "platform": "youtube",
  "total_spent": 3500,
  "total_collaborations": 7,
  "created_at": ISODate("2025-11-15T10:00:00Z"),
  "updated_at": ISODate("2025-12-10T14:30:00Z")
}
```

---

### 5. collaboration_requests

**Purpose**: Brand-influencer partnership invitations

```typescript
{
  _id: ObjectId,
  campaign_id: ObjectId,      // Foreign key to campaigns._id
  influencer_id: ObjectId,    // Foreign key to users._id (influencer role)
  brand_id: ObjectId,         // Foreign key to users._id (brand role)
  status: enum,               // "pending" | "accepted" | "rejected"
  offer_amount: number,       // Payment amount in USD
  deliverables?: string,      // What influencer must deliver
  message?: string,           // Personal message from brand

  created_at: Date,
  responded_at?: Date         // When influencer accepted/rejected
}
```

**Constraints**:
- `offer_amount`: Must be positive
- `status`: Defaults to "pending"
- Unique combination of `campaign_id` + `influencer_id` (can't invite twice)

**Indexes**:
```javascript
db.collaboration_requests.createIndex({ campaign_id: 1 })
db.collaboration_requests.createIndex({ influencer_id: 1 })
db.collaboration_requests.createIndex({ brand_id: 1 })
db.collaboration_requests.createIndex({ status: 1 })
db.collaboration_requests.createIndex(
  { campaign_id: 1, influencer_id: 1 },
  { unique: true }
)
```

**Sample Document**:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439015"),
  "campaign_id": ObjectId("507f1f77bcf86cd799439014"),
  "influencer_id": ObjectId("507f1f77bcf86cd799439011"),
  "brand_id": ObjectId("507f1f77bcf86cd799439012"),
  "status": "accepted",
  "offer_amount": 500,
  "deliverables": "1 YouTube review video (10-15 min)",
  "message": "Hi John! We love your tech reviews and would like to collaborate.",
  "created_at": ISODate("2025-11-20T10:00:00Z"),
  "responded_at": ISODate("2025-11-21T14:30:00Z")
}
```

---

### 6. posts

**Purpose**: Influencer content submissions and metrics

```typescript
{
  _id: ObjectId,
  campaign_id: ObjectId,      // Foreign key to campaigns._id
  influencer_id: ObjectId,    // Foreign key to users._id
  collaboration_id: ObjectId, // Foreign key to collaboration_requests._id

  // Post details
  post_url: string,           // Link to published content
  screenshot_url?: string,    // Screenshot of post
  caption?: string,           // Post caption/description
  platform: string,           // "instagram", "tiktok", "youtube", etc.

  // Metrics
  views?: number,             // Post views/impressions
  likes?: number,             // Likes count
  comments?: number,          // Comments count
  shares?: number,            // Shares/retweets count

  // Calculated
  engagement_rate?: number,   // (likes + comments + shares) / views * 100

  posted_at: Date,            // When content was published
  submitted_at: Date          // When submitted to platform
}
```

**Constraints**:
- `post_url`: Required, valid URL
- Metrics default to 0 if not provided
- `engagement_rate`: Calculated automatically

**Indexes**:
```javascript
db.posts.createIndex({ campaign_id: 1 })
db.posts.createIndex({ influencer_id: 1 })
db.posts.createIndex({ collaboration_id: 1 })
db.posts.createIndex({ platform: 1 })
db.posts.createIndex({ posted_at: -1 })
db.posts.createIndex({ engagement_rate: -1 })
```

**Sample Document**:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439016"),
  "campaign_id": ObjectId("507f1f77bcf86cd799439014"),
  "influencer_id": ObjectId("507f1f77bcf86cd799439011"),
  "collaboration_id": ObjectId("507f1f77bcf86cd799439015"),
  "post_url": "https://youtube.com/watch?v=abc123",
  "screenshot_url": "https://cdn.example.com/screenshots/post1.jpg",
  "caption": "Unboxing the latest TechCorp gadget! #TechCorpGifts #HolidayTech2025",
  "platform": "youtube",
  "views": 45000,
  "likes": 2800,
  "comments": 150,
  "shares": 75,
  "engagement_rate": 6.72,
  "posted_at": ISODate("2025-12-05T15:00:00Z"),
  "submitted_at": ISODate("2025-12-05T16:30:00Z")
}
```

---

### 7. transactions

**Purpose**: Influencer withdrawal requests and payment tracking

```typescript
{
  _id: ObjectId,
  influencer_id: ObjectId,    // Foreign key to users._id
  type: enum,                 // "withdrawal" | "payment" | "refund"
  amount: number,             // Amount in USD
  status: enum,               // "pending" | "approved" | "rejected" | "completed"

  // Payment details
  payment_method?: string,    // "PayPal", "Bank Transfer", etc.
  payment_details?: string,   // Email, account number (encrypted)

  // Admin review
  reviewed_by?: ObjectId,     // Admin user_id who reviewed
  reviewed_at?: Date,
  rejection_reason?: string,  // If rejected

  created_at: Date,
  completed_at?: Date         // When payment was sent
}
```

**Constraints**:
- `amount`: Must be positive
- `status`: Defaults to "pending"
- Balance is deducted immediately on creation (held pending approval)

**Indexes**:
```javascript
db.transactions.createIndex({ influencer_id: 1 })
db.transactions.createIndex({ status: 1 })
db.transactions.createIndex({ created_at: -1 })
db.transactions.createIndex({ reviewed_by: 1 })
```

**Sample Document**:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439017"),
  "influencer_id": ObjectId("507f1f77bcf86cd799439011"),
  "type": "withdrawal",
  "amount": 500,
  "status": "approved",
  "payment_method": "PayPal",
  "payment_details": "john@example.com",
  "reviewed_by": ObjectId("507f1f77bcf86cd799439001"),
  "reviewed_at": ISODate("2025-01-18T10:00:00Z"),
  "created_at": ISODate("2025-01-17T14:30:00Z"),
  "completed_at": ISODate("2025-01-18T10:05:00Z")
}
```

---

### 8. notifications

**Purpose**: User notifications for events and updates

```typescript
{
  _id: ObjectId,
  user_id: ObjectId,          // Foreign key to users._id
  title: string,              // Notification title
  message: string,            // Notification body
  type: enum,                 // "info" | "success" | "warning" | "error"
  read: boolean,              // Read status
  link?: string,              // Optional: Link to related resource

  created_at: Date,
  read_at?: Date              // When user marked as read
}
```

**Constraints**:
- `read`: Defaults to `false`
- Auto-deleted after 90 days if `read` is `true` (background job)

**Indexes**:
```javascript
db.notifications.createIndex({ user_id: 1 })
db.notifications.createIndex({ read: 1 })
db.notifications.createIndex({ created_at: -1 })
db.notifications.createIndex({ user_id: 1, read: 1, created_at: -1 })
```

**Sample Document**:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439018"),
  "user_id": ObjectId("507f1f77bcf86cd799439011"),
  "title": "Campaign Invitation",
  "message": "TechCorp Inc invited you to join 'Holiday Tech Gift Guide' campaign for $500",
  "type": "info",
  "read": true,
  "link": "/influencer/invitations",
  "created_at": ISODate("2025-11-20T10:00:00Z"),
  "read_at": ISODate("2025-11-20T11:15:00Z")
}
```

---

### 9. audit_logs

**Purpose**: Immutable system activity logs for compliance and security

```typescript
{
  _id: ObjectId,
  user_id?: ObjectId,         // User who performed action (null for system)
  action: string,             // Action type (e.g., "user.created", "campaign.invite")
  resource_type?: string,     // Type of resource affected
  resource_id?: ObjectId,     // ID of affected resource
  ip_address?: string,        // IP address of requester
  user_agent?: string,        // Browser/client info
  metadata?: object,          // Additional action-specific data
  timestamp: Date             // When action occurred
}
```

**Constraints**:
- Logs are immutable (never updated or deleted)
- `action`: Required, follows format "entity.action"

**Indexes**:
```javascript
db.audit_logs.createIndex({ user_id: 1 })
db.audit_logs.createIndex({ action: 1 })
db.audit_logs.createIndex({ timestamp: -1 })
db.audit_logs.createIndex({ resource_type: 1, resource_id: 1 })
```

**Common Actions**:
- `user.created`
- `user.verified`
- `user.rejected`
- `campaign.created`
- `campaign.invite`
- `collaboration.accepted`
- `collaboration.rejected`
- `post.submitted`
- `withdrawal.requested`
- `withdrawal.approved`
- `withdrawal.rejected`

**Sample Document**:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439019"),
  "user_id": ObjectId("507f1f77bcf86cd799439012"),
  "action": "campaign.invite",
  "resource_type": "collaboration_request",
  "resource_id": ObjectId("507f1f77bcf86cd799439015"),
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "metadata": {
    "campaign_id": "507f1f77bcf86cd799439014",
    "influencer_count": 5,
    "total_offer": 2500
  },
  "timestamp": ISODate("2025-11-20T10:00:00Z")
}
```

---

### 10. analytics

**Purpose**: Cached analytics data for performance

```typescript
{
  _id: ObjectId,
  entity_type: enum,          // "campaign" | "influencer" | "brand"
  entity_id: ObjectId,        // ID of campaign/influencer/brand
  period: enum,               // "daily" | "weekly" | "monthly" | "all_time"

  // Metrics (varies by entity_type)
  metrics: {
    total_reach?: number,
    total_engagement?: number,
    engagement_rate?: number,
    total_posts?: number,
    total_collaborations?: number,
    total_spent?: number,
    total_earnings?: number,
    // ... more metrics
  },

  calculated_at: Date         // When analytics were computed
}
```

**Constraints**:
- Unique combination of `entity_type`, `entity_id`, and `period`
- Refreshed by background job every 30 minutes

**Indexes**:
```javascript
db.analytics.createIndex(
  { entity_type: 1, entity_id: 1, period: 1 },
  { unique: true }
)
db.analytics.createIndex({ calculated_at: -1 })
```

**Sample Document**:
```json
{
  "_id": ObjectId("507f1f77bcf86cd79943901a"),
  "entity_type": "campaign",
  "entity_id": ObjectId("507f1f77bcf86cd799439014"),
  "period": "all_time",
  "metrics": {
    "total_reach": 450000,
    "total_engagement": 28500,
    "engagement_rate": 6.33,
    "total_posts": 7,
    "total_collaborations": 7,
    "total_spent": 3500
  },
  "calculated_at": ISODate("2025-12-10T15:00:00Z")
}
```

---

### 11. fraud_detections

**Purpose**: AI fraud detection results and alerts

```typescript
{
  _id: ObjectId,
  entity_type: enum,          // "influencer_profile" | "campaign" | "collaboration"
  entity_id?: ObjectId,       // Optional: ID of entity checked
  fraud_score: number,        // Score 0-100 (higher = more suspicious)
  is_fraud: boolean,          // true if fraud_score >= 50
  severity: enum,             // "low" | "medium" | "high" | "critical"
  flags: string[],            // List of suspicious indicators
  data: object,               // Data that was analyzed
  detected_by: string,        // "ai_system" or admin user ID
  detected_at: Date
}
```

**Constraints**:
- `fraud_score`: 0-100
- `is_fraud`: true if score >= 50

**Indexes**:
```javascript
db.fraud_detections.createIndex({ entity_type: 1, entity_id: 1 })
db.fraud_detections.createIndex({ is_fraud: 1 })
db.fraud_detections.createIndex({ severity: 1 })
db.fraud_detections.createIndex({ detected_at: -1 })
```

**Sample Document**:
```json
{
  "_id": ObjectId("507f1f77bcf86cd79943901b"),
  "entity_type": "influencer_profile",
  "entity_id": ObjectId("507f1f77bcf86cd799439013"),
  "fraud_score": 25,
  "is_fraud": false,
  "severity": "low",
  "flags": [],
  "data": {
    "followers": 125000,
    "engagement_rate": 5.8,
    "follower_growth_rate": 8
  },
  "detected_by": "ai_system",
  "detected_at": ISODate("2025-01-20T10:00:00Z")
}
```

---

### 12. projects

**Purpose**: Client project management and tracking

```typescript
{
  _id: ObjectId,
  client_id: ObjectId,        // Foreign key to users._id (client role)
  name: string,               // Project name
  description?: string,       // Project details
  status: enum,               // "planning" | "active" | "completed" | "on_hold"
  progress_percentage: number, // 0-100

  // Associated campaigns
  campaign_ids: ObjectId[],   // Array of campaign._id

  // Budget and timeline
  budget?: number,            // Optional: Project budget
  start_date?: Date,
  end_date?: Date,

  // Deliverables
  deliverables?: string[],    // List of expected outputs

  created_at: Date,
  updated_at: Date
}
```

**Constraints**:
- `progress_percentage`: 0-100
- `status`: Defaults to "planning"

**Indexes**:
```javascript
db.projects.createIndex({ client_id: 1 })
db.projects.createIndex({ status: 1 })
db.projects.createIndex({ created_at: -1 })
```

**Sample Document**:
```json
{
  "_id": ObjectId("507f1f77bcf86cd79943901c"),
  "client_id": ObjectId("507f1f77bcf86cd799439020"),
  "name": "Q4 2025 Marketing Push",
  "description": "Multi-channel influencer marketing for holiday season",
  "status": "active",
  "progress_percentage": 65,
  "campaign_ids": [
    ObjectId("507f1f77bcf86cd799439014"),
    ObjectId("507f1f77bcf86cd799439021")
  ],
  "budget": 50000,
  "start_date": ISODate("2025-10-01T00:00:00Z"),
  "end_date": ISODate("2025-12-31T23:59:59Z"),
  "deliverables": [
    "20 YouTube videos",
    "50 Instagram posts",
    "Campaign performance report"
  ],
  "created_at": ISODate("2025-09-15T10:00:00Z"),
  "updated_at": ISODate("2025-12-10T14:30:00Z")
}
```

---

### 13. payments

**Purpose**: Payment history and transaction records

```typescript
{
  _id: ObjectId,
  transaction_id: ObjectId,   // Foreign key to transactions._id
  influencer_id: ObjectId,    // Foreign key to users._id
  amount: number,             // Payment amount in USD
  payment_method: string,     // "PayPal", "Bank Transfer", etc.
  status: enum,               // "pending" | "completed" | "failed"

  // Payment gateway info
  gateway_transaction_id?: string, // External payment ID
  gateway_response?: object,  // Response from payment provider

  processed_at?: Date,
  created_at: Date
}
```

**Indexes**:
```javascript
db.payments.createIndex({ transaction_id: 1 })
db.payments.createIndex({ influencer_id: 1 })
db.payments.createIndex({ status: 1 })
db.payments.createIndex({ created_at: -1 })
```

**Sample Document**:
```json
{
  "_id": ObjectId("507f1f77bcf86cd79943901d"),
  "transaction_id": ObjectId("507f1f77bcf86cd799439017"),
  "influencer_id": ObjectId("507f1f77bcf86cd799439011"),
  "amount": 500,
  "payment_method": "PayPal",
  "status": "completed",
  "gateway_transaction_id": "PAYPAL-ABC123",
  "gateway_response": {
    "status": "COMPLETED",
    "transaction_fee": 15.50
  },
  "processed_at": ISODate("2025-01-18T10:05:00Z"),
  "created_at": ISODate("2025-01-18T10:00:00Z")
}
```

---

### 14. daily_reports

**Purpose**: Employee daily work reports

```typescript
{
  _id: ObjectId,
  employee_id: ObjectId,      // Foreign key to users._id (employee role)
  report_date: Date,          // Date of report
  hours_worked: number,       // Hours worked (e.g., 8.5)
  tasks_completed: string,    // Description of tasks
  blockers?: string,          // Issues or obstacles
  notes?: string,             // Additional comments
  project_id?: ObjectId,      // Optional: Associated project

  // Manager review
  reviewed_by?: ObjectId,     // Manager who reviewed
  rating?: number,            // Performance rating (1-5)
  feedback?: string,          // Manager feedback

  created_at: Date,
  updated_at: Date
}
```

**Constraints**:
- `hours_worked`: Must be positive
- `rating`: 1-5 if provided

**Indexes**:
```javascript
db.daily_reports.createIndex({ employee_id: 1 })
db.daily_reports.createIndex({ report_date: -1 })
db.daily_reports.createIndex({ project_id: 1 })
db.daily_reports.createIndex({ employee_id: 1, report_date: -1 })
```

**Sample Document**:
```json
{
  "_id": ObjectId("507f1f77bcf86cd79943901e"),
  "employee_id": ObjectId("507f1f77bcf86cd799439030"),
  "report_date": ISODate("2025-01-20T00:00:00Z"),
  "hours_worked": 8,
  "tasks_completed": "Completed user authentication bug fixes, reviewed pull requests, updated documentation",
  "blockers": "Waiting for design team feedback on new UI",
  "notes": "Good progress on sprint goals",
  "reviewed_by": ObjectId("507f1f77bcf86cd799439001"),
  "rating": 4,
  "feedback": "Great work on the bug fixes!",
  "created_at": ISODate("2025-01-20T18:00:00Z"),
  "updated_at": ISODate("2025-01-21T09:00:00Z")
}
```

---

## Indexes

### Index Creation Script

```javascript
// Run this script to create all indexes
// Execute: mongosh < create-indexes.js

use porchest_db;

// users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ verified: 1 });
db.users.createIndex({ created_at: -1 });

// brand_profiles
db.brand_profiles.createIndex({ user_id: 1 }, { unique: true });
db.brand_profiles.createIndex({ brand_name: 1 });
db.brand_profiles.createIndex({ industry: 1 });

// influencer_profiles
db.influencer_profiles.createIndex({ user_id: 1 }, { unique: true });
db.influencer_profiles.createIndex({ category: 1 });
db.influencer_profiles.createIndex({ platform: 1 });
db.influencer_profiles.createIndex({ followers: -1 });
db.influencer_profiles.createIndex({ engagement_rate: -1 });
db.influencer_profiles.createIndex({ rating: -1 });

// campaigns
db.campaigns.createIndex({ brand_id: 1 });
db.campaigns.createIndex({ status: 1 });
db.campaigns.createIndex({ start_date: -1 });
db.campaigns.createIndex({ end_date: -1 });
db.campaigns.createIndex({ created_at: -1 });

// collaboration_requests
db.collaboration_requests.createIndex({ campaign_id: 1 });
db.collaboration_requests.createIndex({ influencer_id: 1 });
db.collaboration_requests.createIndex({ brand_id: 1 });
db.collaboration_requests.createIndex({ status: 1 });
db.collaboration_requests.createIndex(
  { campaign_id: 1, influencer_id: 1 },
  { unique: true }
);

// posts
db.posts.createIndex({ campaign_id: 1 });
db.posts.createIndex({ influencer_id: 1 });
db.posts.createIndex({ collaboration_id: 1 });
db.posts.createIndex({ platform: 1 });
db.posts.createIndex({ posted_at: -1 });
db.posts.createIndex({ engagement_rate: -1 });

// transactions
db.transactions.createIndex({ influencer_id: 1 });
db.transactions.createIndex({ status: 1 });
db.transactions.createIndex({ created_at: -1 });
db.transactions.createIndex({ reviewed_by: 1 });

// notifications
db.notifications.createIndex({ user_id: 1 });
db.notifications.createIndex({ read: 1 });
db.notifications.createIndex({ created_at: -1 });
db.notifications.createIndex({ user_id: 1, read: 1, created_at: -1 });

// audit_logs
db.audit_logs.createIndex({ user_id: 1 });
db.audit_logs.createIndex({ action: 1 });
db.audit_logs.createIndex({ timestamp: -1 });
db.audit_logs.createIndex({ resource_type: 1, resource_id: 1 });

// analytics
db.analytics.createIndex(
  { entity_type: 1, entity_id: 1, period: 1 },
  { unique: true }
);
db.analytics.createIndex({ calculated_at: -1 });

// fraud_detections
db.fraud_detections.createIndex({ entity_type: 1, entity_id: 1 });
db.fraud_detections.createIndex({ is_fraud: 1 });
db.fraud_detections.createIndex({ severity: 1 });
db.fraud_detections.createIndex({ detected_at: -1 });

// projects
db.projects.createIndex({ client_id: 1 });
db.projects.createIndex({ status: 1 });
db.projects.createIndex({ created_at: -1 });

// payments
db.payments.createIndex({ transaction_id: 1 });
db.payments.createIndex({ influencer_id: 1 });
db.payments.createIndex({ status: 1 });
db.payments.createIndex({ created_at: -1 });

// daily_reports
db.daily_reports.createIndex({ employee_id: 1 });
db.daily_reports.createIndex({ report_date: -1 });
db.daily_reports.createIndex({ project_id: 1 });
db.daily_reports.createIndex({ employee_id: 1, report_date: -1 });

print("All indexes created successfully!");
```

### Index Usage Guidelines

**Query Optimization**:
- Use indexed fields in `find()` queries
- Avoid `$regex` on non-indexed fields for large collections
- Use compound indexes for frequently combined filters
- Monitor slow queries with MongoDB profiler

**Index Maintenance**:
- Rebuild indexes periodically: `db.collection.reIndex()`
- Monitor index usage: `db.collection.aggregate([{ $indexStats: {} }])`
- Drop unused indexes to save space

---

## Relationships

### Entity Relationship Diagram (ERD)

```
users (1) ─────< (1) brand_profiles
  │                     │
  │                     │
  │                     └──< (many) campaigns
  │                              │
  │                              │
  │                              └──< (many) collaboration_requests
  │                                          │
  │                                          │
  └─────< (1) influencer_profiles            │
            │                                │
            │                                │
            └──< (many) posts ───────────────┘
            │
            │
            └──< (many) transactions ───< (many) payments

users (client) ─────< (many) projects ──────< (many) campaigns

users (employee) ───< (many) daily_reports

users ──────< (many) notifications
users ──────< (many) audit_logs

campaigns ──────< (1) analytics
influencer_profiles ──< (1) analytics

(any entity) ──────< fraud_detections
```

### Foreign Key Relationships

| Child Collection | Foreign Key | Parent Collection | Parent Field |
|-----------------|-------------|-------------------|--------------|
| brand_profiles | user_id | users | _id |
| influencer_profiles | user_id | users | _id |
| campaigns | brand_id | users | _id |
| collaboration_requests | campaign_id | campaigns | _id |
| collaboration_requests | influencer_id | users | _id |
| collaboration_requests | brand_id | users | _id |
| posts | campaign_id | campaigns | _id |
| posts | influencer_id | users | _id |
| posts | collaboration_id | collaboration_requests | _id |
| transactions | influencer_id | users | _id |
| transactions | reviewed_by | users | _id |
| notifications | user_id | users | _id |
| audit_logs | user_id | users | _id |
| analytics | entity_id | (varies) | _id |
| fraud_detections | entity_id | (varies) | _id |
| projects | client_id | users | _id |
| projects | campaign_ids | campaigns | _id |
| payments | transaction_id | transactions | _id |
| payments | influencer_id | users | _id |
| daily_reports | employee_id | users | _id |
| daily_reports | project_id | projects | _id |

**Note**: MongoDB doesn't enforce foreign key constraints. Application code must maintain referential integrity.

---

## Data Integrity

### Application-Level Constraints

**On User Verification (admin approves)**:
```javascript
// Auto-create profile based on role
if (role === "brand") {
  await brand_profiles.insertOne({ user_id, created_at: new Date() })
}
if (role === "influencer") {
  await influencer_profiles.insertOne({
    user_id,
    balance: 0,
    total_earnings: 0,
    created_at: new Date()
  })
}
```

**On Campaign Invite**:
```javascript
// Ensure unique invitation
const existing = await collaboration_requests.findOne({
  campaign_id,
  influencer_id
})
if (existing) throw new Error("Already invited")
```

**On Post Submission**:
```javascript
// Update influencer balance
const collaboration = await collaboration_requests.findOne({ _id: collaboration_id })
await influencer_profiles.updateOne(
  { user_id: influencer_id },
  { $inc: { balance: collaboration.offer_amount, total_earnings: collaboration.offer_amount } }
)
```

**On Withdrawal Request**:
```javascript
// Deduct balance immediately (held pending approval)
await influencer_profiles.updateOne(
  { user_id: influencer_id },
  { $inc: { balance: -amount } }
)

// If rejected, refund
if (status === "rejected") {
  await influencer_profiles.updateOne(
    { user_id: influencer_id },
    { $inc: { balance: amount } }
  )
}
```

### Cascade Delete Behavior

**When deleting a user**:
- Delete associated profile (brand_profiles or influencer_profiles)
- Archive campaigns (don't delete, for audit)
- Archive collaborations and posts
- Keep audit_logs (immutable)
- Delete notifications

**When deleting a campaign**:
- Archive collaboration_requests
- Archive posts
- Keep analytics (for historical reporting)

**Best Practice**: Use soft deletes (add `deleted_at` field) instead of hard deletes for important entities.

---

## Query Patterns

### Common Queries

#### 1. Find Influencers by Category and Engagement

```javascript
db.influencer_profiles.find({
  category: "Technology",
  engagement_rate: { $gte: 5 },
  followers: { $gte: 100000 }
}).sort({ engagement_rate: -1 }).limit(10)
```

**Uses indexes**: `category`, `engagement_rate`, `followers`

---

#### 2. Get Campaign with Collaborations and Posts

```javascript
const campaign = await db.campaigns.findOne({ _id: campaignId })

const collaborations = await db.collaboration_requests.find({
  campaign_id: campaignId
}).toArray()

const posts = await db.posts.find({ campaign_id: campaignId }).toArray()
```

**Uses indexes**: `campaign_id` on collaboration_requests and posts

---

#### 3. Influencer Earnings History

```javascript
const posts = await db.posts.find({ influencer_id }).toArray()

const collaborationIds = posts.map(p => p.collaboration_id)

const earnings = await db.collaboration_requests.find({
  _id: { $in: collaborationIds },
  status: "accepted"
}).toArray()

const totalEarnings = earnings.reduce((sum, c) => sum + c.offer_amount, 0)
```

---

#### 4. Pending User Approvals

```javascript
db.users.find({ verified: false }).sort({ created_at: -1 })
```

**Uses indexes**: `verified`, `created_at`

---

#### 5. Admin Audit Log Search

```javascript
db.audit_logs.find({
  action: { $regex: "campaign", $options: "i" },
  timestamp: {
    $gte: ISODate("2025-01-01"),
    $lte: ISODate("2025-01-31")
  }
}).sort({ timestamp: -1 }).limit(100)
```

**Uses indexes**: `action`, `timestamp`

---

#### 6. Campaign Analytics Aggregation

```javascript
const stats = await db.posts.aggregate([
  { $match: { campaign_id: ObjectId(campaignId) } },
  {
    $group: {
      _id: null,
      totalViews: { $sum: "$views" },
      totalLikes: { $sum: "$likes" },
      totalComments: { $sum: "$comments" },
      totalShares: { $sum: "$shares" },
      postCount: { $sum: 1 }
    }
  }
]).toArray()
```

---

### Performance Tips

1. **Use projection** to limit returned fields:
```javascript
db.users.find({ role: "influencer" }, { email: 1, full_name: 1, _id: 0 })
```

2. **Batch operations** with `bulkWrite`:
```javascript
await db.influencer_profiles.bulkWrite([
  { updateOne: { filter: { _id: id1 }, update: { $inc: { balance: 100 } } } },
  { updateOne: { filter: { _id: id2 }, update: { $inc: { balance: 200 } } } }
])
```

3. **Cursor iteration** for large datasets:
```javascript
const cursor = db.posts.find().batchSize(100)
for await (const post of cursor) {
  // Process post
}
```

4. **Aggregation pipelines** for complex analytics:
```javascript
db.posts.aggregate([
  { $match: { posted_at: { $gte: startDate } } },
  { $group: { _id: "$platform", totalEngagement: { $sum: { $add: ["$likes", "$comments"] } } } },
  { $sort: { totalEngagement: -1 } }
])
```

---

## Migration Scripts

### Initial Setup

```bash
# Create database
mongosh --eval "use porchest_db"

# Run index creation
mongosh porchest_db < create-indexes.js

# Verify indexes
mongosh porchest_db --eval "db.getCollectionNames().forEach(c => { print(c); db[c].getIndexes().forEach(i => print('  ' + JSON.stringify(i.key))) })"
```

### Seed Data (Development)

```javascript
// seed-dev-data.js
use porchest_db;

// Create admin user
const adminPassword = "$2b$10$N9qo8uLOickgx2ZMRZoMye"; // bcrypt("password")
db.users.insertOne({
  email: "admin@porchest.com",
  password: adminPassword,
  full_name: "Admin User",
  role: "admin",
  verified: true,
  created_at: new Date(),
  updated_at: new Date()
});

print("Seed data created!");
```

---

## Backup and Restore

### Backup

```bash
# Full backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/porchest_db" --out=/backup/$(date +%Y%m%d)

# Single collection
mongodump --uri="mongodb+srv://..." --collection=users --out=/backup/users-$(date +%Y%m%d)
```

### Restore

```bash
# Full restore
mongorestore --uri="mongodb+srv://..." /backup/20250115

# Single collection
mongorestore --uri="mongodb+srv://..." --collection=users /backup/users-20250115/porchest_db/users.bson
```

### Automated Backups

Set up daily automated backups using cron:

```bash
# crontab -e
0 2 * * * /usr/bin/mongodump --uri="$MONGODB_URI" --out=/backups/$(date +\%Y\%m\%d) && find /backups -type d -mtime +30 -exec rm -rf {} \;
```

---

**Last Updated**: 2025-11-15
**Version**: 1.0.0

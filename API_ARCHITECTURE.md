# Porchest Multiportal - API Endpoints & Data Flow Architecture

## Project Overview

**Technology Stack:**
- Framework: Next.js 14.2+ with App Router
- Authentication: NextAuth v5 + JWT
- Database: MongoDB 6.20
- Validation: Zod
- Runtime: Node.js (API routes)

**Supported User Roles:**
- `admin`: System administrators with full access
- `brand`: Brands/companies creating campaigns
- `influencer`: Influencers with profiles and earnings
- `client`: Generic client access
- `employee`: Internal employees with daily reporting

---

## Authentication & Authorization Architecture

### 1. Authentication Flow

**Registration Flow:**
```
POST /api/auth/register
  ↓
Validate credentials with Zod schema
  ↓
Hash password with bcrypt (10 salt rounds)
  ↓
Insert user to MongoDB with status:
  - "PENDING" (brands/influencers need admin approval)
  - "ACTIVE" (clients/employees immediate access)
  ↓
Return 201 Created with userId and redirectTo URL
```

**Login Flow:**
```
POST /api/auth/[...nextauth]
  ↓
CredentialsProvider.authorize():
  - Find user by email
  - Check status !== "PENDING" (must be approved)
  - Compare password with bcrypt
  ↓
JWT Token Generation:
  - token.role = user.role
  - token.status = user.status
  - token.id = user._id
  ↓
Session created with JWT strategy (24h max age)
  ↓
Redirect to /portal (role-based routing)
```

**OAuth (Google) Flow:**
```
GoogleProvider configured
  ↓
Profile mapping: { id, name, email, image, role: "brand", status: "PENDING" }
  ↓
SignIn callback checks if user exists and status
  ↓
Redirects PENDING users to /auth/pending-approval
```

### 2. Middleware (Edge-Compatible)

**Location:** `/middleware.ts`

**Authentication Checks:**
- Uses JWT-only auth (no MongoDB in middleware)
- Validates session without database calls

**Route Protection:**
- Public routes: `/`, `/login`, `/signup`, `/api/auth`
- Protected routes require authentication
- Role-based route access:
  - `/brand/*` → brand role
  - `/influencer/*` → influencer role
  - `/client/*` → client role
  - `/employee/*` → employee role
  - `/admin/*` → admin role

**Account Status Validation:**
- Redirects non-ACTIVE users to `/auth/pending-approval`
- Enforces callback URL preservation

### 3. Authorization Patterns

**Pattern 1: Role-based Access**
```typescript
// Check authentication
const session = await auth();
if (!session || !session.user) {
  return unauthorizedResponse("Authentication required");
}

// Check role
if (session.user.role !== "brand") {
  return forbiddenResponse("Brand access required");
}
```

**Pattern 2: Resource Ownership**
```typescript
// Verify brand owns the campaign
const user = await getUserById(session.user.id);
if (campaign.brand_id.toString() !== user._id.toString()) {
  return forbiddenResponse("You don't have access to this campaign");
}
```

**Pattern 3: Admin-Only Access**
```typescript
if (session.user.role !== "admin") {
  return unauthorizedResponse("Admin access required");
}
```

---

## Data Flow Architecture

### 1. Client → API Request Flow

```
Client (React Component/Browser)
  ↓
[Optional: Rate Limiting Check]
  ↓
Middleware Authentication
  ↓
Route Handler
  ├─ Session Extraction (JWT)
  ├─ Request Validation (Zod)
  ├─ Authorization Check
  ├─ Business Logic
  ├─ Database Operation
  └─ Response Formatting
  ↓
Standardized API Response
  ├─ success: boolean
  ├─ data: T
  ├─ error: { message, code, details }
  └─ meta: { timestamp, requestId }
  ↓
Client (with caching headers if applicable)
```

### 2. Database Access Pattern

**Connection Flow:**
```
App Request
  ↓
getDb() → MongoDB Client Promise
  ↓
client.db("porchestDB")
  ↓
collections.{collectionName}()
  ↓
Type-safe MongoDB operations
```

**Typical Operation:**
```typescript
// 1. Get collection
const usersCollection = await collections.users();

// 2. Query/Modify
const user = await usersCollection.findOne({ email: "user@example.com" });

// 3. Sanitize (remove sensitive fields)
const sanitized = sanitizeDocument(user);

// 4. Return response
return successResponse(sanitized);
```

### 3. Data Transformation Pipeline

**Sanitization (Automatic in all API responses):**
```typescript
sanitizeDocument(doc) {
  - Convert ObjectId → string
  - Convert Date → ISO string
  - Remove: password_hash, payment_details
  - Recursive for nested objects/arrays
}
```

**Validation (Request Input):**
```typescript
const validatedData = validateRequest(schema, body);
// Throws ZodError if invalid → validationErrorResponse()
```

**Validation (Query Parameters):**
```typescript
const queryParams = validateQuery(schema, searchParams);
// Type-safe query parameter extraction
```

---

## Rate Limiting System

**Configuration:** `/lib/rate-limit.ts`

**Rate Limit Configurations:**

| Endpoint Type | Max Requests | Window | Purpose |
|---------------|-------------|--------|---------|
| `auth` | 5 | 15 min | Brute force prevention |
| `register` | 3 | 1 hour | Prevent spam accounts |
| `ai` | 10 | 1 min | Prevent ML service abuse |
| `financial` | 5 | 1 min | Prevent rapid withdrawals |
| `admin` | 100 | 1 min | Admin operations |
| `default` | 100 | 1 min | General endpoints |

**Implementation:**
- In-memory LRU cache (10k entries max)
- Sliding window algorithm
- IP-based or user-based tracking
- Headers added to response:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
- Returns 429 (Too Many Requests) when exceeded

---

## Error Handling

**Standardized Error Responses:**

```typescript
interface ApiResponse {
  success: false,
  error: {
    message: string,
    code: string,
    details?: any
  },
  meta: { timestamp: ISO8601 }
}
```

**Error Types & Status Codes:**

| Error | Status | Code | Meaning |
|-------|--------|------|---------|
| Validation Failed | 400 | `VALIDATION_ERROR` | Input data invalid |
| Bad Request | 400 | `BAD_REQUEST` | Malformed request |
| Unauthorized | 401 | `UNAUTHORIZED` | No valid auth |
| Forbidden | 403 | `FORBIDDEN` | Auth valid, no access |
| Not Found | 404 | `NOT_FOUND` | Resource missing |
| Conflict | 409 | `CONFLICT` | Resource exists (duplicate) |
| Too Many Requests | 429 | `TOO_MANY_REQUESTS` | Rate limited |
| Server Error | 500 | `INTERNAL_ERROR` | Unexpected error |

**Error Handling Wrapper:**
```typescript
withErrorHandling(handler) {
  - Catches errors automatically
  - Converts to standardized response
  - Logs errors with context
  - Sanitizes error details in production
}
```

---

## API Endpoints Reference

### Authentication Routes

#### POST `/api/auth/register`
**Description:** Register new user account
**Rate Limit:** 3 requests/hour
**Authentication:** None required
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "brand|influencer|client|employee",
  "phone": "+1234567890",
  "company": "Company Name"
}
```
**Response (201):**
```json
{
  "success": true,
  "data": {
    "message": "Account created successfully",
    "requiresApproval": true/false,
    "redirectTo": "/auth/pending-approval or /login",
    "userId": "ObjectId"
  }
}
```
**Notes:**
- Brands/Influencers: Status = PENDING (need admin approval)
- Clients/Employees: Status = ACTIVE (immediate access)
- Password hashed with bcrypt (10 rounds)

#### GET `/api/auth/session`
**Description:** Get current user session
**Rate Limit:** 100 requests/minute
**Authentication:** Required
**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "ObjectId",
      "email": "user@example.com",
      "name": "User Name",
      "role": "brand|admin|influencer",
      "status": "ACTIVE",
      "image": "url or null"
    }
  },
  "meta": { "timestamp": "ISO8601" }
}
```
**Cache:** 1 minute (private cache)

#### POST/GET `/api/auth/[...nextauth]`
**Description:** NextAuth dynamic route handler
**Providers:**
- Credentials (email/password)
- Google OAuth
**Session:** JWT-based, 24-hour max age

---

### Admin Management Routes

#### GET `/api/admin/pending-users?page=1&limit=20&role=brand`
**Description:** List users pending approval
**Rate Limit:** 100 requests/minute
**Authentication:** Required (admin only)
**Query Parameters:**
- `page` (integer, default: 1)
- `limit` (integer, default: 20, max: 100)
- `role` (optional: brand|influencer|client|employee)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "_id": "ObjectId",
        "full_name": "John Doe",
        "email": "john@example.com",
        "role": "brand",
        "status": "PENDING",
        "phone": "+1234567890",
        "company": "Company",
        "verified": false,
        "created_at": "ISO8601",
        "updated_at": "ISO8601"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### GET `/api/admin/users?page=1&limit=20&role=brand&status=ACTIVE`
**Description:** List all users with filters
**Rate Limit:** 100 requests/minute
**Authentication:** Required (admin only)
**Query Parameters:**
- `page` (integer, default: 1)
- `limit` (integer, default: 20, max: 100)
- `role` (optional: brand|influencer|client|employee|admin)
- `status` (optional: PENDING|ACTIVE|REJECTED|SUSPENDED)

**Response:** Same structure as pending-users

#### POST `/api/admin/verify-user`
**Description:** Approve/reject pending user (in real app)
**Authentication:** Required (admin only)
**Note:** Current implementation is placeholder

#### POST `/api/admin/approve`
**Description:** Approve user registration
**Authentication:** Required (admin only)
**Note:** Current implementation sets cookie

---

### Brand Campaign Routes

#### GET `/api/brand/campaigns`
**Description:** List all campaigns for logged-in brand
**Rate Limit:** 100 requests/minute
**Authentication:** Required (brand only)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "campaigns": [
      {
        "_id": "ObjectId",
        "brand_id": "ObjectId",
        "name": "Summer Campaign 2024",
        "description": "Marketing campaign",
        "objectives": ["Awareness", "Engagement"],
        "budget": 5000,
        "spent_amount": 2500,
        "status": "active|draft|paused|completed|cancelled",
        "metrics": {
          "total_reach": 50000,
          "total_impressions": 100000,
          "total_engagement": 5000,
          "total_clicks": 500,
          "total_conversions": 50,
          "engagement_rate": 5.0,
          "estimated_roi": 150.0
        },
        "start_date": "ISO8601",
        "end_date": "ISO8601",
        "created_at": "ISO8601",
        "updated_at": "ISO8601"
      }
    ],
    "total": 10
  }
}
```

#### POST `/api/brand/campaigns`
**Description:** Create new campaign
**Rate Limit:** 100 requests/minute
**Authentication:** Required (brand only)

**Request Body:**
```json
{
  "name": "Campaign Name",
  "description": "Campaign description",
  "objectives": ["Awareness", "Sales"],
  "target_audience": {
    "age_range": { "min": 18, "max": 45 },
    "gender": ["female", "male"],
    "locations": ["US", "UK"],
    "interests": ["tech", "fashion"]
  },
  "budget": 5000,
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-02-01T00:00:00Z"
}
```

**Response (201):** Created campaign object

#### GET `/api/brand/campaigns/[id]`
**Description:** Get single campaign details
**Parameters:** `id` (MongoDB ObjectId)
**Authentication:** Required (brand, must own)
**Authorization:** Verifies `brand_id` matches user ID

**Response (200):** Campaign object

#### PUT `/api/brand/campaigns/[id]`
**Description:** Update campaign
**Parameters:** `id` (MongoDB ObjectId)
**Authentication:** Required (brand, must own)

**Request Body:** Partial campaign object (validated)

**Response (200):** Updated campaign with message

#### DELETE `/api/brand/campaigns/[id]`
**Description:** Delete campaign
**Parameters:** `id` (MongoDB ObjectId)
**Authentication:** Required (brand, must own)

**Response (204):** No content

**Notes:** Hard delete (production: consider soft delete)

#### GET `/api/brand/recommend-influencers`
**Description:** Get recommended influencers for campaign
**Authentication:** Required (brand only)
**Note:** Likely returns mock/calculated recommendations

---

### Influencer Profile Routes

#### GET `/api/influencer/profile`
**Description:** Get influencer profile for logged-in user
**Rate Limit:** 100 requests/minute
**Authentication:** Required (influencer only)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "profile": {
      "_id": "ObjectId",
      "user_id": "ObjectId",
      "bio": "Bio text",
      "profile_picture": "url",
      "social_media": {
        "instagram": {
          "handle": "@username",
          "url": "https://instagram.com/username",
          "followers": 50000,
          "verified": true
        },
        "tiktok": { ... },
        "youtube": { ... }
      },
      "total_followers": 150000,
      "avg_engagement_rate": 3.5,
      "content_categories": ["fashion", "lifestyle"],
      "primary_platform": "instagram",
      "total_earnings": 15000.00,
      "available_balance": 5000.00,
      "completed_campaigns": 12,
      "rating": 4.8,
      "reviews_count": 25,
      "created_at": "ISO8601",
      "updated_at": "ISO8601"
    }
  }
}
```

#### POST `/api/influencer/profile`
**Description:** Create or update influencer profile
**Rate Limit:** 100 requests/minute
**Authentication:** Required (influencer only)

**Request Body:**
```json
{
  "bio": "Bio text",
  "profile_picture": "https://example.com/pic.jpg",
  "social_media": {
    "instagram": {
      "handle": "@username",
      "url": "https://instagram.com/username",
      "followers": 50000,
      "verified": true
    }
  },
  "total_followers": 50000,
  "avg_engagement_rate": 3.5,
  "content_categories": ["fashion"],
  "primary_platform": "instagram",
  "pricing": {
    "per_post": 500,
    "per_story": 200,
    "package_monthly": 5000
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { "message": "Profile updated successfully" }
}
```

**Side Effects:**
- Sets `user.profile_completed = true`

#### POST `/api/influencer/withdraw`
**Description:** Request withdrawal of earnings
**Rate Limit:** 5 requests/minute
**Authentication:** Required (influencer only)

**Request Body:**
```json
{
  "amount": 1000.00,
  "payment_method": "bank_transfer|paypal|stripe",
  "payment_details": {
    "account_number": "123456789",
    "routing_number": "987654321",
    "paypal_email": "user@example.com",
    "stripe_account_id": "acct_xxx"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "message": "Withdrawal request submitted successfully",
    "transaction_id": "ObjectId",
    "amount": 1000.00,
    "status": "pending"
  }
}
```

**Database Transaction (Atomic):**
1. Check available balance
2. Create transaction record
3. Decrement balance
4. All-or-nothing (prevents double withdrawals)

**Errors:**
- Insufficient balance → 400 Bad Request
- Profile not found → 404 Not Found

#### GET `/api/influencer/withdraw`
**Description:** Get withdrawal history
**Rate Limit:** 100 requests/minute
**Authentication:** Required (influencer only)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "_id": "ObjectId",
        "user_id": "ObjectId",
        "type": "withdrawal",
        "amount": 1000.00,
        "status": "pending|completed|failed",
        "payment_method": "bank_transfer",
        "description": "Withdrawal request",
        "created_at": "ISO8601",
        "updated_at": "ISO8601"
      }
    ],
    "count": 5
  }
}
```

**Notes:** Payment details removed from list view (security)

---

### Collaboration Routes

#### GET `/api/collaboration`
**Description:** List collaboration requests for user
**Rate Limit:** 100 requests/minute
**Authentication:** Required (brand or influencer)

**Behavior:**
- Brands see: Requests they sent
- Influencers see: Requests they received

**Response (200):**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "_id": "ObjectId",
        "campaign_id": "ObjectId",
        "brand_id": "ObjectId",
        "influencer_id": "ObjectId",
        "status": "pending|accepted|rejected",
        "offer_amount": 2500.00,
        "deliverables": ["3 Instagram posts", "5 TikTok videos"],
        "deadline": "ISO8601",
        "message": "Interested in collaborating",
        "response_from_influencer": "text",
        "accepted_at": "ISO8601",
        "created_at": "ISO8601",
        "updated_at": "ISO8601"
      }
    ],
    "total": 5
  }
}
```

#### POST `/api/collaboration`
**Description:** Create collaboration request (brand to influencer)
**Rate Limit:** 100 requests/minute
**Authentication:** Required (brand only)

**Request Body:**
```json
{
  "campaign_id": "ObjectId",
  "influencer_id": "ObjectId",
  "offer_amount": 2500.00,
  "deliverables": ["3 Instagram posts", "5 TikTok videos"],
  "deadline": "2024-02-01T00:00:00Z",
  "message": "Interested in collaborating"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "request": {
      "_id": "ObjectId",
      "campaign_id": "ObjectId",
      "brand_id": "ObjectId",
      "influencer_id": "ObjectId",
      "status": "pending",
      "offer_amount": 2500.00,
      "created_at": "ISO8601"
    }
  }
}
```

#### POST `/api/collaboration/[id]/action`
**Description:** Accept or reject collaboration request
**Parameters:** `id` (Collaboration request ID)
**Rate Limit:** 100 requests/minute
**Authentication:** Required (influencer only, must be recipient)

**Request Body:**
```json
{
  "action": "accept|reject",
  "response": "Optional message from influencer"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Request accepted|rejected successfully",
    "request": {
      "_id": "ObjectId",
      "status": "accepted|rejected",
      "updated_at": "ISO8601"
    }
  }
}
```

**Validation:**
- Request must exist and belong to user
- Status must be "pending" (can't re-process)

---

### AI/ML Routes

#### POST `/api/ai/detect-fraud`
**Description:** Detect fraudulent activity
**Rate Limit:** 10 requests/minute
**Authentication:** Required (admin only)

**Request Body:**
```json
{
  "type": "influencer_profile|campaign|collaboration",
  "entity_id": "ObjectId (optional)",
  "data": {
    // Influencer profile fields
    "followers": 50000,
    "engagement_rate": 3.5,
    "follower_growth_rate": 10.5,
    "avg_likes": 1500,
    "avg_comments": 150,
    "verified": true,
    
    // Campaign fields
    "reach": 100000,
    "impressions": 200000,
    "engagement": 5000,
    "clicks": 500,
    "conversions": 50,
    "spent_amount": 5000,
    "duration_days": 30,
    
    // Collaboration fields
    "influencer_followers": 50000,
    "post_likes": 2000,
    "post_comments": 200,
    "post_shares": 50,
    "time_to_results": 3600
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "fraud_detected": true|false,
    "fraud_score": 65,
    "severity": "low|medium|high|critical",
    "flags": [
      "Unusually high engagement rate (>20%)",
      "Abnormal follower growth rate (>50% per month)"
    ],
    "recommendation": "WARNING: Moderate fraud probability - Investigate",
    "note": "Using rule-based detection"
  }
}
```

**Fraud Detection Rules:**

**Influencer Profile:**
- Engagement > 20%: +30 points
- Low engagement, high followers: +20 points
- Follower growth > 50%/month: +25 points
- Unusual comment/like ratio: +15 points
- Unverified, 100k+ followers: +10 points

**Campaign:**
- Impression/reach ratio > 10: +25 points
- Engagement rate > 25%: +30 points
- CTR > 10%: +20 points
- Conversion rate > 15%: +20 points
- Daily spend > $10k: +15 points

**Collaboration:**
- Likes > 30% of follower count: +30 points
- Comments > 50% of likes: +20 points
- Results < 1 hour: +35 points

**Severity Levels:**
- Critical: fraud_score >= 70 → URGENT
- High: fraud_score >= 50 → WARNING
- Medium: fraud_score >= 30 → CAUTION
- Low: fraud_score < 30 → SAFE

#### GET `/api/ai/detect-fraud?type=influencer_profile&fraud=true`
**Description:** View fraud detection history
**Rate Limit:** 100 requests/minute
**Authentication:** Required (admin only)

**Query Parameters:**
- `type` (optional: influencer_profile|campaign|collaboration)
- `fraud` (optional: true|false)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "detections": [
      {
        "_id": "ObjectId",
        "entity_type": "influencer_profile",
        "entity_id": "ObjectId",
        "fraud_score": 65,
        "is_fraud": true,
        "severity": "high",
        "flags": ["..."],
        "detected_by": "ai_system",
        "detected_at": "ISO8601"
      }
    ],
    "total": 15
  }
}
```

**Limit:** 100 most recent detections

#### POST `/api/ai/predict-roi`
**Description:** Predict campaign ROI
**Rate Limit:** 10 requests/minute
**Authentication:** Required (brand or admin only)

**Request Body:**
```json
{
  "followers": 50000,
  "engagement_rate": 3.5,
  "post_count": 100,
  "campaign_budget": 5000,
  "campaign_duration_days": 30,
  "influencer_rating": 4.5,
  "past_campaign_count": 12,
  "platform": "instagram|tiktok|youtube|twitter|facebook|linkedin",
  "content_category": "fashion|beauty|tech|fitness|food|travel|gaming"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "estimated_reach": 15000,
    "estimated_engagement": 525,
    "estimated_conversions": 16,
    "estimated_revenue": 1600,
    "predicted_roi": 145.5,
    "confidence_score": 0.78,
    "risk_level": "medium|low|high",
    "recommendation": "Recommended - Good ROI potential",
    "breakdown": {
      "base_roi": 100,
      "platform_boost": 20,
      "category_boost": 30,
      "experience_boost": 10
    },
    "note": "Using statistical model"
  }
}
```

**ROI Calculation:**
1. Base reach: followers × 0.30
2. Engagement: reach × (engagement_rate / 100)
3. Conversions: engagement × (2% + quality_score × 3%)
4. Revenue: conversions × avg_order_value ($100-$200)
5. ROI: ((revenue - budget) / budget) × 100
6. Adjustments: platform multiplier, category multiplier, experience bonus

**Platform Multipliers:**
- YouTube: 1.8x
- TikTok: 1.5x
- Tech category: 1.5x
- Instagram: 1.2x
- LinkedIn: 1.1x
- Twitter: 0.9x
- Facebook: 0.8x

#### GET/POST `/api/ai/sentiment-analysis`
**Description:** Analyze sentiment of campaign content
**Authentication:** Required (brand only)
**Note:** Likely calculates positive/neutral/negative percentages

---

### Employee Routes

#### POST `/api/employee/daily-reports`
**Description:** Submit daily report
**Rate Limit:** Default (100 req/min)
**Authentication:** Required (employee only)

**Request Body:**
```json
{
  "date": "2024-01-15T00:00:00Z",
  "projects_worked_on": ["ObjectId1", "ObjectId2"],
  "summary": "Worked on feature X and fixed bug Y",
  "blockers": "Waiting for API documentation",
  "achievements": [
    "Completed feature X",
    "Fixed critical bug Y"
  ],
  "next_day_plan": "Start feature Z",
  "total_hours": 8.5
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "message": "Daily report submitted successfully",
    "report_id": "ObjectId",
    "date": "ISO8601"
  }
}
```

**Unique Constraint:**
- Prevents duplicate submissions for same date
- Returns 409 Conflict if already submitted

**Validation:**
- Summary: min 10 characters
- Hours: 0-24
- Date must be valid

#### GET `/api/employee/daily-reports?employeeId=ObjectId`
**Description:** Get daily reports
**Rate Limit:** Default (100 req/min)
**Authentication:** Required (employee or admin)

**Query Parameters:**
- `employeeId` (optional, admin only)

**Behavior:**
- Employees: See only their own reports
- Admins: See all, or filter by employeeId

**Response (200):**
```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "_id": "ObjectId",
        "employee_id": "ObjectId",
        "date": "ISO8601",
        "projects_worked_on": ["ObjectId1"],
        "summary": "Work summary",
        "blockers": "Blockers",
        "achievements": ["Achievement 1"],
        "next_day_plan": "Next plan",
        "total_hours": 8.5,
        "status": "submitted",
        "created_at": "ISO8601",
        "updated_at": "ISO8601"
      }
    ],
    "count": 30
  }
}
```

**Limit:** 30 most recent reports

---

### Health & Dummy Data Routes

#### GET `/api/health`
**Description:** Health check endpoint
**Authentication:** None required

#### GET/POST `/api/dummy/campaigns`
#### GET/POST `/api/dummy/influencers`
#### GET/POST `/api/dummy/sentiment`
**Description:** Dummy/mock data endpoints for testing
**Note:** Useful for development without real data

---

## Database Schema Overview

### Collections Structure

**users**
- Indexes: email (unique)
- Auth, profile info, role, status
- Timestamps: created_at, updated_at, last_login

**campaigns**
- Indexes: brand_id, status
- Campaign details, budget, metrics
- Performance tracking, sentiment analysis

**influencer_profiles**
- Indexes: user_id (unique)
- Bio, followers, engagement, earnings
- Social media links, ratings, completed campaigns

**brand_profiles**
- User profile extension for brands

**collaboration_requests**
- Indexes: campaign_id, brand_id, influencer_id
- Offer details, deliverables, deadlines
- Status tracking (pending, accepted, rejected)

**transactions**
- Indexes: user_id, type, status
- Financial records (withdrawals, payments)
- Payment method and details

**daily_reports**
- Indexes: employee_id, date (unique compound)
- Work logs, achievements, blockers
- Project references

**fraud_detections**
- Indexes: entity_id, entity_type, is_fraud
- Fraud scores and flags
- Detection history

**posts**
- Social media posts
- Engagement metrics

**notifications**
- User notifications
- Status tracking

**analytics**
- Campaign and user analytics

**audit_logs**
- Complete action history
- User actions, changes, outcomes

---

## Request/Response Flow Example

### Complete Campaign Creation Flow:

```
1. CLIENT REQUEST
   POST /api/brand/campaigns
   Header: Authorization: Bearer <JWT_TOKEN>
   Body: { name, description, budget, ... }

2. MIDDLEWARE
   ✓ Extract JWT from Authorization header
   ✓ Verify signature and expiration
   ✓ Route protection check

3. HANDLER EXECUTION
   a) Authentication Check
      - Verify session exists
      - Check session.user.role === "brand"
      → Return 403 if not brand
   
   b) Request Validation
      - Parse body as JSON
      - Validate against createCampaignSchema
      → Return 400 with error details if invalid
   
   c) Authorization Check
      - Find user by session.user.email
      → Return 404 if user not found
   
   d) Business Logic
      - Validate no circular references
      - Set initial metrics to 0
      - Prepare campaign object
   
   e) Database Operation
      - await collections.campaigns().insertOne(campaign)
      → Throws error on failure
   
   f) Response Preparation
      - Sanitize campaign (convert ObjectIds to strings)
      - Format timestamp
      - Wrap in ApiResponse

4. RESPONSE SENT TO CLIENT
   Status: 201 Created
   Header: Location: /api/brand/campaigns/{id}
   Body:
   {
     "success": true,
     "data": {
       "campaign": { _id, name, budget, ... }
     },
     "meta": { "timestamp": "ISO8601" }
   }

5. CLIENT RECEIVES
   - Parse JSON response
   - Update local state
   - Navigate to campaign details or success message
```

---

## Security Considerations

### 1. Authentication Security
- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with 24-hour expiration
- Credentials provider validates against DB
- OAuth profile mapping enforces defaults

### 2. Authorization Security
- Role-based access control on all endpoints
- Resource ownership verification (campaigns, profiles)
- Session validation on every request
- Status checks (PENDING users cannot access features)

### 3. Input Validation
- All inputs validated with Zod schemas
- Request body, query parameters, URL params
- Type-safe validation errors returned to client
- Prevents injection attacks

### 4. Rate Limiting
- IP-based rate limiting on all endpoints
- Stricter limits on sensitive endpoints
- Prevents brute force and DoS

### 5. Data Protection
- Sensitive fields removed from responses (password_hash, payment_details)
- ObjectIds converted to strings
- Dates converted to ISO 8601

### 6. Database Security
- Transaction support for critical operations
- Atomic operations (withdrawals)
- Unique constraints prevent duplicates
- Proper indexing for query efficiency

### 7. Error Handling
- Never expose internal error details to client
- Detailed errors in development only
- Structured logging for debugging
- Consistent error format

---

## Implementation Notes

### Data Flow Best Practices
1. **Always sanitize before returning:** Never expose raw MongoDB documents
2. **Use transactions for financial ops:** Prevent race conditions
3. **Validate all inputs:** Use Zod schemas
4. **Check authorization early:** Before business logic
5. **Log significant actions:** For audit trail

### Common Patterns
- All GET/POST handlers wrapped with `withRateLimit()`
- All routes use `auth()` for session validation
- All errors caught with `handleApiError()`
- All responses use `successResponse()` or `*Response()` functions
- All DB queries sanitized with `sanitizeDocument()`

### Performance Considerations
- Indexes on frequently queried fields
- Pagination implemented (limit 100 max)
- Session cache 1 minute
- LRU cache for rate limiting
- Direct MongoDB queries (no ORM overhead)

---

## Deployment Considerations

### Environment Variables Required
- `MONGODB_URI`: MongoDB connection string
- `NEXTAUTH_URL`: Application base URL
- `NEXTAUTH_SECRET`: JWT secret
- `GOOGLE_CLIENT_ID`: Google OAuth credentials
- `GOOGLE_CLIENT_SECRET`: Google OAuth credentials
- `NODE_ENV`: development|production

### Runtime Configuration
- API routes use `nodejs` runtime (for MongoDB)
- Edge middleware for authentication (lightweight)
- 24-hour JWT expiration
- No external API service dependencies (rules-based ML)

---

## Future Enhancements

1. **ML Integration:**
   - Connect to Python microservice for Isolation Forest fraud detection
   - XGBoost/Random Forest for ROI predictions
   - NLP for sentiment analysis

2. **Payment Processing:**
   - Integrate Stripe/PayPal for withdrawal processing
   - Transaction settlement workflows
   - Payment webhook handlers

3. **Notifications:**
   - Email notifications for collaboration requests
   - Push notifications for approvals
   - Webhook notifications

4. **Analytics:**
   - Advanced campaign analytics
   - Influencer performance tracking
   - ROI tracking and reporting

5. **Caching:**
   - Redis for session caching
   - Campaign metrics caching
   - Influencer profile caching


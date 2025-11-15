# API Endpoints Reference

Complete reference for all Porchest Multiportal API endpoints.

**Base URL**: `http://localhost:3000` (development) or your production domain

**Authentication**: Most endpoints require authentication via NextAuth.js session cookies.

---

## Table of Contents

- [Authentication](#authentication)
- [Admin Endpoints](#admin-endpoints)
- [Brand Endpoints](#brand-endpoints)
- [Influencer Endpoints](#influencer-endpoints)
- [Client Endpoints](#client-endpoints)
- [Analytics Endpoints](#analytics-endpoints)
- [Collaboration Endpoints](#collaboration-endpoints)
- [Notification Endpoints](#notification-endpoints)
- [AI Endpoints](#ai-endpoints)
- [Employee Endpoints](#employee-endpoints)
- [Health Check](#health-check)

---

## Authentication

### Register User
**POST** `/api/auth/register`

Register a new user account.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "full_name": "John Doe",
  "role": "brand|influencer|client|employee",
  "company": "Company Name (optional)"
}
```

**Response**: `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "_id": "...", "email": "...", "role": "..." }
  }
}
```

### Get Session
**GET** `/api/auth/session`

Get current user session.

**Response**: `200 OK`
```json
{
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "role": "brand",
    "full_name": "John Doe"
  }
}
```

---

## Admin Endpoints

### Get Pending Users
**GET** `/api/admin/pending-users`

Get list of users pending approval.

**Auth**: Admin only

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "users": [{ "_id": "...", "email": "...", "status": "pending" }]
  }
}
```

### Verify User
**POST** `/api/admin/verify-user`

Approve or reject a user account.

**Auth**: Admin only

**Request Body**:
```json
{
  "user_id": "507f1f77bcf86cd799439011",
  "action": "approve|reject"
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "message": "User approved successfully"
}
```

### Get All Users
**GET** `/api/admin/users?role=brand&status=active&limit=50&skip=0`

Get all users with filtering.

**Auth**: Admin only

**Query Parameters**:
- `role` (optional): Filter by role
- `status` (optional): Filter by status
- `limit` (optional): Number of results (default: 50, max: 100)
- `skip` (optional): Pagination offset

**Response**: `200 OK`

### Get Transactions
**GET** `/api/admin/transactions?status=pending&type=withdrawal`

Get all transactions with filtering.

**Auth**: Admin only

**Query Parameters**:
- `status` (optional): Filter by status (pending/completed/failed)
- `type` (optional): Filter by type (payment/withdrawal)

**Response**: `200 OK`

### Approve Transaction
**PUT** `/api/admin/transactions/[id]/approve`

Approve or reject a withdrawal request.

**Auth**: Admin only

**Request Body**:
```json
{
  "action": "approve|reject",
  "admin_notes": "Optional notes"
}
```

**Response**: `200 OK`

### Get Audit Logs
**GET** `/api/admin/audit-logs?action=user&limit=100`

Get system audit logs with filtering.

**Auth**: Admin only

**Query Parameters**:
- `action` (optional): Filter by action pattern (regex)
- `entity_type` (optional): Filter by entity type
- `user_id` (optional): Filter by user ID
- `success` (optional): Filter by success status (true/false)
- `start_date` (optional): Filter logs after date (ISO string)
- `end_date` (optional): Filter logs before date (ISO string)
- `limit` (optional): Results limit (max: 100)
- `skip` (optional): Pagination offset

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "_id": "...",
        "action": "user.approve",
        "user_info": { "email": "admin@example.com", "role": "admin" },
        "timestamp": "2024-01-15T10:30:00.000Z",
        "success": true
      }
    ],
    "stats": {
      "total_logs": 150,
      "failed_actions": 5,
      "unique_users": 12
    }
  }
}
```

---

## Brand Endpoints

### Get Campaigns
**GET** `/api/brand/campaigns?status=active`

Get all campaigns for the authenticated brand.

**Auth**: Brand only

**Query Parameters**:
- `status` (optional): Filter by status

**Response**: `200 OK`

### Create Campaign
**POST** `/api/brand/campaigns`

Create a new campaign.

**Auth**: Brand only

**Request Body**:
```json
{
  "name": "Summer Campaign 2024",
  "description": "Campaign description",
  "budget": 10000,
  "start_date": "2024-06-01",
  "end_date": "2024-08-31",
  "target_audience": "18-35 year olds",
  "platforms": ["instagram", "tiktok"]
}
```

**Response**: `201 Created`

### Get Campaign by ID
**GET** `/api/brand/campaigns/[id]`

Get detailed campaign information.

**Auth**: Brand (own campaigns only) or Admin

**Response**: `200 OK`

### Update Campaign
**PUT** `/api/brand/campaigns/[id]`

Update campaign details.

**Auth**: Brand (own campaigns only)

**Request Body**: Partial campaign object

**Response**: `200 OK`

### Delete Campaign
**DELETE** `/api/brand/campaigns/[id]`

Delete a campaign.

**Auth**: Brand (own campaigns only)

**Response**: `204 No Content`

### Invite Influencers
**POST** `/api/brand/campaigns/[id]/invite`

Invite influencers to campaign.

**Auth**: Brand only

**Request Body**:
```json
{
  "influencer_ids": ["id1", "id2", "id3"],
  "offer_amount": 500,
  "deliverables": ["1 Instagram post", "3 stories"],
  "message": "We'd love to work with you!"
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "invited_count": 3,
    "skipped_count": 0
  }
}
```

### Get Brand Profile
**GET** `/api/brand/profile`

Get brand profile (auto-creates if doesn't exist).

**Auth**: Brand only

**Response**: `200 OK`

### Update Brand Profile
**PUT** `/api/brand/profile`

Update brand profile.

**Auth**: Brand only

**Request Body**:
```json
{
  "company_name": "Nike",
  "industry": "Sports & Fashion",
  "website": "https://nike.com",
  "description": "Leading sports brand",
  "budget_range": { "min": 10000, "max": 100000 }
}
```

**Response**: `200 OK`

### Recommend Influencers
**POST** `/api/brand/recommend-influencers`

Get AI-powered influencer recommendations.

**Auth**: Brand only

**Request Body**:
```json
{
  "campaign_id": "507f1f77bcf86cd799439011",
  "target_audience": "18-35 year olds",
  "budget": 10000,
  "platforms": ["instagram"]
}
```

**Response**: `200 OK`

---

## Influencer Endpoints

### Get Influencer Profile
**GET** `/api/influencer/profile`

Get influencer profile (auto-creates if doesn't exist).

**Auth**: Influencer only

**Response**: `200 OK`

### Update Influencer Profile
**PUT** `/api/influencer/profile`

Update influencer profile.

**Auth**: Influencer only

**Request Body**:
```json
{
  "full_name": "Jane Smith",
  "bio": "Fashion & Lifestyle Influencer",
  "social_media": {
    "instagram": "https://instagram.com/jane",
    "instagram_followers": 50000
  },
  "content_categories": ["fashion", "lifestyle"],
  "location": "Los Angeles, CA"
}
```

**Response**: `200 OK`

### Get Posts
**GET** `/api/influencer/posts?campaign_id=...`

Get all posts by influencer.

**Auth**: Influencer only

**Query Parameters**:
- `campaign_id` (optional): Filter by campaign

**Response**: `200 OK`

### Submit Post
**POST** `/api/influencer/posts`

Submit a new post for a campaign.

**Auth**: Influencer only

**Request Body**:
```json
{
  "campaign_id": "507f1f77bcf86cd799439011",
  "platform": "instagram",
  "post_url": "https://instagram.com/p/abc123",
  "post_type": "image",
  "likes": 1000,
  "comments": 50,
  "shares": 25,
  "views": 5000
}
```

**Response**: `201 Created`
```json
{
  "success": true,
  "data": {
    "post": {
      "_id": "...",
      "engagement_rate": 21.5
    }
  }
}
```

### Request Withdrawal
**POST** `/api/influencer/withdraw`

Request withdrawal of available balance.

**Auth**: Influencer only

**Request Body**:
```json
{
  "amount": 500,
  "payment_method": "bank_transfer|paypal",
  "payment_details": {
    "account_number": "****1234",
    "routing_number": "****5678"
  }
}
```

**Response**: `201 Created`

---

## Client Endpoints

### Get Campaigns (Read-only)
**GET** `/api/client/campaigns?status=active`

Get campaigns associated with client projects.

**Auth**: Client only

**Response**: `200 OK`

### Get Campaign Detail
**GET** `/api/client/campaigns/[id]`

Get detailed campaign view with posts and influencers.

**Auth**: Client only

**Response**: `200 OK`

### Get Projects
**GET** `/api/client/projects?status=active&limit=50`

Get all projects for client.

**Auth**: Client or Admin

**Query Parameters**:
- `status` (optional): Filter by status
- `limit` (optional): Results limit (max: 100)
- `skip` (optional): Pagination offset

**Response**: `200 OK`

### Create Project
**POST** `/api/client/projects`

Create a new project.

**Auth**: Client or Admin

**Request Body**:
```json
{
  "name": "Q4 Marketing Campaign",
  "description": "End of year campaign",
  "campaign_ids": ["id1", "id2"],
  "deliverables": ["Website", "Mobile App"],
  "budget": 50000,
  "start_date": "2024-10-01",
  "end_date": "2024-12-31",
  "status": "planning"
}
```

**Response**: `201 Created`

### Get Project Detail
**GET** `/api/client/projects/[id]`

Get detailed project information.

**Auth**: Client (own projects) or Admin

**Response**: `200 OK`

### Update Project
**PUT** `/api/client/projects/[id]`

Update project details.

**Auth**: Client (own projects) or Admin

**Request Body**: Partial project object

**Response**: `200 OK`

---

## Analytics Endpoints

### Get Campaign Analytics
**GET** `/api/analytics/campaigns/[id]`

Get comprehensive analytics for a campaign.

**Auth**: Brand (own campaigns), Admin, or Employee

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "campaign": { "_id": "...", "name": "..." },
    "metrics": {
      "total_collaborations": 10,
      "accepted_collaborations": 8,
      "total_posts": 15,
      "total_views": 50000,
      "total_engagement": 5000,
      "engagement_rate": 10.0
    }
  }
}
```

### Get Influencer Analytics
**GET** `/api/analytics/influencers/[id]`

Get comprehensive analytics for an influencer.

**Auth**: Influencer (own), Brand, Admin, or Employee

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "profile": { "_id": "...", "full_name": "..." },
    "metrics": {
      "total_collaborations": 5,
      "total_posts": 12,
      "total_views": 30000,
      "total_engagement": 3000,
      "avg_engagement_rate": 10.5,
      "total_earnings": 2500
    }
  }
}
```

---

## Collaboration Endpoints

### Get Collaborations
**GET** `/api/collaboration?status=pending`

Get collaboration requests.

**Auth**: Influencer or Brand

**Query Parameters**:
- `status` (optional): Filter by status

**Response**: `200 OK`

### Accept/Reject Collaboration
**POST** `/api/collaboration/[id]/action`

Accept or reject a collaboration invitation.

**Auth**: Influencer only

**Request Body**:
```json
{
  "action": "accept|reject",
  "message": "Optional message"
}
```

**Response**: `200 OK`

---

## Notification Endpoints

### Get Notifications
**GET** `/api/notifications?unread_only=true&limit=50`

Get user notifications.

**Auth**: Required

**Query Parameters**:
- `unread_only` (optional): Show only unread (true/false)
- `limit` (optional): Results limit (max: 100)
- `skip` (optional): Pagination offset

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "notifications": [...],
    "unread_count": 5
  }
}
```

### Mark Notification as Read
**PUT** `/api/notifications/[id]/read`

Mark a single notification as read.

**Auth**: Required

**Response**: `200 OK`

### Mark All as Read
**PUT** `/api/notifications/read-all`

Mark all user notifications as read.

**Auth**: Required

**Response**: `200 OK`

---

## AI Endpoints

### Sentiment Analysis
**POST** `/api/ai/sentiment-analysis`

Analyze sentiment of text or comments.

**Auth**: Required

**Rate Limit**: 10 requests/minute

**Request Body**:
```json
{
  "text": "This product is amazing!",
  "comments": ["Great!", "Love it", "Not good"]
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "sentiment": "positive",
    "confidence": 0.85,
    "total_analyzed": 3,
    "sentiment_breakdown": {
      "positive": 2,
      "neutral": 0,
      "negative": 1
    }
  }
}
```

### Fraud Detection
**POST** `/api/ai/detect-fraud`

Detect fraudulent activity.

**Auth**: Admin only

**Rate Limit**: 10 requests/minute

**Request Body**:
```json
{
  "type": "influencer_profile|campaign|collaboration",
  "entity_id": "507f1f77bcf86cd799439011",
  "data": {
    "followers": 100000,
    "engagement_rate": 25,
    "follower_growth_rate": 60
  }
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "fraud_detected": true,
    "fraud_score": 75,
    "severity": "high",
    "flags": [
      "Unusually high engagement rate (>20%)",
      "Abnormal follower growth rate (>50% per month)"
    ],
    "recommendation": "WARNING: Moderate fraud probability - Investigate"
  }
}
```

### ROI Prediction
**POST** `/api/ai/predict-roi`

Predict campaign ROI.

**Auth**: Brand or Admin

**Rate Limit**: 10 requests/minute

**Request Body**:
```json
{
  "followers": 50000,
  "engagement_rate": 5.5,
  "campaign_budget": 5000,
  "platform": "instagram",
  "content_category": "fashion"
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "estimated_reach": 15000,
    "estimated_engagement": 825,
    "estimated_conversions": 25,
    "estimated_revenue": 3750,
    "predicted_roi": 125.5,
    "confidence_score": 0.82,
    "risk_level": "low",
    "recommendation": "Recommended - Good ROI potential"
  }
}
```

---

## Employee Endpoints

### Submit Daily Report
**POST** `/api/employee/daily-reports`

Submit a daily work report.

**Auth**: Employee only

**Request Body**:
```json
{
  "date": "2024-01-15",
  "tasks_completed": ["Task 1", "Task 2"],
  "hours_worked": 8,
  "notes": "Productive day"
}
```

**Response**: `201 Created`

---

## Health Check

### Health Check
**GET** `/api/health`

Check API health and database connection.

**Auth**: Not required

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "database": "connected",
    "timestamp": "2024-01-15T10:00:00.000Z"
  }
}
```

---

## Error Responses

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

**Common HTTP Status Codes**:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## Rate Limiting

Default rate limits by endpoint type:
- **Default**: 100 requests/minute
- **AI endpoints**: 10 requests/minute
- **Admin endpoints**: 100 requests/minute
- **Auth endpoints**: 10 requests/minute

Rate limit headers in responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in window
- `X-RateLimit-Reset`: Timestamp when limit resets

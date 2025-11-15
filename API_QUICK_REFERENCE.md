# Porchest Multiportal - API Quick Reference Guide

## API Endpoints Summary

### Authentication (5 endpoints)
- `POST /api/auth/register` - Register new account
- `GET /api/auth/session` - Get current session
- `POST /api/auth/[...nextauth]` - NextAuth handler (login/oauth)

### Admin Management (4 endpoints)
- `GET /api/admin/pending-users` - List pending approvals
- `GET /api/admin/users` - List all users
- `POST /api/admin/verify-user` - Verify user (placeholder)
- `POST /api/admin/approve` - Approve user (placeholder)

### Brand Campaigns (5 endpoints)
- `GET /api/brand/campaigns` - List brand campaigns
- `POST /api/brand/campaigns` - Create campaign
- `GET /api/brand/campaigns/[id]` - Get campaign details
- `PUT /api/brand/campaigns/[id]` - Update campaign
- `DELETE /api/brand/campaigns/[id]` - Delete campaign
- `GET /api/brand/recommend-influencers` - Get influencer recommendations

### Influencer Profiles (4 endpoints)
- `GET /api/influencer/profile` - Get profile
- `POST /api/influencer/profile` - Create/update profile
- `POST /api/influencer/withdraw` - Request withdrawal
- `GET /api/influencer/withdraw` - Get withdrawal history

### Collaborations (3 endpoints)
- `GET /api/collaboration` - List collaboration requests
- `POST /api/collaboration` - Create collaboration request
- `POST /api/collaboration/[id]/action` - Accept/reject request

### AI/ML Services (3 endpoints)
- `POST /api/ai/detect-fraud` - Detect fraudulent activity
- `GET /api/ai/detect-fraud` - View fraud detection history
- `POST /api/ai/predict-roi` - Predict campaign ROI
- `GET/POST /api/ai/sentiment-analysis` - Analyze sentiment

### Employee Management (2 endpoints)
- `POST /api/employee/daily-reports` - Submit daily report
- `GET /api/employee/daily-reports` - Get reports

### Utility (1 endpoint)
- `GET /api/health` - Health check
- `GET/POST /api/dummy/*` - Dummy data endpoints

---

## User Roles & Permissions Matrix

### Admin
- Can access all endpoints
- Can approve/reject pending users
- Can view fraud detections
- Can view all campaigns, profiles, collaborations
- Can access AI/ML features

### Brand
- Can create/manage campaigns
- Can send collaboration requests to influencers
- Can view pending collaboration responses
- Can use ROI prediction
- Cannot access admin functions

### Influencer
- Can create/update profile
- Can view collaboration requests
- Can accept/reject collaborations
- Can request withdrawals
- Cannot access admin or brand-specific features

### Client
- Basic access
- Likely limited to their own resources

### Employee
- Can submit daily reports
- Can view their own reports
- Admins can view all employee reports

---

## Rate Limits Summary

| Endpoint Type | Limit | Window | Example Endpoints |
|---------------|-------|--------|-------------------|
| Register | 3 | 1 hour | `POST /api/auth/register` |
| Auth | 5 | 15 min | `POST /api/auth/[...nextauth]` |
| AI | 10 | 1 min | `POST /api/ai/detect-fraud`, `POST /api/ai/predict-roi` |
| Financial | 5 | 1 min | `POST /api/influencer/withdraw` |
| Admin | 100 | 1 min | `GET /api/admin/users`, `GET /api/admin/pending-users` |
| Default | 100 | 1 min | All other endpoints |

---

## Common Response Patterns

### Success Response (200, 201)
```json
{
  "success": true,
  "data": { /* Response data */ },
  "meta": { "timestamp": "ISO8601" }
}
```

### Error Response (400, 401, 403, 404, 409, 500)
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": { /* Optional details */ }
  },
  "meta": { "timestamp": "ISO8601" }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [ /* Array of items */ ],
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

---

## Error Codes Reference

| HTTP | Code | Meaning | Example |
|------|------|---------|---------|
| 400 | `VALIDATION_ERROR` | Input validation failed | Invalid email format |
| 400 | `BAD_REQUEST` | Malformed request | Missing required fields |
| 401 | `UNAUTHORIZED` | No authentication | Missing JWT token |
| 403 | `FORBIDDEN` | Insufficient permissions | Not a brand user |
| 404 | `NOT_FOUND` | Resource not found | Campaign doesn't exist |
| 409 | `CONFLICT` | Resource already exists | Duplicate user email |
| 429 | `TOO_MANY_REQUESTS` | Rate limit exceeded | > 5 auth attempts |
| 500 | `INTERNAL_ERROR` | Server error | Database connection failed |

---

## Data Flow Diagrams

### Registration & Login Flow
```
User Registration
    ↓
POST /api/auth/register
    ↓
Validate input (Zod)
    ↓
Hash password (bcrypt)
    ↓
Determine status:
├─ Brand/Influencer → PENDING
└─ Client/Employee → ACTIVE
    ↓
Insert to DB
    ↓
Return 201 with userId

---

User Login
    ↓
POST /api/auth/[...nextauth]
    ↓
Verify credentials
    ↓
Check status !== PENDING
    ↓
Generate JWT token
    ↓
Set session cookie
    ↓
Redirect to /portal
```

### Campaign Creation Flow
```
Brand User
    ↓
POST /api/brand/campaigns
    ↓
Check: session exists & role="brand"
    ↓
Validate request body
    ↓
Get brand user ID from DB
    ↓
Create campaign with:
├─ brand_id = user._id
├─ status = "draft"
└─ metrics = { all zeros }
    ↓
Save to DB
    ↓
Return 201 with campaign
```

### Collaboration Request Flow
```
Brand User
    ↓
POST /api/collaboration
    ↓
Check: session & role="brand"
    ↓
Create request:
├─ campaign_id
├─ influencer_id
├─ offer_amount
└─ status = "pending"
    ↓
Save to DB
    ↓
Return 201

Influencer User (receives request)
    ↓
GET /api/collaboration
    ↓
Return requests where influencer_id = user._id
    ↓
Influencer reviews

Influencer User (responds)
    ↓
POST /api/collaboration/[id]/action
    ↓
Check: role="influencer" & owns request
    ↓
Update status: "accepted" or "rejected"
    ↓
Return 200
```

### Withdrawal Flow (Atomic Transaction)
```
Influencer User
    ↓
POST /api/influencer/withdraw
    ↓
Start MongoDB transaction
    ├─ Check balance >= amount
    ├─ Create transaction record
    ├─ Decrement balance ($inc)
    └─ Commit or rollback
    ↓
If success: Return 201
If balance insufficient: Return 400
If profile missing: Return 404
```

---

## Authentication Header Format

All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

JWT Token contains:
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "role": "brand|influencer|admin|client|employee",
  "status": "ACTIVE",
  "iat": 1234567890,
  "exp": 1234654290
}
```

---

## Common Query Parameters

### Pagination (most list endpoints)
```
?page=1&limit=20
```
- `page`: 1-based page number (default: 1)
- `limit`: Items per page, max 100 (default: 20)

### Filters (where applicable)
```
?role=brand&status=ACTIVE
```
- Varies by endpoint
- See full documentation for specific filters

---

## Database Collections Quick Reference

| Collection | Key Fields | Indexes |
|-----------|-----------|---------|
| users | _id, email, role, status | email (unique) |
| campaigns | _id, brand_id, status | brand_id, status |
| influencer_profiles | _id, user_id | user_id (unique) |
| collaboration_requests | _id, campaign_id, influencer_id | all three |
| transactions | _id, user_id, type | user_id, type, status |
| daily_reports | _id, employee_id, date | employee_id, (employee_id, date) unique |
| fraud_detections | _id, entity_id, is_fraud | entity_id, is_fraud |

---

## Response Headers Added by System

### All Responses
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1234567890000
```

### Session Endpoints
```
Cache-Control: private, max-age=60
```

### POST Responses (Creation)
```
Location: /api/resource/{id}
```

---

## Common Validation Rules

### Password
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number

### Email
- Valid email format
- Lowercase stored
- Trimmed

### Phone
- Valid international format (optional)
- Pattern: +[1-9]\d{1,14}

### ObjectId
- 24 character hex string
- MongoDB format

### Budget/Amount
- Positive numbers only
- Can have decimals

### Engagement Rate
- 0-100 range
- Percentage value

---

## Sensitive Fields Removed from Responses

The system automatically removes these fields:
- `password_hash`
- `payment_details` (in list views)
- `emailVerified` (auth fields)

These are removed by `sanitizeDocument()` function in all API responses.

---

## Testing Endpoints (Dummy Data)

For development/testing without real data:
```
GET/POST /api/dummy/campaigns
GET/POST /api/dummy/influencers
GET/POST /api/dummy/sentiment
```

Health check (no auth required):
```
GET /api/health
```

---

## Performance Tips

1. **Pagination**: Always use `?limit=20` or appropriate limit
2. **Caching**: Session endpoint caches for 1 minute
3. **Rate Limits**: Be aware of 5 requests/min on withdrawals
4. **Batch Operations**: Not available yet (consider implementing)
5. **Indexes**: Ensure MongoDB indexes are created on deployment

---

## Troubleshooting Guide

### 401 Unauthorized
- Check JWT token in Authorization header
- Verify token hasn't expired (24 hours)
- Check NEXTAUTH_SECRET env variable

### 403 Forbidden
- Verify user role matches endpoint requirements
- Check user status is ACTIVE (not PENDING)
- Verify resource ownership (campaigns, etc)

### 404 Not Found
- Verify resource ID is valid ObjectId
- Check resource hasn't been deleted
- Verify user has access to resource

### 409 Conflict
- Email already exists (duplicate registration)
- Duplicate daily report for same date
- Duplicate unique constraint

### 429 Too Many Requests
- Wait for rate limit window (check Retry-After header)
- Reduce request frequency
- Check for loops making requests

### 500 Internal Error
- Check MongoDB connection
- Review server logs
- Check environment variables
- Verify database indexes exist

---

## Future Roadmap

- [ ] Webhook support for real-time updates
- [ ] Batch operations for bulk updates
- [ ] GraphQL API alternative
- [ ] WebSocket support for live notifications
- [ ] Advanced filtering and search
- [ ] CSV export functionality
- [ ] API documentation with Swagger/OpenAPI

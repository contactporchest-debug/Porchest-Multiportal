# Porchest Multiportal - Architecture Documentation Index

This document serves as an index to all architecture documentation for the Porchest Multiportal system. It provides a comprehensive overview of the API endpoints, data flow, and system architecture.

## Documentation Files

### 1. API_ARCHITECTURE.md (Comprehensive Reference - 1300+ lines)
**Complete API documentation covering:**
- Project overview and technology stack
- Authentication and authorization architecture
- Data flow from client to database and back
- Rate limiting system (in-memory LRU cache)
- Error handling and response formats
- Complete API endpoint reference (22 endpoints across 8 categories)
- Database schema overview
- Request/response flow examples
- Security considerations
- Implementation notes
- Deployment considerations

**Best for:** Full understanding of API structure, integration reference, implementation guidelines

### 2. API_QUICK_REFERENCE.md (Quick Lookup - 400+ lines)
**Condensed reference guide with:**
- API endpoints summary (organized by module)
- User roles and permissions matrix
- Rate limits summary table
- Common response patterns
- Error codes reference
- Data flow diagrams (ASCII)
- Authentication header format
- Database collections quick reference
- Response headers
- Validation rules
- Troubleshooting guide

**Best for:** Quick lookups, testing, debugging, API consumer reference

---

## API Endpoints by Category

### Authentication & Authorization (3 routes)
- `POST /api/auth/register` - User registration with role-based status assignment
- `GET /api/auth/session` - Current session retrieval with JWT validation
- `POST/GET /api/auth/[...nextauth]` - NextAuth handler (Credentials + Google OAuth)

**Key Files:**
- `/app/api/auth/register/route.ts` - Registration handler
- `/app/api/auth/session/route.ts` - Session handler
- `/app/api/auth/[...nextauth]/route.ts` - NextAuth route
- `/lib/auth.ts` - Auth configuration
- `/lib/auth.config.ts` - NextAuth config with providers
- `/lib/auth-middleware.ts` - Edge-compatible middleware
- `/middleware.ts` - Route protection middleware

### Admin Management (4 routes)
- `GET /api/admin/pending-users` - List PENDING users awaiting approval
- `GET /api/admin/users` - List all users with filters (role, status)
- `POST /api/admin/verify-user` - Verify user (placeholder)
- `POST /api/admin/approve` - Approve user (placeholder)

**Key Files:**
- `/app/api/admin/pending-users/route.ts` - Pending users listing
- `/app/api/admin/users/route.ts` - All users listing
- `/app/api/admin/verify-user/route.ts` - User verification
- `/app/api/admin/approve/route.ts` - User approval

### Brand Campaign Management (5 routes)
- `GET /api/brand/campaigns` - List campaigns for logged-in brand
- `POST /api/brand/campaigns` - Create new campaign
- `GET /api/brand/campaigns/[id]` - Get single campaign (ownership verified)
- `PUT /api/brand/campaigns/[id]` - Update campaign (ownership verified)
- `DELETE /api/brand/campaigns/[id]` - Delete campaign (ownership verified)

**Key Files:**
- `/app/api/brand/campaigns/route.ts` - Campaign CRUD
- `/app/api/brand/campaigns/[id]/route.ts` - Single campaign operations

### Influencer Profile & Earnings (4 routes)
- `GET /api/influencer/profile` - Get influencer profile
- `POST /api/influencer/profile` - Create/update influencer profile
- `POST /api/influencer/withdraw` - Request withdrawal (atomic transaction)
- `GET /api/influencer/withdraw` - Get withdrawal history

**Key Files:**
- `/app/api/influencer/profile/route.ts` - Profile operations
- `/app/api/influencer/withdraw/route.ts` - Withdrawal with MongoDB transactions

### Collaboration Management (3 routes)
- `GET /api/collaboration` - List collaboration requests (role-filtered)
- `POST /api/collaboration` - Create collaboration request (brand → influencer)
- `POST /api/collaboration/[id]/action` - Accept/reject collaboration (influencer)

**Key Files:**
- `/app/api/collaboration/route.ts` - Collaboration request CRUD
- `/app/api/collaboration/[id]/action/route.ts` - Collaboration response

### AI/ML Services (4 routes)
- `POST /api/ai/detect-fraud` - Fraud detection (rule-based scoring)
- `GET /api/ai/detect-fraud` - View fraud detection history
- `POST /api/ai/predict-roi` - ROI prediction (statistical model)
- `GET/POST /api/ai/sentiment-analysis` - Sentiment analysis

**Key Files:**
- `/app/api/ai/detect-fraud/route.ts` - Fraud detection with scoring rules
- `/app/api/ai/predict-roi/route.ts` - ROI prediction engine

### Employee Management (2 routes)
- `POST /api/employee/daily-reports` - Submit daily report (unique per date)
- `GET /api/employee/daily-reports` - Get reports (role-filtered visibility)

**Key Files:**
- `/app/api/employee/daily-reports/route.ts` - Daily report CRUD

---

## Core Architecture Files

### Authentication & Sessions
- `/lib/auth.ts` - Main auth export, session helpers
- `/lib/auth.config.ts` - NextAuth configuration (providers, callbacks, JWT)
- `/lib/auth-middleware.ts` - Edge-compatible JWT validation
- `/lib/auth-helpers.ts` - Client-safe helper functions

### Database Layer
- `/lib/db.ts` - Database utilities (1000+ lines)
  - Connection management
  - Collection accessors (typed)
  - Helper functions (getUserByEmail, createCampaign, etc.)
  - Document sanitization
  - Pagination utility
  - Transaction wrapper for atomic operations
- `/lib/db-types.ts` - TypeScript type definitions
  - User types and roles
  - Campaign types
  - Influencer profile types
  - Transaction types
  - All MongoDB collection schemas
- `/lib/mongodb.ts` - MongoDB client connection pool

### Request/Response Handling
- `/lib/api-response.ts` - Standardized response utilities (1000+ lines)
  - successResponse, errorResponse functions
  - Specialized responses (validationError, notFound, unauthorized, etc.)
  - Error handling wrapper
  - Pagination response formatter
  - Cache control and CORS headers

### Validation & Input Handling
- `/lib/validations.ts` - Zod validation schemas
  - Common validators (email, password, phone, URL)
  - User validation schemas
  - Campaign validation schemas
  - Request/response validators
- `/lib/validateRequest()` - Validation utility function

### Rate Limiting
- `/lib/rate-limit.ts` - Rate limiting system (300+ lines)
  - In-memory LRU cache implementation
  - Sliding window algorithm
  - IP address extraction (proxy-aware)
  - Configuration for different endpoint types
  - Middleware wrapper

### Logging & Monitoring
- `/lib/logger.ts` - Structured logging utility
  - Log levels (debug, info, warn, error)
  - Context-aware logging
  - Error tracking

### Utilities
- `/lib/utils.ts` - General utilities
- `/lib/fetcher.ts` - Client-side data fetcher
- `/lib/routes.ts` - Route helpers

---

## Database Collections

### users
**Purpose:** User accounts and authentication
**Fields:** 
- _id, email (unique), password_hash, role, status
- verified, verified_at, approved_by, approved_at
- phone, company, profile_completed
- created_at, updated_at, last_login
**Indexes:** email (unique)

### campaigns
**Purpose:** Brand marketing campaigns
**Fields:**
- _id, brand_id, name, description, objectives
- budget, spent_amount, status
- metrics (reach, impressions, engagement, etc)
- influencers array, sentiment_analysis
- start_date, end_date, target_audience
- created_at, updated_at
**Indexes:** brand_id, status

### influencer_profiles
**Purpose:** Influencer profile information
**Fields:**
- _id, user_id (unique), bio, profile_picture
- social_media (Instagram, YouTube, TikTok)
- total_followers, avg_engagement_rate
- content_categories, primary_platform
- pricing, total_earnings, available_balance
- completed_campaigns, rating, reviews_count
- created_at, updated_at
**Indexes:** user_id (unique)

### collaboration_requests
**Purpose:** Brand-influencer collaboration proposals
**Fields:**
- _id, campaign_id, brand_id, influencer_id
- status (pending, accepted, rejected)
- offer_amount, deliverables, deadline
- message, response_from_influencer
- accepted_at, created_at, updated_at
**Indexes:** campaign_id, brand_id, influencer_id

### transactions
**Purpose:** Financial transactions and records
**Fields:**
- _id, user_id, type (withdrawal, payment)
- amount, currency, status
- payment_method, payment_details
- reference_id, campaign_id, collaboration_id
- description, created_at, updated_at
**Indexes:** user_id, type, status

### daily_reports
**Purpose:** Employee daily work reports
**Fields:**
- _id, employee_id, date
- projects_worked_on, summary, blockers
- achievements, next_day_plan, total_hours
- status (submitted), created_at, updated_at
**Indexes:** employee_id, (employee_id, date) unique

### fraud_detections
**Purpose:** Fraud detection records and history
**Fields:**
- _id, entity_type, entity_id
- fraud_score, is_fraud, severity, flags
- data (detection input), detected_by, detected_at
**Indexes:** entity_id, entity_type, is_fraud

### Other Collections
- brand_profiles - Brand-specific profiles
- posts - Social media posts
- notifications - User notifications
- analytics - Campaign and user analytics
- audit_logs - Complete action history

---

## Data Flow Architecture

### Request Processing Pipeline
```
1. Middleware (Edge)
   - JWT validation
   - Route protection
   - Role-based access
   
2. Rate Limiting
   - IP-based tracking
   - In-memory LRU cache
   - Sliding window algorithm
   
3. Route Handler
   - Session extraction
   - Request validation (Zod)
   - Authorization check
   - Business logic execution
   - Database operation
   - Response formatting
   
4. Response
   - Standardized format
   - Sanitized data
   - Error details (if any)
   - Caching headers
```

### Authentication Flow
```
Registration:
  Input validation → Password hashing → Status assignment → DB insert → Response

Login:
  Credentials check → Password verification → JWT generation → Session creation → Redirect

OAuth:
  Provider flow → User lookup/create → Callback handling → Redirect based on status
```

### Financial Operation (Withdrawal)
```
Request validation → User lookup → Transaction start
  ├─ Balance check
  ├─ Transaction record creation
  ├─ Balance decrement (atomic)
  └─ Transaction commit/rollback
Return response with transaction_id
```

---

## Security Architecture

### Authentication
- **Strategy:** JWT (JWT session strategy, 24-hour max age)
- **Password Storage:** bcrypt with 10 salt rounds
- **Session Validation:** On every request via middleware
- **Token Format:** {id, email, name, role, status, iat, exp}

### Authorization
- **Level 1:** Role-based (admin, brand, influencer, client, employee)
- **Level 2:** Status validation (ACTIVE vs PENDING)
- **Level 3:** Resource ownership (campaigns, profiles belong to users)
- **Patterns:**
  - Admin-only routes (fraud detection, user management)
  - Role-specific routes (brand can only access brand routes)
  - Ownership verification (can only modify own resources)

### Input Validation
- **Framework:** Zod schema validation
- **Scope:** Request body, query params, URL params
- **Response:** Detailed validation errors returned to client
- **Protection:** Prevents injection attacks, type safety

### Rate Limiting
- **Type:** IP-based sliding window
- **Storage:** In-memory LRU cache (10k entries max)
- **Cleanup:** Periodic expiration cleanup (5 min interval)
- **Endpoints:**
  - Register: 3 requests/hour
  - Auth: 5 requests/15 min
  - Financial: 5 requests/min
  - AI: 10 requests/min
  - Admin: 100 requests/min
  - Default: 100 requests/min

### Data Protection
- **Sanitization:** Automatic removal of sensitive fields
  - password_hash
  - payment_details
- **Type Conversion:** ObjectId → string, Date → ISO 8601
- **Recursion:** Sanitizes nested objects and arrays

### Database Security
- **Transactions:** Atomic operations for financial transactions
- **Constraints:** Unique indexes prevent duplicates
- **Indexes:** Proper indexing for query efficiency

---

## Error Handling Strategy

### Error Categories
1. **Validation Errors (400)** - Input validation failed
2. **Authentication Errors (401)** - No valid session
3. **Authorization Errors (403)** - Insufficient permissions
4. **Not Found (404)** - Resource doesn't exist
5. **Conflict (409)** - Resource already exists
6. **Rate Limiting (429)** - Too many requests
7. **Server Errors (500)** - Unexpected errors

### Response Format
```json
{
  "success": false,
  "error": {
    "message": "User-friendly message",
    "code": "ERROR_CODE",
    "details": { /* Optional */ }
  },
  "meta": { "timestamp": "ISO8601" }
}
```

### Error Handling Patterns
- All handlers wrapped with `withErrorHandling()`
- All errors caught and standardized
- Production: Details stripped, development: Full details shown
- Structured logging for debugging

---

## Performance Considerations

### Optimization Strategies
1. **Caching**
   - Session: 1 minute cache (private)
   - Rate limit: LRU in-memory cache
   
2. **Pagination**
   - Default limit: 20 items
   - Max limit: 100 items
   - Prevents loading entire collections

3. **Indexes**
   - email (users)
   - brand_id, status (campaigns)
   - user_id (influencer_profiles, transactions)
   - Unique indexes prevent duplicates

4. **Query Optimization**
   - Direct MongoDB queries (no ORM overhead)
   - Pagination with skip/limit
   - Sorted results (created_at: -1)

5. **Response Optimization**
   - Sanitization removes unnecessary fields
   - Pagination limits response size
   - Cache headers minimize client requests

---

## Deployment Architecture

### Environment Variables Required
```
MONGODB_URI=mongodb+srv://...
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<random-secret>
GOOGLE_CLIENT_ID=<oauth-client-id>
GOOGLE_CLIENT_SECRET=<oauth-client-secret>
NODE_ENV=production|development
```

### Runtime Configuration
- **API Routes:** Node.js runtime (for MongoDB)
- **Middleware:** Edge runtime (lightweight)
- **Session Duration:** 24 hours
- **Rate Limit Window:** 1 minute (default)

### Database Requirements
- MongoDB 6.20+
- Connection pooling via clientPromise
- Indexes must be created (see collection specs above)
- Transactions enabled (MongoDB 4.0+)

---

## Implementation Patterns Used

### Pattern 1: Authentication Check
```typescript
const session = await auth();
if (!session || !session.user) {
  return unauthorizedResponse("Authentication required");
}
```

### Pattern 2: Role-Based Authorization
```typescript
if (session.user.role !== "brand") {
  return forbiddenResponse("Brand access required");
}
```

### Pattern 3: Resource Ownership Verification
```typescript
if (campaign.brand_id.toString() !== user._id.toString()) {
  return forbiddenResponse("You don't have access to this campaign");
}
```

### Pattern 4: Request Validation
```typescript
const validatedData = validateRequest(createCampaignSchema, body);
// Returns sanitized data or throws ZodError
```

### Pattern 5: Error Handling
```typescript
try {
  // Operation
} catch (error) {
  return handleApiError(error);
}
```

### Pattern 6: Database Transactions
```typescript
await withTransaction(async (session) => {
  // Check
  // Create
  // Update
  // All atomic
});
```

---

## Testing & Development

### Dummy Data Routes
- `GET/POST /api/dummy/campaigns` - Test campaign data
- `GET/POST /api/dummy/influencers` - Test influencer data
- `GET/POST /api/dummy/sentiment` - Test sentiment data

### Health Check
- `GET /api/health` - No authentication required

### Development Tips
1. Use dummy endpoints for development
2. Check rate limit headers in responses
3. Monitor server logs for errors
4. Use database transactions for critical operations
5. Always validate input data
6. Test with different user roles

---

## File Organization Summary

**Total files analyzed:** 25+
**Total lines of code examined:** 5000+

### Directory Structure
```
Porchest-Multiportal/
├── app/
│   ├── api/
│   │   ├── auth/ (3 routes)
│   │   ├── admin/ (4 routes)
│   │   ├── brand/ (5 routes)
│   │   ├── influencer/ (4 routes)
│   │   ├── collaboration/ (3 routes)
│   │   ├── ai/ (4 routes)
│   │   ├── employee/ (2 routes)
│   │   ├── dummy/ (3 routes)
│   │   └── health/ (1 route)
│   ├── (other pages and layouts)
│   └── layout.tsx
├── lib/
│   ├── auth.ts
│   ├── auth.config.ts
│   ├── auth-middleware.ts
│   ├── auth-helpers.ts
│   ├── db.ts (main database utilities)
│   ├── db-types.ts (TypeScript definitions)
│   ├── mongodb.ts
│   ├── api-response.ts (response utilities)
│   ├── validations.ts (Zod schemas)
│   ├── rate-limit.ts (rate limiting)
│   ├── logger.ts
│   ├── fetcher.ts
│   ├── routes.ts
│   └── utils.ts
├── middleware.ts
├── package.json
└── (configuration files)
```

---

## Next Steps & Recommendations

### For API Consumers
1. Read `API_QUICK_REFERENCE.md` for quick lookup
2. Check `API_ARCHITECTURE.md` for detailed endpoint documentation
3. Review rate limits before building integrations
4. Test with dummy endpoints first
5. Implement proper error handling in your client

### For Developers
1. Follow existing authentication patterns
2. Always wrap handlers with `withRateLimit()`
3. Use Zod for request validation
4. Call `sanitizeDocument()` before returning data
5. Use database transactions for financial operations
6. Log significant actions for audit trail

### For DevOps
1. Create MongoDB indexes before deployment
2. Set all environment variables (see deployment section)
3. Monitor rate limiting stats
4. Set up error logging/monitoring
5. Configure database backups
6. Test JWT secret rotation procedure

---

## Additional Resources

- Full architecture documentation: `API_ARCHITECTURE.md`
- Quick reference guide: `API_QUICK_REFERENCE.md`
- Source code reference: Individual route files in `/app/api/`
- Database schemas: `/lib/db-types.ts`
- Validation rules: `/lib/validations.ts`

---

**Last Updated:** 2024
**Documentation Coverage:** Complete API surface (29 routes)
**Technology Stack:** Next.js 14, NextAuth v5, MongoDB 6, Zod, bcryptjs

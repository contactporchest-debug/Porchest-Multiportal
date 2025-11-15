# System Architecture

Complete architectural overview of Porchest Multiportal.

---

## Table of Contents

- [High-Level Architecture](#high-level-architecture)
- [Technology Stack](#technology-stack)
- [System Components](#system-components)
- [Data Flow](#data-flow)
- [Database Architecture](#database-architecture)
- [Authentication & Authorization](#authentication--authorization)
- [API Architecture](#api-architecture)
- [Portal Structure](#portal-structure)
- [Integration Points](#integration-points)
- [Scalability & Performance](#scalability--performance)

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐│
│  │ Admin  │  │ Brand  │  │Influenc│  │ Client │  │Employee││
│  │ Portal │  │ Portal │  │  er    │  │ Portal │  │ Portal ││
│  │        │  │        │  │ Portal │  │        │  │        ││
│  └────────┘  └────────┘  └────────┘  └────────┘  └────────┘│
│                    (Next.js React Components)                │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTPS / REST API
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Next.js API Routes                       │  │
│  │  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌─────────────┐ │  │
│  │  │  Auth   │ │  Admin   │ │ Brand  │ │ Influencer  │ │  │
│  │  │  APIs   │ │   APIs   │ │  APIs  │ │    APIs     │ │  │
│  │  └─────────┘ └──────────┘ └────────┘ └─────────────┘ │  │
│  │  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌─────────────┐ │  │
│  │  │ Client  │ │Analytics │ │   AI   │ │Notification │ │  │
│  │  │  APIs   │ │   APIs   │ │  APIs  │ │    APIs     │ │  │
│  │  └─────────┘ └──────────┘ └────────┘ └─────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Middleware & Utilities                      │  │
│  │  • Authentication (NextAuth.js)                       │  │
│  │  • Rate Limiting                                      │  │
│  │  • Validation (Zod)                                   │  │
│  │  • Logging                                            │  │
│  │  • Email Service                                      │  │
│  │  • Automation Engine                                  │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ MongoDB Driver
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              MongoDB Atlas / MongoDB                   │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │ │
│  │  │  Users   │ │Campaigns │ │  Posts   │ │  Trans-  │ │ │
│  │  │          │ │          │ │          │ │ actions  │ │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │ │
│  │  │ Profiles │ │Collabora-│ │Notifica- │ │  Audit   │ │ │
│  │  │          │ │  tions   │ │  tions   │ │   Logs   │ │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │ │
│  │         14 Collections, 29 Indexes                    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **State Management**: React Hooks
- **Forms**: React Hook Form
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Next.js API Routes
- **Database**: MongoDB 6+ (MongoDB Atlas)
- **ODM**: MongoDB Native Driver
- **Authentication**: NextAuth.js v5
- **Validation**: Zod
- **Email**: NodeMailer (ready)

### DevOps
- **Version Control**: Git
- **Testing**: Jest
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Deployment**: Vercel / Docker / VPS

---

## System Components

### 1. Portal Layer (Frontend)

**5 Specialized Portals**:

1. **Admin Portal** (`/admin/*`)
   - User management & approval
   - Transaction oversight
   - Fraud detection
   - System analytics
   - Audit log viewing

2. **Brand Portal** (`/brand/*`)
   - Campaign management
   - Influencer discovery
   - Performance analytics
   - ROI prediction
   - Profile management

3. **Influencer Portal** (`/influencer/*`)
   - Profile management
   - Collaboration requests
   - Post submission
   - Earnings tracking
   - Withdrawal requests

4. **Client Portal** (`/client/*`)
   - Project tracking
   - Campaign viewing (read-only)
   - Deliverable management
   - Communication

5. **Employee Portal** (`/employee/*`)
   - Daily task management
   - Report submission
   - Internal communication

### 2. API Layer

**38 API Endpoints** organized by domain:

- **Auth** (3): Register, Session, OAuth
- **Admin** (7): Users, Approvals, Transactions, Audit Logs
- **Brand** (5): Campaigns, Profile, Invitations, Recommendations
- **Influencer** (4): Profile, Posts, Withdrawals, Collaboration
- **Client** (5): Campaigns (read), Projects
- **Analytics** (2): Campaign analytics, Influencer analytics
- **Collaboration** (2): Requests, Actions
- **Notifications** (3): List, Mark read, Bulk read
- **AI** (3): Sentiment, Fraud detection, ROI prediction
- **Employee** (1): Daily reports
- **Health** (1): System health check

### 3. Middleware Services

**Authentication**: NextAuth.js with MongoDB adapter
```typescript
// Session-based authentication
// Role-based access control (RBAC)
// OAuth providers (Google ready)
```

**Rate Limiting**: Sliding window algorithm
```typescript
// IP-based rate limiting
// Configurable per endpoint
// LRU cache for performance
```

**Validation**: Zod schemas
```typescript
// Runtime type validation
// Request/response validation
// Type-safe error messages
```

**Logging**: Structured logging
```typescript
// Winston-based logger
// Log levels: error, warn, info, debug
// JSON format for parsing
```

### 4. Automation Services

**Email Service** (`lib/email.ts`)
- Template-based emails
- HTML + text versions
- Batch sending support

**Event Automation** (`lib/automation.ts`)
- Event-driven triggers
- Automatic notifications
- Scheduled events

**Background Jobs** (`lib/jobs.ts`)
- Periodic maintenance
- Metric aggregation
- Data cleanup

---

## Data Flow

### User Registration & Approval Flow

```
┌──────────┐      ┌─────────┐      ┌──────────┐      ┌──────────┐
│  User    │─────>│Register │─────>│ Database │─────>│  Admin   │
│          │      │   API   │      │(pending) │      │  Review  │
└──────────┘      └─────────┘      └──────────┘      └──────────┘
                                                            │
                                                            v
┌──────────┐      ┌─────────┐      ┌──────────┐      ┌──────────┐
│  Email   │<─────│Automatio│<─────│ Approve  │<─────│  Admin   │
│Notifica- │      │  Event  │      │   API    │      │  Action  │
│  tion    │      └─────────┘      └──────────┘      └──────────┘
└──────────┘
```

### Campaign Creation & Invitation Flow

```
┌──────────┐      ┌─────────┐      ┌──────────┐
│  Brand   │─────>│ Create  │─────>│ Database │
│          │      │Campaign │      │ (MongoDB)│
└──────────┘      └─────────┘      └──────────┘
     │
     │            ┌─────────┐      ┌──────────┐
     └───────────>│ Invite  │─────>│Collabora-│
                  │Influenc.│      │  tion    │
                  └─────────┘      │Collection│
                       │            └──────────┘
                       v
                  ┌─────────┐      ┌──────────┐
                  │  Event  │─────>│  Email   │
                  │ Trigger │      │Notifica- │
                  └─────────┘      │  tion    │
                                   └──────────┘
```

### Post Submission & Analytics Flow

```
┌──────────┐      ┌─────────┐      ┌──────────┐
│Influencer│─────>│ Submit  │─────>│  Posts   │
│          │      │  Post   │      │Collection│
└──────────┘      └─────────┘      └──────────┘
                       │                 │
                       v                 v
                  ┌─────────┐      ┌──────────┐
                  │Calculate│─────>│ Update   │
                  │Engagemen│      │ Campaign │
                  │  Rate   │      │ Metrics  │
                  └─────────┘      └──────────┘
                       │
                       v
                  ┌─────────┐      ┌──────────┐
                  │  Notify │─────>│  Brand   │
                  │  Brand  │      │  Email   │
                  └─────────┘      └──────────┘
```

---

## Database Architecture

### Collections (14)

```
┌─────────────────────────────────────────────────────────┐
│                      Core Collections                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  users                   → Authentication & profiles    │
│  ├─ Indexes: email (unique), role, status, verified    │
│  └─ Documents: ~1KB each                                │
│                                                          │
│  campaigns               → Campaign management          │
│  ├─ Indexes: brand_id, status, created_at              │
│  └─ Documents: ~5KB each                                │
│                                                          │
│  collaboration_requests  → Influencer invitations       │
│  ├─ Indexes: campaign_id, influencer_id, status        │
│  └─ Documents: ~2KB each                                │
│                                                          │
│  posts                   → Content submissions          │
│  ├─ Indexes: campaign_id, influencer_id, platform      │
│  └─ Documents: ~3KB each                                │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   Profile Collections                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  brand_profiles          → Brand information            │
│  ├─ Indexes: user_id (unique), industry                │
│  └─ Auto-created on first access                        │
│                                                          │
│  influencer_profiles     → Influencer information       │
│  ├─ Indexes: user_id (unique), followers, engagement   │
│  └─ Auto-created on first access                        │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                Transaction Collections                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  transactions            → Payments & withdrawals       │
│  ├─ Indexes: user_id, status, type, created_at         │
│  └─ ACID transactions for withdrawals                   │
│                                                          │
│  payments                → Payment history              │
│  └─ Indexes: from_user_id, to_user_id                  │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│               System & Utility Collections               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  notifications           → User notifications           │
│  ├─ Indexes: user_id, read, created_at                 │
│  └─ Auto-cleanup after 90 days (job)                    │
│                                                          │
│  audit_logs              → System audit trail           │
│  ├─ Indexes: user_id, action, timestamp                │
│  └─ Immutable records                                   │
│                                                          │
│  analytics               → Cached analytics data        │
│  └─ Indexes: entity_id, type, created_at               │
│                                                          │
│  fraud_detections        → AI fraud detection results   │
│  └─ Indexes: entity_id, is_fraud, detected_at          │
│                                                          │
│  projects                → Client project tracking      │
│  └─ Indexes: client_id, status                         │
│                                                          │
│  daily_reports           → Employee reports             │
│  └─ Indexes: employee_id, date                         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Relationships

```
users (1) ──────< (N) campaigns
  │                      │
  │                      │
  └──< brand_profiles    └──< collaboration_requests
  │                                    │
  │                                    │
  └──< influencer_profiles             └──< posts
            │
            │
            └──< transactions
```

---

## Authentication & Authorization

### Session Management

```
┌──────────────────────────────────────────────────────────┐
│                    NextAuth.js Flow                       │
└──────────────────────────────────────────────────────────┘

1. User Login
   ┌──────────┐      ┌─────────┐      ┌──────────┐
   │  Client  │─────>│NextAuth │─────>│ Database │
   │          │      │         │      │  (users) │
   └──────────┘      └─────────┘      └──────────┘
                           │
                           v
                     ┌─────────┐
                     │   JWT   │
                     │  Token  │
                     │ (Cookie)│
                     └─────────┘

2. Authenticated Request
   ┌──────────┐      ┌─────────┐      ┌──────────┐
   │  Client  │─────>│   API   │─────>│  Check   │
   │(+ Cookie)│      │         │      │  Session │
   └──────────┘      └─────────┘      └──────────┘
                                            │
                                            v
                                      ┌─────────┐
                                      │ Verify  │
                                      │  Role   │
                                      └─────────┘
```

### Role-Based Access Control (RBAC)

| Role | Admin | Brand | Influencer | Client | Employee |
|------|-------|-------|------------|--------|----------|
| **User Management** | ✓ | - | - | - | - |
| **Approve Users** | ✓ | - | - | - | - |
| **View All Campaigns** | ✓ | Own | - | Associated | ✓ |
| **Create Campaigns** | - | ✓ | - | - | - |
| **Submit Posts** | - | - | ✓ | - | - |
| **Invite Influencers** | - | ✓ | - | - | - |
| **Withdraw Funds** | - | - | ✓ | - | - |
| **Approve Transactions** | ✓ | - | - | - | - |
| **View Analytics** | ✓ | Own | Own | Associated | ✓ |
| **Fraud Detection** | ✓ | - | - | - | - |
| **Audit Logs** | ✓ | - | - | - | - |

---

## API Architecture

### Request/Response Cycle

```
┌──────────────────────────────────────────────────────────┐
│                   API Request Flow                        │
└──────────────────────────────────────────────────────────┘

Request
   │
   v
┌─────────────┐
│Rate Limiter │ → 429 if exceeded
└─────────────┘
   │
   v
┌─────────────┐
│  Auth Check │ → 401 if not authenticated
└─────────────┘
   │
   v
┌─────────────┐
│ Role Check  │ → 403 if insufficient permissions
└─────────────┘
   │
   v
┌─────────────┐
│  Validation │ → 400 if invalid input (Zod)
└─────────────┘
   │
   v
┌─────────────┐
│  Business   │
│   Logic     │
└─────────────┘
   │
   v
┌─────────────┐
│  Database   │ → MongoDB operations
└─────────────┘
   │
   v
┌─────────────┐
│ Audit Log   │ → Record critical actions
└─────────────┘
   │
   v
┌─────────────┐
│ Automation  │ → Trigger events (optional)
└─────────────┘
   │
   v
Response (JSON)
```

### Standard Response Format

**Success**:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* ... */ }
}
```

**Error**:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

## Portal Structure

### Route Organization

```
app/
├── (auth)/
│   ├── login/
│   ├── register/
│   └── verify-request/
│
├── admin/
│   ├── page.tsx                    # Dashboard
│   ├── users/
│   ├── campaigns/
│   ├── audit-logs/
│   ├── fraud/
│   └── payments/
│
├── brand/
│   ├── page.tsx                    # Dashboard
│   ├── campaigns/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── invite/
│   ├── profile/
│   ├── discover/
│   ├── analytics/
│   └── roi/
│
├── influencer/
│   ├── page.tsx                    # Dashboard
│   ├── profile/
│   ├── collaborations/
│   ├── posts/
│   └── earnings/
│
├── client/
│   ├── page.tsx                    # Dashboard
│   ├── campaigns/                  # Read-only
│   ├── projects/
│   ├── deliverables/
│   └── communication/
│
└── employee/
    ├── page.tsx                    # Dashboard
    ├── tasks/
    ├── reports/
    └── chat/
```

---

## Integration Points

### Email Integration (Ready)

```typescript
// lib/email.ts
import { sendTemplatedEmail, emailTemplates } from "@/lib/email"

// Send email
const template = emailTemplates.campaignInvite(/* ... */)
await sendTemplatedEmail("user@example.com", template)
```

**Production Options**:
- NodeMailer (SMTP)
- SendGrid
- AWS SES
- Resend

### AI Integration (Stub)

```typescript
// Production: Call Python microservice
// AI_SERVICE_URL=http://ai-service:5000

// Current: Rule-based logic
// POST /api/ai/sentiment-analysis
// POST /api/ai/detect-fraud
// POST /api/ai/predict-roi
```

**ML Models Ready For**:
- Sentiment: BERT/DistilBERT
- Fraud: Isolation Forest/DBSCAN
- ROI: XGBoost/Random Forest

### Job Queue Integration (Ready)

```typescript
// lib/jobs.ts
import { executeJob } from "@/lib/jobs"

// Execute background job
await executeJob("updateCampaignMetrics")
```

**Production Options**:
- BullMQ (Redis-based)
- Agenda (MongoDB-based)
- Vercel Cron

---

## Scalability & Performance

### Current Performance

- **Response Time**: < 200ms (avg)
- **Database Queries**: Optimized with 29 indexes
- **Concurrent Users**: 100+ (tested)
- **API Rate Limit**: 100 req/min (configurable)

### Scaling Strategy

**Horizontal Scaling**:
```
┌─────────┐    ┌─────────┐    ┌─────────┐
│ Next.js │    │ Next.js │    │ Next.js │
│Instance1│    │Instance2│    │Instance3│
└────┬────┘    └────┬────┘    └────┬────┘
     │              │              │
     └──────────┬───┴──────────────┘
                │
         ┌──────┴──────┐
         │Load Balancer│
         └─────────────┘
```

**Database Scaling**:
- Read replicas for analytics
- Sharding by user_id
- Connection pooling

**Caching Strategy**:
- Redis for sessions
- CDN for static assets
- API response caching

### Performance Optimizations

1. **Database**:
   - All collections have appropriate indexes
   - Query projection to minimize data transfer
   - Aggregation pipelines for analytics

2. **API**:
   - Rate limiting prevents abuse
   - Pagination on all list endpoints
   - Zod validation for type safety

3. **Frontend**:
   - Next.js automatic code splitting
   - Dynamic imports for large components
   - Image optimization

---

## Security Architecture

### Layers of Security

1. **Network Layer**:
   - HTTPS enforced in production
   - CORS restrictions
   - Rate limiting

2. **Authentication Layer**:
   - NextAuth.js session management
   - Secure password hashing (bcrypt)
   - JWT tokens with expiration

3. **Authorization Layer**:
   - Role-based access control
   - Resource ownership checks
   - Admin-only endpoints

4. **Data Layer**:
   - MongoDB authentication
   - Network access restrictions
   - Data sanitization (remove password_hash, etc.)

5. **Application Layer**:
   - Input validation (Zod)
   - XSS prevention
   - SQL injection prevention (NoSQL database)
   - CSRF protection (NextAuth.js)

---

## Monitoring & Observability

### Logging

```typescript
import { logger } from "@/lib/logger"

logger.info("User logged in", { userId, role })
logger.error("Payment failed", { error, transactionId })
```

### Metrics

- Request count by endpoint
- Response times
- Error rates
- Database query performance

### Audit Trail

All critical actions logged to `audit_logs` collection:
- User approvals/rejections
- Transaction approvals
- Campaign invitations
- Withdrawal requests

---

## Future Enhancements

1. **Real-time Features**:
   - WebSocket for live notifications
   - Real-time analytics dashboards

2. **Advanced AI**:
   - ML model integration
   - Recommendation engine
   - Predictive analytics

3. **Payment Integration**:
   - Stripe/PayPal integration
   - Automated payouts
   - Invoice generation

4. **Mobile Apps**:
   - React Native app
   - Push notifications

5. **Advanced Analytics**:
   - Custom reporting
   - Data export
   - BI tool integration

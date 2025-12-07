# 🚀 Porchest Multiportal Platform - Complete Documentation

> **A comprehensive multi-tenant SaaS platform connecting brands, influencers, software clients, employees, and administrators with AI-powered influencer marketing capabilities.**

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Core Concepts](#-core-concepts)
3. [Complete Technology Stack](#-complete-technology-stack)
4. [Architecture & Design Patterns](#-architecture--design-patterns)
5. [Complete Folder & File Structure](#-complete-folder--file-structure)
6. [Database Schema](#-database-schema)
7. [Authentication System](#-authentication-system)
8. [API Endpoints Reference](#-api-endpoints-reference)
9. [Portal Features](#-portal-features)
10. [AI & Machine Learning Features](#-ai--machine-learning-features)
11. [Setup & Installation](#-setup--installation)
12. [Environment Variables](#-environment-variables)
13. [Development Workflow](#-development-workflow)
14. [Deployment](#-deployment)
15. [Testing](#-testing)
16. [Troubleshooting](#-troubleshooting)

---

## 🎯 Project Overview

**Porchest Multiportal** is a production-ready, enterprise-grade platform that serves as a marketplace connecting brands with influencers for marketing campaigns, while also providing project management capabilities for software clients and employees.

### What This Platform Does

- **For Brands**: Discover influencers, create campaigns, track ROI, and manage marketing budgets
- **For Influencers**: Manage profiles, connect Instagram, track earnings, and receive collaboration invitations
- **For Admins**: Oversee users, verify accounts, detect fraud, and manage platform operations
- **For Clients**: Track software projects, monitor deliverables, and communicate with teams
- **For Employees**: Submit daily reports, manage tasks, and track performance

### Key Differentiators

1. **Multi-Tenant Architecture**: One platform, five distinct user experiences
2. **AI-Powered Matching**: Uses OpenAI and Google Gemini for intelligent influencer discovery
3. **Real-Time Analytics**: Live campaign performance tracking and ROI prediction
4. **Instagram Integration**: Direct connection to Meta API for authentic metrics
5. **Automated Payments**: Influencer earnings and withdrawal management

---

## 💡 Core Concepts

### Multi-Tenant SaaS Architecture

This platform implements **true multi-tenancy** where different user roles (tenants) share the same infrastructure but have completely isolated experiences:

- **Shared Database**: All users stored in MongoDB, segregated by role
- **Role-Based Access Control (RBAC)**: Middleware enforces portal access
- **Isolated UI/UX**: Each portal has its own design, navigation, and features
- **Shared Services**: Authentication, database, and AI services are reused

### Role-Based Access Control (RBAC)

Every user belongs to ONE role:
- `brand` - Marketing teams creating campaigns
- `influencer` - Content creators promoting products
- `admin` - Platform administrators
- `client` - Software project clients
- `employee` - Internal team members

Roles determine:
- Which portal they can access (`/brand`, `/influencer`, etc.)
- Which API endpoints they can call
- What data they can view and modify

### JWT-Based Authentication

- **JWT Tokens**: Stateless authentication using JSON Web Tokens
- **Session Strategy**: Token-based (not database sessions) for scalability
- **Token Contents**: User ID, role, status, profile completion
- **Expiration**: 24-hour token lifetime
- **Refresh**: Automatic token refresh on session update

### Lazy Loading & Performance Optimization

- **MongoDB Lazy Loading**: Database connection deferred until first query (prevents build failures)
- **Connection Pooling**: Reuses 2-10 database connections for efficiency
- **Server Components**: Next.js 14 server components for faster initial load
- **Code Splitting**: Automatic route-based code splitting

---

## 🛠 Complete Technology Stack

### Frontend Framework & Core

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.2.18 | React framework with App Router, server components, and routing |
| **React** | 18.3.1 | UI library for building component-based interfaces |
| **TypeScript** | 5.7.2 | Static typing for JavaScript (prevents bugs, improves DX) |
| **JavaScript** | ES2022 | Programming language (compiled by Next.js) |

**Why Next.js 14?**
- App Router (vs Pages Router): Better file-based routing, layouts, and server components
- Server Components: Render React on server for faster initial load
- API Routes: Backend API in same codebase
- Image Optimization: Automatic image resizing and WebP conversion
- Built-in SEO: Metadata API for search engine optimization

### Styling & UI Components

| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | 3.4.1 | Utility-first CSS framework for rapid styling |
| **PostCSS** | 8.5.0 | CSS processing tool (autoprefixer, minification) |
| **Radix UI** | Various | Unstyled, accessible UI primitives (headless components) |
| **shadcn/ui** | Latest | Pre-built components using Radix UI + Tailwind |
| **Lucide React** | 0.469.0 | Icon library (454+ icons, tree-shakeable) |
| **Class Variance Authority** | 0.7.1 | CSS class composition utility |
| **clsx** | 2.1.1 | Conditional CSS class names |
| **Tailwind Merge** | 2.5.5 | Intelligently merges Tailwind classes |

**UI Component Breakdown**:
- **Radix UI Primitives**: Accordion, Dialog, Dropdown, Select, Tabs, Toast, Tooltip, etc.
- **Custom Components**: Built on top of Radix for consistent design
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### Data Visualization

| Technology | Version | Purpose |
|------------|---------|---------|
| **Recharts** | 2.15.0 | React charting library for analytics dashboards |
| **Chart.js** | Via shadcn | Alternative charting for specific use cases |

**Chart Types Used**:
- Line Charts: Campaign performance over time
- Bar Charts: Comparative metrics (influencer engagement rates)
- Pie Charts: Sentiment analysis distribution
- Donut Charts: Budget allocation

### Database & Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **MongoDB** | 6.20.0 (Driver) | NoSQL database (document-oriented, flexible schema) |
| **MongoDB Server** | 7.0 | Database server (production) |

**Why MongoDB?**
- **Flexible Schema**: Different user types have different fields (brand vs influencer profiles)
- **Document Model**: Natural fit for JavaScript objects (JSON-like documents)
- **Scalability**: Horizontal scaling with sharding
- **Performance**: Indexing and aggregation for fast queries
- **Connection Pooling**: Reuses connections for efficiency

### Authentication & Security

| Technology | Version | Purpose |
|------------|---------|---------|
| **NextAuth.js (Auth.js)** | 5.0.0-beta.25 | Authentication framework for Next.js |
| **@auth/mongodb-adapter** | 3.7.4 | Stores sessions and accounts in MongoDB |
| **bcryptjs** | 2.4.3 | Password hashing (one-way encryption) |
| **JWT** | Via NextAuth | JSON Web Tokens for stateless auth |

**Authentication Features**:
- Google OAuth 2.0 (social login)
- Credentials provider (email/password)
- Session management
- CSRF protection
- Secure cookies (httpOnly, sameSite)

### Form Management & Validation

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Hook Form** | 7.54.2 | Performant form state management |
| **Zod** | 3.24.1 | TypeScript-first schema validation |
| **@hookform/resolvers** | 3.9.1 | Connects Zod to React Hook Form |

**How It Works**:
1. Define schema with Zod (e.g., email format, password length)
2. Connect to React Hook Form for validation
3. Display errors in real-time
4. Submit validated data to API

### AI & Machine Learning

| Technology | Version | Purpose |
|------------|---------|---------|
| **OpenAI API** | 4.77.3 | GPT models for influencer recommendations |
| **Google Generative AI** | 0.21.0 | Gemini models for chatbot (free tier) |
| **Python Flask** | 3.1.0 | Microservice for ML models (sentiment, ROI, fraud) |

**AI Use Cases**:
- Influencer search and matching
- Natural language query processing
- Sentiment analysis on comments
- ROI prediction based on historical data
- Fraud detection (anomaly detection)

### External API Integrations

| Service | Purpose |
|---------|---------|
| **Meta Graph API** | Instagram data (followers, engagement, posts) |
| **Google OAuth** | Social login authentication |
| **OpenAI API** | Generative AI for recommendations |
| **Gemini API** | Conversational AI chatbot |

### Development Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| **ESLint** | 8 | Code linting (JavaScript/TypeScript) |
| **TypeScript Compiler** | 5.7.2 | Type checking |
| **tsx** | 4.19.2 | TypeScript execution (for scripts) |
| **Dotenv** | 16.4.7 | Load environment variables from .env |

### Testing Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **Jest** | 29.7.0 | JavaScript testing framework |
| **@testing-library/react** | 16.1.0 | React component testing utilities |
| **@testing-library/jest-dom** | 6.6.3 | Custom Jest matchers for DOM |
| **ts-jest** | 29.2.5 | TypeScript support for Jest |
| **Supertest** | 7.0.0 | HTTP API testing |

### Build & Deployment Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| **Docker** | Latest | Containerization |
| **Docker Compose** | Latest | Multi-container orchestration |
| **Vercel** | Latest | Serverless deployment platform |

### Utility Libraries

| Library | Purpose |
|---------|---------|
| **date-fns** | Date formatting and manipulation |
| **SWR** | Data fetching with caching and revalidation |
| **Sonner** | Toast notifications |
| **Nodemailer** | Email sending (transactional emails) |
| **Vercel Analytics** | Application performance monitoring |
| **cmdk** | Command palette component |
| **vaul** | Drawer component |
| **input-otp** | OTP input field |
| **Embla Carousel** | Carousel/slider component |

---

## 🏗 Architecture & Design Patterns

### Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
│  (React Components + Tailwind CSS + Client JavaScript)      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js 14 App Router                      │
│                  (Edge Runtime Middleware)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Middleware: Auth Check → Role Check → Status Check  │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
  ┌─────────┐      ┌─────────┐     ┌──────────┐
  │ Server  │      │  API    │     │  Server  │
  │ Pages   │      │ Routes  │     │ Actions  │
  └────┬────┘      └────┬────┘     └────┬─────┘
       │                │               │
       │                │               │
       └────────────────┼───────────────┘
                        │
         ┌──────────────┼──────────────┐
         │              │              │
         ▼              ▼              ▼
   ┌─────────┐   ┌──────────┐   ┌─────────┐
   │ MongoDB │   │ OpenAI   │   │  Meta   │
   │   DB    │   │   API    │   │   API   │
   └─────────┘   └──────────┘   └─────────┘
```

### Design Patterns Used

#### 1. **Repository Pattern** (`/lib/db-types.ts`)
Abstracts database operations into reusable functions:
```typescript
// Instead of raw MongoDB queries everywhere:
const users = await db.collection("users").find({});

// We use typed repository functions:
const users = await collections.users().find({});
```

#### 2. **Singleton Pattern** (`/lib/mongodb.ts`)
One MongoDB connection shared across the application:
- Development: Survives hot reloads (global variable)
- Production: Single instance per deployment
- Benefits: Prevents connection exhaustion

#### 3. **Middleware Pattern** (`/middleware.ts`)
Intercepts requests before they reach pages:
- Authentication check
- Authorization (role-based)
- Redirects (profile completion, pending approval)

#### 4. **Factory Pattern** (Auth Providers)
Different authentication strategies (Google, Credentials) with same interface

#### 5. **Strategy Pattern** (AI Services)
Interchangeable AI providers (OpenAI, Gemini) with same contract

#### 6. **Component Composition** (React)
Small, reusable components combined to build complex UIs

---

## 📁 Complete Folder & File Structure

```
Porchest-Multiportal/
│
├── 📁 app/                           # Next.js 14 App Router (main application)
│   │
│   ├── 📁 (auth)/                    # Auth route group (shared layout)
│   │   ├── login/page.tsx            # Login page
│   │   ├── signup/page.tsx           # Registration page
│   │   └── layout.tsx                # Auth layout wrapper
│   │
│   ├── 📁 api/                       # API routes (REST endpoints)
│   │   │
│   │   ├── 📁 auth/                  # Authentication endpoints
│   │   │   ├── register/route.ts     # POST /api/auth/register
│   │   │   ├── set-role/route.ts     # POST /api/auth/set-role
│   │   │   └── [...nextauth]/route.ts # NextAuth handler
│   │   │
│   │   ├── 📁 brand/                 # Brand portal endpoints
│   │   │   ├── campaigns/route.ts    # GET/POST /api/brand/campaigns
│   │   │   ├── campaigns/[id]/route.ts # GET/PUT/DELETE by ID
│   │   │   ├── profile/route.ts      # POST /api/brand/profile
│   │   │   ├── recommend-influencers/route.ts # AI recommendations
│   │   │   └── chat-recommend/route.ts # Chatbot recommendations
│   │   │
│   │   ├── 📁 influencer/            # Influencer portal endpoints
│   │   │   ├── profile/route.ts      # GET/POST profile
│   │   │   ├── profile-setup/route.ts # Complete setup
│   │   │   ├── posts/route.ts        # Sync Instagram posts
│   │   │   ├── withdraw/route.ts     # Withdraw earnings
│   │   │   └── 📁 instagram/         # Instagram integration
│   │   │       ├── connect/route.ts  # Initiate OAuth
│   │   │       ├── callback/route.ts # OAuth callback
│   │   │       ├── sync/route.ts     # Sync metrics
│   │   │       └── disconnect/route.ts # Disconnect account
│   │   │
│   │   ├── 📁 admin/                 # Admin endpoints
│   │   │   ├── users/route.ts        # List all users
│   │   │   ├── pending-users/route.ts # Pending approvals
│   │   │   ├── verify-user/route.ts  # Verify user
│   │   │   ├── approve/route.ts      # Approve account
│   │   │   ├── transactions/route.ts # List transactions
│   │   │   └── audit-logs/route.ts   # System logs
│   │   │
│   │   ├── 📁 client/                # Client endpoints
│   │   │   ├── projects/route.ts     # GET/POST projects
│   │   │   └── projects/[id]/route.ts # Single project
│   │   │
│   │   ├── 📁 employee/              # Employee endpoints
│   │   │   └── daily-reports/route.ts # Daily reports
│   │   │
│   │   ├── 📁 ai/                    # AI service endpoints
│   │   │   ├── sentiment-analysis/route.ts # Analyze sentiment
│   │   │   ├── predict-roi/route.ts  # ROI prediction
│   │   │   └── detect-fraud/route.ts # Fraud detection
│   │   │
│   │   ├── 📁 collaboration/         # Collaboration endpoints
│   │   │   ├── route.ts              # List invitations
│   │   │   └── [id]/action/route.ts  # Accept/reject
│   │   │
│   │   ├── 📁 meta/                  # Meta/Facebook API
│   │   │   ├── auth/route.ts         # Meta authorization
│   │   │   ├── callback/route.ts     # Meta OAuth callback
│   │   │   └── refresh-token/route.ts # Token refresh
│   │   │
│   │   ├── 📁 cron/                  # Scheduled jobs
│   │   │   └── refresh-instagram-tokens/route.ts # Token refresh cron
│   │   │
│   │   ├── brand-chat/route.ts       # Brand chatbot
│   │   ├── brand-chat-robust/route.ts # Enhanced chatbot
│   │   ├── health/route.ts           # Health check
│   │   └── notifications/route.ts    # Notifications CRUD
│   │
│   ├── 📁 brand/                     # Brand Portal Pages
│   │   ├── page.tsx                  # Dashboard (/brand)
│   │   ├── layout.tsx                # Brand layout with sidebar
│   │   ├── 📁 campaigns/             # Campaign management
│   │   │   ├── page.tsx              # List campaigns
│   │   │   ├── [id]/page.tsx         # Single campaign details
│   │   │   ├── new/page.tsx          # Create campaign
│   │   │   └── [id]/edit/page.tsx    # Edit campaign
│   │   ├── 📁 discover/              # Influencer discovery
│   │   │   └── page.tsx              # Search influencers
│   │   ├── 📁 recommendations/       # AI recommendations
│   │   │   └── page.tsx              # Recommended influencers
│   │   ├── 📁 search/                # Advanced search
│   │   │   └── page.tsx              # Filter influencers
│   │   ├── 📁 profile-setup/         # Onboarding
│   │   │   └── page.tsx              # Complete brand profile
│   │   ├── 📁 analytics/             # Campaign analytics
│   │   │   └── page.tsx              # Performance dashboard
│   │   ├── 📁 roi/                   # ROI analysis
│   │   │   └── page.tsx              # ROI predictions
│   │   └── 📁 active-campaigns/      # Active campaigns
│   │       └── page.tsx              # Ongoing campaigns
│   │
│   ├── 📁 influencer/                # Influencer Portal Pages
│   │   ├── page.tsx                  # Dashboard (/influencer)
│   │   ├── layout.tsx                # Influencer layout
│   │   ├── 📁 profile/               # Profile management
│   │   │   └── page.tsx              # View/edit profile
│   │   ├── 📁 earnings/              # Earnings tracking
│   │   │   └── page.tsx              # Earnings dashboard
│   │   ├── 📁 collaborations/        # Campaign invitations
│   │   │   └── page.tsx              # Invitations list
│   │   ├── 📁 posts/                 # Instagram posts
│   │   │   └── page.tsx              # Posts with metrics
│   │   ├── 📁 insights/              # Performance insights
│   │   │   └── page.tsx              # Analytics dashboard
│   │   └── 📁 verification/          # Account verification
│   │       └── page.tsx              # Verification status
│   │
│   ├── 📁 admin/                     # Admin Portal Pages
│   │   ├── page.tsx                  # Dashboard (/admin)
│   │   ├── layout.tsx                # Admin layout
│   │   ├── 📁 users/                 # User management
│   │   │   └── page.tsx              # All users list
│   │   ├── 📁 verification/          # User verification
│   │   │   └── page.tsx              # Pending verifications
│   │   ├── 📁 campaigns/             # Campaign oversight
│   │   │   └── page.tsx              # All campaigns
│   │   ├── 📁 payments/              # Payment processing
│   │   │   └── page.tsx              # Payment approvals
│   │   ├── 📁 audit-logs/            # System logs
│   │   │   └── page.tsx              # Audit trail
│   │   ├── 📁 fraud/                 # Fraud detection
│   │   │   └── page.tsx              # Anomalies dashboard
│   │   └── 📁 create-login/          # Admin user creation
│   │       └── page.tsx              # Create admin account
│   │
│   ├── 📁 client/                    # Client Portal Pages
│   │   ├── page.tsx                  # Dashboard (/client)
│   │   ├── layout.tsx                # Client layout
│   │   ├── 📁 projects/              # Project tracking
│   │   │   └── page.tsx              # Projects list
│   │   ├── 📁 deliverables/          # Deliverables
│   │   │   └── page.tsx              # Deliverables status
│   │   └── 📁 communication/         # Client communication
│   │       └── page.tsx              # Communication center
│   │
│   ├── 📁 employee/                  # Employee Portal Pages
│   │   ├── page.tsx                  # Dashboard (/employee)
│   │   ├── layout.tsx                # Employee layout
│   │   ├── 📁 tasks/                 # Task management
│   │   │   └── page.tsx              # Tasks list
│   │   ├── 📁 reports/               # Report history
│   │   │   └── page.tsx              # Past reports
│   │   ├── 📁 reporting/             # Report submission
│   │   │   └── page.tsx              # Daily report form
│   │   ├── 📁 chat/                  # Team chat
│   │   │   └── page.tsx              # Chat interface
│   │   └── 📁 performance/           # Performance metrics
│   │       └── page.tsx              # Performance dashboard
│   │
│   ├── 📁 auth/                      # Auth flow pages
│   │   ├── choose-role/page.tsx      # Role selection (Google OAuth)
│   │   ├── pending-approval/page.tsx # Awaiting admin approval
│   │   └── error/page.tsx            # Auth error page
│   │
│   ├── page.tsx                      # Homepage (/)
│   ├── layout.tsx                    # Root layout
│   ├── globals.css                   # Global CSS + Tailwind imports
│   └── favicon.ico                   # Favicon
│
├── 📁 components/                    # React components
│   │
│   ├── 📁 ui/                        # shadcn/ui components (30+)
│   │   ├── button.tsx                # Button component
│   │   ├── card.tsx                  # Card container
│   │   ├── dialog.tsx                # Modal dialog
│   │   ├── dropdown-menu.tsx         # Dropdown menu
│   │   ├── input.tsx                 # Text input
│   │   ├── select.tsx                # Select dropdown
│   │   ├── tabs.tsx                  # Tabs component
│   │   ├── toast.tsx                 # Toast notifications
│   │   ├── tooltip.tsx               # Tooltip
│   │   ├── accordion.tsx             # Accordion
│   │   ├── alert.tsx                 # Alert message
│   │   ├── avatar.tsx                # User avatar
│   │   ├── badge.tsx                 # Badge label
│   │   ├── calendar.tsx              # Date picker
│   │   ├── checkbox.tsx              # Checkbox input
│   │   ├── command.tsx               # Command palette
│   │   ├── label.tsx                 # Form label
│   │   ├── popover.tsx               # Popover
│   │   ├── progress.tsx              # Progress bar
│   │   ├── radio-group.tsx           # Radio buttons
│   │   ├── scroll-area.tsx           # Scrollable area
│   │   ├── separator.tsx             # Divider line
│   │   ├── slider.tsx                # Range slider
│   │   ├── switch.tsx                # Toggle switch
│   │   └── ... (30+ total components)
│   │
│   ├── 📁 charts/                    # Chart components
│   │   ├── line-chart.tsx            # Time-series chart
│   │   ├── bar-chart.tsx             # Bar chart
│   │   ├── pie-chart.tsx             # Pie/donut chart
│   │   ├── sentiment-pie.tsx         # Sentiment distribution
│   │   └── performance-bar.tsx       # Performance metrics
│   │
│   ├── 📁 brand-specific/            # Brand portal components
│   │   ├── campaign-dashboard.tsx    # Campaign overview
│   │   ├── influencer-card.tsx       # Influencer profile card
│   │   ├── chatbot-recommendations.tsx # AI chatbot UI
│   │   ├── roi-prediction.tsx        # ROI forecast display
│   │   └── sentiment-chart.tsx       # Sentiment visualization
│   │
│   ├── portal-layout.tsx             # Generic portal layout
│   ├── portal-sidebar.tsx            # Generic sidebar
│   ├── brand-sidebar.tsx             # Brand portal sidebar
│   ├── influencer-sidebar.tsx        # Influencer sidebar
│   ├── admin-sidebar.tsx             # Admin sidebar
│   ├── employee-sidebar.tsx          # Employee sidebar
│   ├── client-sidebar.tsx            # Client sidebar
│   ├── navigation.tsx                # Top navigation bar
│   ├── user-nav.tsx                  # User profile menu
│   ├── chatbot.tsx                   # Generic chatbot
│   ├── hero.tsx                      # Homepage hero section
│   ├── footer.tsx                    # Footer
│   └── not-authorized.tsx            # 403 error page
│
├── 📁 lib/                           # Utility libraries & helpers
│   │
│   ├── 📄 auth.ts                    # NextAuth export
│   ├── 📄 auth.config.ts             # NextAuth configuration ⭐
│   ├── 📄 auth-middleware.ts         # Edge-compatible auth
│   ├── 📄 mongodb.ts                 # MongoDB connection ⭐
│   ├── 📄 db-types.ts                # TypeScript database types (739 lines)
│   ├── 📄 db.ts                      # Database helper functions
│   │
│   ├── 📄 ai-helpers.ts              # OpenAI API wrapper
│   ├── 📄 ai-gemini.ts               # Google Gemini wrapper
│   ├── 📄 gemini-function-calling.ts # Structured Gemini output
│   ├── 📄 extractCriteriaWithGemini.ts # Parse search queries
│   ├── 📄 intentDetection.ts         # Detect user intent
│   ├── 📄 searchInfluencers.ts       # Basic search algorithm
│   ├── 📄 searchInfluencersRobust.ts # Advanced search with scoring
│   ├── 📄 formatInfluencerResults.ts # Format search results
│   │
│   ├── 📄 validations.ts             # Zod validation schemas
│   ├── 📄 api-response.ts            # Standardized API responses
│   ├── 📄 logger.ts                  # Application logging
│   ├── 📄 rate-limit.ts              # In-memory rate limiting
│   ├── 📄 automation.ts              # Background jobs
│   ├── 📄 jobs.ts                    # Job definitions
│   ├── 📄 mock-data.ts               # Sample data for dev
│   ├── 📄 utils.ts                   # General utilities
│   │
│   └── 📁 utils/                     # Additional utilities
│       ├── meta-api.ts               # Meta API helpers
│       ├── calculations.ts           # Number formatting
│       └── influencer-db.ts          # Influencer DB operations
│
├── 📁 hooks/                         # Custom React hooks
│   ├── use-session.ts                # Session management hook
│   ├── use-profile.ts                # Profile data hook
│   └── use-mobile.ts                 # Mobile detection hook
│
├── 📁 types/                         # TypeScript type definitions
│   ├── next-auth.d.ts                # Extend NextAuth types
│   └── index.ts                      # Global type exports
│
├── 📁 styles/                        # Global styles
│   └── globals.css                   # Tailwind + custom CSS
│
├── 📁 public/                        # Static assets
│   ├── images/                       # Image files
│   ├── icons/                        # Icon files
│   └── fonts/                        # Font files
│
├── 📁 scripts/                       # Utility scripts
│   ├── create-indexes.ts             # Create MongoDB indexes
│   ├── seed-sample-data.ts           # Seed demo data
│   ├── migrate-users-clean.ts        # User migration
│   ├── migrate-influencer-profiles.ts # Profile migration
│   └── check-instagram-connection.ts # Debug Instagram
│
├── 📁 __tests__/                     # Test files
│   ├── api/                          # API route tests
│   ├── lib/                          # Library tests
│   └── components/                   # Component tests
│
├── 📁 ai-microservice/               # Python Flask AI service
│   ├── app.py                        # Flask application
│   ├── requirements.txt              # Python dependencies
│   └── Dockerfile                    # Docker image config
│
├── 📁 coverage/                      # Jest coverage reports
│
├── 📄 middleware.ts                  # Next.js middleware ⭐
├── 📄 next.config.mjs                # Next.js configuration
├── 📄 tsconfig.json                  # TypeScript config
├── 📄 tailwind.config.ts             # Tailwind CSS config
├── 📄 postcss.config.mjs             # PostCSS config
├── 📄 components.json                # shadcn/ui config
├── 📄 jest.config.cjs                # Jest config
├── 📄 jest.setup.cjs                 # Jest setup
├── 📄 package.json                   # Dependencies & scripts
├── 📄 package-lock.json              # Locked dependency versions
├── 📄 .env.example                   # Environment variable template
├── 📄 .env.local                     # Local environment (gitignored)
├── 📄 .gitignore                     # Git ignore rules
├── 📄 docker-compose.yml             # Docker multi-container
├── 📄 Dockerfile                     # Next.js Docker image
├── 📄 vercel.json                    # Vercel deployment config
└── 📄 README.md                      # This file

⭐ = Key files with comprehensive inline comments
```

### Key File Descriptions

#### Configuration Files
- **middleware.ts**: Route protection, authentication, and RBAC enforcement
- **lib/auth.config.ts**: NextAuth setup with Google OAuth and credentials providers
- **lib/mongodb.ts**: Lazy-loaded MongoDB connection with retry logic
- **next.config.mjs**: Next.js build and runtime configuration
- **tailwind.config.ts**: Tailwind CSS theme and plugin configuration

#### Core Libraries
- **lib/db-types.ts**: TypeScript interfaces for all MongoDB collections (739 lines)
- **lib/searchInfluencersRobust.ts**: AI-powered influencer search with scoring
- **lib/ai-helpers.ts**: OpenAI integration for recommendations
- **lib/validations.ts**: Zod schemas for input validation

---

## 🗄 Database Schema

### Database Name: `porchest_db`

### Collections Overview

| Collection | Documents | Purpose |
|------------|-----------|---------|
| **users** | Master table | All user accounts (auth + basic info) |
| **brand_profiles** | Brand-specific | Brand business details |
| **influencer_profiles** | Influencer-specific | Influencer metrics & Instagram data |
| **employee_profiles** | Employee-specific | Employee information |
| **campaigns** | Campaign data | Marketing campaigns |
| **collaborations** | Invitations | Campaign-influencer links |
| **notifications** | User notifications | In-app notifications |
| **transactions** | Payment records | Financial transactions |
| **daily_reports** | Employee reports | Daily report submissions |
| **audit_logs** | System logs | Platform activity tracking |

### Detailed Schema

#### 1. **users** Collection (Master Identity Table)

```typescript
{
  _id: ObjectId,                    // MongoDB unique ID
  full_name: string,                // User's full name
  email: string,                    // Email address (unique, indexed)
  password_hash: string,            // Bcrypt hashed password (credentials users only)
  role: "brand" | "influencer" | "admin" | "client" | "employee",
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED",
  profile_completed: boolean,       // Has user completed onboarding?
  created_at: Date,                 // Account creation timestamp
  updated_at: Date,                 // Last update timestamp
  last_login: Date,                 // Last login timestamp (optional)
}
```

**Indexes**:
- `email` (unique)
- `role`
- `status`

**Key Concepts**:
- **role**: Determines which portal user can access
- **status**:
  - ACTIVE = can log in
  - INACTIVE = pending admin approval
  - SUSPENDED = account suspended
- **profile_completed**: Redirects to profile setup if false

---

#### 2. **brand_profiles** Collection

```typescript
{
  _id: ObjectId,
  user_id: ObjectId,                // Reference to users._id
  brand_name: string,               // Company/brand name
  company: string,                  // Legal company name
  phone: string,                    // Contact phone
  website: string,                  // Brand website
  industry: string,                 // E.g., "Fashion", "Tech", "Food"
  location: string,                 // City, Country
  company_description: string,      // About the brand
  campaign_tracking: {              // Campaign statistics
    total_campaigns: number,
    active_campaigns: number,
    total_spend: number,
    avg_roi: number
  },
  profile_completed: boolean,       // Setup wizard completed?
  created_at: Date,
  updated_at: Date,
}
```

**Relationship**: `user_id` → `users._id` (one-to-one)

**Why Separate Collection?**
- Brand-specific fields don't apply to other roles
- Keeps `users` collection lean
- Easier to query brand-specific data

---

#### 3. **influencer_profiles** Collection

```typescript
{
  _id: ObjectId,
  user_id: ObjectId,                // Reference to users._id
  username: string,                 // Social media handle
  niche: string,                    // E.g., "Fashion", "Fitness", "Travel"
  location: string,                 // City, Country
  languages: string[],              // ["English", "Spanish"]
  platforms: string[],              // ["Instagram", "TikTok", "YouTube"]

  // Instagram Integration (via Meta API)
  instagram: {
    connected: boolean,             // Is Instagram connected?
    access_token: string,           // Long-lived access token (encrypted)
    token_expires_at: Date,         // Token expiration
    business_account_id: string,    // Instagram Business Account ID
    username: string,               // @username
    followers_count: number,        // Current follower count
    engagement_rate: number,        // Average engagement rate (%)
    avg_likes: number,              // Average likes per post
    avg_comments: number,           // Average comments per post
    avg_views: number,              // Average video views
    last_synced: Date,              // Last metrics sync
    demographics: {                 // Audience demographics
      age_ranges: Object,           // E.g., {"18-24": 30, "25-34": 45}
      genders: Object,              // E.g., {"male": 40, "female": 60}
      top_countries: string[],      // ["US", "UK", "CA"]
      top_cities: string[],         // ["New York", "London"]
    }
  },

  // Pricing & Availability
  price_per_post: number,           // Price in USD
  availability: "available" | "busy" | "unavailable",

  // Performance Metrics
  rating: number,                   // Average rating (1-5)
  completed_campaigns: number,      // Total campaigns completed
  brands_worked_with: string[],     // List of brand names

  // Earnings
  earnings: {
    total_earned: number,           // Lifetime earnings
    current_balance: number,        // Available for withdrawal
    pending: number,                // Pending approval
  },

  // Verification
  is_verified: boolean,             // Admin verified?
  verification_status: "pending" | "verified" | "rejected",

  profile_completed: boolean,
  last_active_at: Date,
  created_at: Date,
  updated_at: Date,
}
```

**Instagram Token Flow**:
1. User clicks "Connect Instagram"
2. Redirected to Meta OAuth
3. User authorizes app
4. Callback receives short-lived token
5. Exchange for long-lived token (60 days)
6. Store encrypted in database
7. Cron job refreshes before expiration

---

#### 4. **campaigns** Collection

```typescript
{
  _id: ObjectId,
  brand_id: ObjectId,               // Reference to brand_profiles._id
  name: string,                     // Campaign name
  description: string,              // Campaign details
  budget: number,                   // Total budget in USD
  spend: number,                    // Amount spent so far
  status: "draft" | "active" | "paused" | "completed" | "cancelled",

  // Target Audience
  target_audience: {
    age_range: string,              // E.g., "18-35"
    gender: string,                 // "male" | "female" | "all"
    locations: string[],            // ["US", "CA", "UK"]
    interests: string[],            // ["fashion", "tech"]
  },

  // Campaign Dates
  start_date: Date,
  end_date: Date,

  // Influencer Assignments
  influencers: [
    {
      influencer_id: ObjectId,      // Reference to influencer_profiles._id
      status: "invited" | "accepted" | "rejected" | "completed",
      payment_amount: number,
      paid: boolean,
    }
  ],

  // Performance Metrics
  metrics: {
    total_reach: number,            // Total impressions
    total_impressions: number,      // Total views
    total_engagement: number,       // Likes + comments + shares
    engagement_rate: number,        // Engagement / reach (%)
    clicks: number,                 // Link clicks
    conversions: number,            // Sales/signups
    roi: number,                    // Return on investment (%)
  },

  // Sentiment Analysis (AI-powered)
  sentiment_analysis: {
    positive: number,               // % positive comments
    neutral: number,                // % neutral comments
    negative: number,               // % negative comments
    last_analyzed: Date,
  },

  created_at: Date,
  updated_at: Date,
}
```

**Campaign Lifecycle**:
1. draft → Brand creates campaign
2. active → Campaign goes live
3. paused → Temporarily paused
4. completed → Successfully finished
5. cancelled → Terminated early

---

#### 5. **collaborations** Collection (Campaign Invitations)

```typescript
{
  _id: ObjectId,
  campaign_id: ObjectId,            // Reference to campaigns._id
  influencer_id: ObjectId,          // Reference to influencer_profiles._id
  brand_id: ObjectId,               // Reference to brand_profiles._id
  status: "pending" | "accepted" | "rejected" | "completed",
  payment_amount: number,           // Agreed payment
  message: string,                  // Brand's invitation message
  influencer_response: string,      // Influencer's response (optional)
  created_at: Date,
  response_date: Date,              // Date accepted/rejected
  completed_date: Date,             // Date marked complete
}
```

**Flow**:
1. Brand invites influencer → `status: "pending"`
2. Influencer accepts → `status: "accepted"`
3. Campaign completes → `status: "completed"`
4. Payment processed → Earnings updated

---

#### 6. **notifications** Collection

```typescript
{
  _id: ObjectId,
  user_id: ObjectId,                // Reference to users._id
  type: "campaign_invite" | "payment_received" | "profile_approved" | "system",
  title: string,                    // Notification title
  content: string,                  // Notification body
  link: string,                     // URL to navigate to (optional)
  read: boolean,                    // Has user read it?
  created_at: Date,
}
```

**Notification Types**:
- Campaign invites
- Payment confirmations
- Account approvals
- System announcements

---

#### 7. **transactions** Collection

```typescript
{
  _id: ObjectId,
  user_id: ObjectId,                // Reference to users._id
  type: "earning" | "withdrawal" | "refund",
  amount: number,                   // Amount in USD
  status: "pending" | "approved" | "completed" | "rejected",
  campaign_id: ObjectId,            // Related campaign (optional)
  payment_method: string,           // "bank_transfer" | "paypal" | etc.
  notes: string,                    // Admin notes (optional)
  created_at: Date,
  processed_at: Date,               // Date approved/rejected
}
```

---

### Database Relationships

```
users (1) ──→ (1) brand_profiles
users (1) ──→ (1) influencer_profiles
users (1) ──→ (1) employee_profiles
users (1) ──→ (many) notifications
users (1) ──→ (many) transactions

brand_profiles (1) ──→ (many) campaigns
campaigns (1) ──→ (many) collaborations
influencer_profiles (1) ──→ (many) collaborations

campaigns (many) ──→ (many) influencer_profiles  [via collaborations]
```

---

## 🔐 Authentication System

### Authentication Flow Diagram

```
User Visit
    │
    ▼
┌───────────────────┐
│  Login Page       │
│  /login           │
└────────┬──────────┘
         │
         ├─────── Option 1: Google OAuth
         │              │
         │              ▼
         │        ┌──────────────────┐
         │        │ Google Login     │
         │        │ (OAuth 2.0)      │
         │        └────────┬─────────┘
         │                 │
         │                 ▼
         │        ┌──────────────────┐
         │        │ First time user? │
         │        └────────┬─────────┘
         │                 │
         │         Yes     │     No
         │         ┌───────┴───────┐
         │         ▼               ▼
         │    ┌─────────┐    ┌─────────┐
         │    │ Choose  │    │ Has     │
         │    │ Role    │    │ Role    │
         │    └────┬────┘    └────┬────┘
         │         │              │
         │         └──────┬───────┘
         │                ▼
         │        ┌──────────────────┐
         │        │ Check Status:    │
         │        │ ACTIVE?          │
         │        └────────┬─────────┘
         │                 │
         │          Yes    │    No
         │          ┌──────┴──────┐
         │          ▼             ▼
         │    ┌─────────┐   ┌──────────┐
         │    │ Portal  │   │ Pending  │
         │    │ Access  │   │ Approval │
         │    └─────────┘   └──────────┘
         │
         └─────── Option 2: Email/Password
                        │
                        ▼
                ┌──────────────────┐
                │ Credentials      │
                │ (email+password) │
                └────────┬─────────┘
                         │
                         ▼
                ┌──────────────────┐
                │ Verify password  │
                │ (bcrypt.compare) │
                └────────┬─────────┘
                         │
                  Valid  │  Invalid
                  ┌──────┴──────┐
                  ▼             ▼
            ┌─────────┐   ┌─────────┐
            │ Check   │   │ Error:  │
            │ Status  │   │ Invalid │
            └────┬────┘   └─────────┘
                 │
          Active │  Inactive/Suspended
          ┌──────┴──────┐
          ▼             ▼
    ┌─────────┐   ┌──────────┐
    │ Create  │   │ Error:   │
    │ Session │   │ Pending  │
    └────┬────┘   └──────────┘
         │
         ▼
┌──────────────────┐
│ JWT Token        │
│ (role, status)   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Middleware       │
│ Route Protection │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Role-Based       │
│ Portal Access    │
└──────────────────┘
```

### Authentication Providers

#### 1. **Google OAuth 2.0**

**Setup Requirements**:
1. Create project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URI: `https://yourdomain.com/api/auth/callback/google`
5. Set environment variables:
   ```bash
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

**Flow**:
1. User clicks "Sign in with Google"
2. Redirected to Google's login page
3. User authorizes app
4. Google redirects back with authorization code
5. NextAuth exchanges code for user info
6. User created/updated in database
7. JWT token issued
8. Session created

**Benefits**:
- No password management
- Trusted authentication
- One-click sign-in
- Automatic email verification

#### 2. **Credentials (Email/Password)**

**Registration Flow**:
1. User submits email + password
2. Password hashed with bcrypt (10 salt rounds)
3. User created in database with `status: "INACTIVE"`
4. Admin approves account → `status: "ACTIVE"`
5. User can now log in

**Login Flow**:
1. User submits email + password
2. Look up user by email
3. Verify password: `bcrypt.compare(password, hash)`
4. Check status (must be ACTIVE)
5. Create JWT token
6. Issue session

**Password Hashing**:
```typescript
// Registration
const hash = await bcrypt.hash(password, 10);
// 10 = salt rounds (higher = more secure but slower)

// Login
const isValid = await bcrypt.compare(password, hash);
// Returns true if password matches
```

### Session Management

**JWT Token Contents**:
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "brand",
  "status": "ACTIVE",
  "profileCompleted": true,
  "needsRole": false,
  "exp": 1234567890
}
```

**Token Lifecycle**:
1. Created on login
2. Stored in httpOnly cookie (prevents XSS)
3. Sent with every request
4. Validated by middleware
5. Expires after 24 hours
6. Refreshed on `session.update()`

**Security Features**:
- httpOnly cookies (JavaScript can't access)
- sameSite: "lax" (CSRF protection)
- Secure flag in production (HTTPS only)
- Secret key encryption (NEXTAUTH_SECRET)

### Middleware Protection

Every request passes through middleware:

```
Request → Middleware → Checks → Allow/Redirect
                         │
                         ├─ Is authenticated?
                         ├─ Has role?
                         ├─ Status = ACTIVE?
                         ├─ Profile completed?
                         └─ Role matches portal?
```

**Redirect Logic**:
- Not logged in → `/login`
- No role → `/auth/choose-role`
- Status ≠ ACTIVE → `/auth/pending-approval`
- Wrong portal → `/{correct_portal}`
- Profile incomplete → `/brand/profile-setup` or `/influencer/profile`

---

## 📡 API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/set-role` | Set role for Google users | Yes |
| POST | `/api/auth/[...nextauth]` | NextAuth handler | No |
| GET | `/api/auth/session` | Get current session | Yes |

**Example: Register**
```typescript
POST /api/auth/register
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "role": "brand"
}

Response:
{
  "success": true,
  "message": "Account created. Awaiting admin approval."
}
```

---

### Brand Portal Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/brand/campaigns` | List all brand campaigns | Yes (brand) |
| POST | `/api/brand/campaigns` | Create new campaign | Yes (brand) |
| GET | `/api/brand/campaigns/[id]` | Get single campaign | Yes (brand) |
| PUT | `/api/brand/campaigns/[id]` | Update campaign | Yes (brand) |
| DELETE | `/api/brand/campaigns/[id]` | Delete campaign | Yes (brand) |
| POST | `/api/brand/campaigns/[id]/invite` | Invite influencers | Yes (brand) |
| POST | `/api/brand/profile` | Update brand profile | Yes (brand) |
| POST | `/api/brand/recommend-influencers` | Get AI recommendations | Yes (brand) |
| POST | `/api/brand/chat-recommend` | Chatbot search | Yes (brand) |

**Example: Create Campaign**
```typescript
POST /api/brand/campaigns
Content-Type: application/json
Cookie: next-auth.session-token=...

{
  "name": "Summer Fashion Campaign",
  "description": "Promote new summer collection",
  "budget": 5000,
  "target_audience": {
    "age_range": "18-35",
    "gender": "female",
    "locations": ["US", "CA"],
    "interests": ["fashion", "lifestyle"]
  },
  "start_date": "2025-06-01",
  "end_date": "2025-08-31"
}

Response:
{
  "success": true,
  "campaign": {
    "_id": "...",
    "name": "Summer Fashion Campaign",
    "status": "draft",
    ...
  }
}
```

---

### Influencer Portal Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/influencer/profile` | Get influencer profile | Yes (influencer) |
| POST | `/api/influencer/profile` | Update profile | Yes (influencer) |
| POST | `/api/influencer/profile-setup` | Complete setup | Yes (influencer) |
| GET | `/api/influencer/posts` | Get Instagram posts | Yes (influencer) |
| POST | `/api/influencer/posts` | Sync Instagram | Yes (influencer) |
| POST | `/api/influencer/withdraw` | Withdraw earnings | Yes (influencer) |
| POST | `/api/influencer/instagram/connect` | Connect Instagram | Yes (influencer) |
| GET | `/api/influencer/instagram/callback` | OAuth callback | Yes (influencer) |
| POST | `/api/influencer/instagram/sync` | Sync metrics | Yes (influencer) |
| POST | `/api/influencer/instagram/disconnect` | Disconnect account | Yes (influencer) |

**Example: Connect Instagram**
```typescript
POST /api/influencer/instagram/connect

Response:
{
  "success": true,
  "authUrl": "https://www.facebook.com/v18.0/dialog/oauth?..."
}
// User redirected to Meta OAuth
// After authorization, callback handles token exchange
```

---

### Admin Portal Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/admin/users` | List all users | Yes (admin) |
| GET | `/api/admin/pending-users` | Pending approvals | Yes (admin) |
| POST | `/api/admin/verify-user` | Verify user | Yes (admin) |
| POST | `/api/admin/approve` | Approve account | Yes (admin) |
| GET | `/api/admin/transactions` | All transactions | Yes (admin) |
| POST | `/api/admin/transactions/[id]/approve` | Approve transaction | Yes (admin) |
| GET | `/api/admin/audit-logs` | System logs | Yes (admin) |

---

### AI Service Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/ai/sentiment-analysis` | Analyze comments | Yes |
| POST | `/api/ai/predict-roi` | Predict ROI | Yes (brand) |
| POST | `/api/ai/detect-fraud` | Detect anomalies | Yes (admin) |

**Example: Sentiment Analysis**
```typescript
POST /api/ai/sentiment-analysis
Content-Type: application/json

{
  "comments": [
    "Love this product!",
    "Not worth the money",
    "Pretty good quality"
  ]
}

Response:
{
  "success": true,
  "sentiment": {
    "positive": 66.7,  // 2 out of 3
    "neutral": 0,
    "negative": 33.3   // 1 out of 3
  },
  "breakdown": [
    { "text": "Love this product!", "sentiment": "positive", "score": 0.95 },
    { "text": "Not worth the money", "sentiment": "negative", "score": 0.88 },
    { "text": "Pretty good quality", "sentiment": "positive", "score": 0.72 }
  ]
}
```

---

### Collaboration Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/collaboration` | List invitations | Yes (influencer) |
| POST | `/api/collaboration` | Create invitation | Yes (brand) |
| POST | `/api/collaboration/[id]/action` | Accept/reject | Yes (influencer) |

---

### API Response Format

All API endpoints follow this format:

**Success Response**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

**HTTP Status Codes**:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (wrong role)
- `404` - Not Found
- `500` - Internal Server Error

---

## 🎨 Portal Features

### 1. Brand Portal (`/brand`)

**Dashboard Features**:
- Total campaigns count
- Active campaigns
- Total spend vs budget
- Average ROI
- Recent influencer recommendations
- Campaign performance charts

**Pages**:
1. **Campaigns** (`/brand/campaigns`)
   - Create new campaigns
   - View all campaigns (draft, active, completed)
   - Edit campaign details
   - Invite influencers
   - Track performance metrics

2. **Discover** (`/brand/discover`)
   - Search influencers by niche
   - Filter by followers, engagement rate
   - Filter by location, language
   - View influencer profiles
   - Send collaboration invitations

3. **Recommendations** (`/brand/recommendations`)
   - AI-powered influencer suggestions
   - Based on campaign goals
   - Compatibility scoring
   - One-click invite

4. **Analytics** (`/brand/analytics`)
   - Campaign performance over time
   - ROI analysis
   - Engagement rate trends
   - Sentiment analysis charts
   - Export reports

5. **Profile Setup** (`/brand/profile-setup`)
   - Company information
   - Industry selection
   - Brand description
   - Contact details

---

### 2. Influencer Portal (`/influencer`)

**Dashboard Features**:
- Total earnings
- Current balance
- Active collaborations
- Follower growth chart
- Engagement rate trends
- Recent notifications

**Pages**:
1. **Profile** (`/influencer/profile`)
   - Edit profile information
   - Connect Instagram account
   - Set pricing
   - Update availability
   - View verification status

2. **Earnings** (`/influencer/earnings`)
   - Total earned
   - Available balance
   - Pending payments
   - Withdrawal history
   - Request withdrawal

3. **Collaborations** (`/influencer/collaborations`)
   - Pending invitations
   - Active campaigns
   - Completed campaigns
   - Accept/reject invitations

4. **Posts** (`/influencer/posts`)
   - Instagram posts with metrics
   - Likes, comments, views
   - Engagement rate per post
   - Sync latest posts

5. **Insights** (`/influencer/insights`)
   - Audience demographics
   - Growth analytics
   - Performance metrics
   - Best performing content

---

### 3. Admin Portal (`/admin`)

**Dashboard Features**:
- Total users
- Pending approvals
- Total campaigns
- Total transactions
- System health
- Recent activity

**Pages**:
1. **Users** (`/admin/users`)
   - View all users
   - Filter by role
   - Search by email/name
   - View user details
   - Suspend/activate accounts

2. **Verification** (`/admin/verification`)
   - Pending user approvals
   - Approve/reject accounts
   - Verify influencer profiles
   - Review documentation

3. **Campaigns** (`/admin/campaigns`)
   - All campaigns oversight
   - Monitor performance
   - Flag issues
   - Generate reports

4. **Payments** (`/admin/payments`)
   - Pending withdrawals
   - Approve/reject payments
   - Transaction history
   - Payment disputes

5. **Fraud Detection** (`/admin/fraud`)
   - Anomaly detection alerts
   - Suspicious activity
   - Fake follower detection
   - Account investigations

6. **Audit Logs** (`/admin/audit-logs`)
   - System activity log
   - User actions
   - API requests
   - Error logs

---

### 4. Client Portal (`/client`)

**Dashboard Features**:
- Active projects
- Deliverables status
- Recent updates

**Pages**:
1. **Projects** - Software project tracking
2. **Deliverables** - Deliverable status
3. **Communication** - Messages with team

---

### 5. Employee Portal (`/employee`)

**Dashboard Features**:
- Tasks assigned
- Reports submitted
- Performance metrics

**Pages**:
1. **Tasks** - Task list and tracking
2. **Reporting** - Submit daily reports
3. **Performance** - Performance dashboard

---

## 🤖 AI & Machine Learning Features

### 1. **Influencer Discovery & Matching (OpenAI GPT-4)**

**Technology**: OpenAI GPT-4 with function calling

**How It Works**:
1. Brand describes campaign in natural language
2. GPT-4 extracts search criteria (niche, followers, engagement, location, budget)
3. Zod schema validates extracted criteria
4. MongoDB aggregation searches influencers
5. Scoring algorithm ranks results
6. Top matches returned with compatibility score

**Example**:
```
User: "I need fashion influencers in New York with 50k+ followers for a $10k campaign"

AI Extracts:
{
  "category": "fashion",
  "location": "New York",
  "minFollowers": 50000,
  "maxBudget": 10000
}

Database Query:
db.influencer_profiles.aggregate([
  { $match: { niche: /fashion/i, location: /new york/i, followers_count: { $gte: 50000 } } },
  { $addFields: { score: ... } },
  { $sort: { score: -1 } },
  { $limit: 10 }
])
```

**Files**:
- `lib/ai-helpers.ts` - OpenAI API wrapper
- `lib/extractCriteriaWithGemini.ts` - Query parsing
- `lib/searchInfluencersRobust.ts` - Search with scoring

---

### 2. **Conversational Chatbot (Google Gemini)**

**Technology**: Google Gemini 1.5 Flash (free tier)

**Features**:
- Natural language queries
- Intent detection
- Follow-up questions
- Search refinement
- Result formatting

**Example Conversation**:
```
User: "Find me beauty influencers"
Bot: "I found 45 beauty influencers. Would you like to filter by location or follower count?"

User: "Show me ones in California with over 100k followers"
Bot: "Here are 8 beauty influencers in California with 100k+ followers..."
```

**Files**:
- `lib/ai-gemini.ts` - Gemini API wrapper
- `lib/intentDetection.ts` - Intent classification
- `app/api/brand-chat-robust/route.ts` - Chatbot endpoint

---

### 3. **Sentiment Analysis (Python Flask Microservice)**

**Technology**: Python + Transformers (HuggingFace) or OpenAI

**Purpose**: Analyze campaign comments for sentiment

**How It Works**:
1. Collect comments from campaign posts
2. Send to AI microservice
3. Classify each comment: positive, neutral, negative
4. Calculate overall sentiment score
5. Display in dashboard

**Example**:
```python
# ai-microservice/app.py
from transformers import pipeline

sentiment_analyzer = pipeline("sentiment-analysis")

def analyze_sentiment(comments):
    results = []
    for comment in comments:
        result = sentiment_analyzer(comment)[0]
        results.append({
            "text": comment,
            "sentiment": result['label'],  # POSITIVE, NEGATIVE
            "score": result['score']       # 0-1 confidence
        })
    return results
```

---

### 4. **ROI Prediction (Machine Learning)**

**Technology**: Scikit-learn regression models

**Features**:
- Predicts campaign ROI based on historical data
- Factors: influencer engagement rate, follower count, niche, budget
- Trained on completed campaigns

**Formula (simplified)**:
```
Predicted ROI = (
  (Engagement Rate × 0.4) +
  (Follower Count / 10000 × 0.3) +
  (Niche Match Score × 0.2) +
  (Historical Performance × 0.1)
) × Budget Multiplier
```

---

### 5. **Fraud Detection (Anomaly Detection)**

**Technology**: Statistical analysis + rule-based

**Detects**:
- Fake followers (sudden spikes)
- Engagement manipulation (likes/comments mismatch)
- Duplicate accounts (same IP, email patterns)
- Suspicious transactions (unusual withdrawal patterns)

**Example Rules**:
```typescript
// Fake follower detection
if (follower_growth_last_week / avg_follower_growth > 5) {
  flag = "SUSPICIOUS_GROWTH";
}

// Engagement manipulation
if (engagement_rate > 20 && avg_comments < 10) {
  flag = "SUSPICIOUS_ENGAGEMENT";
}
```

---

## 🚀 Setup & Installation

### Prerequisites

- **Node.js** 18+ (20 recommended)
- **npm** or **yarn**
- **MongoDB** 7.0+ (local or Atlas)
- **Git**
- **Python 3.10+** (for AI microservice, optional)

### Step 1: Clone Repository

```bash
git clone https://github.com/contactporchest-debug/Porchest-Multiportal.git
cd Porchest-Multiportal
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

This installs all packages from `package.json`.

### Step 3: Environment Variables

Create `.env.local` in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` (see Environment Variables section below for details).

### Step 4: Database Setup

**Option A: MongoDB Atlas (Cloud)**
1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create free cluster
3. Get connection string
4. Add to `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/porchest_db?retryWrites=true&w=majority
   ```

**Option B: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB: `mongod`
3. Add to `.env.local`:
   ```
   MONGODB_URI=mongodb://localhost:27017/porchest_db
   ```

### Step 5: Create Database Indexes (Optional but Recommended)

```bash
npm run db:indexes
```

This creates indexes for better query performance.

### Step 6: Seed Sample Data (Optional)

```bash
npm run db:seed
```

This creates demo users and data for testing.

### Step 7: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Step 8: Set Up AI Microservice (Optional)

```bash
cd ai-microservice
pip install -r requirements.txt
python app.py
```

AI service runs on [http://localhost:5000](http://localhost:5000).

---

## 🔑 Environment Variables

Create `.env.local` with these variables:

### Required

```bash
# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/porchest_db

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key-here-min-32-chars

# Generate NEXTAUTH_SECRET:
# openssl rand -base64 32
```

### OAuth (Required for Google Login)

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Get from: https://console.cloud.google.com/
```

### Meta/Instagram Integration (Required for Instagram Features)

```bash
# Meta App
META_APP_ID=your-meta-app-id
META_APP_SECRET=your-meta-app-secret
META_REDIRECT_URI=http://localhost:3000/api/influencer/instagram/callback

# Get from: https://developers.facebook.com/
```

### AI Services (Required for AI Features)

```bash
# OpenAI API (for influencer recommendations)
OPENAI_API_KEY=sk-...

# Google Gemini API (for chatbot)
GEMINI_API_KEY=your-gemini-api-key

# AI Microservice URL
AI_SERVICE_URL=http://localhost:5000

# Get OpenAI key: https://platform.openai.com/api-keys
# Get Gemini key: https://ai.google.dev/
```

### Email (Optional, for Transactional Emails)

```bash
# SMTP Settings
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourapp.com
```

### Production

```bash
# Node Environment
NODE_ENV=production

# Security
JWT_SECRET=another-random-secret-key

# Cron Jobs
CRON_SECRET=secret-for-cron-endpoints
```

---

## 💻 Development Workflow

### Available Scripts

```bash
# Development
npm run dev          # Start dev server (localhost:3000)

# Building
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint

# Testing
npm test             # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report

# Database
npm run db:indexes   # Create MongoDB indexes
npm run db:seed      # Seed sample data
npm run db:migrate   # Run migrations
```

### Development Tips

1. **Hot Reload**: Code changes automatically reload the browser
2. **TypeScript**: Type errors shown in terminal and browser
3. **Server Components**: Default in Next.js 14 App Router
4. **API Routes**: Edit files in `app/api/`, changes apply immediately
5. **Environment Variables**: Restart dev server after changing `.env.local`

### File Naming Conventions

- **Pages**: `page.tsx`
- **Layouts**: `layout.tsx`
- **API Routes**: `route.ts`
- **Components**: PascalCase (e.g., `CampaignCard.tsx`)
- **Utilities**: camelCase (e.g., `formatCurrency.ts`)
- **Types**: PascalCase with `.d.ts` (e.g., `User.d.ts`)

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git push origin main
   ```

2. **Import on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repo
   - Vercel auto-detects Next.js

3. **Add Environment Variables**:
   - In Vercel dashboard → Settings → Environment Variables
   - Add all variables from `.env.local`

4. **Deploy**:
   - Vercel automatically deploys on every push
   - Production URL: `your-project.vercel.app`

### Deploy with Docker

**Build Image**:
```bash
docker build -t porchest-multiportal .
```

**Run Container**:
```bash
docker run -p 3000:3000 \
  -e MONGODB_URI=your_mongodb_uri \
  -e NEXTAUTH_SECRET=your_secret \
  porchest-multiportal
```

**Docker Compose** (with MongoDB + AI Service):
```bash
docker-compose up -d
```

This starts:
- Next.js app (port 3000)
- MongoDB (port 27017)
- Flask AI service (port 5000)

---

## 🧪 Testing

### Running Tests

```bash
# All tests
npm test

# Watch mode (re-run on file changes)
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Structure

```
__tests__/
├── api/                  # API route tests
│   ├── auth.test.ts      # Authentication endpoints
│   ├── brand.test.ts     # Brand endpoints
│   └── influencer.test.ts # Influencer endpoints
├── lib/                  # Library tests
│   ├── utils.test.ts     # Utility functions
│   └── validation.test.ts # Zod schemas
└── components/           # Component tests
    └── Button.test.tsx   # UI components
```

### Example Test

```typescript
// __tests__/api/auth.test.ts
import { POST } from '@/app/api/auth/register/route';

describe('POST /api/auth/register', () => {
  it('creates a new user', async () => {
    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        full_name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
        role: 'brand'
      })
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
  });
});
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **MongoDB Connection Failed**

**Error**: `MongoServerError: connection failed`

**Solutions**:
- Check `MONGODB_URI` in `.env.local`
- Ensure MongoDB is running (if local)
- Whitelist IP in MongoDB Atlas (if cloud)
- Check firewall settings

#### 2. **NextAuth Configuration Error**

**Error**: `[next-auth][error][NO_SECRET]`

**Solution**:
- Add `NEXTAUTH_SECRET` to `.env.local`
- Generate: `openssl rand -base64 32`

#### 3. **Build Fails with MongoDB Error**

**Error**: `MongoClient can only be used on the server`

**Solution**:
- Already fixed in `lib/mongodb.ts` with lazy loading
- Ensure `import "server-only"` is at top of file

#### 4. **Google OAuth Not Working**

**Error**: `redirect_uri_mismatch`

**Solution**:
- Add authorized redirect URI in Google Console:
  - `http://localhost:3000/api/auth/callback/google` (dev)
  - `https://yourdomain.com/api/auth/callback/google` (prod)

#### 5. **Instagram Connection Fails**

**Error**: `OAuthException`

**Solutions**:
- Ensure Meta app is in "Live" mode (not Development)
- Add Instagram Basic Display permissions
- Verify `META_REDIRECT_URI` matches exactly
- Check app is approved for `instagram_basic` permission

#### 6. **Type Errors in Development**

**Error**: TypeScript errors in terminal

**Solution**:
- Run `npm run build` to see all errors
- Fix type issues or use `// @ts-ignore` (not recommended)
- Check `tsconfig.json` for strict mode settings

---

## 📊 Performance Optimization

### Implemented Optimizations

1. **MongoDB Connection Pooling**: Reuses 2-10 connections
2. **Lazy Loading**: Database connects only when needed
3. **Server Components**: React rendering on server
4. **Image Optimization**: Next.js automatic image optimization
5. **Code Splitting**: Automatic route-based splitting
6. **Caching**: SWR for data fetching with stale-while-revalidate
7. **Edge Runtime**: Middleware runs on Vercel Edge (fast, global)

### Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **MongoDB Atlas Monitoring**: Query performance insights
- **Logger**: Custom logging in `lib/logger.ts`

---

## 📝 License

**Proprietary** - © 2025 Porchest. All rights reserved.

This is proprietary software. Unauthorized copying, distribution, or modification is prohibited.

---

## 🙋 Support

- **Email**: support@porchest.com
- **GitHub Issues**: [github.com/contactporchest-debug/Porchest-Multiportal/issues](https://github.com/contactporchest-debug/Porchest-Multiportal/issues)
- **Documentation**: This README

---

## 🎓 Learning Resources

### Next.js 14
- [Next.js Docs](https://nextjs.org/docs)
- [App Router](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

### Authentication
- [NextAuth.js Docs](https://next-auth.js.org/)
- [JWT Introduction](https://jwt.io/introduction)

### MongoDB
- [MongoDB Manual](https://www.mongodb.com/docs/manual/)
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript with React](https://react-typescript-cheatsheet.netlify.app/)

### AI/ML
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Google Gemini Docs](https://ai.google.dev/docs)

---

## 🗺 Roadmap

### Planned Features

- [ ] Multi-language support (i18n)
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Email campaigns
- [ ] Contract generation
- [ ] Video calls integration
- [ ] Payment gateway integration (Stripe)
- [ ] TikTok integration
- [ ] YouTube integration

---

## 👥 Contributors

- **Development Team**: Porchest Engineering
- **AI Integration**: Porchest AI Team
- **Design**: Porchest Design Team

---

## 📚 Additional Documentation

### Key Concepts Explained

#### What is Multi-Tenancy?
Multiple isolated user environments sharing the same infrastructure. Each "tenant" (role) has their own experience, but all use the same database and codebase.

#### What is RBAC?
Role-Based Access Control. Users are assigned roles (brand, influencer, admin), and their permissions are determined by their role.

#### What is JWT?
JSON Web Tokens. A compact, self-contained way to securely transmit information between parties as a JSON object. Used for stateless authentication.

#### What is OAuth?
Open Authorization. A standard for token-based authentication that allows third-party services (Google) to verify user identity without exposing passwords.

#### What is Server-Side Rendering (SSR)?
Rendering React components on the server before sending HTML to the client. Results in faster initial page loads and better SEO.

#### What is Edge Runtime?
A lightweight JavaScript runtime that runs code at the edge (closest to the user geographically). Used for middleware in this project.

---

**Last Updated**: January 2025
**Version**: 2.0.0
**Status**: Production Ready ✅

---

*This documentation is comprehensive and covers all aspects of the Porchest Multiportal platform. For specific questions or issues, please refer to the relevant sections above or contact support.*

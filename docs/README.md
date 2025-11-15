# Porchest Multiportal Documentation

Complete documentation for the Porchest Multiportal platform - a multi-portal influencer marketing management system.

---

## Quick Links

- [API Endpoints Reference](./API_ENDPOINTS_REFERENCE.md) - Complete API documentation
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Production deployment instructions
- [Environment Variables](./ENVIRONMENT_VARIABLES.md) - Configuration reference
- [System Architecture](./SYSTEM_ARCHITECTURE.md) - Technical architecture overview

---

## What is Porchest Multiportal?

Porchest Multiportal is a comprehensive influencer marketing platform that connects brands with influencers through a sophisticated multi-portal system. The platform handles campaign management, content tracking, payments, and analytics through specialized interfaces for different user roles.

### Key Features

- **5 Specialized Portals**: Admin, Brand, Influencer, Client, Employee
- **38 API Endpoints**: Complete REST API for all operations
- **14 MongoDB Collections**: Comprehensive data model with 29 indexes
- **Real-time Analytics**: Campaign and influencer performance tracking
- **AI-Powered Features**: Sentiment analysis, fraud detection, ROI prediction
- **Automated Workflows**: Email notifications and event-driven automation
- **Audit Trail**: Complete system activity logging

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB 6+ (or MongoDB Atlas account)
- npm 9+

### Quick Start

```bash
# Clone repository
git clone https://github.com/your-org/Porchest-Multiportal.git
cd Porchest-Multiportal

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your configuration

# Create database indexes
npm run db:indexes

# Start development server
npm run dev
```

Visit `http://localhost:3000`

---

## Platform Overview

### User Roles

**Admin**
- Approve/reject user registrations
- Oversee all platform activity
- Manage transactions and payments
- View audit logs and fraud detection
- System-wide analytics access

**Brand**
- Create and manage campaigns
- Discover and invite influencers
- Track campaign performance
- Request ROI predictions
- Manage brand profile

**Influencer**
- Manage influencer profile
- Accept/reject campaign invitations
- Submit content posts with analytics
- Track earnings and request withdrawals
- View performance metrics

**Client**
- View associated campaigns (read-only)
- Track project progress
- Manage project deliverables
- Monitor campaign results

**Employee**
- Submit daily work reports
- Access internal tools
- Support operations

---

## Architecture Highlights

### Technology Stack

**Frontend**:
- Next.js 14 (App Router)
- React 18
- Tailwind CSS + shadcn/ui
- TypeScript

**Backend**:
- Next.js API Routes
- MongoDB with Native Driver
- NextAuth.js v5
- Zod validation

**Infrastructure**:
- Vercel-ready deployment
- Docker support
- MongoDB Atlas integration
- Email automation (NodeMailer ready)

### Data Model

**14 Collections**:
- `users` - Authentication and user profiles
- `campaigns` - Campaign management
- `collaboration_requests` - Influencer invitations
- `posts` - Content submissions
- `brand_profiles` - Brand information
- `influencer_profiles` - Influencer information
- `transactions` - Payments and withdrawals
- `notifications` - User notifications
- `audit_logs` - System audit trail
- `analytics` - Cached analytics data
- `fraud_detections` - AI fraud detection results
- `projects` - Client project tracking
- `payments` - Payment history
- `daily_reports` - Employee reports

**29 Indexes** for optimal query performance

---

## API Overview

### Authentication

```bash
POST /api/auth/register
POST /api/auth/[...nextauth]
GET  /api/auth/session
```

### Admin Endpoints

```bash
GET  /api/admin/pending-users
POST /api/admin/verify-user
GET  /api/admin/users
GET  /api/admin/transactions
PUT  /api/admin/transactions/[id]/approve
GET  /api/admin/audit-logs
```

### Brand Endpoints

```bash
GET    /api/brand/campaigns
POST   /api/brand/campaigns
GET    /api/brand/campaigns/[id]
POST   /api/brand/campaigns/[id]/invite
GET    /api/brand/profile
PUT    /api/brand/profile
POST   /api/brand/recommend-influencers
```

### Influencer Endpoints

```bash
GET  /api/influencer/profile
PUT  /api/influencer/profile
GET  /api/influencer/posts
POST /api/influencer/posts
POST /api/influencer/withdraw
```

### Analytics Endpoints

```bash
GET /api/analytics/campaigns/[id]
GET /api/analytics/influencers/[id]
```

### AI Endpoints

```bash
POST /api/ai/sentiment-analysis
POST /api/ai/detect-fraud
POST /api/ai/predict-roi
```

See [API_ENDPOINTS_REFERENCE.md](./API_ENDPOINTS_REFERENCE.md) for complete documentation.

---

## Key Workflows

### 1. User Registration & Approval

```
User Registers → Pending Status → Admin Reviews → Approve/Reject →
Email Notification → User Can Login
```

### 2. Campaign Creation & Influencer Invitation

```
Brand Creates Campaign → Invite Influencers → Notifications Sent →
Influencer Accepts → Collaboration Active
```

### 3. Post Submission & Analytics

```
Influencer Submits Post → Engagement Calculated → Campaign Metrics Updated →
Brand Notified → Analytics Available
```

### 4. Withdrawal Process

```
Influencer Requests Withdrawal → Balance Deducted → Admin Reviews →
Approve/Reject → Email Notification → Payment Processed (if approved)
```

---

## Automation Features

### Email Notifications

Automated emails for:
- Account approval/rejection
- Campaign invitations
- Post submissions
- Withdrawal approvals/rejections
- Payment confirmations

### Background Jobs

Scheduled maintenance:
- Cleanup expired notifications (daily)
- Update influencer stats (daily)
- Update campaign metrics (every 30 min)
- Archive old campaigns (weekly)
- Send collaboration reminders (daily)

### Event Triggers

Automatic actions on:
- User verification
- Campaign invitations
- Post submissions
- Transaction approvals
- Collaboration acceptance

---

## Security Features

- **Authentication**: NextAuth.js with JWT tokens
- **Authorization**: Role-based access control (RBAC)
- **Rate Limiting**: IP-based, configurable per endpoint
- **Input Validation**: Zod schemas for all requests
- **Data Sanitization**: Sensitive fields removed from responses
- **Audit Logging**: All critical actions logged
- **Password Hashing**: bcrypt with 10 salt rounds
- **HTTPS**: Enforced in production

---

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suite
npm test -- __tests__/api
```

**Test Coverage**:
- 232 tests passing
- Unit tests for all utilities
- API endpoint validation tests
- Business logic tests

---

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Docker

```bash
docker-compose up -d
```

### Traditional VPS

```bash
npm run build
pm2 start npm --name "porchest" -- start
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## Environment Configuration

Required variables:
```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key
MONGODB_URI=mongodb+srv://...
```

Optional but recommended:
```env
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

See [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) for complete reference.

---

## Performance

- **Response Time**: < 200ms average
- **Concurrent Users**: 100+ tested
- **Database**: Optimized with 29 indexes
- **Rate Limiting**: 100 req/min (configurable)
- **Build Size**: ~88KB First Load JS

---

## Monitoring

### Health Check

```bash
GET /api/health
```

Returns database connection status and system health.

### Logs

- Structured logging with Winston
- Log levels: error, warn, info, debug
- JSON format for parsing

### Metrics

- Request count by endpoint
- Response times
- Error rates
- Database query performance

---

## Development Guidelines

### Code Structure

```
app/
  ├── (auth)/          # Auth pages
  ├── admin/           # Admin portal
  ├── brand/           # Brand portal
  ├── influencer/      # Influencer portal
  ├── client/          # Client portal
  ├── employee/        # Employee portal
  └── api/             # API routes

lib/
  ├── auth.ts          # Authentication
  ├── db.ts            # Database utilities
  ├── email.ts         # Email service
  ├── automation.ts    # Event automation
  ├── jobs.ts          # Background jobs
  └── validations.ts   # Zod schemas

components/
  ├── ui/              # shadcn/ui components
  └── *.tsx            # Custom components
```

### Best Practices

1. **Always validate input** with Zod schemas
2. **Check authentication** before processing requests
3. **Verify authorization** based on user role
4. **Log critical actions** to audit_logs
5. **Handle errors gracefully** with proper error responses
6. **Use TypeScript** for type safety
7. **Write tests** for new features
8. **Document** API changes

---

## Troubleshooting

### Common Issues

**Database connection failed**:
- Verify `MONGODB_URI` is correct
- Check network access in MongoDB Atlas
- Ensure database user has permissions

**Auth errors**:
- Regenerate `NEXTAUTH_SECRET`
- Verify `NEXTAUTH_URL` matches your domain
- Clear browser cookies

**Email not sending**:
- Check SMTP credentials
- Enable "less secure apps" or use app password for Gmail
- Verify EMAIL_* environment variables

**Build failures**:
- Clear `.next` folder: `rm -rf .next`
- Delete node_modules: `rm -rf node_modules && npm install`
- Increase Node memory: `NODE_OPTIONS="--max-old-space-size=4096" npm run build`

---

## Support & Contributing

### Documentation

- [API Reference](./API_ENDPOINTS_REFERENCE.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Architecture Overview](./SYSTEM_ARCHITECTURE.md)
- [Environment Variables](./ENVIRONMENT_VARIABLES.md)

### Getting Help

- GitHub Issues: [Report bugs or request features](https://github.com/your-org/Porchest-Multiportal/issues)
- Email: support@your-domain.com
- Documentation: [docs/](./docs/)

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

---

## License

[Your License Here]

---

## Project Status

**Version**: 1.0.0
**Status**: Production Ready
**Last Updated**: 2025-11-15

### Completed Features

- ✅ Multi-portal system (5 portals)
- ✅ Complete API (38 endpoints)
- ✅ MongoDB integration (14 collections, 29 indexes)
- ✅ Authentication & authorization
- ✅ Profile auto-creation
- ✅ Campaign management
- ✅ Influencer discovery & invitation
- ✅ Post submission & analytics
- ✅ Payment & withdrawal system
- ✅ Notification system
- ✅ Audit logging
- ✅ AI endpoints (sentiment, fraud, ROI)
- ✅ Email automation
- ✅ Background jobs
- ✅ Comprehensive testing (232 tests)
- ✅ Complete documentation

### Future Enhancements

- Real-time notifications (WebSocket/SSE)
- Payment gateway integration (Stripe/PayPal)
- Mobile applications
- Advanced ML model integration
- Custom reporting and BI tools

---

**Built with ❤️ using Next.js, React, MongoDB, and TypeScript**

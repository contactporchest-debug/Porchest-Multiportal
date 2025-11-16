# Deployment Guide

Complete guide for deploying Porchest Multiportal to production.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Post-Deployment](#post-deployment)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **MongoDB**: v6.0 or higher (or MongoDB Atlas account)
- **Git**: For version control

### Optional but Recommended
- **Docker**: For containerized deployment
- **Redis**: For job queues (BullMQ)
- **SMTP Server**: For email notifications

---

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/Porchest-Multiportal.git
cd Porchest-Multiportal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) for details):

```env
# Auth Configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key-min-32-characters

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/porchest_db

# Optional: OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Configuration
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@your-domain.com

# Environment
NODE_ENV=production
```

---

## Database Setup

### Option 1: MongoDB Atlas (Recommended for Production)

1. **Create MongoDB Atlas Account**
   - Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free tier cluster (M0) or paid tier

2. **Configure Network Access**
   - Add your IP address or use `0.0.0.0/0` for testing
   - For production, whitelist only your server IPs

3. **Create Database User**
   - Create a database user with read/write permissions
   - Use a strong password

4. **Get Connection String**
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/porchest_db?retryWrites=true&w=majority
   ```

5. **Create Indexes**
   ```bash
   npm run db:indexes
   ```

### Option 2: Self-Hosted MongoDB

1. **Install MongoDB**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install mongodb-org

   # macOS
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. **Start MongoDB**
   ```bash
   sudo systemctl start mongod
   ```

3. **Create Database**
   ```bash
   mongosh
   use porchest_db
   ```

4. **Create Indexes**
   ```bash
   npm run db:indexes
   ```

---

## Local Development

### 1. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### 2. Build and Test

```bash
# Build production bundle
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### 3. Verify Setup

- Visit `/api/health` to check database connection
- Register a test user
- Verify email configuration (if enabled)

---

## Production Deployment

### Option 1: Vercel (Recommended for Next.js)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Configure Environment Variables**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add all variables from `.env`

5. **Configure MongoDB Atlas**
   - Add Vercel IP ranges to MongoDB Atlas whitelist
   - Or use `0.0.0.0/0` with strong authentication

6. **Set Up Cron Jobs** (Optional)
   - Create `vercel.json`:
   ```json
   {
     "crons": [
       {
         "path": "/api/cron/cleanup-notifications",
         "schedule": "0 2 * * *"
       },
       {
         "path": "/api/cron/update-metrics",
         "schedule": "*/30 * * * *"
       }
     ]
   }
   ```

### Option 2: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine

   WORKDIR /app

   COPY package*.json ./
   RUN npm ci --only=production

   COPY . .
   RUN npm run build

   EXPOSE 3000

   CMD ["npm", "start"]
   ```

2. **Create docker-compose.yml**
   ```yaml
   version: '3.8'

   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - MONGODB_URI=${MONGODB_URI}
         - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
         - NEXTAUTH_URL=${NEXTAUTH_URL}
       depends_on:
         - mongodb

     mongodb:
       image: mongo:6
       ports:
         - "27017:27017"
       volumes:
         - mongodb_data:/data/db
       environment:
         - MONGO_INITDB_ROOT_USERNAME=admin
         - MONGO_INITDB_ROOT_PASSWORD=password

   volumes:
     mongodb_data:
   ```

3. **Build and Run**
   ```bash
   docker-compose up -d
   ```

### Option 3: Traditional VPS (Ubuntu/Debian)

1. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Install PM2** (Process Manager)
   ```bash
   sudo npm install -g pm2
   ```

3. **Clone and Build**
   ```bash
   git clone https://github.com/your-org/Porchest-Multiportal.git
   cd Porchest-Multiportal
   npm install
   npm run build
   ```

4. **Start with PM2**
   ```bash
   pm2 start npm --name "porchest" -- start
   pm2 save
   pm2 startup
   ```

5. **Configure Nginx** (Reverse Proxy)
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Enable HTTPS with Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## Post-Deployment

### 1. Create Admin Account

**Method 1: Direct Database Insert**
```javascript
// In MongoDB shell or via script
db.users.insertOne({
  email: "admin@your-domain.com",
  password_hash: "$2a$10$...", // Use bcrypt to hash password
  role: "admin",
  full_name: "System Admin",
  status: "active",
  verified: true,
  created_at: new Date(),
  updated_at: new Date()
})
```

**Method 2: Via Registration + Manual Update**
1. Register via `/register` with role "admin"
2. Update in database:
   ```javascript
   db.users.updateOne(
     { email: "admin@your-domain.com" },
     { $set: { status: "active", verified: true } }
   )
   ```

### 2. Verify Database Indexes

```bash
npm run db:indexes
```

### 3. Test Critical Flows

- [ ] User registration and login
- [ ] Admin approval workflow
- [ ] Campaign creation
- [ ] Influencer invitation
- [ ] Post submission
- [ ] Withdrawal request
- [ ] Email notifications (if configured)

### 4. Configure Background Jobs

**Option A: Vercel Cron**
- Add cron endpoints to `vercel.json`

**Option B: PM2 Cron**
```javascript
// cron.js
const { executeAllJobs } = require('./lib/jobs')

executeAllJobs().then(() => process.exit(0))
```

```bash
# Add to crontab
0 2 * * * cd /path/to/app && node cron.js
```

**Option C: BullMQ** (Recommended for scale)
- Install Redis
- Configure BullMQ job processor
- Create worker process

### 5. Set Up Monitoring

**Application Monitoring**:
- **Sentry**: Error tracking
- **LogRocket**: User session replay
- **DataDog**: Infrastructure monitoring

**Database Monitoring**:
- MongoDB Atlas built-in monitoring
- Custom metrics via MongoDB queries

**Uptime Monitoring**:
- Uptime Robot
- Pingdom
- StatusCake

---

## Monitoring & Maintenance

### Regular Maintenance Tasks

**Daily**:
- Check error logs
- Monitor database performance
- Review failed transactions

**Weekly**:
- Review audit logs
- Check disk space
- Backup database

**Monthly**:
- Update dependencies (`npm update`)
- Review security advisories
- Analyze performance metrics

### Backup Strategy

**Automated Backups** (MongoDB Atlas):
```
- Frequency: Daily
- Retention: 30 days
- Point-in-time restore: Enabled
```

**Manual Backups**:
```bash
# Export database
mongodump --uri="mongodb+srv://..." --out=./backup

# Import database
mongorestore --uri="mongodb+srv://..." ./backup
```

### Scaling Considerations

**Horizontal Scaling**:
- Deploy multiple Next.js instances
- Use load balancer (nginx, AWS ELB)
- MongoDB read replicas

**Vertical Scaling**:
- Upgrade server resources
- Increase MongoDB tier

**Caching**:
- Implement Redis for sessions
- Cache frequently accessed data
- CDN for static assets

---

## Troubleshooting

### Common Issues

**1. "Database connection failed"**
```bash
# Check MongoDB connection string
echo $MONGODB_URI

# Test connection
mongosh "$MONGODB_URI"

# Verify network access (MongoDB Atlas)
# Add your IP to whitelist
```

**2. "NextAuth session error"**
```bash
# Regenerate NEXTAUTH_SECRET
openssl rand -base64 32

# Ensure NEXTAUTH_URL matches your domain
# Include https:// in production
```

**3. "Build fails with memory error"**
```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

**4. "Rate limit errors"**
```typescript
// Adjust rate limits in lib/rate-limit.ts
export const RATE_LIMIT_CONFIGS = {
  DEFAULT: { maxRequests: 200, windowMs: 60000 },
  // ...
}
```

**5. "Email not sending"**
```bash
# Verify SMTP credentials
# Check EMAIL_SERVER_* variables
# Enable "less secure apps" for Gmail
# Or use app-specific password
```

### Debug Mode

Enable detailed logging:

```env
NODE_ENV=development
LOG_LEVEL=debug
```

Check logs:
```bash
# PM2 logs
pm2 logs porchest

# Vercel logs
vercel logs

# Docker logs
docker-compose logs -f app
```

---

## Security Checklist

- [ ] Use HTTPS in production (`NEXTAUTH_URL=https://...`)
- [ ] Set strong `NEXTAUTH_SECRET` (32+ characters)
- [ ] Use environment variables, never commit secrets
- [ ] Enable MongoDB authentication
- [ ] Restrict MongoDB network access
- [ ] Keep dependencies updated (`npm audit`)
- [ ] Enable CORS restrictions
- [ ] Implement rate limiting (already configured)
- [ ] Regular security audits
- [ ] Monitor for suspicious activity

---

## Performance Optimization

1. **Enable Caching**
   - Static assets via CDN
   - API responses (where appropriate)
   - Database query results

2. **Optimize Images**
   - Use Next.js Image component
   - WebP format
   - Lazy loading

3. **Database Optimization**
   - Ensure all indexes are created
   - Monitor slow queries
   - Implement pagination everywhere

4. **Bundle Size**
   - Tree shaking enabled (default in Next.js)
   - Code splitting
   - Dynamic imports for large components

---

## Support

For deployment assistance:
- Documentation: [docs/](./docs)
- Issues: [GitHub Issues](https://github.com/your-org/Porchest-Multiportal/issues)
- Email: support@your-domain.com

# Porchest Multiportal - Deployment Guide

## Table of Contents
1. [Environment Setup](#environment-setup)
2. [Local Development](#local-development)
3. [Production Deployment](#production-deployment)
4. [AI Microservice Deployment](#ai-microservice-deployment)
5. [Database Setup](#database-setup)
6. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Environment Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB 7.0+
- Python 3.11+ (for AI microservice)
- Docker & Docker Compose (optional, for containerized deployment)

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# App Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# Database
MONGODB_URI=mongodb://localhost:27017/porchest_db

# OAuth Providers
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Email Configuration (Optional - for magic links)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=<your-email@gmail.com>
EMAIL_SERVER_PASSWORD=<your-app-password>
EMAIL_FROM=noreply@porchest.com

# AI Microservice
AI_SERVICE_URL=http://localhost:5000

# Optional
NODE_ENV=development
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## Local Development

### Method 1: Standard Node.js Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Start MongoDB:**
```bash
# Using Docker
docker run -d -p 27017:27017 --name porchest-mongo mongo:7.0

# Or use local MongoDB installation
mongod --dbpath /path/to/data
```

3. **Run development server:**
```bash
npm run dev
```

4. **Access the application:**
- Frontend: http://localhost:3000
- API: http://localhost:3000/api

### Method 2: Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

This will start:
- Next.js app on port 3000
- MongoDB on port 27017
- AI microservice on port 5000

---

## Production Deployment

### Option 1: Vercel (Recommended for Next.js)

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Configure environment variables in Vercel dashboard:**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`

3. **Deploy:**
```bash
vercel --prod
```

4. **Configure MongoDB Atlas:**
   - Create cluster at https://cloud.mongodb.com
   - Whitelist Vercel IP addresses
   - Update `MONGODB_URI` in Vercel environment

### Option 2: Custom Server Deployment

**Using PM2 (Process Manager):**

1. **Install PM2:**
```bash
npm install -g pm2
```

2. **Build the application:**
```bash
npm run build
```

3. **Start with PM2:**
```bash
pm2 start npm --name "porchest-app" -- start
pm2 save
pm2 startup
```

**Using Nginx as Reverse Proxy:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;

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

### Option 3: Docker Deployment

1. **Build Docker image:**
```bash
docker build -t porchest-app .
```

2. **Run container:**
```bash
docker run -d \
  -p 3000:3000 \
  -e MONGODB_URI=<your-mongodb-uri> \
  -e NEXTAUTH_URL=https://yourdomain.com \
  -e NEXTAUTH_SECRET=<your-secret> \
  --name porchest-app \
  porchest-app
```

---

## AI Microservice Deployment

### Option 1: Separate Python Server

1. **Navigate to AI microservice:**
```bash
cd ai-microservice
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Run with Gunicorn:**
```bash
gunicorn --bind 0.0.0.0:5000 --workers 4 app:app
```

### Option 2: Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create new app
heroku create porchest-ai-service

# Deploy
git subtree push --prefix ai-microservice heroku main

# Set environment variables
heroku config:set MONGODB_URI=<your-mongodb-uri>
```

### Option 3: Deploy to Railway

1. Create new project on Railway.app
2. Connect GitHub repository
3. Set root directory to `ai-microservice`
4. Railway will auto-detect Python and deploy

### Option 4: AWS Lambda (Serverless)

Use Zappa or AWS SAM to deploy Flask as Lambda function.

---

## Database Setup

### MongoDB Atlas (Production)

1. **Create cluster:**
   - Go to https://cloud.mongodb.com
   - Create free M0 cluster
   - Create database user
   - Whitelist IP addresses

2. **Get connection string:**
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/porchest_db?retryWrites=true&w=majority
```

3. **Create indexes for better performance:**
```javascript
// Connect to MongoDB and run:
db.users.createIndex({ email: 1 })
db.users.createIndex({ role: 1, status: 1 })
db.campaigns.createIndex({ brand_id: 1, status: 1 })
db.influencer_profiles.createIndex({ user_id: 1 })
db.collaboration_requests.createIndex({ brand_id: 1 })
db.collaboration_requests.createIndex({ influencer_id: 1 })
```

### Seed Data (Optional)

Create sample data for testing:

```bash
node scripts/seed-database.js
```

---

## Monitoring & Maintenance

### Logging

**Production logging setup:**

```javascript
// Add to next.config.js
module.exports = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}
```

**Use logging service:**
- Vercel Analytics (built-in for Vercel)
- LogRocket
- Sentry for error tracking

### Performance Monitoring

1. **Vercel Analytics:**
   - Automatically enabled on Vercel
   - View in dashboard

2. **Custom monitoring:**
```bash
npm install @vercel/analytics
```

3. **Database monitoring:**
   - MongoDB Atlas provides built-in monitoring
   - Set up alerts for high CPU/memory usage

### Backup Strategy

**Automated MongoDB Backups:**

```bash
# Daily backup script
mongodump --uri="<MONGODB_URI>" --out=/backups/$(date +%Y%m%d)

# Restore backup
mongorestore --uri="<MONGODB_URI>" /backups/20250115
```

**Using MongoDB Atlas:**
- Continuous backups enabled by default
- Point-in-time recovery available
- Configure backup schedule in Atlas dashboard

### Health Checks

Create health check endpoint:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  })
}
```

Monitor with:
- UptimeRobot
- Pingdom
- Custom scripts

---

## Troubleshooting

### Common Issues

**1. MongoDB Connection Failed:**
```
Solution: Check MONGODB_URI, ensure IP whitelisting, verify credentials
```

**2. Auth.js Session Issues:**
```
Solution: Verify NEXTAUTH_SECRET is set, check NEXTAUTH_URL matches deployment URL
```

**3. Build Failures:**
```
Solution: Clear .next folder, delete node_modules, reinstall dependencies
```

**4. API Rate Limiting:**
```
Solution: Implement Redis-based rate limiting or use Upstash
```

---

## Security Checklist

- [ ] NEXTAUTH_SECRET is strong and unique
- [ ] MongoDB has authentication enabled
- [ ] API routes have proper authorization
- [ ] CORS is properly configured
- [ ] Environment variables are not committed to Git
- [ ] SSL/HTTPS is enabled in production
- [ ] Rate limiting is implemented
- [ ] Input validation on all forms
- [ ] SQL injection protection (using Mongoose)
- [ ] XSS protection enabled

---

## Scaling

### Horizontal Scaling

1. **Load Balancer:**
   - Use Vercel (auto-scaling)
   - Or configure Nginx with multiple instances

2. **Database Scaling:**
   - MongoDB Atlas auto-scales
   - Consider sharding for large datasets

3. **Caching:**
   - Implement Redis for session storage
   - Use CDN for static assets

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/contactporchest-debug/Porchest-Multiportal/issues
- Email: support@porchest.com
- Documentation: https://docs.porchest.com

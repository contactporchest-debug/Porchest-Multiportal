# Environment Variables

Complete reference for all environment variables used in Porchest Multiportal.

---

## Quick Start

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

---

## Required Variables

### Authentication (NextAuth.js)

#### `NEXTAUTH_URL`
**Required**: Yes
**Type**: String (URL)
**Description**: The canonical URL of your application

**Development**:
```env
NEXTAUTH_URL=http://localhost:3000
```

**Production**:
```env
NEXTAUTH_URL=https://your-domain.com
```

**Notes**:
- Must include protocol (`http://` or `https://`)
- Must match your actual domain
- Required for OAuth callbacks

---

#### `NEXTAUTH_SECRET`
**Required**: Yes
**Type**: String (min 32 characters)
**Description**: Secret key for encrypting JWT tokens

**Generate**:
```bash
openssl rand -base64 32
```

**Example**:
```env
NEXTAUTH_SECRET=veryLongRandomStringAtLeast32CharactersLong123456789
```

**Notes**:
- Keep this secret and never commit to version control
- Changing this will invalidate all existing sessions
- Use different secrets for dev/staging/production

---

### Database

#### `MONGODB_URI`
**Required**: Yes
**Type**: String (MongoDB connection string)
**Description**: MongoDB database connection URL

**MongoDB Atlas** (recommended):
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/porchestDB?retryWrites=true&w=majority
```

**Local MongoDB**:
```env
MONGODB_URI=mongodb://localhost:27017/porchestDB
```

**Docker MongoDB**:
```env
MONGODB_URI=mongodb://admin:password@mongodb:27017/porchestDB?authSource=admin
```

**Notes**:
- URL-encode special characters in password
- Database name defaults to `porchestDB`
- Connection pooling is automatically configured

---

## Optional Variables

### OAuth Providers

#### `GOOGLE_CLIENT_ID`
**Required**: No (if using Google OAuth)
**Type**: String
**Description**: Google OAuth client ID

**Get from**: [Google Cloud Console](https://console.cloud.google.com/)

```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

---

#### `GOOGLE_CLIENT_SECRET`
**Required**: No (if using Google OAuth)
**Type**: String
**Description**: Google OAuth client secret

```env
GOOGLE_CLIENT_SECRET=GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ
```

**Notes**:
- Required if `GOOGLE_CLIENT_ID` is set
- Configure OAuth redirect URIs in Google Console:
  - Development: `http://localhost:3000/api/auth/callback/google`
  - Production: `https://your-domain.com/api/auth/callback/google`

---

### Email Configuration

#### `EMAIL_SERVER_HOST`
**Required**: No (if using email features)
**Type**: String
**Description**: SMTP server hostname

**Common providers**:
```env
# Gmail
EMAIL_SERVER_HOST=smtp.gmail.com

# SendGrid
EMAIL_SERVER_HOST=smtp.sendgrid.net

# AWS SES
EMAIL_SERVER_HOST=email-smtp.us-east-1.amazonaws.com

# Custom SMTP
EMAIL_SERVER_HOST=mail.your-domain.com
```

---

#### `EMAIL_SERVER_PORT`
**Required**: No
**Type**: Number
**Default**: 587
**Description**: SMTP server port

```env
EMAIL_SERVER_PORT=587  # TLS (recommended)
EMAIL_SERVER_PORT=465  # SSL
EMAIL_SERVER_PORT=25   # Non-encrypted (not recommended)
```

---

#### `EMAIL_SERVER_USER`
**Required**: No (if using email)
**Type**: String
**Description**: SMTP authentication username

```env
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_USER=apikey  # SendGrid
```

---

#### `EMAIL_SERVER_PASSWORD`
**Required**: No (if using email)
**Type**: String
**Description**: SMTP authentication password

**Gmail**:
```env
# Use app-specific password, not regular password
EMAIL_SERVER_PASSWORD=abcd efgh ijkl mnop
```

**SendGrid**:
```env
EMAIL_SERVER_PASSWORD=SG.aBcDeFgHiJkLmNoPqRsTuVwXyZ
```

**Notes**:
- Gmail requires "App Password" (2FA must be enabled)
- Never use plain Gmail password

---

#### `EMAIL_FROM`
**Required**: No
**Type**: String (email address)
**Default**: Uses `EMAIL_SERVER_USER`
**Description**: "From" address for outgoing emails

```env
EMAIL_FROM=noreply@your-domain.com
EMAIL_FROM="Porchest Support" <support@your-domain.com>
```

---

### Application Configuration

#### `NODE_ENV`
**Required**: No
**Type**: String
**Default**: `development`
**Description**: Node environment mode

```env
NODE_ENV=development  # Local development
NODE_ENV=production   # Production deployment
NODE_ENV=test         # Running tests
```

**Effects**:
- `development`: Hot reload, detailed errors, debug logging
- `production`: Optimized build, minimal logging, error pages
- `test`: Test database, mocked services

---

#### `JWT_SECRET`
**Required**: No
**Type**: String
**Description**: Legacy JWT secret (for backward compatibility)

```env
JWT_SECRET=your-jwt-secret-key
```

**Notes**:
- Used by older authentication code
- `NEXTAUTH_SECRET` is preferred
- Can be the same value as `NEXTAUTH_SECRET`

---

### AI Microservice (Optional)

#### `AI_SERVICE_URL`
**Required**: No
**Type**: String (URL)
**Default**: `http://localhost:5000`
**Description**: URL of Python AI microservice

```env
AI_SERVICE_URL=http://localhost:5000          # Local
AI_SERVICE_URL=http://ai-service:5000         # Docker
AI_SERVICE_URL=https://ai.your-domain.com     # Production
```

**Notes**:
- Currently, AI endpoints use rule-based logic
- Set this when integrating ML models
- See AI service documentation for deployment

---

### Feature Flags (Optional)

#### `ENABLE_EMAIL_NOTIFICATIONS`
**Required**: No
**Type**: Boolean
**Default**: `true`
**Description**: Enable/disable email notifications

```env
ENABLE_EMAIL_NOTIFICATIONS=true   # Emails will be sent
ENABLE_EMAIL_NOTIFICATIONS=false  # Emails logged only (stub mode)
```

---

#### `ENABLE_FRAUD_DETECTION`
**Required**: No
**Type**: Boolean
**Default**: `true`
**Description**: Enable AI fraud detection

```env
ENABLE_FRAUD_DETECTION=true
```

---

#### `ENABLE_ANALYTICS`
**Required**: No
**Type**: Boolean
**Default**: `true`
**Description**: Enable analytics endpoints

```env
ENABLE_ANALYTICS=true
```

---

### Logging & Monitoring

#### `LOG_LEVEL`
**Required**: No
**Type**: String
**Default**: `info`
**Description**: Application logging level

```env
LOG_LEVEL=error   # Errors only
LOG_LEVEL=warn    # Warnings and errors
LOG_LEVEL=info    # Info, warnings, errors (default)
LOG_LEVEL=debug   # Detailed debugging
LOG_LEVEL=trace   # Very verbose
```

---

#### `SENTRY_DSN`
**Required**: No
**Type**: String
**Description**: Sentry error tracking DSN

```env
SENTRY_DSN=https://abc123@o123456.ingest.sentry.io/123456
```

---

### Rate Limiting (Optional)

#### `RATE_LIMIT_MAX_REQUESTS`
**Required**: No
**Type**: Number
**Default**: 100
**Description**: Max requests per window

```env
RATE_LIMIT_MAX_REQUESTS=200
```

---

#### `RATE_LIMIT_WINDOW_MS`
**Required**: No
**Type**: Number (milliseconds)
**Default**: 60000 (1 minute)
**Description**: Rate limit time window

```env
RATE_LIMIT_WINDOW_MS=60000  # 1 minute
```

---

## Environment-Specific Configurations

### Development

```env
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-min-32-chars-long-12345678
MONGODB_URI=mongodb://localhost:27017/porchestDB
LOG_LEVEL=debug
ENABLE_EMAIL_NOTIFICATIONS=false
```

### Staging

```env
NODE_ENV=production
NEXTAUTH_URL=https://staging.your-domain.com
NEXTAUTH_SECRET=staging-secret-different-from-prod
MONGODB_URI=mongodb+srv://user:pass@staging-cluster.mongodb.net/porchestDB
LOG_LEVEL=info
ENABLE_EMAIL_NOTIFICATIONS=true
EMAIL_FROM=staging@your-domain.com
```

### Production

```env
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=prod-secret-very-long-and-secure-random-string
MONGODB_URI=mongodb+srv://user:pass@prod-cluster.mongodb.net/porchestDB
LOG_LEVEL=warn
ENABLE_EMAIL_NOTIFICATIONS=true
EMAIL_SERVER_HOST=smtp.sendgrid.net
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=apikey
EMAIL_SERVER_PASSWORD=SG.your-sendgrid-api-key
EMAIL_FROM="Porchest" <noreply@your-domain.com>
SENTRY_DSN=https://your-sentry-dsn
```

---

## Security Best Practices

1. **Never Commit `.env` Files**
   ```bash
   # Already in .gitignore
   .env
   .env.local
   .env.production
   ```

2. **Use Different Secrets Per Environment**
   - Development, staging, and production should each have unique secrets
   - Never reuse production secrets in development

3. **Rotate Secrets Regularly**
   - Change `NEXTAUTH_SECRET` periodically (will log out all users)
   - Rotate database passwords
   - Update API keys

4. **Use Secret Management**
   - **Vercel**: Environment variables in dashboard
   - **AWS**: Secrets Manager or Parameter Store
   - **Google Cloud**: Secret Manager
   - **Azure**: Key Vault
   - **Docker**: Docker secrets

5. **Validate Environment Variables**
   ```typescript
   // In code
   if (!process.env.NEXTAUTH_SECRET) {
     throw new Error('NEXTAUTH_SECRET is required')
   }
   ```

---

## Vercel Configuration

In Vercel Dashboard → Settings → Environment Variables:

**Production**:
- Set all required variables
- Mark sensitive values as "Encrypted"
- Select "Production" environment

**Preview**:
- Use staging/development values
- Select "Preview" environment

**Development**:
- Can use same as local `.env`
- Select "Development" environment

---

## Docker Compose

Example `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    environment:
      - NODE_ENV=production
      - NEXTAUTH_URL=https://your-domain.com
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - MONGODB_URI=mongodb://mongodb:27017/porchestDB
    env_file:
      - .env.production
```

Use `.env.production` for Docker secrets.

---

## Troubleshooting

### Issue: "NEXTAUTH_URL mismatch"
**Solution**: Ensure `NEXTAUTH_URL` matches your actual domain including protocol

### Issue: "MongoDB connection refused"
**Solution**: Check `MONGODB_URI` format and network access

### Issue: "Email not sending"
**Solution**: Verify all `EMAIL_*` variables are set correctly

### Issue: "JWT secret too short"
**Solution**: `NEXTAUTH_SECRET` must be at least 32 characters

---

## Template

Complete `.env` template:

```env
# ============================================================================
# Authentication
# ============================================================================
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# ============================================================================
# Database
# ============================================================================
MONGODB_URI=mongodb://localhost:27017/porchestDB

# ============================================================================
# OAuth (Optional)
# ============================================================================
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ============================================================================
# Email (Optional)
# ============================================================================
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@your-domain.com

# ============================================================================
# Application
# ============================================================================
NODE_ENV=development
JWT_SECRET=your-jwt-secret

# ============================================================================
# AI Service (Optional)
# ============================================================================
AI_SERVICE_URL=http://localhost:5000

# ============================================================================
# Feature Flags (Optional)
# ============================================================================
ENABLE_EMAIL_NOTIFICATIONS=false
ENABLE_FRAUD_DETECTION=true
ENABLE_ANALYTICS=true

# ============================================================================
# Logging (Optional)
# ============================================================================
LOG_LEVEL=info

# ============================================================================
# Monitoring (Optional)
# ============================================================================
SENTRY_DSN=
```

# 🚀 Quick Start Guide - Your Setup is Ready!

Your environment variables are already configured! Follow these simple steps to get started.

---

## ✅ You're Using:

- **MongoDB Atlas** (Cloud database - no local installation needed!)
- **Google OAuth** (Pre-configured)
- **Gmail SMTP** (Email notifications ready)

---

## 📥 Step 1: Clone & Setup (On Your MacBook)

```bash
# Clone the repository
git clone https://github.com/contactporchest-debug/Porchest-Multiportal.git
cd Porchest-Multiportal

# Checkout the feature branch
git checkout claude/implement-multiportal-features-011CV5bAM3u88aso9Dqr9gru

# Install dependencies
npm install
```

---

## 🔑 Step 2: Environment Variables

**Good news!** Your `.env.local` is already configured with:
- ✅ MongoDB Atlas connection
- ✅ Google OAuth credentials
- ✅ Gmail SMTP settings

The file is already in the repository. Just make sure it's there:
```bash
# Check if .env.local exists
cat .env.local
```

If it's not there, copy `.env.example` and fill in your values:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual credentials.

**Or create it manually with this structure:**

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
MONGODB_URI=your-mongodb-atlas-uri
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-gmail-app-password
EMAIL_FROM=your-email@gmail.com
JWT_SECRET=your-jwt-secret
AI_SERVICE_URL=http://localhost:5000
NODE_ENV=development
```

---

## 🚀 Step 3: Run the Application

```bash
npm run dev
```

That's it! Open your browser:

```
http://localhost:3000
```

---

## 🎯 What You Can Do Now

### 1. **Access the Homepage**
Go to: http://localhost:3000

### 2. **Sign Up**
http://localhost:3000/signup

Create accounts with different roles:
- **Brand** - For businesses looking for influencers
- **Influencer** - For content creators
- **Client** - For software project clients
- **Employee** - For team members
- **Admin** - For platform management

### 3. **Login with Google**
Click "Continue with Google" on the login page - your OAuth is already configured!

### 4. **Create an Admin Account (Important!)**

Since brands and influencers need admin approval, you'll want an admin account first.

**Option A: Via MongoDB Atlas Web Interface**
1. Go to: https://cloud.mongodb.com/
2. Log in with your Atlas account
3. Browse Collections → `porchest_db` → `users`
4. Insert this document:

```json
{
  "full_name": "Admin User",
  "email": "admin@porchest.com",
  "password_hash": "$2a$10$YourHashedPasswordHere",
  "role": "admin",
  "status": "ACTIVE",
  "verified": true,
  "created_at": {"$date": "2025-01-15T00:00:00.000Z"}
}
```

**Option B: Via MongoDB Compass**
1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Connect with your Atlas URI (from .env.local)
3. Navigate to `porchest_db.users` collection
4. Insert the admin document above

**Option C: Via Code (Quick)**
Create a temporary API endpoint or run this in your browser console after signing up:
```javascript
// Sign up normally as admin role
// Then manually update status in database
```

---

## 🎨 Portal URLs

After logging in, you'll be redirected based on your role:

- **Brand Portal:** http://localhost:3000/brand
  - AI Discovery: http://localhost:3000/brand/discover
  - Campaigns: http://localhost:3000/brand/campaigns

- **Influencer Portal:** http://localhost:3000/influencer
  - Profile: http://localhost:3000/influencer/profile
  - Earnings: http://localhost:3000/influencer/earnings

- **Admin Portal:** http://localhost:3000/admin
  - Pending Users: http://localhost:3000/admin/users
  - Verify Users: Approve/reject sign-ups

- **Employee Portal:** http://localhost:3000/employee
  - Daily Reports: Submit work logs

- **Client Portal:** http://localhost:3000/client
  - Projects: Track software projects

---

## 🔧 No Additional Setup Needed!

**You DON'T need to install:**
- ❌ Local MongoDB (using Atlas)
- ❌ Docker (optional, only if you want)
- ❌ Python/AI service (optional, for AI features)

**Everything works with just Node.js!**

---

## 🧪 Test the Features

### Test 1: Sign Up Flow
1. Go to `/signup`
2. Create a brand account
3. See "Pending Approval" page
4. Log in as admin
5. Approve the brand account
6. Brand can now login!

### Test 2: AI Influencer Discovery
1. Login as brand
2. Go to `/brand/discover`
3. Use the chatbot to search for influencers
4. See AI-powered recommendations

### Test 3: Create Campaign
1. Login as brand
2. Go to `/brand/campaigns`
3. Click "Create Campaign"
4. Fill in details and save

### Test 4: Google OAuth
1. Go to `/login`
2. Click "Continue with Google"
3. Sign in with Google account
4. Automatically creates account

---

## 📊 Database Collections

Your MongoDB Atlas already has these collections ready:
- `users` - All user accounts
- `brand_profiles` - Brand information
- `influencer_profiles` - Influencer data
- `campaigns` - Marketing campaigns
- `collaboration_requests` - Brand-influencer collabs
- `projects` - Software projects
- `daily_reports` - Employee reports
- `transactions` - Payments
- `posts` - Social media posts
- `fraud_detections` - AI fraud logs

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution:** Check your Atlas cluster:
1. Go to https://cloud.mongodb.com/
2. Ensure cluster is running (not paused)
3. Check Network Access → Allow 0.0.0.0/0 for development
4. Verify database user credentials

### Issue: "Google OAuth not working"
**Solution:** Check OAuth settings:
1. Go to: https://console.cloud.google.com/
2. Find your OAuth client
3. Add to Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
4. Add to Authorized JavaScript origins:
   - `http://localhost:3000`

### Issue: Port 3000 already in use
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

---

## 🎉 You're All Set!

Your Porchest Multiportal is fully configured and ready to run!

### Quick Commands:
```bash
npm run dev          # Start development
npm test             # Run tests
npm run build        # Build for production
npm start            # Run production build
```

### Important URLs:
- **App:** http://localhost:3000
- **MongoDB:** https://cloud.mongodb.com/
- **Google OAuth:** https://console.cloud.google.com/

---

## 📚 Next Steps

1. ✅ Create admin account
2. ✅ Sign up test users (brand, influencer)
3. ✅ Test AI discovery features
4. ✅ Create sample campaigns
5. ✅ Explore all 5 portals

**Everything is ready to go!** 🚀

For detailed documentation, see:
- **MACOS_SETUP.md** - Complete MacBook setup guide
- **DEPLOYMENT.md** - Production deployment
- **README.md** - Project overview

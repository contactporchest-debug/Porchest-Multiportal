# 🚀 Deploy to Vercel - Complete Guide

This guide will help you deploy the Porchest Multiportal application to Vercel in just a few minutes.

---

## Prerequisites

✅ You already have:
- Vercel CLI installed (`vercel` command available)
- `.env.local` configured with all your credentials
- Repository ready to deploy

---

## 🎯 Quick Deployment (3 Steps)

### Step 1: Login to Vercel

```bash
vercel login
```

This will open your browser. Login with your preferred method (GitHub, GitLab, Bitbucket, or Email).

---

### Step 2: Deploy to Vercel

```bash
vercel --prod
```

**During the deployment, answer these prompts:**

```
? Set up and deploy "~/Porchest-Multiportal"? [Y/n] Y
? Which scope do you want to deploy to? (Your username or team)
? Link to existing project? [y/N] N
? What's your project's name? porchest-multiportal
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

Vercel will now:
- Upload your code
- Install dependencies
- Build your Next.js application
- Deploy to production

**Wait for:** `✅ Production: https://porchest-multiportal-xxx.vercel.app [copied to clipboard]`

---

### Step 3: Configure Environment Variables

After first deployment, you need to add environment variables:

```bash
# Add all environment variables
vercel env add NEXTAUTH_SECRET production
vercel env add MONGODB_URI production
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production
vercel env add EMAIL_SERVER_HOST production
vercel env add EMAIL_SERVER_PORT production
vercel env add EMAIL_SERVER_USER production
vercel env add EMAIL_SERVER_PASSWORD production
vercel env add EMAIL_FROM production
vercel env add JWT_SECRET production
vercel env add NODE_ENV production
```

**For each command:**
- It will prompt: `What's the value of VARIABLE_NAME?`
- Copy the value from your `.env.local` file
- Paste it and press Enter

---

## 📋 Environment Variables Reference

Copy these values from your `.env.local`:

| Variable | Value from .env.local |
|----------|----------------------|
| `NEXTAUTH_SECRET` | `superstrongsecretkey123changethisinproduction` |
| `MONGODB_URI` | Your MongoDB Atlas URI |
| `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth Client Secret |
| `EMAIL_SERVER_HOST` | `smtp.gmail.com` |
| `EMAIL_SERVER_PORT` | `587` |
| `EMAIL_SERVER_USER` | `contact.porchest@gmail.com` |
| `EMAIL_SERVER_PASSWORD` | Your Gmail App Password |
| `EMAIL_FROM` | `contact.porchest@gmail.com` |
| `JWT_SECRET` | `superstrongsecretkey123` |
| `NODE_ENV` | `production` |

---

## 🔧 Update NEXTAUTH_URL

After deployment, you'll get a URL like: `https://porchest-multiportal-xxx.vercel.app`

**Update NEXTAUTH_URL:**

```bash
vercel env add NEXTAUTH_URL production
# Paste: https://your-actual-domain.vercel.app
```

---

## 🔐 Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your OAuth 2.0 Client
3. Under **Authorized redirect URIs**, add:
   ```
   https://your-domain.vercel.app/api/auth/callback/google
   ```
4. Click **Save**

---

## 🔄 Redeploy with Environment Variables

```bash
vercel --prod
```

This will rebuild with all environment variables applied.

---

## ✅ Verify Deployment

Visit your deployment URL and test:

1. **Homepage** - Should load correctly
2. **Sign Up** - Create a test account
3. **Google OAuth** - Click "Continue with Google"
4. **Database** - Check MongoDB Atlas for new user
5. **Email** - Check if verification emails are sent

---

## 🎨 Using Custom Domain (Optional)

### Add Custom Domain:

```bash
vercel domains add yourdomain.com
```

### Update DNS Records:

Add these records to your domain provider:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Update Environment Variables:

```bash
vercel env rm NEXTAUTH_URL production
vercel env add NEXTAUTH_URL production
# Enter: https://yourdomain.com
```

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Check build logs
vercel logs

# Test build locally
npm run build
```

### Environment Variables Not Working

```bash
# List all environment variables
vercel env ls

# Remove and re-add a variable
vercel env rm VARIABLE_NAME production
vercel env add VARIABLE_NAME production
```

### Authentication Issues

1. Check NEXTAUTH_URL matches your domain exactly
2. Verify Google OAuth redirect URI includes `/api/auth/callback/google`
3. Check MongoDB URI is correct and accessible

---

## 📱 Vercel Dashboard

Access your project dashboard: https://vercel.com/dashboard

From the dashboard you can:
- View deployments
- Check logs
- Manage environment variables
- Configure custom domains
- View analytics

---

## 🚀 Automated Script (Alternative)

If you prefer automation, run:

```bash
./deploy-to-vercel.sh
```

This script will:
- Check Vercel CLI installation
- Login to Vercel
- Read environment variables from `.env.local`
- Deploy to production
- Configure all environment variables automatically

---

## 📝 Post-Deployment Checklist

- [ ] Application deployed successfully
- [ ] All environment variables configured
- [ ] NEXTAUTH_URL updated to production domain
- [ ] Google OAuth redirect URI updated
- [ ] Database connection working
- [ ] Email sending working
- [ ] Test user sign up
- [ ] Test Google OAuth login
- [ ] Test all portals (Brand, Influencer, Client, Employee, Admin)
- [ ] Monitor Vercel logs for any errors

---

## 🎉 Success!

Your Porchest Multiportal application is now live on Vercel!

**Production URL:** Check your Vercel dashboard or run `vercel ls`

**Next Steps:**
1. Share the URL with your team
2. Create your admin account
3. Start onboarding users
4. Monitor analytics in Vercel dashboard

---

## 💡 Pro Tips

- **Preview Deployments**: Every git push creates a preview deployment
- **Rollback**: Instantly rollback to previous deployments from dashboard
- **Environment Variables**: Use different values for preview vs production
- **Logs**: Monitor real-time logs with `vercel logs --follow`
- **CI/CD**: Connect GitHub repository for automatic deployments

---

Need help? Check [Vercel Documentation](https://vercel.com/docs) or contact support.

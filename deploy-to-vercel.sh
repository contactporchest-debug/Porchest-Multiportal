#!/bin/bash

# Porchest Multiportal - Vercel Deployment Script
# This script will deploy your application to Vercel with all environment variables configured

set -e

echo "🚀 Porchest Multiportal - Vercel Deployment"
echo "==========================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "✅ Vercel CLI is installed"
echo ""

# Check if user is logged in
echo "📝 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel:"
    vercel login
fi

echo "✅ Authenticated with Vercel"
echo ""

# Read environment variables from .env.local
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please create .env.local with your environment variables"
    exit 1
fi

echo "📋 Setting up environment variables from .env.local..."
echo ""

# Extract variables from .env.local
NEXTAUTH_URL_VALUE=$(grep NEXTAUTH_URL= .env.local | cut -d '=' -f2)
NEXTAUTH_SECRET_VALUE=$(grep NEXTAUTH_SECRET= .env.local | cut -d '=' -f2)
MONGODB_URI_VALUE=$(grep MONGODB_URI= .env.local | cut -d '=' -f2)
GOOGLE_CLIENT_ID_VALUE=$(grep GOOGLE_CLIENT_ID= .env.local | cut -d '=' -f2)
GOOGLE_CLIENT_SECRET_VALUE=$(grep GOOGLE_CLIENT_SECRET= .env.local | cut -d '=' -f2)
EMAIL_SERVER_HOST_VALUE=$(grep EMAIL_SERVER_HOST= .env.local | cut -d '=' -f2)
EMAIL_SERVER_PORT_VALUE=$(grep EMAIL_SERVER_PORT= .env.local | cut -d '=' -f2)
EMAIL_SERVER_USER_VALUE=$(grep EMAIL_SERVER_USER= .env.local | cut -d '=' -f2)
EMAIL_SERVER_PASSWORD_VALUE=$(grep EMAIL_SERVER_PASSWORD= .env.local | cut -d '=' -f2)
EMAIL_FROM_VALUE=$(grep EMAIL_FROM= .env.local | cut -d '=' -f2)
JWT_SECRET_VALUE=$(grep JWT_SECRET= .env.local | cut -d '=' -f2)

echo "🔧 Configuring environment variables in Vercel..."
echo ""

# Set environment variables (these will be prompted for production/preview/development)
vercel env add NEXTAUTH_SECRET production <<< "$NEXTAUTH_SECRET_VALUE" 2>/dev/null || echo "NEXTAUTH_SECRET already set"
vercel env add MONGODB_URI production <<< "$MONGODB_URI_VALUE" 2>/dev/null || echo "MONGODB_URI already set"
vercel env add GOOGLE_CLIENT_ID production <<< "$GOOGLE_CLIENT_ID_VALUE" 2>/dev/null || echo "GOOGLE_CLIENT_ID already set"
vercel env add GOOGLE_CLIENT_SECRET production <<< "$GOOGLE_CLIENT_SECRET_VALUE" 2>/dev/null || echo "GOOGLE_CLIENT_SECRET already set"
vercel env add EMAIL_SERVER_HOST production <<< "$EMAIL_SERVER_HOST_VALUE" 2>/dev/null || echo "EMAIL_SERVER_HOST already set"
vercel env add EMAIL_SERVER_PORT production <<< "$EMAIL_SERVER_PORT_VALUE" 2>/dev/null || echo "EMAIL_SERVER_PORT already set"
vercel env add EMAIL_SERVER_USER production <<< "$EMAIL_SERVER_USER_VALUE" 2>/dev/null || echo "EMAIL_SERVER_USER already set"
vercel env add EMAIL_SERVER_PASSWORD production <<< "$EMAIL_SERVER_PASSWORD_VALUE" 2>/dev/null || echo "EMAIL_SERVER_PASSWORD already set"
vercel env add EMAIL_FROM production <<< "$EMAIL_FROM_VALUE" 2>/dev/null || echo "EMAIL_FROM already set"
vercel env add JWT_SECRET production <<< "$JWT_SECRET_VALUE" 2>/dev/null || echo "JWT_SECRET already set"
vercel env add NODE_ENV production <<< "production" 2>/dev/null || echo "NODE_ENV already set"

echo ""
echo "✅ Environment variables configured"
echo ""

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo ""

# First deployment (creates project)
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📱 Your application is now live!"
echo ""
echo "Next steps:"
echo "1. Visit your Vercel dashboard: https://vercel.com/dashboard"
echo "2. Find your project and copy the production URL"
echo "3. Update NEXTAUTH_URL in Vercel environment variables to your production URL"
echo "4. Update Google OAuth redirect URIs to include: https://your-domain.vercel.app/api/auth/callback/google"
echo "5. Redeploy: vercel --prod"
echo ""
echo "🎉 Done!"

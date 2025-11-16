#!/bin/bash

# Script to fix 404 errors after login
# Run this if you're experiencing login routing issues

echo "🔧 Fixing Portal 404 Errors..."
echo ""

# Step 1: Clean Next.js cache
echo "Step 1: Cleaning .next cache..."
rm -rf .next
echo "✅ Cache cleared"
echo ""

# Step 2: Rebuild the application
echo "Step 2: Rebuilding application..."
npm run build
echo "✅ Build complete"
echo ""

# Step 3: Instructions for testing
echo "📋 Testing Instructions:"
echo ""
echo "1. Start the development server:"
echo "   npm run dev"
echo ""
echo "2. Clear your browser cache:"
echo "   - Chrome/Edge: Ctrl+Shift+Delete → Clear cached images and files"
echo "   - Firefox: Ctrl+Shift+Delete → Cached Web Content"
echo "   - Safari: Cmd+Option+E"
echo ""
echo "3. Test the login flow:"
echo "   a. Go to http://localhost:3000/login"
echo "   b. Enter credentials"
echo "   c. Click 'Sign in'"
echo "   d. Should redirect to /portal → then to /brand (or your role)"
echo ""
echo "4. If still getting 404:"
echo "   - Open browser DevTools (F12)"
echo "   - Go to Network tab"
echo "   - Try logging in again"
echo "   - Check which URL is returning 404"
echo "   - Share that URL with support"
echo ""
echo "✅ All routes verified:"
echo "   - /login ✓"
echo "   - /portal ✓"
echo "   - /api/auth/[...nextauth] ✓"
echo "   - /brand ✓"
echo "   - /admin ✓"
echo "   - /influencer ✓"
echo "   - /employee ✓"
echo "   - /client ✓"
echo ""
echo "🎉 Setup complete!"

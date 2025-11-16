# Troubleshooting 404 Errors After Login

## Quick Fix

If you're getting a 404 error when logging in, run this command:

```bash
./scripts/fix-404.sh
```

Or manually:

```bash
# 1. Clean cache
rm -rf .next

# 2. Rebuild
npm run build

# 3. Restart dev server
npm run dev
```

---

## Common 404 Scenarios

### Scenario 1: 404 on /portal page

**Symptoms**: After clicking "Sign in", you see "404 | This page could not be found"

**Cause**: Browser is using a cached version of the broken route

**Fix**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Restart your browser
4. Try login again

---

### Scenario 2: 404 on role dashboard (/brand, /admin, etc.)

**Symptoms**: Portal redirects but then shows 404

**Cause**: Dashboard page doesn't exist or isn't built correctly

**Fix**:
1. Verify the page exists:
   ```bash
   ls app/brand/page.tsx app/admin/page.tsx app/influencer/page.tsx
   ```

2. Rebuild:
   ```bash
   rm -rf .next && npm run build
   ```

---

### Scenario 3: 404 on /api/auth/signin

**Symptoms**: NextAuth API route returns 404

**Cause**: NextAuth route not configured or middleware blocking it

**Fix**:
1. Verify NextAuth route exists:
   ```bash
   ls app/api/auth/\[...nextauth\]/route.ts
   ```

2. Check middleware.ts isn't blocking /api/auth:
   ```typescript
   // middleware.ts should have:
   const publicRoutes = [
     "/",
     "/login",
     "/api/auth", // ✅ This should be here
   ];
   ```

---

## Diagnostic Steps

### Step 1: Check which URL is 404'ing

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try logging in
4. Look for red (404) requests
5. Note the exact URL that's failing

### Step 2: Verify build output

Run:
```bash
npm run build | grep -E "(login|portal|brand|admin)"
```

Expected output:
```
├ ○ /login                                3.61 kB         108 kB
├ ƒ /portal                               185 B          87.9 kB
├ ƒ /brand                                4.44 kB         151 kB
├ ƒ /admin                                4.35 kB         257 kB
```

If any route is missing, check if the file exists.

### Step 3: Check middleware

```bash
cat middleware.ts | grep -A 20 "publicRoutes"
```

Ensure it includes:
- `/login`
- `/api/auth`
- `/register`

### Step 4: Check auth configuration

```bash
cat lib/auth.config.ts | grep -A 10 "redirect"
```

Should redirect to `/portal` after login:
```typescript
async redirect({ url, baseUrl }) {
  return `${baseUrl}/portal`;
}
```

---

## Login Flow Verification

### Expected Flow:

1. **User visits** → `/login`
2. **User submits credentials** → POST to `/api/auth/callback/credentials`
3. **NextAuth validates** → Sets JWT cookie
4. **NextAuth redirects** → `/portal`
5. **Portal page renders** → Reads JWT, gets user role
6. **Portal redirects** → `/${user.role}` (e.g., `/brand`)
7. **Dashboard renders** → User sees their portal

### Verify Each Step:

```bash
# 1. Login page exists
ls app/\(auth\)/login/page.tsx
# Should output: app/(auth)/login/page.tsx

# 2. NextAuth API exists
ls app/api/auth/\[...nextauth\]/route.ts
# Should output: app/api/auth/[...nextauth]/route.ts

# 3. Portal page exists
ls app/portal/page.tsx
# Should output: app/portal/page.tsx

# 4. Dashboard pages exist
ls app/brand/page.tsx app/admin/page.tsx app/influencer/page.tsx
# Should list all three files

# 5. Portal has dynamic export
grep "dynamic" app/portal/page.tsx
# Should output: export const dynamic = "force-dynamic";

# 6. Portal has NO metadata export
grep "metadata" app/portal/page.tsx
# Should output: (nothing - metadata export was removed)
```

---

## Environment-Specific Issues

### Development (npm run dev)

If 404 occurs in development:

1. Stop dev server (Ctrl+C)
2. Clear .next: `rm -rf .next`
3. Restart: `npm run dev`
4. Clear browser cache
5. Try again

### Production (npm run build + npm start)

If 404 occurs in production:

1. Clean build:
   ```bash
   rm -rf .next
   npm run build
   npm start
   ```

2. Check build logs for errors

3. Verify environment variables:
   ```bash
   echo $NEXTAUTH_URL
   echo $NEXTAUTH_SECRET
   ```

### Vercel Deployment

If 404 occurs on Vercel:

1. Check Vercel build logs
2. Ensure environment variables are set in Vercel dashboard:
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `MONGODB_URI`
3. Redeploy:
   ```bash
   git push origin main
   ```

---

## Recent Fixes Applied

### ✅ Fix 1: Removed metadata export from /portal/page.tsx

**Issue**: Portal page had both `dynamic = "force-dynamic"` and `metadata` export, causing 404

**Fixed in commit**: `88f50b9`

**Before**:
```typescript
export const dynamic = "force-dynamic";
export const metadata = { title: "Portal" }; // ❌ Caused conflict
```

**After**:
```typescript
export const dynamic = "force-dynamic"; // ✅ No metadata
```

### ✅ Fix 2: Relaxed password validation

**Issue**: Too strict password requirements caused registration failures

**Fixed in commit**: `c23e97d`

**Changed**: 8 chars with complexity → 6 chars minimum

### ✅ Fix 3: Fixed admin users page

**Issue**: Admin page showed mock data instead of real users

**Fixed in commit**: `c23e97d`

**Changed**: Now fetches from `/api/admin/users`

---

## Still Having Issues?

If you're still experiencing 404 errors:

1. **Share these details**:
   - Exact URL that returns 404
   - Browser console errors
   - Network tab screenshot
   - Build output

2. **Run diagnostics**:
   ```bash
   npm run build > build.log 2>&1
   cat build.log | grep -E "(404|Error|Failed)"
   ```

3. **Check logs**:
   - Browser console (F12 → Console tab)
   - Terminal output (where you ran `npm run dev`)
   - Network requests (F12 → Network tab)

4. **Verify database connection**:
   ```bash
   # Test MongoDB connection
   node -e "require('./lib/mongodb').then(() => console.log('Connected'))"
   ```

---

## Quick Reference

### All Portal Routes (Should Work):

- ✅ `/` - Home page (public)
- ✅ `/login` - Login page (public)
- ✅ `/register` - Registration page (public)
- ✅ `/portal` - Portal router (protected, redirects)
- ✅ `/brand` - Brand dashboard (protected, brand only)
- ✅ `/admin` - Admin dashboard (protected, admin only)
- ✅ `/influencer` - Influencer dashboard (protected, influencer only)
- ✅ `/employee` - Employee dashboard (protected, employee only)
- ✅ `/client` - Client dashboard (protected, client only)
- ✅ `/api/auth/[...nextauth]` - NextAuth endpoints (public)
- ✅ `/api/auth/session` - Session endpoint (public)
- ✅ `/api/auth/register` - Registration endpoint (public)

### Common Commands:

```bash
# Clean rebuild
rm -rf .next && npm run build

# Start dev server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Check route generation
npm run build | grep -E "(○|ƒ)" | grep -E "(login|portal|brand)"

# Clear everything and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

---

**Last Updated**: 2025-11-15
**All Routes Verified**: ✅
**Build Status**: ✅ PASSING

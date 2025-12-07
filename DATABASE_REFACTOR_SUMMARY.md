# Database Schema Refactor - Users Collection
**Date:** 2025-12-07
**Version:** 2.0.0
**Status:** ✅ COMPLETE (Pending Migration)

---

## 📋 **Overview**

Refactored the Users collection to implement a **clean master identity table pattern**, separating authentication/role data from portal-specific profile data.

---

## 🎯 **Goals**

1. **Users collection = Master identity table ONLY**
   - Contains: authentication, role, status
   - No portal-specific data (phone, company, etc.)

2. **Portal profiles = Portal-specific data**
   - BrandProfile, InfluencerProfile, EmployeeProfile, ClientProfile
   - Reference users via `user_id` field
   - Contains portal-specific fields (phone, company, etc.)

3. **Clean separation of concerns**
   - Registration creates User + matching portal profile
   - Portal-specific data collected during profile setup flows

---

## 🔧 **Changes Made**

### **1. User Interface (lib/db-types.ts)**

#### **Before:**
```typescript
export interface User {
  _id: ObjectId;
  full_name?: string;
  email: string;
  password_hash?: string;
  role: UserRole;
  status: "PENDING" | "ACTIVE" | "REJECTED" | "SUSPENDED";
  verified: boolean;           // ❌ REMOVED
  verified_at?: Date;           // ❌ REMOVED
  phone?: string;               // ❌ REMOVED - moved to portal profiles
  company?: string;             // ❌ REMOVED - moved to portal profiles
  profile_completed: boolean;
  created_at: Date;
  updated_at: Date;
}
```

#### **After:**
```typescript
export interface User {
  _id: ObjectId;
  full_name: string;            // ✅ Now required
  email: string;
  password_hash: string;        // ✅ Now required
  role: UserRole;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED"; // ✅ Updated enum
  profile_completed: boolean;
  created_at: Date;
  updated_at: Date;
}
```

**Changes:**
- ❌ Removed: `verified`, `verified_at`, `phone`, `company`
- ✅ Updated: `status` enum from `"PENDING" | "ACTIVE" | "REJECTED" | "SUSPENDED"` to `"ACTIVE" | "INACTIVE" | "SUSPENDED"`
- ✅ Made `full_name` and `password_hash` required

---

### **2. Portal Profiles (lib/db-types.ts)**

All portal profiles now include `user_id` to reference the Users collection:

#### **BrandProfile:**
```typescript
export interface BrandProfile {
  _id: ObjectId;
  user_id: ObjectId;        // ✅ References users._id
  unique_brand_id?: string;
  brand_name?: string;
  company?: string;         // ✅ Moved from users
  phone?: string;           // ✅ Moved from users
  // ... other brand-specific fields
}
```

#### **EmployeeProfile:**
```typescript
export interface EmployeeProfile {
  _id: ObjectId;
  user_id: ObjectId;        // ✅ References users._id
  phone?: string;           // ✅ Moved from users
  // ... other employee-specific fields
}
```

#### **ClientProfile:**
```typescript
export interface ClientProfile {
  _id: ObjectId;
  user_id: ObjectId;        // ✅ References users._id
  company?: string;         // ✅ Moved from users
  phone?: string;           // ✅ Moved from users
  // ... other client-specific fields
}
```

---

### **3. Validation Schemas (lib/validations.ts)**

#### **Updated userStatusSchema:**
```typescript
// Before
export const userStatusSchema = z.enum(["PENDING", "ACTIVE", "REJECTED", "SUSPENDED"]);

// After
export const userStatusSchema = z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]);
```

#### **Updated registerSchema:**
```typescript
// Before
export const registerSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: emailSchema,
  password: passwordSchema,
  role: userRoleSchema,
  phone: phoneSchema,                    // ❌ REMOVED
  company: z.string().max(200).optional(), // ❌ REMOVED
});

// After
export const registerSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: emailSchema,
  password: passwordSchema,
  role: userRoleSchema,
  // phone and company removed - now stored in portal-specific profiles
});
```

---

### **4. Registration Endpoint (app/api/auth/register/route.ts)**

#### **Before:**
- Created User with all fields (including deprecated ones)
- Only created BrandProfile for brand users

#### **After:**
- Creates clean User (master identity only)
- Creates portal profile for **ALL** role types (brand, influencer, employee, client)
- Status logic:
  - Brands/Influencers → `INACTIVE` (require approval)
  - Employees/Clients → `ACTIVE` (immediate access)

```typescript
// Create master user identity (clean - no portal-specific data)
const result = await usersCollection.insertOne({
  full_name: validatedData.name,
  email: validatedData.email.toLowerCase(),
  password_hash: hashedPassword,
  role: validatedData.role.toLowerCase() as UserRole,
  status: requiresApproval ? "INACTIVE" : "ACTIVE",
  profile_completed: false,
  created_at: new Date(),
  updated_at: new Date(),
});

// Create matching portal profile based on role
switch (role) {
  case "brand":
    await brandProfilesCollection.insertOne({ user_id: userId, ... });
    break;
  case "influencer":
    await influencerProfilesCollection.insertOne({ user_id: userId, ... });
    break;
  case "employee":
    await employeeProfilesCollection.insertOne({ user_id: userId, ... });
    break;
  case "client":
    await clientProfilesCollection.insertOne({ user_id: userId, ... });
    break;
}
```

---

### **5. Database Utilities (lib/db.ts)**

#### **Added Collection Accessors:**
```typescript
export const collections = {
  // ... existing
  employeeProfiles: () => getCollection<Types.EmployeeProfile>("employee_profiles"), // ✅ NEW
  clientProfiles: () => getCollection<Types.ClientProfile>("client_profiles"),       // ✅ NEW
};
```

#### **Updated createUser Function:**
```typescript
// Before
export async function createUser(data: Types.UserCreateInput): Promise<Types.User> {
  const user: Omit<Types.User, "_id"> = {
    full_name: data.full_name,
    email: data.email.toLowerCase(),
    password_hash: data.password_hash,
    role: data.role,
    status: data.status || "PENDING",  // ❌ OLD
    verified: data.verified || false,  // ❌ REMOVED
    phone: data.phone,                 // ❌ REMOVED
    company: data.company,             // ❌ REMOVED
    // ...
  };
}

// After
export async function createUser(data: Types.UserCreateInput): Promise<Types.User> {
  const user: Omit<Types.User, "_id"> = {
    full_name: data.full_name,
    email: data.email.toLowerCase(),
    password_hash: data.password_hash,
    role: data.role,
    status: data.status || "INACTIVE",  // ✅ UPDATED
    profile_completed: data.profile_completed || false,
    created_at: data.created_at || new Date(),
    updated_at: data.updated_at || new Date(),
  };
}
```

---

### **6. Admin Verify User Endpoint (app/api/admin/verify-user/route.ts)**

#### **Updated Status Logic:**
```typescript
// Before
if (validatedData.action === "approve") {
  updateData.status = "ACTIVE";
  updateData.verified = true;       // ❌ REMOVED
  updateData.verified_at = new Date(); // ❌ REMOVED
} else {
  updateData.status = "REJECTED";   // ❌ OLD ENUM
}

// After
if (validatedData.action === "approve") {
  updateData.status = "ACTIVE";
} else {
  updateData.status = "SUSPENDED";  // ✅ UPDATED ENUM
  updateData.rejection_reason = validatedData.reason || "No reason provided";
}
```

#### **Updated Audit Logs:**
```typescript
// Before
changes: {
  before: {
    status: user.status,
    verified: user.verified,  // ❌ REMOVED
  },
  after: {
    status: updateData.status,
    verified: updateData.verified || false,  // ❌ REMOVED
  },
}

// After
changes: {
  before: {
    status: user.status,
  },
  after: {
    status: updateData.status,
    rejection_reason: updateData.rejection_reason,
  },
}
```

---

### **7. Automation Events (lib/automation.ts)**

#### **Updated Brand Name References:**

All instances of `user.company` replaced with `brandProfile.brand_name`:

```typescript
// Before
const brandName = brand.company || brand.full_name || "A brand";

// After
const brandProfilesCollection = await collections.brandProfiles();
const brandProfile = await brandProfilesCollection.findOne({ user_id: brand._id });
const brandName = brandProfile?.brand_name || brand.full_name || "A brand";
```

**Updated Functions:**
- `handleCampaignInvite()` - line 151
- `handlePostSubmitted()` - line 207
- `handleCollaborationAccepted()` - line 306

---

### **8. Brand Profile Endpoint (app/api/brand/profile/route.ts)**

#### **Updated Default Profile Creation:**
```typescript
// Before
const defaultProfile = {
  brand_name: user.company || user.full_name || "",  // ❌ user.company doesn't exist
  // ...
};

// After
const defaultProfile = {
  brand_name: user.full_name || "",  // ✅ Use full_name as fallback
  // ...
};
```

---

## 📝 **Migration Script**

Created **`scripts/migrate-users-clean.ts`** to handle data migration:

### **What It Does:**

1. **Analyzes current state**
   - Counts users with deprecated fields
   - Counts users with old status values

2. **Migrates phone/company data**
   - Extracts `phone` and `company` from users
   - Moves to respective portal profiles
   - Only for users who already have profiles

3. **Updates status enum values**
   - `PENDING` → `INACTIVE`
   - `REJECTED` → `SUSPENDED`

4. **Removes deprecated fields**
   - Uses `$unset` to remove: `verified`, `verified_at`, `phone`, `company`

5. **Ensures portal profiles exist**
   - Creates missing profiles for all users
   - Matches role type (brand/influencer/employee/client)

6. **Verification**
   - Checks that no users still have deprecated fields
   - Logs sample user to verify clean structure

### **Usage:**
```bash
npx ts-node scripts/migrate-users-clean.ts
```

---

## ✅ **Status Enum Mapping**

| Old Status | New Status  | Meaning                          |
|-----------|-------------|----------------------------------|
| `PENDING` | `INACTIVE`  | Awaiting admin approval          |
| `ACTIVE`  | `ACTIVE`    | Approved and active (unchanged)  |
| `REJECTED`| `SUSPENDED` | Rejected or banned               |
| `SUSPENDED` | `SUSPENDED` | Temporarily suspended (unchanged) |

---

## 🔄 **Data Flow**

### **Registration:**
```
1. User submits registration (name, email, password, role)
   ↓
2. Hash password with bcrypt (10 rounds)
   ↓
3. Create User doc (clean master identity)
   ↓
4. Determine status:
   - brand/influencer → INACTIVE (needs approval)
   - employee/client → ACTIVE (immediate access)
   ↓
5. Create matching portal profile
   - brand → BrandProfile (with user_id)
   - influencer → InfluencerProfile (with user_id)
   - employee → EmployeeProfile (with user_id)
   - client → ClientProfile (with user_id)
   ↓
6. Return success response
```

### **Admin Approval:**
```
1. Admin approves/rejects user
   ↓
2. Update User.status:
   - approve → ACTIVE
   - reject → SUSPENDED
   ↓
3. Create audit log (no longer tracking verified field)
   ↓
4. Send notification to user
```

### **Profile Setup:**
```
1. User logs in (if ACTIVE)
   ↓
2. Redirected to profile setup if profile_completed = false
   ↓
3. User fills portal-specific fields:
   - Brand: brand_name, company, phone, website, etc.
   - Influencer: full_name, bio, social_media, etc.
   - Employee: phone, department, etc.
   - Client: company, phone, etc.
   ↓
4. Update portal profile + set profile_completed = true
```

---

## 📦 **Files Modified**

| File Path | Changes |
|-----------|---------|
| `lib/db-types.ts` | ✅ User interface refactored, portal profiles updated |
| `lib/validations.ts` | ✅ Updated status enum and registerSchema |
| `lib/db.ts` | ✅ Added collection accessors, updated createUser |
| `app/api/auth/register/route.ts` | ✅ Refactored to create clean users + all portal profiles |
| `app/api/admin/verify-user/route.ts` | ✅ Removed verified fields, updated status enum |
| `lib/automation.ts` | ✅ Updated brand.company → brandProfile.brand_name |
| `app/api/brand/profile/route.ts` | ✅ Removed user.company reference |
| `scripts/migrate-users-clean.ts` | ✅ NEW - Migration script |

---

## 🚀 **Next Steps**

### **Before Deployment:**

1. **Run Migration Script** (Production)
   ```bash
   npx ts-node scripts/migrate-users-clean.ts
   ```

2. **Verify Migration**
   - Check that all users have matching portal profiles
   - Verify no users have deprecated fields
   - Test registration flow

3. **Test User Flows**
   - Registration (all roles)
   - Admin approval/rejection
   - Login (ACTIVE users only)
   - Profile setup (all portals)

### **After Deployment:**

1. **Monitor for Errors**
   - Check logs for any references to deprecated fields
   - Watch for profile creation failures

2. **Update Documentation**
   - API docs with new schemas
   - Frontend integration guide
   - Database schema diagram

---

## 🎉 **Benefits**

✅ **Clean separation of concerns** - Auth data separate from profile data
✅ **Easier to maintain** - Portal-specific logic isolated
✅ **Better scalability** - Add new portals without touching Users collection
✅ **Improved security** - Minimal PII in master identity table
✅ **Consistent patterns** - All portals follow same user_id reference pattern

---

**Created:** 2025-12-07
**Author:** Claude Code
**Version:** 2.0.0

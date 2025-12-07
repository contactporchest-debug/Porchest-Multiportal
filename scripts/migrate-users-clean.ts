/**
 * MongoDB Migration Script: Clean Users Collection
 *
 * Purpose: Refactor Users collection to be a clean master identity table
 *
 * Changes:
 * 1. Remove deprecated fields from users: verified, verified_at, phone, company
 * 2. Update status enum values: PENDING → INACTIVE, REJECTED → SUSPENDED
 * 3. Ensure each user has a matching portal profile with userId reference
 * 4. Migrate phone/company data to portal profiles if needed
 *
 * Usage:
 *   npx ts-node scripts/migrate-users-clean.ts
 */

import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

interface OldUser {
  _id: ObjectId;
  full_name?: string;
  email: string;
  password_hash?: string;
  role: "admin" | "brand" | "influencer" | "client" | "employee";
  status: "PENDING" | "ACTIVE" | "REJECTED" | "SUSPENDED";
  verified?: boolean;
  verified_at?: Date;
  phone?: string;
  company?: string;
  profile_completed: boolean;
  created_at: Date;
  updated_at: Date;
}

async function migrateUsers() {
  console.log("🚀 Starting Users Collection Migration...\n");

  try {
    const client = await clientPromise;
    const db = client.db("porchest_db");

    const usersCollection = db.collection<OldUser>("users");
    const brandProfilesCollection = db.collection("brand_profiles");
    const influencerProfilesCollection = db.collection("influencer_profiles");
    const employeeProfilesCollection = db.collection("employee_profiles");
    const clientProfilesCollection = db.collection("client_profiles");

    // ========================================================================
    // STEP 1: Analyze current state
    // ========================================================================
    console.log("📊 Step 1: Analyzing current users...");

    const totalUsers = await usersCollection.countDocuments();
    const usersWithDeprecatedFields = await usersCollection.countDocuments({
      $or: [
        { verified: { $exists: true } },
        { verified_at: { $exists: true } },
        { phone: { $exists: true } },
        { company: { $exists: true } },
      ],
    });
    const usersWithOldStatus = await usersCollection.countDocuments({
      status: { $in: ["PENDING", "REJECTED"] },
    });

    console.log(`   Total users: ${totalUsers}`);
    console.log(`   Users with deprecated fields: ${usersWithDeprecatedFields}`);
    console.log(`   Users with old status values: ${usersWithOldStatus}\n`);

    // ========================================================================
    // STEP 2: Migrate phone/company data to portal profiles
    // ========================================================================
    console.log("📦 Step 2: Migrating phone/company data to portal profiles...");

    const usersWithData = await usersCollection
      .find({
        $or: [{ phone: { $exists: true } }, { company: { $exists: true } }],
      })
      .toArray();

    let migratedDataCount = 0;

    for (const user of usersWithData) {
      const phone = user.phone;
      const company = user.company;

      try {
        switch (user.role) {
          case "brand":
            if (phone || company) {
              const existingProfile = await brandProfilesCollection.findOne({
                user_id: user._id,
              });

              if (existingProfile) {
                await brandProfilesCollection.updateOne(
                  { user_id: user._id },
                  {
                    $set: {
                      ...(phone && { phone }),
                      ...(company && { company }),
                      updated_at: new Date(),
                    },
                  }
                );
                migratedDataCount++;
              }
            }
            break;

          case "employee":
            if (phone) {
              const existingProfile = await employeeProfilesCollection.findOne({
                user_id: user._id,
              });

              if (existingProfile) {
                await employeeProfilesCollection.updateOne(
                  { user_id: user._id },
                  { $set: { phone, updated_at: new Date() } }
                );
                migratedDataCount++;
              }
            }
            break;

          case "client":
            if (phone || company) {
              const existingProfile = await clientProfilesCollection.findOne({
                user_id: user._id,
              });

              if (existingProfile) {
                await clientProfilesCollection.updateOne(
                  { user_id: user._id },
                  {
                    $set: {
                      ...(phone && { phone }),
                      ...(company && { company }),
                      updated_at: new Date(),
                    },
                  }
                );
                migratedDataCount++;
              }
            }
            break;
        }
      } catch (error) {
        console.error(`   ⚠️  Failed to migrate data for user ${user.email}:`, error);
      }
    }

    console.log(`   ✅ Migrated phone/company data for ${migratedDataCount} users\n`);

    // ========================================================================
    // STEP 3: Update status values
    // ========================================================================
    console.log("🔄 Step 3: Updating status enum values...");

    const pendingUpdate = await usersCollection.updateMany(
      { status: "PENDING" },
      { $set: { status: "INACTIVE", updated_at: new Date() } }
    );

    const rejectedUpdate = await usersCollection.updateMany(
      { status: "REJECTED" },
      { $set: { status: "SUSPENDED", updated_at: new Date() } }
    );

    console.log(`   ✅ PENDING → INACTIVE: ${pendingUpdate.modifiedCount} users`);
    console.log(`   ✅ REJECTED → SUSPENDED: ${rejectedUpdate.modifiedCount} users\n`);

    // ========================================================================
    // STEP 4: Remove deprecated fields
    // ========================================================================
    console.log("🗑️  Step 4: Removing deprecated fields...");

    const unsetResult = await usersCollection.updateMany(
      {},
      {
        $unset: {
          verified: "",
          verified_at: "",
          phone: "",
          company: "",
        },
        $set: {
          updated_at: new Date(),
        },
      }
    );

    console.log(`   ✅ Removed deprecated fields from ${unsetResult.modifiedCount} users\n`);

    // ========================================================================
    // STEP 5: Ensure all users have matching portal profiles
    // ========================================================================
    console.log("👤 Step 5: Ensuring portal profiles exist...");

    const allUsers = await usersCollection.find().toArray();
    let createdProfiles = 0;

    for (const user of allUsers) {
      try {
        switch (user.role) {
          case "brand":
            const brandExists = await brandProfilesCollection.findOne({
              user_id: user._id,
            });
            if (!brandExists) {
              await brandProfilesCollection.insertOne({
                user_id: user._id,
                unique_brand_id: `BRN-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
                total_campaigns: 0,
                active_campaigns: 0,
                total_spent: 0,
                profile_completed: false,
                created_at: new Date(),
                updated_at: new Date(),
              });
              createdProfiles++;
            }
            break;

          case "influencer":
            const influencerExists = await influencerProfilesCollection.findOne({
              user_id: user._id,
            });
            if (!influencerExists) {
              await influencerProfilesCollection.insertOne({
                user_id: user._id,
                profile_completed: false,
                created_at: new Date(),
                updated_at: new Date(),
              });
              createdProfiles++;
            }
            break;

          case "employee":
            const employeeExists = await employeeProfilesCollection.findOne({
              user_id: user._id,
            });
            if (!employeeExists) {
              await employeeProfilesCollection.insertOne({
                user_id: user._id,
                profile_completed: false,
                created_at: new Date(),
                updated_at: new Date(),
              });
              createdProfiles++;
            }
            break;

          case "client":
            const clientExists = await clientProfilesCollection.findOne({
              user_id: user._id,
            });
            if (!clientExists) {
              await clientProfilesCollection.insertOne({
                user_id: user._id,
                profile_completed: false,
                created_at: new Date(),
                updated_at: new Date(),
              });
              createdProfiles++;
            }
            break;
        }
      } catch (error) {
        console.error(`   ⚠️  Failed to create profile for user ${user.email}:`, error);
      }
    }

    console.log(`   ✅ Created ${createdProfiles} missing portal profiles\n`);

    // ========================================================================
    // STEP 6: Verify migration
    // ========================================================================
    console.log("✅ Step 6: Verification...");

    const finalCheck = await usersCollection.findOne();
    console.log("   Sample user after migration:", {
      _id: finalCheck?._id,
      full_name: finalCheck?.full_name,
      email: finalCheck?.email,
      role: finalCheck?.role,
      status: finalCheck?.status,
      profile_completed: finalCheck?.profile_completed,
      has_verified: "verified" in (finalCheck || {}),
      has_verified_at: "verified_at" in (finalCheck || {}),
      has_phone: "phone" in (finalCheck || {}),
      has_company: "company" in (finalCheck || {}),
    });

    const stillHaveDeprecated = await usersCollection.countDocuments({
      $or: [
        { verified: { $exists: true } },
        { verified_at: { $exists: true } },
        { phone: { $exists: true } },
        { company: { $exists: true } },
      ],
    });

    const stillHaveOldStatus = await usersCollection.countDocuments({
      status: { $in: ["PENDING", "REJECTED"] },
    });

    console.log(`   Users still with deprecated fields: ${stillHaveDeprecated}`);
    console.log(`   Users still with old status: ${stillHaveOldStatus}\n`);

    // ========================================================================
    // SUMMARY
    // ========================================================================
    console.log("=" .repeat(60));
    console.log("✅ MIGRATION COMPLETED SUCCESSFULLY!");
    console.log("=" .repeat(60));
    console.log(`📊 Summary:`);
    console.log(`   • Total users: ${totalUsers}`);
    console.log(`   • Migrated phone/company data: ${migratedDataCount}`);
    console.log(`   • Updated status (PENDING → INACTIVE): ${pendingUpdate.modifiedCount}`);
    console.log(`   • Updated status (REJECTED → SUSPENDED): ${rejectedUpdate.modifiedCount}`);
    console.log(`   • Removed deprecated fields: ${unsetResult.modifiedCount}`);
    console.log(`   • Created missing portal profiles: ${createdProfiles}`);
    console.log("=" .repeat(60));

    if (stillHaveDeprecated > 0 || stillHaveOldStatus > 0) {
      console.warn("\n⚠️  WARNING: Some users still have deprecated data. Please review.");
    }

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migration
migrateUsers();

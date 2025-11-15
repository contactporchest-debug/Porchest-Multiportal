// @ts-nocheck
/**
 * Database Utilities
 * Type-safe database operations using MongoDB native driver
 */

import { Collection, Db, ObjectId, Filter, UpdateFilter, FindOptions } from "mongodb";
import clientPromise from "@/lib/mongodb";
import type * as Types from "@/lib/db-types";

// ============================================================================
// DATABASE CONNECTION
// ============================================================================

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db("porchestDB");
}

// ============================================================================
// COLLECTION ACCESSORS (Type-safe)
// ============================================================================

export async function getCollection<T = any>(name: string): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}

// Typed collection accessors
export const collections = {
  users: () => getCollection<Types.User>("users"),
  campaigns: () => getCollection<Types.Campaign>("campaigns"),
  influencerProfiles: () => getCollection<Types.InfluencerProfile>("influencer_profiles"),
  brandProfiles: () => getCollection<Types.BrandProfile>("brand_profiles"),
  collaborationRequests: () => getCollection<Types.CollaborationRequest>("collaboration_requests"),
  projects: () => getCollection<Types.Project>("projects"),
  dailyReports: () => getCollection<Types.DailyReport>("daily_reports"),
  transactions: () => getCollection<Types.Transaction>("transactions"),
  notifications: () => getCollection<Types.Notification>("notifications"),
  analytics: () => getCollection<Types.Analytics>("analytics"),
  auditLogs: () => getCollection<Types.AuditLog>("audit_logs"),
  payments: () => getCollection<Types.Payment>("payments"),
  posts: () => getCollection<Types.Post>("posts"),
  fraudDetections: () => getCollection<Types.FraudDetection>("fraud_detections"),
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Safely convert string to ObjectId
 * @param id - String or ObjectId
 * @returns ObjectId or null if invalid
 */
export function toObjectId(id: string | ObjectId | undefined | null): ObjectId | null {
  if (!id) return null;
  if (id instanceof ObjectId) return id;
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

/**
 * Sanitize MongoDB document for API response
 * Converts ObjectId to string, Date to ISO string
 */
export function sanitizeDocument<T extends { _id?: any }>(doc: T): Types.Sanitized<T> {
  if (!doc) return doc as any;

  const sanitized = { ...doc } as any;

  // Convert _id
  if (sanitized._id && sanitized._id instanceof ObjectId) {
    sanitized._id = sanitized._id.toString();
  }

  // Convert all ObjectId fields to strings
  for (const key in sanitized) {
    const value = sanitized[key];

    if (value instanceof ObjectId) {
      sanitized[key] = value.toString();
    } else if (value instanceof Date) {
      sanitized[key] = value.toISOString();
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === "object" && item !== null ? sanitizeDocument(item) : item
      );
    } else if (value && typeof value === "object" && !(value instanceof Date)) {
      sanitized[key] = sanitizeDocument(value);
    }
  }

  // Remove sensitive fields
  delete sanitized.password_hash;
  delete sanitized.payment_details;

  return sanitized;
}

/**
 * Sanitize array of documents
 */
export function sanitizeDocuments<T extends { _id?: any }>(docs: T[]): Types.Sanitized<T>[] {
  return docs.map(sanitizeDocument);
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<Types.User | null> {
  const col = await collections.users();
  return col.findOne({ email: email.toLowerCase() });
}

/**
 * Get user by ID
 */
export async function getUserById(id: string | ObjectId): Promise<Types.User | null> {
  const objectId = toObjectId(id);
  if (!objectId) return null;

  const col = await collections.users();
  return col.findOne({ _id: objectId });
}

/**
 * Create user
 */
export async function createUser(data: Types.UserCreateInput): Promise<Types.User> {
  const col = await collections.users();

  const user: Omit<Types.User, "_id"> = {
    full_name: data.full_name,
    email: data.email.toLowerCase(),
    password_hash: data.password_hash,
    role: data.role,
    status: data.status || "PENDING",
    verified: data.verified || false,
    profile_completed: data.profile_completed || false,
    phone: data.phone,
    company: data.company,
    created_at: data.created_at || new Date(),
    updated_at: data.updated_at || new Date(),
  };

  const result = await col.insertOne(user as Types.User);
  return { ...user, _id: result.insertedId } as Types.User;
}

/**
 * Update user
 */
export async function updateUser(
  id: string | ObjectId,
  updates: Partial<Types.User>
): Promise<boolean> {
  const objectId = toObjectId(id);
  if (!objectId) return false;

  const col = await collections.users();
  const result = await col.updateOne(
    { _id: objectId },
    { $set: { ...updates, updated_at: new Date() } }
  );

  return result.modifiedCount > 0;
}

/**
 * Get campaign by ID
 */
export async function getCampaignById(id: string | ObjectId): Promise<Types.Campaign | null> {
  const objectId = toObjectId(id);
  if (!objectId) return null;

  const col = await collections.campaigns();
  return col.findOne({ _id: objectId });
}

/**
 * Create campaign
 */
export async function createCampaign(data: Types.CampaignCreateInput): Promise<Types.Campaign> {
  const col = await collections.campaigns();

  const campaign: Omit<Types.Campaign, "_id"> = {
    brand_id: data.brand_id,
    name: data.name,
    description: data.description,
    objectives: data.objectives || [],
    target_audience: data.target_audience,
    start_date: data.start_date,
    end_date: data.end_date,
    budget: data.budget,
    spent_amount: data.spent_amount || 0,
    status: data.status || "draft",
    metrics: {
      total_reach: 0,
      total_impressions: 0,
      total_engagement: 0,
      total_clicks: 0,
      total_conversions: 0,
      engagement_rate: 0,
      estimated_roi: 0,
      ...data.metrics,
    },
    influencers: data.influencers || [],
    sentiment_analysis: data.sentiment_analysis,
    created_at: data.created_at || new Date(),
    updated_at: data.updated_at || new Date(),
  };

  const result = await col.insertOne(campaign as Types.Campaign);
  return { ...campaign, _id: result.insertedId } as Types.Campaign;
}

/**
 * Update campaign
 */
export async function updateCampaign(
  id: string | ObjectId,
  updates: Partial<Types.Campaign>
): Promise<boolean> {
  const objectId = toObjectId(id);
  if (!objectId) return false;

  const col = await collections.campaigns();
  const result = await col.updateOne(
    { _id: objectId },
    { $set: { ...updates, updated_at: new Date() } }
  );

  return result.modifiedCount > 0;
}

/**
 * Get influencer profile by user ID
 */
export async function getInfluencerProfile(
  userId: string | ObjectId
): Promise<Types.InfluencerProfile | null> {
  const objectId = toObjectId(userId);
  if (!objectId) return null;

  const col = await collections.influencerProfiles();
  return col.findOne({ user_id: objectId });
}

/**
 * Create influencer profile
 */
export async function createInfluencerProfile(
  data: Types.InfluencerProfileCreateInput
): Promise<Types.InfluencerProfile> {
  const col = await collections.influencerProfiles();

  const profile: Omit<Types.InfluencerProfile, "_id"> = {
    user_id: data.user_id,
    bio: data.bio,
    profile_picture: data.profile_picture,
    social_media: data.social_media || {},
    total_followers: data.total_followers || 0,
    avg_engagement_rate: data.avg_engagement_rate || 0,
    content_categories: data.content_categories || [],
    primary_platform: data.primary_platform,
    demographics: data.demographics,
    pricing: data.pricing,
    total_earnings: data.total_earnings || 0,
    available_balance: data.available_balance || 0,
    completed_campaigns: data.completed_campaigns || 0,
    rating: data.rating || 0,
    reviews_count: data.reviews_count || 0,
    predicted_roi: data.predicted_roi,
    predicted_reach: data.predicted_reach,
    created_at: data.created_at || new Date(),
    updated_at: data.updated_at || new Date(),
  };

  const result = await col.insertOne(profile as Types.InfluencerProfile);
  return { ...profile, _id: result.insertedId } as Types.InfluencerProfile;
}

/**
 * Update influencer profile
 */
export async function updateInfluencerProfile(
  userId: string | ObjectId,
  updates: Partial<Types.InfluencerProfile>
): Promise<boolean> {
  const objectId = toObjectId(userId);
  if (!objectId) return false;

  const col = await collections.influencerProfiles();
  const result = await col.updateOne(
    { user_id: objectId },
    { $set: { ...updates, updated_at: new Date() } }
  );

  return result.modifiedCount > 0;
}

/**
 * Create transaction
 */
export async function createTransaction(
  data: Types.TransactionCreateInput
): Promise<Types.Transaction> {
  const col = await collections.transactions();

  const transaction: Omit<Types.Transaction, "_id"> = {
    user_id: data.user_id,
    type: data.type,
    amount: data.amount,
    status: data.status || "pending",
    description: data.description,
    reference_id: data.reference_id,
    campaign_id: data.campaign_id,
    collaboration_id: data.collaboration_id,
    payment_method: data.payment_method,
    payment_details: data.payment_details,
    created_at: data.created_at || new Date(),
    updated_at: data.updated_at || new Date(),
  };

  const result = await col.insertOne(transaction as Types.Transaction);
  return { ...transaction, _id: result.insertedId } as Types.Transaction;
}

/**
 * Create daily report
 */
export async function createDailyReport(
  data: Types.DailyReportCreateInput
): Promise<Types.DailyReport> {
  const col = await collections.dailyReports();

  const report: Omit<Types.DailyReport, "_id"> = {
    employee_id: data.employee_id,
    date: data.date,
    tasks_completed: data.tasks_completed,
    hours_worked: data.hours_worked,
    projects_worked_on: data.projects_worked_on,
    achievements: data.achievements,
    blockers: data.blockers,
    next_day_plan: data.next_day_plan,
    productivity_rating: data.productivity_rating,
    mood: data.mood,
    submitted_at: data.submitted_at || new Date(),
    created_at: data.created_at || new Date(),
    updated_at: data.updated_at || new Date(),
  };

  const result = await col.insertOne(report as Types.DailyReport);
  return { ...report, _id: result.insertedId } as Types.DailyReport;
}

/**
 * Create collaboration request
 */
export async function createCollaborationRequest(
  data: Types.CollaborationRequestCreateInput
): Promise<Types.CollaborationRequest> {
  const col = await collections.collaborationRequests();

  const request: Omit<Types.CollaborationRequest, "_id"> = {
    campaign_id: data.campaign_id,
    brand_id: data.brand_id,
    influencer_id: data.influencer_id,
    status: data.status || "pending",
    offer_amount: data.offer_amount,
    deliverables: data.deliverables,
    deadline: data.deadline,
    message: data.message,
    created_at: data.created_at || new Date(),
    updated_at: data.updated_at || new Date(),
  };

  const result = await col.insertOne(request as Types.CollaborationRequest);
  return { ...request, _id: result.insertedId } as Types.CollaborationRequest;
}

/**
 * Create audit log
 */
export async function createAuditLog(data: {
  user_id?: ObjectId;
  action: string;
  entity_type: string;
  entity_id?: ObjectId;
  ip_address?: string;
  user_agent?: string;
  changes?: { before?: any; after?: any };
  success: boolean;
  error_message?: string;
}): Promise<void> {
  const col = await collections.auditLogs();

  const log: Omit<Types.AuditLog, "_id"> = {
    ...data,
    timestamp: new Date(),
  };

  await col.insertOne(log as Types.AuditLog);
}

/**
 * Pagination helper
 */
export async function paginate<T>(
  collection: Collection<T>,
  filter: Filter<T>,
  page: number = 1,
  limit: number = 20,
  options?: FindOptions<T>
): Promise<Types.PaginatedResponse<T>> {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    collection.find(filter, options).skip(skip).limit(limit).toArray(),
    collection.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}

/**
 * Transaction wrapper for MongoDB operations
 */
export async function withTransaction<T>(
  callback: (session: any) => Promise<T>
): Promise<T> {
  const client = await clientPromise;
  const session = client.startSession();

  try {
    let result: T;
    await session.withTransaction(async () => {
      result = await callback(session);
    });
    return result!;
  } finally {
    await session.endSession();
  }
}

// Force dynamic rendering - API routes must NEVER be statically generated
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";


import { auth } from "@/lib/auth"
import { collections, toObjectId } from "@/lib/db"
import { successResponse, handleApiError, unauthorizedResponse, forbiddenResponse } from "@/lib/api-response"
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit"
import { z } from "zod"

const querySchema = z.object({
  limit: z.string().optional().default("50").transform(Number),
  skip: z.string().optional().default("0").transform(Number),
  action: z.string().optional(),
  entity_type: z.string().optional(),
  user_id: z.string().optional(),
  success: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
})

/**
 * GET /api/admin/audit-logs
 * Admin endpoint to retrieve system audit logs with filtering
 */
export const GET = withRateLimit(async (request: Request) => {
  try {
    // Authentication & Authorization
    const session = await auth()
    if (!session?.user) {
      return unauthorizedResponse()
    }

    if (session.user.role !== "admin") {
      return forbiddenResponse("Admin access required")
    }

    // Validate query parameters
    const { searchParams } = new URL(request.url)
    const validatedParams = querySchema.parse({
      limit: searchParams.get("limit") || undefined,
      skip: searchParams.get("skip") || undefined,
      action: searchParams.get("action") || undefined,
      entity_type: searchParams.get("entity_type") || undefined,
      user_id: searchParams.get("user_id") || undefined,
      success: searchParams.get("success") || undefined,
      start_date: searchParams.get("start_date") || undefined,
      end_date: searchParams.get("end_date") || undefined,
    })

    // Enforce max limit
    const limit = Math.min(validatedParams.limit, 100)
    const skip = validatedParams.skip

    // Build query filter
    const filter: any = {}

    if (validatedParams.action) {
      filter.action = { $regex: validatedParams.action, $options: "i" }
    }

    if (validatedParams.entity_type) {
      filter.entity_type = validatedParams.entity_type
    }

    if (validatedParams.user_id) {
      const userObjectId = toObjectId(validatedParams.user_id)
      if (!userObjectId) {
        return Response.json({ success: false, error: "Invalid user_id format" }, { status: 400 })
      }
      filter.user_id = userObjectId
    }

    if (validatedParams.success !== undefined) {
      filter.success = validatedParams.success === "true"
    }

    // Date range filtering
    if (validatedParams.start_date || validatedParams.end_date) {
      filter.timestamp = {}
      if (validatedParams.start_date) {
        filter.timestamp.$gte = new Date(validatedParams.start_date)
      }
      if (validatedParams.end_date) {
        filter.timestamp.$lte = new Date(validatedParams.end_date)
      }
    }

    // Get collections
    const auditLogsCollection = await collections.auditLogs()
    const usersCollection = await collections.users()

    // Fetch audit logs
    const logs = await auditLogsCollection
      .find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await auditLogsCollection.countDocuments(filter)

    // Enrich logs with user information
    const enrichedLogs = await Promise.all(
      logs.map(async (log) => {
        let userInfo = null
        if (log.user_id) {
          const logUser = await usersCollection.findOne(
            { _id: log.user_id },
            { projection: { email: 1, full_name: 1, role: 1 } }
          )
          if (logUser) {
            userInfo = {
              email: logUser.email,
              full_name: logUser.full_name,
              role: logUser.role,
            }
          }
        }

        return {
          _id: log._id.toString(),
          user_id: log.user_id?.toString(),
          user_info: userInfo,
          action: log.action,
          entity_type: log.entity_type,
          entity_id: log.entity_id?.toString(),
          changes: log.changes,
          success: log.success,
          error_message: log.error_message,
          ip_address: log.ip_address,
          user_agent: log.user_agent,
          timestamp: log.timestamp,
        }
      })
    )

    // Calculate stats
    const stats = {
      total_logs: total,
      failed_actions: await auditLogsCollection.countDocuments({ ...filter, success: false }),
      unique_users: (await auditLogsCollection.distinct("user_id", filter)).length,
    }

    return successResponse({
      logs: enrichedLogs,
      pagination: {
        total,
        limit,
        skip,
        has_more: total > skip + limit,
      },
      stats,
    })
  } catch (err) {
    return handleApiError(err, "Failed to fetch audit logs")
  }
}, RATE_LIMIT_CONFIGS.DEFAULT)

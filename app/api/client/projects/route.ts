import { auth } from "@/lib/auth"
import { collections, toObjectId } from "@/lib/db"
import { successResponse, handleApiError, unauthorizedResponse, forbiddenResponse } from "@/lib/api-response"
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit"
import { z } from "zod"

const createProjectSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  campaign_ids: z.array(z.string()).optional().default([]),
  deliverables: z.array(z.string()).optional().default([]),
  budget: z.number().min(0).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.enum(["planning", "active", "on_hold", "completed", "cancelled"]).optional().default("planning"),
})

/**
 * GET /api/client/projects
 * Get all projects for the authenticated client
 */
export const GET = withRateLimit(async (request: Request) => {
  try {
    const session = await auth()
    if (!session?.user) {
      return unauthorizedResponse()
    }

    if (session.user.role !== "client" && session.user.role !== "admin") {
      return forbiddenResponse("Client or Admin access required")
    }

    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100)
    const skip = parseInt(searchParams.get("skip") || "0")
    const status = searchParams.get("status")

    const filter: any = {}
    if (session.user.role === "client") {
      filter.client_id = toObjectId(session.user._id)
    }
    if (status && status !== "all") {
      filter.status = status
    }

    const projectsCollection = await collections.projects()
    const projects = await projectsCollection
      .find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await projectsCollection.countDocuments(filter)

    return successResponse({
      projects: projects.map((p) => ({
        _id: p._id.toString(),
        client_id: p.client_id.toString(),
        name: p.name,
        description: p.description,
        status: p.status,
        budget: p.budget,
        start_date: p.start_date,
        end_date: p.end_date,
        created_at: p.created_at,
      })),
      pagination: { total, limit, skip, has_more: total > skip + limit },
    })
  } catch (err) {
    return handleApiError(err, "Failed to fetch projects")
  }
}, RATE_LIMIT_CONFIGS.DEFAULT)

/**
 * POST /api/client/projects
 * Create a new project
 */
export const POST = withRateLimit(async (request: Request) => {
  try {
    const session = await auth()
    if (!session?.user) {
      return unauthorizedResponse()
    }

    if (session.user.role !== "client" && session.user.role !== "admin") {
      return forbiddenResponse("Client or Admin access required")
    }

    const body = await request.json()
    const validatedData = createProjectSchema.parse(body)

    const projectsCollection = await collections.projects()
    const newProject = {
      client_id: toObjectId(session.user._id)!,
      name: validatedData.name,
      description: validatedData.description,
      campaign_ids: validatedData.campaign_ids.map((id) => toObjectId(id)!).filter(Boolean),
      deliverables: validatedData.deliverables,
      budget: validatedData.budget,
      start_date: validatedData.start_date ? new Date(validatedData.start_date) : undefined,
      end_date: validatedData.end_date ? new Date(validatedData.end_date) : undefined,
      status: validatedData.status,
      progress_percentage: 0,
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = await projectsCollection.insertOne(newProject as any)

    return successResponse(
      {
        project: {
          _id: result.insertedId.toString(),
          ...newProject,
          client_id: newProject.client_id.toString(),
        },
      },
      "Project created successfully",
      201
    )
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ success: false, error: err.errors[0].message }, { status: 400 })
    }
    return handleApiError(err, "Failed to create project")
  }
}, RATE_LIMIT_CONFIGS.DEFAULT)

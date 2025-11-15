import { auth } from "@/lib/auth"
import { collections, toObjectId } from "@/lib/db"
import { successResponse, handleApiError, unauthorizedResponse, forbiddenResponse, notFoundResponse } from "@/lib/api-response"
import { z } from "zod"

const updateProjectSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  campaign_ids: z.array(z.string()).optional(),
  deliverables: z.array(z.string()).optional(),
  budget: z.number().min(0).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.enum(["planning", "active", "on_hold", "completed", "cancelled"]).optional(),
  progress_percentage: z.number().min(0).max(100).optional(),
})

/**
 * GET /api/client/projects/[id]
 * Get detailed information about a specific project
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return unauthorizedResponse()
    }

    if (session.user.role !== "client" && session.user.role !== "admin") {
      return forbiddenResponse("Client or Admin access required")
    }

    const projectId = toObjectId(params.id)
    if (!projectId) {
      return Response.json({ success: false, error: "Invalid project ID" }, { status: 400 })
    }

    const projectsCollection = await collections.projects()
    const project = await projectsCollection.findOne({ _id: projectId })

    if (!project) {
      return notFoundResponse("Project not found")
    }

    // Authorization check for clients
    if (session.user.role === "client" && project.client_id.toString() !== session.user._id) {
      return forbiddenResponse("You can only access your own projects")
    }

    return successResponse({
      project: {
        _id: project._id.toString(),
        client_id: project.client_id.toString(),
        name: project.name,
        description: project.description,
        status: project.status,
        budget: project.budget,
        deliverables: project.deliverables,
        start_date: project.start_date,
        end_date: project.end_date,
        progress_percentage: project.progress_percentage || 0,
        created_at: project.created_at,
        updated_at: project.updated_at,
      },
    })
  } catch (err) {
    return handleApiError(err, "Failed to fetch project")
  }
}

/**
 * PUT /api/client/projects/[id]
 * Update an existing project
 */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user) {
      return unauthorizedResponse()
    }

    if (session.user.role !== "client" && session.user.role !== "admin") {
      return forbiddenResponse("Client or Admin access required")
    }

    const projectId = toObjectId(params.id)
    if (!projectId) {
      return Response.json({ success: false, error: "Invalid project ID" }, { status: 400 })
    }

    const body = await request.json()
    const validatedData = updateProjectSchema.parse(body)

    const projectsCollection = await collections.projects()
    const existingProject = await projectsCollection.findOne({ _id: projectId })

    if (!existingProject) {
      return notFoundResponse("Project not found")
    }

    // Authorization check for clients
    if (session.user.role === "client" && existingProject.client_id.toString() !== session.user._id) {
      return forbiddenResponse("You can only update your own projects")
    }

    const updateData: any = { updated_at: new Date() }
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.budget !== undefined) updateData.budget = validatedData.budget
    if (validatedData.deliverables !== undefined) updateData.deliverables = validatedData.deliverables
    if (validatedData.status !== undefined) updateData.status = validatedData.status
    if (validatedData.progress_percentage !== undefined) updateData.progress_percentage = validatedData.progress_percentage
    if (validatedData.start_date !== undefined) updateData.start_date = new Date(validatedData.start_date)
    if (validatedData.end_date !== undefined) updateData.end_date = new Date(validatedData.end_date)

    if (validatedData.campaign_ids !== undefined) {
      updateData.campaign_ids = validatedData.campaign_ids.map((id) => toObjectId(id)!).filter(Boolean)
    }

    await projectsCollection.updateOne({ _id: projectId }, { $set: updateData })

    const updatedProject = await projectsCollection.findOne({ _id: projectId })

    return successResponse(
      {
        project: {
          _id: updatedProject!._id.toString(),
          client_id: updatedProject!.client_id.toString(),
          name: updatedProject!.name,
          description: updatedProject!.description,
          status: updatedProject!.status,
          budget: updatedProject!.budget,
          deliverables: updatedProject!.deliverables,
          start_date: updatedProject!.start_date,
          end_date: updatedProject!.end_date,
          progress_percentage: updatedProject!.progress_percentage,
          created_at: updatedProject!.created_at,
          updated_at: updatedProject!.updated_at,
        },
      },
      "Project updated successfully"
    )
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ success: false, error: err.errors[0].message }, { status: 400 })
    }
    return handleApiError(err, "Failed to update project")
  }
}

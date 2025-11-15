// Force dynamic rendering - API routes must NEVER be statically generated
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";


import { auth } from "@/lib/auth";
import { collections, paginate, sanitizeDocuments } from "@/lib/db";
import {
  successResponse,
  unauthorizedResponse,
  handleApiError,
  paginatedResponse,
} from "@/lib/api-response";
import { validateQuery, getUsersFilterSchema } from "@/lib/validations";

/**
 * GET /api/admin/users
 * List all users with optional filters (admin only)
 */
export async function GET(req: Request) {
  try {
    // Check authentication and authorization
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return unauthorizedResponse(
        "Admin access required to view all users"
      );
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(req.url);
    const filters = validateQuery(getUsersFilterSchema, searchParams);

    // Build MongoDB filter (now type-safe and validated)
    const filter: any = {};
    if (filters.role) filter.role = filters.role;
    if (filters.status) filter.status = filters.status;

    // Get paginated users
    const usersCollection = await collections.users();
    const result = await paginate(
      usersCollection,
      filter,
      filters.page,
      filters.limit,
      { sort: { created_at: -1 } }
    );

    // Sanitize user data (removes sensitive fields)
    const sanitizedUsers = sanitizeDocuments(result.items);

    return paginatedResponse({
      items: sanitizedUsers,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

import { auth } from "@/lib/auth";
import { collections, sanitizeDocuments, paginate } from "@/lib/db";
import {
  successResponse,
  unauthorizedResponse,
  paginatedResponse,
  handleApiError,
} from "@/lib/api-response";
import { validateQuery } from "@/lib/validations";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/rate-limit";
import { z } from "zod";

// Validation schema for query parameters
const getPendingUsersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  role: z.enum(["brand", "influencer", "client", "employee"]).optional(),
});

/**
 * GET /api/admin/pending-users
 * Get all pending users awaiting admin approval (admin only)
 * Supports pagination and filtering by role
 *
 * RATE LIMIT: 100 requests per minute per IP
 */
async function getPendingUsersHandler(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user || session.user.role !== "admin") {
      return unauthorizedResponse("Admin access required");
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(req.url);
    const queryParams = validateQuery(getPendingUsersSchema, searchParams);

    // Build filter
    const filter: Record<string, any> = {
      status: "PENDING",
    };

    // Add role filter if provided
    if (queryParams.role) {
      filter.role = queryParams.role;
    }

    // Get users collection
    const usersCollection = await collections.users();

    // Fetch pending users with pagination
    const result = await paginate(
      usersCollection,
      filter,
      queryParams.page,
      queryParams.limit
    );

    // Sanitize users (remove password_hash and other sensitive fields)
    const sanitizedUsers = sanitizeDocuments(result.items);

    return paginatedResponse({
      items: sanitizedUsers,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Export with rate limiting applied
export const GET = withRateLimit(getPendingUsersHandler, RATE_LIMIT_CONFIGS.admin);

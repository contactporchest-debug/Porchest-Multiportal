/**
 * API Response Utilities
 * Standardized response formatting for all API routes
 */

import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { formatValidationError } from "@/lib/validations";

/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

/**
 * Success response
 */
export function successResponse<T>(
  data: T,
  status: number = 200,
  meta?: Partial<ApiResponse["meta"]>
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    },
    { status }
  );
}

/**
 * Error response
 */
export function errorResponse(
  message: string,
  status: number = 400,
  code?: string,
  details?: any
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code,
        details,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    },
    { status }
  );
}

/**
 * Validation error response
 */
export function validationErrorResponse(
  error: ZodError
): NextResponse<ApiResponse> {
  const formatted = formatValidationError(error);
  return errorResponse(
    formatted.message,
    400,
    "VALIDATION_ERROR",
    formatted.errors
  );
}

/**
 * Not found response
 */
export function notFoundResponse(
  resource: string = "Resource"
): NextResponse<ApiResponse> {
  return errorResponse(`${resource} not found`, 404, "NOT_FOUND");
}

/**
 * Unauthorized response
 */
export function unauthorizedResponse(
  message: string = "Unauthorized access"
): NextResponse<ApiResponse> {
  return errorResponse(message, 401, "UNAUTHORIZED");
}

/**
 * Forbidden response
 */
export function forbiddenResponse(
  message: string = "Forbidden"
): NextResponse<ApiResponse> {
  return errorResponse(message, 403, "FORBIDDEN");
}

/**
 * Conflict response
 */
export function conflictResponse(
  message: string = "Resource already exists"
): NextResponse<ApiResponse> {
  return errorResponse(message, 409, "CONFLICT");
}

/**
 * Internal server error response
 */
export function internalServerErrorResponse(
  message: string = "Internal server error",
  details?: any
): NextResponse<ApiResponse> {
  // Log the error for debugging (will be replaced with proper logging in Phase 7)
  if (details) {
    console.error("Internal Server Error:", details);
  }

  // Don't expose internal details in production
  const exposedDetails =
    process.env.NODE_ENV === "development" ? details : undefined;

  return errorResponse(message, 500, "INTERNAL_ERROR", exposedDetails);
}

/**
 * Bad request response
 */
export function badRequestResponse(
  message: string = "Bad request",
  details?: any
): NextResponse<ApiResponse> {
  return errorResponse(message, 400, "BAD_REQUEST", details);
}

/**
 * Too many requests response (for rate limiting)
 */
export function tooManyRequestsResponse(
  message: string = "Too many requests",
  retryAfter?: number
): NextResponse<ApiResponse> {
  const response = errorResponse(message, 429, "TOO_MANY_REQUESTS");
  if (retryAfter) {
    response.headers.set("Retry-After", retryAfter.toString());
  }
  return response;
}

/**
 * Created response
 */
export function createdResponse<T>(
  data: T,
  location?: string
): NextResponse<ApiResponse<T>> {
  const response = successResponse(data, 201);
  if (location) {
    response.headers.set("Location", location);
  }
  return response;
}

/**
 * No content response
 */
export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

/**
 * Paginated response
 */
export interface PaginatedData<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function paginatedResponse<T>(
  data: PaginatedData<T>,
  status: number = 200
): NextResponse<ApiResponse<PaginatedData<T>>> {
  return successResponse(data, status);
}

/**
 * Handle API errors consistently
 * Use this in try-catch blocks to ensure consistent error handling
 */
export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  // Zod validation errors
  if (error instanceof ZodError) {
    return validationErrorResponse(error);
  }

  // MongoDB duplicate key error
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === 11000
  ) {
    return conflictResponse("Resource already exists");
  }

  // Custom error with status
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    const errorObj = error as { message: string; status?: number };
    const status = errorObj.status || 500;
    return errorResponse(errorObj.message, status);
  }

  // Generic error
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred";

  return internalServerErrorResponse(message, error);
}

/**
 * Async error handler wrapper for API routes
 * Automatically catches errors and returns appropriate responses
 */
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<NextResponse<ApiResponse<R>>>
) {
  return async (...args: T): Promise<NextResponse<ApiResponse<R>>> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error) as NextResponse<ApiResponse<R>>;
    }
  };
}

/**
 * Cache control headers
 */
export function withCacheHeaders(
  response: NextResponse,
  maxAge: number = 0,
  sMaxAge?: number
): NextResponse {
  if (maxAge === 0) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
  } else {
    const cacheControl = [`public`, `max-age=${maxAge}`];
    if (sMaxAge) {
      cacheControl.push(`s-maxage=${sMaxAge}`);
    }
    response.headers.set("Cache-Control", cacheControl.join(", "));
  }
  return response;
}

/**
 * CORS headers (if needed)
 */
export function withCorsHeaders(
  response: NextResponse,
  origin: string = "*"
): NextResponse {
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return response;
}

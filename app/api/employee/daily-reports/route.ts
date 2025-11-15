import { auth } from "@/lib/auth";
import { collections, getUserByEmail, toObjectId, sanitizeDocuments } from "@/lib/db";
import {
  successResponse,
  unauthorizedResponse,
  notFoundResponse,
  conflictResponse,
  handleApiError,
  createdResponse,
} from "@/lib/api-response";
import { validateRequest, validateQuery } from "@/lib/validations";
import { z } from "zod";

// Validation schema for daily report submission
const dailyReportSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  projects_worked_on: z.array(z.string()).optional().default([]),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  blockers: z.string().optional().default(""),
  achievements: z.array(z.string()).optional().default([]),
  next_day_plan: z.string().optional().default(""),
  total_hours: z.number().min(0).max(24, "Total hours must be between 0 and 24").optional().default(0),
});

// Validation schema for GET query params
const getDailyReportsSchema = z.object({
  employeeId: z.string().optional(),
});

/**
 * POST /api/employee/daily-reports
 * Submit a daily report (employee only)
 * Uses unique index to prevent duplicate submissions for same date
 */
export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user || session.user.role !== "employee") {
      return unauthorizedResponse("Employee access required");
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = validateRequest(dailyReportSchema, body);

    // Get user
    const user = await getUserByEmail(session.user.email!);
    if (!user) {
      return notFoundResponse("User");
    }

    // Parse date
    const reportDate = new Date(validatedData.date);
    reportDate.setHours(0, 0, 0, 0); // Normalize to start of day

    // Create report
    // NOTE: MongoDB should have a unique index on {employee_id: 1, date: 1}
    // This prevents duplicate submissions at the database level
    const dailyReportsCollection = await collections.dailyReports();

    try {
      const result = await dailyReportsCollection.insertOne({
        employee_id: user._id,
        date: reportDate,
        projects_worked_on: validatedData.projects_worked_on?.map(id => toObjectId(id)!),
        summary: validatedData.summary,
        blockers: validatedData.blockers,
        achievements: validatedData.achievements,
        next_day_plan: validatedData.next_day_plan,
        total_hours: validatedData.total_hours,
        status: "submitted",
        created_at: new Date(),
        updated_at: new Date(),
      } as any);

      return createdResponse({
        message: "Daily report submitted successfully",
        report_id: result.insertedId.toString(),
        date: reportDate.toISOString(),
      });
    } catch (error: any) {
      // Handle MongoDB duplicate key error (E11000)
      if (error.code === 11000) {
        return conflictResponse(
          `You have already submitted a daily report for ${reportDate.toLocaleDateString()}`
        );
      }
      throw error;
    }
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * GET /api/employee/daily-reports
 * Get daily reports
 * - Employees can only see their own reports
 * - Admins can see all reports or filter by employee
 */
export async function GET(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user || !["employee", "admin"].includes(session.user.role)) {
      return unauthorizedResponse("Employee or admin access required");
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(req.url);
    const queryParams = validateQuery(getDailyReportsSchema, searchParams);

    // Get user
    const user = await getUserByEmail(session.user.email!);
    if (!user) {
      return notFoundResponse("User");
    }

    // Build filter based on role
    const filter: Record<string, any> = {};

    if (session.user.role === "employee") {
      // Employees can only see their own reports
      filter.employee_id = user._id;
    } else if (session.user.role === "admin" && queryParams.employeeId) {
      // Admins can filter by specific employee
      const employeeObjectId = toObjectId(queryParams.employeeId);
      if (!employeeObjectId) {
        return notFoundResponse("Employee");
      }
      filter.employee_id = employeeObjectId;
    }
    // If admin without filter, return all reports (no filter)

    // Get daily reports
    const dailyReportsCollection = await collections.dailyReports();
    const reports = await dailyReportsCollection
      .find(filter)
      .sort({ date: -1 })
      .limit(30) // Limit to 30 most recent reports
      .toArray();

    // Sanitize reports
    const sanitizedReports = sanitizeDocuments(reports);

    return successResponse({
      reports: sanitizedReports,
      count: sanitizedReports.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

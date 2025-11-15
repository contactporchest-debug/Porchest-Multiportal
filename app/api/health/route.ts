import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

/**
 * GET /api/health
 * Health check endpoint for monitoring and deployment verification
 *
 * Returns:
 * - 200 OK: All systems operational
 * - 503 Service Unavailable: Database connection failed
 *
 * Response includes:
 * - status: "healthy" | "unhealthy"
 * - timestamp: Current ISO timestamp
 * - services: Status of each service (database, etc.)
 * - version: Application version
 * - uptime: Process uptime in seconds
 */
export async function GET() {
  const startTime = Date.now();
  const healthStatus: {
    status: "healthy" | "unhealthy";
    timestamp: string;
    responseTime?: number;
    services: {
      database: {
        status: "connected" | "disconnected" | "error";
        responseTime?: number;
        error?: string;
      };
      application: {
        status: "running";
        uptime: number;
        memory: {
          used: number;
          total: number;
          percentage: number;
        };
      };
    };
    version: string;
    environment: string;
  } = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      database: {
        status: "disconnected",
      },
      application: {
        status: "running",
        uptime: process.uptime(),
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
          percentage: Math.round(
            (process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100
          ),
        },
      },
    },
    version: process.env.npm_package_version || "0.1.0",
    environment: process.env.NODE_ENV || "development",
  };

  try {
    // Check database connection
    const dbStartTime = Date.now();
    const client = await clientPromise;
    const db = client.db("porchestDB");

    // Perform a simple ping to verify connection
    await db.admin().ping();

    healthStatus.services.database = {
      status: "connected",
      responseTime: Date.now() - dbStartTime,
    };
  } catch (error) {
    healthStatus.status = "unhealthy";
    healthStatus.services.database = {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown database error",
    };

    // Return 503 Service Unavailable if database is down
    return NextResponse.json(
      {
        ...healthStatus,
        responseTime: Date.now() - startTime,
      },
      { status: 503 }
    );
  }

  // Calculate total response time
  healthStatus.responseTime = Date.now() - startTime;

  // Return 200 OK with health status
  return NextResponse.json(healthStatus, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}

/**
 * HEAD /api/health
 * Lightweight health check (returns only status code)
 * Useful for monitoring systems that only need to check availability
 */
export async function HEAD() {
  try {
    const client = await clientPromise;
    const db = client.db("porchestDB");
    await db.admin().ping();

    return new NextResponse(null, { status: 200 });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}

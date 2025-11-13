import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "employee") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const {
      date,
      projects_worked_on,
      summary,
      blockers,
      achievements,
      next_day_plan,
      total_hours,
    } = body;

    if (!date || !summary) {
      return NextResponse.json(
        { error: "Date and summary are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("porchestDB");

    const user = await db.collection("users").findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if report already exists for this date
    const existingReport = await db.collection("daily_reports").findOne({
      employee_id: user._id,
      date: new Date(date),
    });

    if (existingReport) {
      return NextResponse.json(
        { error: "Report already submitted for this date" },
        { status: 400 }
      );
    }

    // Create report
    const result = await db.collection("daily_reports").insertOne({
      employee_id: user._id,
      date: new Date(date),
      projects_worked_on: projects_worked_on || [],
      summary,
      blockers: blockers || "",
      achievements: achievements || [],
      next_day_plan: next_day_plan || "",
      total_hours: total_hours || 0,
      status: "submitted",
      created_at: new Date(),
    });

    return NextResponse.json({
      success: true,
      report_id: result.insertedId.toString(),
      message: "Daily report submitted successfully",
    });
  } catch (error) {
    console.error("Submit daily report error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !["employee", "admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");

    const client = await clientPromise;
    const db = client.db("porchestDB");

    const user = await db.collection("users").findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Build filter
    let filter: any = {};
    if (session.user.role === "employee") {
      filter.employee_id = user._id;
    } else if (employeeId) {
      filter.employee_id = new ObjectId(employeeId);
    }

    const reports = await db
      .collection("daily_reports")
      .find(filter)
      .sort({ date: -1 })
      .limit(30)
      .toArray();

    return NextResponse.json({
      success: true,
      reports: reports.map((r) => ({
        ...r,
        _id: r._id.toString(),
        employee_id: r.employee_id.toString(),
      })),
    });
  } catch (error) {
    console.error("Get daily reports error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

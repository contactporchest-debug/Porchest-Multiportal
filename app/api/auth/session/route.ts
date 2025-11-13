import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { user: null },
        {
          status: 401,
          headers: {
            "Cache-Control": "no-store, must-revalidate",
          },
        }
      );
    }

    // Return user info with short cache lifetime
    return NextResponse.json(
      {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
          status: session.user.status,
          image: session.user.image,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, max-age=60", // cache for 1 minute
        },
      }
    );
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}

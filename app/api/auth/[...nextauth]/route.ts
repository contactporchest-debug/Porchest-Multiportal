import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;

// Ensure this route runs in the Node.js runtime (required for MongoDB)
export const runtime = "nodejs";

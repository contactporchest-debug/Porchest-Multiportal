// Shared types that can be used on both client and server
// This file must NOT import any server-only modules

// Re-export common types from db-types for convenience
export type { UserRole, UserStatus } from "@/lib/db-types";

// Client-safe User interface (for session data, UI components)
export interface User {
  id: string;
  email: string;
  name?: string | null;
  role?: UserRole;
  status?: UserStatus;
  image?: string | null;
}

// Re-export campaign and collaboration status types
export type {
  CampaignStatus,
  CollaborationStatus,
  ProjectStatus,
  TransactionType,
  TransactionStatus,
  NotificationType,
} from "@/lib/db-types";

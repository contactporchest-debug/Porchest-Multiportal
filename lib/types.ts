// Shared types that can be used on both client and server
// This file must NOT import any server-only modules

export type UserRole = "brand" | "influencer" | "client" | "employee" | "admin";

export type UserStatus = "PENDING" | "ACTIVE" | "REJECTED" | "SUSPENDED";

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role?: UserRole;
  status?: UserStatus;
  image?: string | null;
}

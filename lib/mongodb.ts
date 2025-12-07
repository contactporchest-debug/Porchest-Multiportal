/**
 * MongoDB Connection Module
 *
 * This module provides a lazy-loaded, singleton MongoDB client connection with:
 * - Automatic retry logic with exponential backoff
 * - Connection pooling for performance
 * - Development hot-reload support (prevents connection leaks)
 * - Lazy initialization to avoid build-time connections
 * - TLS/SSL encryption for secure connections
 *
 * The connection is created on-demand (lazy loading) which prevents MongoDB
 * connection attempts during Next.js build phase, avoiding build failures.
 *
 * Usage:
 * import clientPromise from "@/lib/mongodb";
 * const client = await clientPromise;
 * const db = client.db("database_name");
 */

import "server-only"; // Ensures this module only runs on the server
import { MongoClient } from "mongodb";
import { logger } from "./logger"; // Application logger for connection status

// Global type declaration for development singleton pattern
// This allows us to persist the MongoDB connection across hot reloads in development
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

/**
 * MongoDB Connection Options
 *
 * These options configure the MongoDB client for:
 * - Security: TLS/SSL encryption
 * - Performance: Connection pooling (2-10 connections)
 * - Reliability: Automatic retry for reads and writes
 * - Fast failure: 10-second timeouts to detect issues quickly
 */
const options = {
  tls: true, // Enable TLS/SSL encryption for secure connections
  serverSelectionTimeoutMS: 10000, // Timeout after 10s if no server found
  connectTimeoutMS: 10000, // Fail early if connection cannot establish within 10s
  maxPoolSize: 10, // Maximum connection pool size (reuse connections for efficiency)
  minPoolSize: 2, // Minimum connection pool size (keep connections ready)
  retryWrites: true, // Automatically retry write operations on transient failures
  retryReads: true, // Automatically retry read operations on transient failures
};

/**
 * Connection Retry Logic with Exponential Backoff
 *
 * Attempts to connect to MongoDB with automatic retries on failure.
 * Uses exponential backoff to avoid overwhelming the database server:
 * - Attempt 1: Connect immediately
 * - Attempt 2: Wait 2 seconds, then retry
 * - Attempt 3: Wait 4 seconds, then retry
 * - Attempt 4: Wait 8 seconds, then retry
 * - Attempt 5: Wait 16 seconds, then retry
 *
 * This strategy helps handle transient network issues or temporary database unavailability.
 *
 * @param client - MongoClient instance to connect
 * @param maxRetries - Maximum number of retry attempts (default: 4)
 * @param baseDelay - Base delay in milliseconds for exponential backoff (default: 2000ms)
 * @returns Connected MongoClient instance
 * @throws Error if all retry attempts fail
 */
async function connectWithRetry(
  client: MongoClient,
  maxRetries: number = 4,
  baseDelay: number = 2000
): Promise<MongoClient> {
  // Attempt connection up to maxRetries + 1 times (initial attempt + retries)
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Attempt to connect to MongoDB
      const connectedClient = await client.connect();
      return connectedClient; // Connection successful!
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;

      // If this was the last attempt, log error and throw
      if (isLastAttempt) {
        logger.error(`MongoDB connection failed after ${maxRetries + 1} attempts`, error, {
          attempts: maxRetries + 1,
        });
        throw error; // Rethrow the error to be handled by caller
      }

      // Calculate delay using exponential backoff: 2s, 4s, 8s, 16s
      const delay = baseDelay * Math.pow(2, attempt);

      // Log warning about failed attempt
      logger.warn(`MongoDB connection attempt ${attempt + 1} failed. Retrying in ${delay}ms`, {
        attempt: attempt + 1,
        delay,
      });

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // TypeScript exhaustiveness check - this should never be reached
  throw new Error("Unreachable: retry loop should have returned or thrown");
}

/**
 * Lazy Initialization
 *
 * The connection is not created when this module is imported.
 * Instead, it's created on-demand when first accessed.
 * This prevents MongoDB connection attempts during Next.js build phase.
 */
let clientPromise: Promise<MongoClient> | undefined;

/**
 * Get MongoDB Client Promise
 *
 * This function implements lazy initialization and singleton pattern:
 * 1. Returns cached promise if connection already exists
 * 2. Validates MONGODB_URI environment variable
 * 3. Creates MongoDB client with connection pooling
 * 4. In development: Uses global singleton to prevent connection leaks during hot reload
 * 5. In production: Creates fresh connection
 *
 * @returns Promise that resolves to connected MongoClient
 * @throws Error if MONGODB_URI is missing or connection fails
 */
function getMongoClientPromise(): Promise<MongoClient> {
  // Return cached promise if already initialized (singleton pattern)
  if (clientPromise) {
    return clientPromise;
  }

  // Validate URI at runtime, not at module import time
  // This allows Next.js build to complete without MongoDB connection
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "Missing MONGODB_URI environment variable. Set it in .env.local or Vercel environment variables."
    );
  }

  /**
   * Singleton Client Pattern
   *
   * Development: Store client in global to survive hot reloads
   * Production: Create new client (no hot reloads in production)
   */
  if (process.env.NODE_ENV === "development") {
    // In development, use global variable to preserve connection across hot reloads
    // This prevents creating new connections every time code changes
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      global._mongoClientPromise = connectWithRetry(client)
        .then((connectedClient) => {
          logger.info("MongoDB Connected (development)");
          return connectedClient;
        })
        .catch((err) => {
          logger.error("MongoDB connection failed", err);
          throw err;
        });
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production, create a fresh connection
    const client = new MongoClient(uri, options);
    clientPromise = connectWithRetry(client)
      .then((connectedClient) => {
        logger.info("MongoDB Connected (production)");
        return connectedClient;
      })
      .catch((err) => {
        logger.error("MongoDB connection failed", err);
        throw err;
      });
  }

  return clientPromise;
}

/**
 * Lazy Client Promise Export
 *
 * This Promise-like object defers MongoDB connection until it's actually needed.
 * It implements the Promise interface (then, catch, finally) but doesn't create
 * the connection until one of these methods is called.
 *
 * This prevents build-time connections which would cause Next.js build failures.
 *
 * Usage:
 * const client = await clientPromise;
 * const db = client.db("porchest_db");
 */
const lazyClientPromise = {
  then: (onfulfilled?: any, onrejected?: any) =>
    getMongoClientPromise().then(onfulfilled, onrejected),
  catch: (onrejected?: any) => getMongoClientPromise().catch(onrejected),
  finally: (onfinally?: any) => getMongoClientPromise().finally(onfinally),
} as Promise<MongoClient>;

export default lazyClientPromise;
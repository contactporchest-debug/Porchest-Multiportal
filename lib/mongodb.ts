import "server-only";
import { MongoClient } from "mongodb";
import { logger } from "./logger";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// --- CONNECTION OPTIONS --- //
const options = {
  tls: true,
  serverSelectionTimeoutMS: 10000, // Timeout after 10s if no server found
  connectTimeoutMS: 10000,         // Fail early if connection cannot establish
  maxPoolSize: 10,                 // Maximum connection pool size
  minPoolSize: 2,                  // Minimum connection pool size
  retryWrites: true,               // Automatically retry write operations
  retryReads: true,                // Automatically retry read operations
};

// --- RETRY LOGIC WITH EXPONENTIAL BACKOFF --- //
async function connectWithRetry(
  client: MongoClient,
  maxRetries: number = 4,
  baseDelay: number = 2000
): Promise<MongoClient> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const connectedClient = await client.connect();
      return connectedClient;
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;

      if (isLastAttempt) {
        logger.error(`MongoDB connection failed after ${maxRetries + 1} attempts`, error, {
          attempts: maxRetries + 1,
        });
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff: 2s, 4s, 8s, 16s
      logger.warn(`MongoDB connection attempt ${attempt + 1} failed. Retrying in ${delay}ms`, {
        attempt: attempt + 1,
        delay,
      });
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // TypeScript exhaustiveness check
  throw new Error("Unreachable: retry loop should have returned or thrown");
}

// --- LAZY INITIALIZATION --- //
// This ensures MongoDB connection is only attempted at runtime, not during build
let clientPromise: Promise<MongoClient> | undefined;

function getMongoClientPromise(): Promise<MongoClient> {
  // Return cached promise if already initialized
  if (clientPromise) {
    return clientPromise;
  }

  // Validate URI at runtime, not at module import time
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "Missing MONGODB_URI environment variable. Set it in .env.local or Vercel environment variables."
    );
  }

  // --- SINGLETON CLIENT PATTERN --- //
  if (process.env.NODE_ENV === "development") {
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

// Export a Promise-like object that defers initialization until consumed
// This prevents MongoDB connection during Next.js build phase
const lazyClientPromise = {
  then: (onfulfilled?: any, onrejected?: any) =>
    getMongoClientPromise().then(onfulfilled, onrejected),
  catch: (onrejected?: any) => getMongoClientPromise().catch(onrejected),
  finally: (onfinally?: any) => getMongoClientPromise().finally(onfinally),
} as Promise<MongoClient>;

export default lazyClientPromise;
import "server-only";
import { MongoClient } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// --- CONNECTION OPTIONS --- //
const options = {
  tls: true,
  serverSelectionTimeoutMS: 10000, // Timeout after 10s if no server found
  connectTimeoutMS: 10000,         // Fail early if connection cannot establish
};

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
      global._mongoClientPromise = client
        .connect()
        .then((connectedClient) => {
          console.log("✅ MongoDB Connected (development)");
          return connectedClient;
        })
        .catch((err) => {
          console.error("❌ MongoDB connection failed:", err.message);
          throw err;
        });
    }
    clientPromise = global._mongoClientPromise;
  } else {
    const client = new MongoClient(uri, options);
    clientPromise = client
      .connect()
      .then((connectedClient) => {
        console.log("✅ MongoDB Connected (production)");
        return connectedClient;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
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
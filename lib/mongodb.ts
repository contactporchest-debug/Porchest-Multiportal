import "server-only";
import { MongoClient } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// --- CONFIGURATION --- //
const uri = process.env.MONGODB_URI;
if (!uri) {
  if (typeof window === "undefined") {
    console.warn(
      "[Porchest] ❗ MONGODB_URI is missing. Database features will not work until you set it in .env.local or Vercel environment variables."
    );
  }
  throw new Error("Missing MONGODB_URI environment variable");
}

// --- CONNECTION OPTIONS --- //
const options = {
  tls: true,
  serverSelectionTimeoutMS: 10000, // Timeout after 10s if no server found
  connectTimeoutMS: 10000,         // Fail early if connection cannot establish
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// --- SINGLETON CLIENT PATTERN --- //
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
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
  client = new MongoClient(uri, options);
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

export default clientPromise;
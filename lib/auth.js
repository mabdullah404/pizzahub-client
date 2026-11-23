import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

// Support all standard MongoDB environment variable aliases
let rawUri = (
  process.env.BETTER_AUTH_DB_URL ||
  process.env.MONGODB_URI ||
  process.env.MONGODB_URL ||
  process.env.MONGO_URI ||
  process.env.DATABASE_URL ||
  process.env.BETTER_AUTH_DATABASE_URL ||
  ""
)
  .trim()
  .replace(/^["']|["']$/g, "");

// Self-healing: Fix common copy-paste typo where authSource=admin was cut off to authSource=admi
if (rawUri.includes("authSource=admi") && !rawUri.includes("authSource=admin")) {
  rawUri = rawUri.replace(/authSource=admi\b/gi, "authSource=admin");
}

const connectionString = rawUri;

if (!connectionString) {
  console.warn("⚠️ [Auth] No MongoDB connection string found in environment variables (BETTER_AUTH_DB_URL, MONGODB_URI, MONGODB_URL).");
}

const globalForMongo = globalThis;
export const mongoClient =
  globalForMongo.__pizzaHubMongoClient ??
  new MongoClient(connectionString || "mongodb://localhost:27017/pizzaHubDB", {
    maxPoolSize: 10,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 10000,
  });

globalForMongo.__pizzaHubMongoClient = mongoClient;

const db = mongoClient.db(process.env.DB_NAME || "pizzaHubDB");

const googleClientId = (
  process.env.GOOGLE_CLIENT_ID ||
  process.env.BETTER_AUTH_GOOGLE_CLIENT_ID ||
  ""
).trim();

const googleClientSecret = (
  process.env.GOOGLE_CLIENT_SECRET ||
  process.env.BETTER_AUTH_GOOGLE_SECRET ||
  ""
).trim();

const getBaseURL = () => {
  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000";
  }
  if (process.env.BETTER_AUTH_URL && !process.env.BETTER_AUTH_URL.includes("localhost")) {
    return process.env.BETTER_AUTH_URL;
  }
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL && !process.env.NEXT_PUBLIC_BETTER_AUTH_URL.includes("localhost")) {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "https://pizzahub-client-tan.vercel.app";
};

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "PizzaHubProductionAuthSecretKey2026",
  baseURL: getBaseURL(),

  trustedOrigins: [
    getBaseURL(),
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    "https://pizzahub-client-tan.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ].filter(Boolean),

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        input: true,
        defaultValue: "customer",
      },
      isBlocked: {
        type: "boolean",
        input: false,
        defaultValue: false,
      },
      banned: {
        type: "boolean",
        input: false,
        defaultValue: false,
      },
      businessName: {
        type: "string",
        input: true,
        defaultValue: "",
      },
      subscriptionPlan: {
        type: "string",
        input: false,
        defaultValue: "free",
      },
      subscriptionExpiresAt: {
        type: "date",
        input: false,
        required: false,
      },
    },
  },

  plugins: [],

  ...(googleClientId && googleClientSecret
    ? {
        socialProviders: {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            prompt: "select_account",
          },
        },
      }
    : {}),

  database: mongodbAdapter(db, {
    client: mongoClient,
    transaction: false,
  }),
});

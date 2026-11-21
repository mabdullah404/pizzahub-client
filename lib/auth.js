import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const fallbackMongoUri =
  "mongodb://pizzaHub:SohLLBqoigGtaAXO@ac-3ww2xt0-shard-00-00.wr4odv4.mongodb.net:27017,ac-3ww2xt0-shard-00-01.wr4odv4.mongodb.net:27017,ac-3ww2xt0-shard-00-02.wr4odv4.mongodb.net:27017/?ssl=true&replicaSet=atlas-11txxf-shard-0&authSource=admin";

const connectionString =
  process.env.BETTER_AUTH_DB_URL ||
  process.env.MONGODB_URI ||
  process.env.MONGODB_URL ||
  fallbackMongoUri;

const globalForMongo = globalThis;
export const mongoClient =
  globalForMongo.__pizzaHubMongoClient ?? new MongoClient(connectionString || "");

if (process.env.NODE_ENV !== "production") {
  globalForMongo.__pizzaHubMongoClient = mongoClient;
}

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
  secret: process.env.BETTER_AUTH_SECRET,
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
        type: ["vendor", "customer", "admin"],
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

  plugins: [
    jwt({
      jwt: {
        expirationTime: "7d",
      },
    }),
  ],

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
  }),
});

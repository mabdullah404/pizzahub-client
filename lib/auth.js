import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const connectionString =
  process.env.BETTER_AUTH_DB_URL || process.env.MONGODB_URL;

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

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ],

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

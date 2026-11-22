import { mongoClient } from "@/lib/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const info = {
    hasBetterAuthDbUrl: !!process.env.BETTER_AUTH_DB_URL,
    hasMongoDbUri: !!process.env.MONGODB_URI,
    mongoDbUriPrefix: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 15) : "none",
    hasBetterAuthSecret: !!process.env.BETTER_AUTH_SECRET,
    betterAuthUrl: process.env.BETTER_AUTH_URL || "none",
    nodeEnv: process.env.NODE_ENV,
    vercelUrl: process.env.VERCEL_URL || "none",
  };

  try {
    const db = mongoClient.db(process.env.DB_NAME || "pizzaHubDB");
    const pingRes = await db.command({ ping: 1 });
    const userCount = await db.collection("user").countDocuments();
    return NextResponse.json({
      status: "ok",
      ping: pingRes,
      userCount,
      env: info,
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: "error",
        error: err.message,
        name: err.name,
        stack: err.stack,
        env: info,
      },
      { status: 500 }
    );
  }
}

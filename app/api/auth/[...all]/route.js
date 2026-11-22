import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

export async function GET(request, context) {
  try {
    return await handlers.GET(request, context);
  } catch (err) {
    console.error("[AUTH_GET_ERROR]", err);
    return new Response(
      JSON.stringify({
        error: err.message || "Internal server error",
        name: err.name,
        stack: err.stack,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(request, context) {
  try {
    return await handlers.POST(request, context);
  } catch (err) {
    console.error("[AUTH_POST_ERROR]", err);
    return new Response(
      JSON.stringify({
        error: err.message || "Internal server error",
        name: err.name,
        stack: err.stack,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

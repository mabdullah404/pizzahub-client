import { auth, mongoClient } from "@/lib/auth";
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
    const url = request.url || "";

    // 1. Enforce strict Sign Up validation (Challenge / Security requirement)
    if (url.includes("/sign-up/email")) {
      try {
        const cloned = request.clone();
        const body = await cloned.json();

        // Enforce role validation: reject role: "admin" or unknown roles
        if (body.role && body.role !== "customer" && body.role !== "vendor") {
          return new Response(
            JSON.stringify({
              status: false,
              message: "Invalid role selected. Only 'customer' and 'vendor' registrations are allowed.",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        // Enforce vendor business name
        if (body.role === "vendor" && (!body.businessName || !body.businessName.trim())) {
          return new Response(
            JSON.stringify({
              status: false,
              message: "Restaurant or business name is required for vendor registration.",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }

        // Enforce password strength: min 6 chars, 1 uppercase, 1 lowercase
        const pass = body.password || "";
        if (pass.length < 6 || !/[A-Z]/.test(pass) || !/[a-z]/.test(pass)) {
          return new Response(
            JSON.stringify({
              status: false,
              message: "Password must be at least 6 characters long and contain at least one uppercase and one lowercase letter.",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
      } catch (parseErr) {
        // Continue to handler if parsing fails
      }
    }

    // 2. Enforce Blocked / Banned user check on Sign In
    if (url.includes("/sign-in/email")) {
      try {
        const cloned = request.clone();
        const body = await cloned.json();
        if (body.email) {
          const email = String(body.email).trim().toLowerCase();
          const existingUser = await mongoClient
            .db(process.env.DB_NAME || "pizzaHubDB")
            .collection("user")
            .findOne({ email });

          if (existingUser && (existingUser.isBlocked || existingUser.banned)) {
            return new Response(
              JSON.stringify({
                status: false,
                message: "Your account has been suspended or blocked by an administrator.",
              }),
              { status: 403, headers: { "Content-Type": "application/json" } }
            );
          }
        }
      } catch (parseErr) {
        // Continue to handler
      }
    }

    return await handlers.POST(request, context);
  } catch (err) {
    console.error("[AUTH_POST_ERROR]", err);
    return new Response(
      JSON.stringify({
        error: err.message || "Internal server error",
        name: err.name,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

import { auth, mongoClient } from "@/lib/auth";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getApiUrl } from "@/lib/utils/apiUrl";
import { ObjectId } from "mongodb";

export const getApiBaseUrl = () => {
  return getApiUrl();
};

/**
 * Reads current user session on the Next.js server side.
 * Dual-layer verification: Better Auth API + direct MongoDB session fallback on fast reloads.
 */
export const getSession = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (session && session.user) {
      return session;
    }
  } catch (error) {
    console.warn("Better Auth getSession notice:", error.message);
  }

  // Resilient fallback: direct MongoDB session lookup if Better Auth helper missed cookie headers
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get("better-auth.session_token")?.value ||
      cookieStore.get("__Secure-better-auth.session_token")?.value;

    if (token) {
      const db = mongoClient.db(process.env.DB_NAME || "pizzaHubDB");
      const sessionDoc = await db.collection("session").findOne({ token });
      if (sessionDoc && new Date(sessionDoc.expiresAt).getTime() > Date.now()) {
        const userId = sessionDoc.userId;
        let userDoc = null;
        if (ObjectId.isValid(String(userId))) {
          userDoc = await db.collection("user").findOne({ _id: new ObjectId(String(userId)) });
        }
        if (!userDoc) {
          userDoc = await db.collection("user").findOne({ id: String(userId) });
        }
        if (userDoc) {
          return { session: sessionDoc, user: userDoc };
        }
      }
    }
  } catch (dbErr) {
    console.error("Direct session fallback lookup error:", dbErr);
  }

  return null;
};

/**
 * Extracts authentication token string for Express API requests.
 */
export const getToken = async () => {
  const session = await getSession();
  if (!session || !session.session?.token) {
    redirect("/sign-in");
  }
  return session.session.token;
};

/**
 * Makes an authenticated GET request to Express backend with Bearer token.
 */
export const authFetch = async (endpoint) => {
  const token = await getToken();
  const baseUrl = getApiBaseUrl();
  const fullUrl = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

  const res = await fetch(fullUrl, {
    cache: "no-store",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401 || res.status === 403) {
    redirect("/sign-in");
  }

  return res;
};

/**
 * Makes an authenticated mutation (POST/PUT/PATCH/DELETE) to Express backend.
 */
export const protectedMutation = async (endpoint, method = "POST", data = undefined) => {
  const token = await getToken();
  const baseUrl = getApiBaseUrl();
  const fullUrl = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

  const res = await fetch(fullUrl, {
    method,
    cache: "no-store",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });

  return res;
};

/**
 * Server-side route guard for dashboard layouts.
 * Ensures users cannot access dashboards belonging to another role!
 */
export const requireRole = async (allowedRole) => {
  const session = await getSession();

  if (!session || !session.user) {
    redirect(`/sign-in?redirectTo=/dashboard/${allowedRole}`);
  }

  const user = session.user;

  if (user.isBlocked || user.banned) {
    redirect("/sign-in?error=blocked");
  }

  if (user.role !== allowedRole) {
    // If user has a different role, redirect them to their own dashboard
    if (user.role === "admin") redirect("/dashboard/admin");
    if (user.role === "vendor") redirect("/dashboard/vendor");
    if (user.role === "customer") redirect("/dashboard/customer");
    redirect("/sign-in");
  }

  return session;
};

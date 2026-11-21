import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL;
  }
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  if (typeof window !== "undefined" && !window.location.hostname.includes("localhost")) {
    return "https://pizzahub-server-mu.vercel.app";
  }
  if (process.env.NODE_ENV === "production") {
    return "https://pizzahub-server-mu.vercel.app";
  }
  return "http://localhost:5000";
};

/**
 * Reads current user session on the Next.js server side.
 */
export const getSession = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (error) {
    console.error("Error reading session:", error);
    return null;
  }
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

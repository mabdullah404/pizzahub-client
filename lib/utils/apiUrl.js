/**
 * Helper to dynamically and safely resolve the backend Express API URL.
 * Automatically guards against misconfigured client URLs pointing to frontend.
 */
export const getApiUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  if (envUrl && !envUrl.includes("pizzahub-client") && !envUrl.includes("client-tan.vercel.app")) {
    return envUrl.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined" && !window.location.hostname.includes("localhost")) {
    return "https://pizzahub-server-mu.vercel.app";
  }
  if (process.env.NODE_ENV === "production") {
    return "https://pizzahub-server-mu.vercel.app";
  }
  return "http://localhost:5000";
};

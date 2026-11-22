/**
 * Helper to dynamically and safely resolve the backend Express API URL.
 * Automatically guards against localhost URLs leaking into production / live deployments.
 */
export const getApiUrl = () => {
  // 1. If running in the browser on ANY live/remote host (e.g. *.vercel.app or any domain other than localhost)
  if (
    typeof window !== "undefined" &&
    !window.location.hostname.includes("localhost") &&
    !window.location.hostname.includes("127.0.0.1")
  ) {
    const envUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL;

    // Only allow envUrl if it is a real remote server URL, NOT localhost and NOT the frontend URL
    if (
      envUrl &&
      !envUrl.includes("localhost") &&
      !envUrl.includes("127.0.0.1") &&
      !envUrl.includes("pizzahub-client") &&
      !envUrl.includes("client-tan.vercel.app")
    ) {
      return envUrl.replace(/\/+$/, "");
    }

    // Default to the verified live production API server
    return "https://pizzahub-server-mu.vercel.app";
  }

  // 2. If running on the server-side in production (e.g. Vercel SSR / edge / serverless)
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    const envUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL;

    if (
      envUrl &&
      !envUrl.includes("localhost") &&
      !envUrl.includes("127.0.0.1") &&
      !envUrl.includes("pizzahub-client") &&
      !envUrl.includes("client-tan.vercel.app")
    ) {
      return envUrl.replace(/\/+$/, "");
    }

    return "https://pizzahub-server-mu.vercel.app";
  }

  // 3. Localhost development
  const envUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL;

  if (envUrl && !envUrl.includes("pizzahub-client")) {
    return envUrl.replace(/\/+$/, "");
  }

  return "http://localhost:5000";
};

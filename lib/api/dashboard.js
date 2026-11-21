const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_SERVER_URL) return process.env.NEXT_PUBLIC_SERVER_URL;
  if (typeof window !== "undefined" && !window.location.hostname.includes("localhost")) {
    return "https://pizzahub-server-mu.vercel.app";
  }
  if (process.env.NODE_ENV === "production") return "https://pizzahub-server-mu.vercel.app";
  return "http://localhost:5000";
};

export async function getVendorStats(token) {
  const res = await fetch(`${getApiUrl()}/api/dashboard/vendor`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch vendor statistics.");
  return json;
}

export async function getCustomerStats(token) {
  const res = await fetch(`${getApiUrl()}/api/dashboard/customer`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch customer statistics.");
  return json;
}

export async function getAdminStats(token) {
  const res = await fetch(`${getApiUrl()}/api/dashboard/admin`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch admin statistics.");
  return json;
}

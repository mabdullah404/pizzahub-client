const getApiUrl = () =>
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

/**
 * Get current authenticated user profile
 */
export async function getCurrentUser(token) {
  const res = await fetch(`${getApiUrl()}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch user profile.");
  return json;
}

/**
 * Update user profile
 */
export async function updateProfile(data, token) {
  const res = await fetch(`${getApiUrl()}/api/users/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to update profile.");
  return json;
}

/**
 * Admin: Get all users
 */
export async function getAllUsers({ search = "", role = "all" } = {}, token) {
  const query = new URLSearchParams();
  if (search) query.append("search", search);
  if (role && role !== "all") query.append("role", role);

  const res = await fetch(`${getApiUrl()}/api/users?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch users.");
  return json;
}

/**
 * Admin: Block a user
 */
export async function blockUser(userId, token) {
  const res = await fetch(`${getApiUrl()}/api/users/${userId}/block`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to block user.");
  return json;
}

/**
 * Admin: Unblock a user
 */
export async function unblockUser(userId, token) {
  const res = await fetch(`${getApiUrl()}/api/users/${userId}/unblock`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to unblock user.");
  return json;
}

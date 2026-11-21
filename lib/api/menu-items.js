import { getApiUrl } from "@/lib/utils/apiUrl";

/**
 * Fetch public menu items with search, filter, and sorting
 */
export async function getMenuItems({
  search = "",
  category = "",
  location = "",
  sort = "newest",
  featured = false,
  limit = 50,
} = {}) {
  const query = new URLSearchParams();
  if (search) query.append("search", search);
  if (category && category !== "All") query.append("category", category);
  if (location && location !== "All") query.append("location", location);
  if (sort) query.append("sort", sort);
  if (featured) query.append("featured", "true");
  if (limit) query.append("limit", String(limit));

  const url = `${getApiUrl()}/api/menu?${query.toString()}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch menu items.");
  return res.json();
}

/**
 * Get single menu item by ID
 */
export async function getMenuItemById(id) {
  const res = await fetch(`${getApiUrl()}/api/menu/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to fetch menu item details.");
  }
  return res.json();
}

/**
 * Vendor: Create a new menu item
 */
export async function createMenuItem(data, token) {
  const res = await fetch(`${getApiUrl()}/api/menu`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to create menu item.");
  return json;
}

/**
 * Vendor: Fetch own menu items
 */
export async function getVendorMenuItems(token) {
  const res = await fetch(`${getApiUrl()}/api/menu/vendor/my-items`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch vendor items.");
  return json;
}

/**
 * Update menu item
 */
export async function updateMenuItem(id, data, token) {
  const res = await fetch(`${getApiUrl()}/api/menu/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to update menu item.");
  return json;
}

/**
 * Delete menu item
 */
export async function deleteMenuItem(id, token) {
  const res = await fetch(`${getApiUrl()}/api/menu/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to delete menu item.");
  return json;
}

/**
 * Admin: Approve / Reject status update
 */
export async function updateMenuItemStatus(id, status, token) {
  const res = await fetch(`${getApiUrl()}/api/menu/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to update item status.");
  return json;
}

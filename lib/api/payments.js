import { getApiUrl } from "@/lib/utils/apiUrl";

/**
 * Vendor: Create Stripe checkout session
 */
export async function createCheckoutSession(token) {
  const res = await fetch(`${getApiUrl()}/api/payments/create-checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to initiate payment session.");
  return json;
}

/**
 * Vendor: Confirm payment / fallback
 */
export async function confirmPayment(sessionId, sandbox = false, token) {
  const res = await fetch(`${getApiUrl()}/api/payments/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ sessionId, sandbox }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to confirm payment.");
  return json;
}

/**
 * Admin: Get all transactions
 */
export async function getAllTransactions(token) {
  const res = await fetch(`${getApiUrl()}/api/payments/transactions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch transactions.");
  return json;
}

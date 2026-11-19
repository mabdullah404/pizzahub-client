const getApiUrl = () =>
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

/**
 * Customer: Place a new order
 */
export async function createOrder(orderData, token) {
  const res = await fetch(`${getApiUrl()}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to place order.");
  return json;
}

/**
 * Customer: Get own orders
 */
export async function getCustomerOrders(token) {
  const res = await fetch(`${getApiUrl()}/api/orders/customer/my-orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch orders.");
  return json;
}

/**
 * Vendor: Get received orders
 */
export async function getVendorOrders(token) {
  const res = await fetch(`${getApiUrl()}/api/orders/vendor/my-orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch vendor orders.");
  return json;
}

/**
 * Vendor: Accept or Reject order
 */
export async function updateOrderStatus(orderId, status, token) {
  const res = await fetch(`${getApiUrl()}/api/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to update order status.");
  return json;
}

/**
 * Customer: Cancel pending order
 */
export async function cancelOrder(orderId, token) {
  const res = await fetch(`${getApiUrl()}/api/orders/${orderId}/cancel`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to cancel order.");
  return json;
}

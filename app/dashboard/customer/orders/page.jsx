"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { getCustomerOrders, cancelOrder } from "@/lib/api/orders";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  ChefHat,
  MessageSquare,
  Loader2,
  Ban,
  ArrowRight,
  Flame,
  Truck,
  Check,
} from "lucide-react";

export default function CustomerOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    if (!session?.session?.token) return;
    try {
      setLoading(true);
      const res = await getCustomerOrders(session.session.token);
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to load customer orders:", err);
      toast.error(err.message || "Failed to retrieve your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [session]);

  const handleCancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this pending pizza order?")) return;

    setCancellingId(orderId);
    try {
      const token = session?.session?.token;
      await cancelOrder(orderId, token);
      toast.success("Order cancelled successfully.");
      setOrders(
        orders.map((o) => (o._id === orderId ? { ...o, status: "cancelled" } : o))
      );
    } catch (err) {
      toast.error(err.message || "Failed to cancel order.");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Accepted by Pizzeria
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300">
            <XCircle className="w-3.5 h-3.5" />
            Declined by Restaurant
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
            <Clock className="w-3.5 h-3.5" />
            Pending Restaurant Review
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#A92E24]">
            My Pizza Orders
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)] mt-1">
            Order History &amp; Tracking
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
            Track current pizza orders along their live preparation timeline or cancel pending requests.
          </p>
        </div>

        <Link
          href="/browse-menu"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#A92E24] hover:bg-[#78231E] text-white font-semibold text-xs uppercase tracking-wider shadow-md shrink-0 transition-all active:scale-95"
        >
          <span>Order More Pizza</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-[#A92E24]" />
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[var(--card)] border border-[var(--border)] space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[var(--muted)] text-[#A92E24] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl font-bold">You have no active orders</h3>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-sm mx-auto">
            Browse our authentic woodfired pizza catalog and treat yourself today!
          </p>
          <Link
            href="/browse-menu"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#A92E24] text-white text-xs font-semibold shadow-md hover:bg-[#78231E]"
          >
            Explore Pizzeria Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isPending = order.status === "pending";
            const isAccepted = order.status === "accepted";
            const isRejected = order.status === "rejected";
            const isCancelled = order.status === "cancelled";
            const isCancelling = cancellingId === order._id;

            return (
              <div
                key={order._id}
                className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-6 hover:shadow-md transition-all"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
                  <div className="flex items-center gap-4">
                    <img
                      src={order.itemImage || "/images/chad-montano-MqT0asuoIcU-unsplash.jpg"}
                      alt={order.itemName}
                      className="w-16 h-16 rounded-2xl object-cover border border-[var(--border)] shrink-0"
                    />
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[var(--foreground)]">
                        {order.itemName}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] mt-0.5">
                        <ChefHat className="w-3.5 h-3.5 text-[#596B45]" />
                        <span className="font-medium text-[var(--foreground)]">
                          {order.vendorName}
                        </span>
                        <span>•</span>
                        <span className="font-bold text-[#A92E24]">
                          {formatPrice(order.itemPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1.5">
                    {getStatusBadge(order.status)}
                    <span className="text-[11px] text-[var(--muted-foreground)]">
                      Requested: {formatDate(order.createdAt)}
                    </span>
                  </div>
                </div>

                {/* =============================================================
                    OPTIONAL REQUIREMENT 3: ORDER STATUS TIMELINE
                   ============================================================= */}
                <div className="py-2">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[var(--muted-foreground)] mb-3 block">
                    Preparation &amp; Delivery Timeline
                  </span>

                  {isCancelled ? (
                    <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                      <Ban className="w-4 h-4 text-zinc-500" />
                      <span>This order was cancelled by you.</span>
                    </div>
                  ) : isRejected ? (
                    <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      <span>The pizzeria was unable to fulfill this order at the requested time.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {/* Step 1: Placed */}
                      <div className="flex flex-col items-center space-y-1.5">
                        <div className="w-8 h-8 rounded-full bg-[#596B45] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                          <Check className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-[var(--foreground)]">
                          Order Placed
                        </span>
                        <span className="text-[10px] text-[var(--muted-foreground)]">
                          Submitted
                        </span>
                      </div>

                      {/* Step 2: Under Review */}
                      <div className="flex flex-col items-center space-y-1.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                            isAccepted
                              ? "bg-[#596B45] text-white"
                              : "bg-amber-500 text-white animate-pulse"
                          }`}
                        >
                          {isAccepted ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        </div>
                        <span className="text-xs font-semibold text-[var(--foreground)]">
                          Kitchen Review
                        </span>
                        <span className="text-[10px] text-[var(--muted-foreground)]">
                          {isAccepted ? "Confirmed" : "In Progress"}
                        </span>
                      </div>

                      {/* Step 3: Woodfired Baking & Delivery */}
                      <div className="flex flex-col items-center space-y-1.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                            isAccepted
                              ? "bg-[#A92E24] text-white animate-bounce"
                              : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                          }`}
                        >
                          <Flame className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-[var(--foreground)]">
                          Baking &amp; Delivery
                        </span>
                        <span className="text-[10px] text-[var(--muted-foreground)]">
                          {isAccepted ? "Scheduled Date" : "Pending"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Delivery Information & Actions */}
                <div className="pt-4 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1 text-[var(--muted-foreground)]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#596B45]" />
                      <span className="text-[var(--foreground)] font-medium">
                        Delivery Date: {order.deliveryDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#A92E24]" />
                      <span>{order.deliveryAddress}</span>
                    </div>
                    {order.message && (
                      <div className="flex items-center gap-1.5 italic">
                        <MessageSquare className="w-3.5 h-3.5 text-[#596B45]" />
                        <span>Instructions: "{order.message}"</span>
                      </div>
                    )}
                  </div>

                  {/* Customer Cancel Button (Only enabled if order is pending) */}
                  {isPending && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={isCancelling}
                      className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      {isCancelling ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Ban className="w-3.5 h-3.5" />
                      )}
                      <span>Cancel Order</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { getVendorOrders, updateOrderStatus } from "@/lib/api/orders";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  MessageSquare,
  User,
  Loader2,
  Check,
  X,
} from "lucide-react";

export default function VendorOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    if (!session?.session?.token) return;
    try {
      setLoading(true);
      const res = await getVendorOrders(session.session.token);
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch vendor orders:", err);
      toast.error(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [session]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const token = session?.session?.token;
      await updateOrderStatus(orderId, newStatus, token);
      toast.success(`Order marked as ${newStatus}! Decision saved.`);
      setOrders(
        orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      toast.error(err.message || `Failed to ${newStatus} order.`);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            Cancelled by Customer
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
            <Clock className="w-3.5 h-3.5" />
            Pending Action
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-[#596B45]">
          Kitchen Dispatch
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)] mt-1">
          Customer Pizza Orders
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
          Review incoming requests, verify delivery dates and addresses, and accept or reject orders.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-[#A92E24]" />
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[var(--card)] border border-[var(--border)] space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[var(--muted)] text-[#596B45] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl font-bold">No incoming orders yet</h3>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-sm mx-auto">
            When food enthusiasts discover and order your artisanal pizzas, their orders will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {orders.map((order) => {
            const isPending = order.status === "pending";
            const isUpdating = updatingId === order._id;

            return (
              <div
                key={order._id}
                className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Left: Item & Customer Info */}
                <div className="flex items-start gap-4">
                  <img
                    src={order.itemImage || "/images/chad-montano-MqT0asuoIcU-unsplash.jpg"}
                    alt={order.itemName}
                    className="w-20 h-20 rounded-2xl object-cover border border-[var(--border)] shrink-0"
                  />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg font-bold text-[var(--foreground)]">
                        {order.itemName}
                      </h3>
                      <span className="font-serif font-bold text-[#A92E24] text-sm">
                        {formatPrice(order.itemPrice)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--muted-foreground)]">
                      <div className="flex items-center gap-1 text-[var(--foreground)] font-medium">
                        <User className="w-3.5 h-3.5 text-[#596B45]" />
                        <span>{order.customerName} ({order.customerEmail})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#A92E24]" />
                        <span>Delivery: {order.deliveryDate}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-1.5 text-xs text-[var(--muted-foreground)] pt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#A92E24] shrink-0 mt-0.5" />
                      <span>{order.deliveryAddress}</span>
                    </div>

                    {order.message && (
                      <div className="flex items-start gap-1.5 text-xs text-[#596B45] italic pt-1">
                        <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>"{order.message}"</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Status and Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-between lg:justify-center gap-3 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-[var(--border)]">
                  {getStatusBadge(order.status)}

                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusUpdate(order._id, "accepted")}
                        disabled={isUpdating}
                        className="px-4 py-2 rounded-xl bg-[#596B45] hover:bg-[#435234] text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-60"
                      >
                        {isUpdating ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        <span>Accept Order</span>
                      </button>

                      <button
                        onClick={() => handleStatusUpdate(order._id, "rejected")}
                        disabled={isUpdating}
                        className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
                      >
                        {isUpdating ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <X className="w-3.5 h-3.5" />
                        )}
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-[var(--muted-foreground)]">
                      Decision finalized
                    </span>
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

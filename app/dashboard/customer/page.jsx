"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { getCustomerStats } from "@/lib/api/dashboard";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Pizza,
  Loader2,
  Calendar,
} from "lucide-react";

export default function CustomerDashboardOverview() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (!session?.session?.token) return;
      try {
        const res = await getCustomerStats(session.session.token);
        if (res?.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Failed to load customer stats:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#A92E24]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#A92E24]">
            Customer Portal
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)] mt-1">
            Welcome, {session?.user?.name || "Pizza Lover"}!
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
            Track your scheduled pizza deliveries, manage incoming treats, and re-order artisan favorites.
          </p>
        </div>

        <Link
          href="/browse-menu"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#A92E24] hover:bg-[#78231E] text-white font-semibold text-xs uppercase tracking-wider shadow-md shrink-0 transition-all active:scale-95"
        >
          <Pizza className="w-4 h-4" />
          <span>Browse Pizza Menu</span>
        </Link>
      </div>

      {/* Orders Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--muted-foreground)]">Total Orders</span>
            <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/30 text-orange-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-[var(--foreground)]">
            {stats?.totalOrders || 0}
          </p>
          <p className="text-[11px] text-[var(--muted-foreground)]">Placed pizzas to date</p>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--muted-foreground)]">Pending Orders</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/30 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-amber-600 dark:text-amber-400">
            {stats?.pendingOrders || 0}
          </p>
          <p className="text-[11px] text-[var(--muted-foreground)]">Awaiting restaurant review</p>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--muted-foreground)]">Accepted Orders</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-[#596B45]">
            {stats?.acceptedOrders || 0}
          </p>
          <p className="text-[11px] text-[var(--muted-foreground)]">Dispatched to kitchen</p>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--muted-foreground)]">Rejected / Cancelled</span>
            <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950/30 text-red-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-[var(--foreground)]">
            {stats?.rejectedOrders || 0}
          </p>
          <p className="text-[11px] text-[var(--muted-foreground)]">Past cancellations</p>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-[var(--foreground)]">
            My Recent Orders
          </h2>
          <Link
            href="/dashboard/customer/orders"
            className="text-xs font-semibold text-[#A92E24] hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="divide-y divide-[var(--border)]">
            {stats.recentOrders.map((order) => (
              <div key={order._id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={order.itemImage || "/images/chad-montano-MqT0asuoIcU-unsplash.jpg"}
                    alt={order.itemName}
                    className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-[var(--border)]"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[var(--foreground)]">{order.itemName}</h4>
                    <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-2 mt-0.5">
                      <span>Pizzeria: {order.vendorName}</span>
                      <span>•</span>
                      <span className="font-semibold text-[#A92E24]">{formatPrice(order.itemPrice)}</span>
                    </p>
                    <p className="text-[11px] text-[var(--muted-foreground)] flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-[#596B45]" />
                      <span>Delivery Date: {order.deliveryDate}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.status === "accepted"
                        ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                        : order.status === "rejected"
                        ? "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300"
                        : order.status === "cancelled"
                        ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                        : "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <Pizza className="w-10 h-10 text-[var(--muted-foreground)] mx-auto opacity-50" />
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
              You haven't ordered any pizzas yet!
            </p>
            <Link
              href="/browse-menu"
              className="inline-block px-5 py-2 rounded-full bg-[#A92E24] text-white text-xs font-semibold"
            >
              Order Your First Pizza
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

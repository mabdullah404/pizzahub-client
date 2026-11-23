"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { getVendorStats } from "@/lib/api/dashboard";
import {
  UtensilsCrossed,
  CheckCircle,
  Clock,
  CheckCheck,
  CreditCard,
  PlusCircle,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function VendorDashboardOverview() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (!session?.session?.token) return;
      try {
        const res = await getVendorStats(session.session.token);
        if (res?.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Failed to load vendor stats:", err);
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

  const isPremium = stats?.subscriptionPlan === "premium";

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Pending Admin Review Notice Banner */}
      {(session?.user?.status === "pending" || session?.user?.isApproved === false) && (
        <div className="p-5 sm:p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Pizzeria Application Under Administrative Review
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-300/80 mt-0.5">
                Your restaurant partner account is pending admin approval. You will receive full catalog publishing and dispatch rights once an administrator approves your pizzeria.
              </p>
            </div>
          </div>
          <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-amber-200/80 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 shrink-0">
            Pending Admin Permission
          </span>
        </div>
      )}

      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#596B45]">
              Restaurant Management
            </span>
            {isPremium && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#A92E24] text-white">
                <Sparkles className="w-3 h-3 fill-amber-300 text-amber-300" />
                Premium Pizzeria
              </span>
            )}
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
            Welcome, {session?.user?.name || "Chef"}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
            Monitor incoming pizza orders, publish artisan menu items, and manage restaurant operations.
          </p>
        </div>

        <Link
          href="/dashboard/vendor/menu-items/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#A92E24] hover:bg-[#78231E] text-white font-semibold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all shrink-0 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Pizza</span>
        </Link>
      </div>

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--muted-foreground)]">Total Items</span>
            <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/30 text-orange-600 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-[var(--foreground)]">
            {stats?.totalItems || 0}
          </p>
          <p className="text-[11px] text-[var(--muted-foreground)]">Submitted to catalog</p>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--muted-foreground)]">Active &amp; Approved</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-[var(--foreground)]">
            {stats?.activeItems || 0}
          </p>
          <p className="text-[11px] text-[var(--muted-foreground)]">Live on Browse Menu</p>
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
          <p className="text-[11px] text-[var(--muted-foreground)]">Requires your review</p>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--muted-foreground)]">Accepted Orders</span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/30 text-blue-600 flex items-center justify-center">
              <CheckCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-[#596B45]">
            {stats?.acceptedOrders || 0}
          </p>
          <p className="text-[11px] text-[var(--muted-foreground)]">Dispatched to kitchen</p>
        </div>
      </div>

      {/* Plan Status Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[var(--card)] to-[var(--background)] border border-[var(--border)] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <CreditCard className="w-5 h-5 text-[#A92E24]" />
            <h3 className="font-serif text-lg font-bold">
              Subscription Plan: <span className="capitalize">{stats?.subscriptionPlan || "Free"} Tier</span>
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-xl">
            {isPremium
              ? "You have unlimited menu items publishing and your pizzas receive top placement on our homepage."
              : "Free plan is limited to 3 active menu items. Upgrade to Premium for unlimited items, priority homepage exposure, and a verified restaurant badge."}
          </p>
        </div>

        {!isPremium && (
          <Link
            href="/dashboard/vendor/subscription"
            className="px-6 py-3 rounded-2xl bg-[#596B45] hover:bg-[#435234] text-white font-semibold text-xs uppercase tracking-wider shrink-0 transition-all shadow-md active:scale-95"
          >
            Upgrade to Premium ($29/mo)
          </Link>
        )}
      </div>

      {/* Recent Orders Overview */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-[var(--foreground)]">
            Recent Customer Orders
          </h2>
          <Link
            href="/dashboard/vendor/orders"
            className="text-xs font-semibold text-[#A92E24] hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="divide-y divide-[var(--border)]">
            {stats.recentOrders.slice(0, 5).map((order) => (
              <div key={order._id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={order.itemImage || "/images/chad-montano-MqT0asuoIcU-unsplash.jpg"}
                    alt={order.itemName}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <p className="text-xs font-bold text-[var(--foreground)]">{order.itemName}</p>
                    <p className="text-[11px] text-[var(--muted-foreground)]">
                      Customer: {order.customerName} • Delivery: {order.deliveryDate}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    order.status === "accepted"
                      ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                      : order.status === "rejected"
                      ? "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300"
                      : "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--muted-foreground)] py-6 text-center">
            No incoming customer orders yet.
          </p>
        )}
      </div>
    </div>
  );
}

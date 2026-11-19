"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { getAdminStats } from "@/lib/api/dashboard";
import { formatPrice } from "@/lib/utils";
import {
  Users,
  ChefHat,
  ShoppingBag,
  UtensilsCrossed,
  Clock,
  DollarSign,
  ArrowRight,
  Loader2,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export default function AdminDashboardOverview() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (!session?.session?.token) return;
      try {
        const res = await getAdminStats(session.session.token);
        if (res?.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Failed to load admin stats:", err);
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
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#78231E]">
            <ShieldCheck className="w-4 h-4 text-[#A92E24]" />
            Administrator Control Center
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)] mt-1">
            PizzaHub Platform Overview
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
            Oversee user accounts, review pending artisan menu items, and audit verified subscription revenue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/admin/menu-items"
            className="px-4 py-2.5 rounded-2xl bg-[#A92E24] hover:bg-[#78231E] text-white font-semibold text-xs shadow-md transition-all active:scale-95"
          >
            Review Menus ({stats?.pendingMenuItems || 0})
          </Link>
          <Link
            href="/dashboard/admin/users"
            className="px-4 py-2.5 rounded-2xl border border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)] font-semibold text-xs transition-all"
          >
            Manage Users
          </Link>
        </div>
      </div>

      {/* Six Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--muted-foreground)]">Total Registered Users</span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/30 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-[var(--foreground)]">
            {stats?.totalUsers || 0}
          </p>
          <p className="text-[11px] text-[var(--muted-foreground)]">
            {stats?.totalVendors || 0} Vendors • {stats?.totalCustomers || 0} Customers
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--muted-foreground)]">Restaurant Vendors</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 flex items-center justify-center">
              <ChefHat className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-[#596B45]">
            {stats?.totalVendors || 0}
          </p>
          <p className="text-[11px] text-[var(--muted-foreground)]">Independent pizzerias</p>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--muted-foreground)]">Customers</span>
            <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/30 text-orange-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-[var(--foreground)]">
            {stats?.totalCustomers || 0}
          </p>
          <p className="text-[11px] text-[var(--muted-foreground)]">Active food enthusiasts</p>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--muted-foreground)]">Published Menu Items</span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/30 text-purple-600 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-[var(--foreground)]">
            {stats?.totalMenuItems || 0}
          </p>
          <p className="text-[11px] text-[var(--muted-foreground)]">In database catalog</p>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--muted-foreground)]">Pending Review Items</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/30 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-amber-600 dark:text-amber-400">
            {stats?.pendingMenuItems || 0}
          </p>
          <p className="text-[11px] text-[var(--muted-foreground)]">Require admin decision</p>
        </div>

        <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--muted-foreground)]">Stripe Platform Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-[#A92E24]/10 text-[#A92E24] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-[#A92E24]">
            {formatPrice(stats?.totalRevenue || 0)}
          </p>
          <p className="text-[11px] text-[var(--muted-foreground)]">
            {stats?.totalTransactions || 0} vendor subscriptions
          </p>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/admin/users"
          className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] hover:border-[#A92E24]/40 hover:shadow-md transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[var(--foreground)] group-hover:text-[#A92E24] transition-colors">
            Manage Registered Users
          </h3>
          <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
            Search users, filter by role, and enforce platform security by blocking or unblocking accounts.
          </p>
          <span className="text-xs font-semibold text-[#A92E24] inline-flex items-center gap-1">
            Open Users Table <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          href="/dashboard/admin/menu-items"
          className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] hover:border-[#A92E24]/40 hover:shadow-md transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[var(--foreground)] group-hover:text-[#A92E24] transition-colors">
            Manage &amp; Approve Menus
          </h3>
          <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
            Review submitted pizzas, verify image compliance, approve for public display, or reject inappropriate items.
          </p>
          <span className="text-xs font-semibold text-[#A92E24] inline-flex items-center gap-1">
            Open Menu Moderation <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          href="/dashboard/admin/transactions"
          className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] hover:border-[#A92E24]/40 hover:shadow-md transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[var(--foreground)] group-hover:text-[#A92E24] transition-colors">
            Monitor Transactions
          </h3>
          <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
            Audit read-only Stripe subscription transactions, vendor details, payment session IDs, and billing amounts.
          </p>
          <span className="text-xs font-semibold text-[#A92E24] inline-flex items-center gap-1">
            View Ledger <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}

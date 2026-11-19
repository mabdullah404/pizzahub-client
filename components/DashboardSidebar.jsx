"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  LayoutDashboard,
  UtensilsCrossed,
  PlusCircle,
  ShoppingBag,
  CreditCard,
  User,
  Users,
  CheckSquare,
  DollarSign,
  LogOut,
  Pizza,
  Home,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export function DashboardSidebar({ role }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully.");
      router.push("/");
      router.refresh();
    } catch (err) {
      toast.error("Failed to sign out.");
    }
  };

  const vendorNav = [
    { name: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
    { name: "My Menu Items", href: "/dashboard/vendor/menu-items", icon: UtensilsCrossed },
    { name: "Add Menu Item", href: "/dashboard/vendor/menu-items/new", icon: PlusCircle },
    { name: "Customer Orders", href: "/dashboard/vendor/orders", icon: ShoppingBag },
    { name: "Subscription", href: "/dashboard/vendor/subscription", icon: CreditCard },
    { name: "Profile Settings", href: "/dashboard/vendor/profile", icon: User },
  ];

  const customerNav = [
    { name: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { name: "My Orders", href: "/dashboard/customer/orders", icon: ShoppingBag },
    { name: "Profile Settings", href: "/dashboard/customer/profile", icon: User },
  ];

  const adminNav = [
    { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Manage Users", href: "/dashboard/admin/users", icon: Users },
    { name: "Manage Menu Items", href: "/dashboard/admin/menu-items", icon: CheckSquare },
    { name: "Transactions", href: "/dashboard/admin/transactions", icon: DollarSign },
  ];

  const navItems =
    role === "admin" ? adminNav : role === "vendor" ? vendorNav : customerNav;

  const roleBadgeColors = {
    admin: "bg-[#78231E] text-white",
    vendor: "bg-[#596B45] text-white",
    customer: "bg-[#A92E24] text-white",
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-[var(--card)] border-r border-[var(--border)] min-h-[calc(100vh-5rem)] flex flex-col justify-between p-4 sm:p-6">
      <div className="space-y-6">
        {/* User Mini Profile Header */}
        <div className="p-4 rounded-2xl bg-[var(--background)] border border-[var(--border)] flex items-center gap-3">
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name || "User"}
              className="w-10 h-10 rounded-full object-cover border border-[#A92E24]"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#A92E24]/10 text-[#A92E24] flex items-center justify-center font-bold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
          <div className="truncate">
            <p className="text-xs font-bold text-[var(--foreground)] truncate">
              {user?.name || "Welcome"}
            </p>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                roleBadgeColors[role] || "bg-zinc-700 text-white"
              }`}
            >
              {role}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== `/dashboard/${role}` && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? "bg-[#A92E24] text-white shadow-md shadow-[#A92E24]/20"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--background)]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Shortcuts */}
      <div className="pt-6 border-t border-[var(--border)] space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Back to Main Website</span>
        </Link>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

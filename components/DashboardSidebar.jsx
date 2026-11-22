"use client";

import { useState, useEffect } from "react";
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
  Home,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

export function DashboardSidebar({ role }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  // Close mobile sheet on route change
  useEffect(() => {
    setMobileSheetOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile sheet is open
  useEffect(() => {
    if (mobileSheetOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileSheetOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully.");
      router.push("/");
      router.refresh();
    } catch {
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

  const currentNav = navItems.find(
    (item) =>
      pathname === item.href ||
      (item.href !== `/dashboard/${role}` && pathname.startsWith(item.href))
  );

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-5 sm:p-6 bg-[var(--card)]">
      <div className="space-y-6">
        {/* User Mini Profile Header */}
        <div className="p-3.5 rounded-2xl bg-[var(--background)] border border-[var(--border)] flex items-center gap-3">
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name || "User"}
              className="w-10 h-10 rounded-full object-cover border border-[#E66A2C] shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#FFD64F] text-[#24242A] flex items-center justify-center font-bold text-sm uppercase shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          )}
          <div className="truncate flex-1 min-w-0">
            <p className="text-xs font-bold text-[var(--foreground)] truncate">
              {user?.name || "Account"}
            </p>
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider mt-0.5 bg-[#FFD64F]/30 text-[#E66A2C] dark:text-[#FFD64F]">
              {role}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)] px-3 mb-2">
            Dashboard Menu
          </p>
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== `/dashboard/${role}` && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSheetOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? "bg-[#E66A2C] text-white shadow-xs"
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
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Mobile & Tablet (< lg) Header Strip with Sheet Trigger Button */}
      <div className="lg:hidden w-full bg-[var(--card)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between sticky top-20 z-40">
        <div className="flex items-center gap-2 truncate">
          <span className="text-xs font-bold uppercase tracking-wider text-[#E66A2C]">
            {role}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
          <span className="text-xs font-semibold text-[var(--foreground)] truncate">
            {currentNav?.name || "Dashboard"}
          </span>
        </div>

        <button
          onClick={() => setMobileSheetOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs font-bold text-[var(--foreground)] hover:border-[#E66A2C] transition-colors cursor-pointer shadow-2xs"
          aria-label="Open dashboard navigation"
        >
          <Menu className="w-4 h-4 text-[#E66A2C]" />
          <span>Menu</span>
        </button>
      </div>

      {/* 2. Mobile & Tablet (< lg) Slide-Over Sheet Drawer */}
      {mobileSheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileSheetOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          />

          {/* Drawer Sheet */}
          <div className="relative w-72 sm:w-80 h-full bg-[var(--card)] shadow-2xl z-10 flex flex-col justify-between animate-in slide-in-from-left duration-300 border-r border-[var(--border)]">
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
              <span className="font-serif font-black text-lg text-[var(--foreground)]">
                Pizza<span className="text-[#E66A2C]">Hub</span>
              </span>
              <button
                onClick={() => setMobileSheetOpen(false)}
                className="p-1.5 rounded-xl text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--background)] transition-colors cursor-pointer"
                aria-label="Close dashboard menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}

      {/* 3. Desktop (lg+) Permanent Fixed/Sticky Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-[var(--card)] border-r border-[var(--border)] min-h-[calc(100vh-5rem)] flex-col justify-between sticky top-20 self-start">
        {sidebarContent}
      </aside>
    </>
  );
}

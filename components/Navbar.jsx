"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";
import {
  Menu as MenuIcon,
  X,
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Home,
  BookOpen,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  ChefHat,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close desktop dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Click logo to scroll smoothly to top
  const handleLogoClick = (e) => {
    setMobileMenuOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully.");
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to sign out. Please try again.");
    }
  };

  const user = session?.user;
  const userRole = user?.role || "customer";

  const getDashboardLink = () => {
    if (userRole === "admin") return "/dashboard/admin";
    if (userRole === "vendor") return "/dashboard/vendor";
    return "/dashboard/customer";
  };

  const getProfileSettingsLink = () => {
    if (userRole === "admin") return "/dashboard/admin";
    if (userRole === "vendor") return "/dashboard/vendor/profile";
    return "/dashboard/customer/profile";
  };

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Browse Menu", href: "/browse-menu", icon: BookOpen },
    ...(user
      ? [
          {
            name:
              userRole === "admin"
                ? "Admin Portal"
                : userRole === "vendor"
                ? "Vendor Dashboard"
                : "My Orders",
            href:
              userRole === "customer"
                ? "/dashboard/customer/orders"
                : getDashboardLink(),
            icon:
              userRole === "admin"
                ? ShieldCheck
                : userRole === "vendor"
                ? ChefHat
                : ShoppingBag,
          },
        ]
      : []),
  ];

  return (
    <>
      {/* 
        Sticky Header:
        - sticky top-0 z-50 ensures it remains anchored on top during scroll on both mobile and desktop
        - Fixed height (h-20) and balanced 3-column flex layout completely eliminates hydration shaking/flickering
      */}
      <header className="sticky top-0 z-50 w-full bg-[#F4F6FA]/95 dark:bg-[#18181B]/95 backdrop-blur-md border-b border-[#E8EDF4] dark:border-[#333338] transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* 1. Left Column: Brand Logo (Clicks to smoothly scroll to top) */}
            <div className="w-40 sm:w-48 shrink-0 flex items-center">
              <Link
                href="/"
                onClick={handleLogoClick}
                className="inline-flex items-center gap-2 group cursor-pointer select-none"
                title="PizzaHub - Scroll to top"
              >
                <span className="font-serif font-black text-2xl tracking-tight text-[#24242A] dark:text-white flex items-center">
                  Pizza<span className="text-[#E66A2C]">Hub</span>
                </span>
              </Link>
            </div>

            {/* 2. Center Column: Desktop Navigation Links (Anchored to center, no jumping) */}
            <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-semibold transition-colors hover:text-[#E66A2C] ${
                      isActive
                        ? "text-[#E66A2C] font-bold"
                        : "text-[#24242A] dark:text-[#A1A1AA]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* 3. Right Column: Theme Toggle & Authentication Controls */}
            <div className="w-40 sm:w-48 shrink-0 flex items-center justify-end gap-3">
              {/* Theme Toggle (Always present and stable) */}
              <ThemeToggle />

              {/* Desktop Auth State (Mounted & Stabilized to prevent hydration flicker) */}
              {!mounted || isPending ? (
                <div className="hidden md:flex items-center justify-end w-32 h-9">
                  <div className="w-24 h-8 rounded-full bg-black/5 dark:bg-white/5 animate-pulse" />
                </div>
              ) : user ? (
                <div className="hidden md:block relative ml-1" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white dark:bg-[#24242A] border border-[#E8EDF4] dark:border-[#333338] shadow-xs hover:border-[#E66A2C] transition-all text-xs font-semibold text-[#24242A] dark:text-white cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#FFD64F] text-[#24242A] flex items-center justify-center font-bold text-xs uppercase overflow-hidden shrink-0">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user.name ? user.name[0] : "U"
                      )}
                    </div>
                    <span className="inline-block max-w-[100px] truncate font-bold">
                      {user.name?.split(" ")[0] || "Account"}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#777777]" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#24242A] rounded-2xl shadow-xl border border-[#E8EDF4] dark:border-[#333338] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-[#E8EDF4] dark:border-[#333338]">
                        <p className="text-xs font-bold text-[#24242A] dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-[#777777] dark:text-[#A1A1AA] truncate">
                          {user.email}
                        </p>
                        <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#FFD64F]/30 text-[#E66A2C] dark:text-[#FFD64F]">
                          {userRole}
                        </span>
                      </div>

                      <Link
                        href={getDashboardLink()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#24242A] dark:text-[#FAF5EB] hover:bg-[#F4F6FA] dark:hover:bg-[#2E2E35] transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#E66A2C]" />
                        Dashboard
                      </Link>

                      <Link
                        href={getProfileSettingsLink()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-[#24242A] dark:text-[#FAF5EB] hover:bg-[#F4F6FA] dark:hover:bg-[#2E2E35] transition-colors"
                      >
                        <User className="w-4 h-4 text-[#FFD64F]" />
                        Profile Settings
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer border-t border-[#E8EDF4] dark:border-[#333338] mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Desktop Sign In / Sign Up buttons (Strictly hidden on mobile) */
                <div className="hidden md:flex items-center gap-2.5">
                  <Link
                    href="/sign-in"
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-[#24242A] dark:text-white bg-white dark:bg-[#24242A] border border-[#E8EDF4] dark:border-[#333338] hover:border-[#E66A2C] transition-all shadow-xs"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-[#24242A] bg-[#FFD64F] hover:bg-[#FACC15] transition-all shadow-xs"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* 4. Mobile 3-Line Hamburger Toggle Button (VISIBLE ONLY ON MOBILE) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2.5 rounded-2xl bg-white dark:bg-[#24242A] border border-[#E8EDF4] dark:border-[#333338] text-[#24242A] dark:text-white hover:text-[#E66A2C] transition-all shadow-xs cursor-pointer"
                aria-label="Open mobile menu"
              >
                <MenuIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 5. Modern Smooth Mobile Drawer (Right Side Slide-Over) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Backdrop overlay */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          />

          {/* Drawer Panel */}
          <div className="relative w-72 sm:w-80 h-full bg-white dark:bg-[#1E1E24] shadow-2xl z-10 flex flex-col justify-between p-6 animate-in slide-in-from-right duration-300 border-l border-[#E8EDF4] dark:border-[#333338]">
            {/* Top section */}
            <div className="space-y-6">
              {/* Drawer Header: Logo + Close button */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E8EDF4] dark:border-[#333338]">
                <Link
                  href="/"
                  onClick={handleLogoClick}
                  className="font-serif font-black text-xl tracking-tight text-[#24242A] dark:text-white"
                >
                  Pizza<span className="text-[#E66A2C]">Hub</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-[#777777] dark:text-[#A1A1AA] hover:text-[#24242A] dark:hover:text-white hover:bg-[#F4F6FA] dark:hover:bg-[#2A2A32] transition-colors cursor-pointer"
                  aria-label="Close mobile menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Logged In User Profile Header Card */}
              {user && (
                <div className="p-3.5 rounded-2xl bg-[#F4F6FA] dark:bg-[#27272F] border border-[#E8EDF4] dark:border-[#333338] space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FFD64F] text-[#24242A] flex items-center justify-center font-bold text-sm uppercase overflow-hidden shrink-0">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user.name ? user.name[0] : "U"
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#24242A] dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-[#777777] dark:text-[#A1A1AA] truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="pt-1 flex items-center justify-between">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#FFD64F]/30 text-[#E66A2C] dark:text-[#FFD64F]">
                      {userRole}
                    </span>
                    <Link
                      href={getProfileSettingsLink()}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[11px] font-semibold text-[#E66A2C] hover:underline"
                    >
                      Settings
                    </Link>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#777777] dark:text-[#A1A1AA] px-2 mb-2">
                  Navigation
                </p>
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? "bg-[#E66A2C] text-white shadow-sm shadow-[#E66A2C]/20"
                          : "text-[#24242A] dark:text-[#FAF5EB] hover:bg-[#F4F6FA] dark:hover:bg-[#27272F]"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions (Sign In / Sign Up or Sign Out) */}
            <div className="pt-6 border-t border-[#E8EDF4] dark:border-[#333338] space-y-2.5">
              {user ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full py-3 rounded-2xl bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center gap-2 border border-red-200 dark:border-red-900/30 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/sign-in"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 rounded-2xl bg-white dark:bg-[#27272F] border border-[#E8EDF4] dark:border-[#333338] text-[#24242A] dark:text-white hover:border-[#E66A2C] font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all text-center"
                  >
                    <span>Sign In</span>
                  </Link>

                  <Link
                    href="/sign-up"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 rounded-2xl bg-[#FFD64F] hover:bg-[#FACC15] text-[#24242A] font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#FFD64F]/20 transition-all text-center"
                  >
                    <span>Sign Up</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              <p className="text-[10px] text-center text-[#777777] dark:text-[#A1A1AA] pt-2">
                © 2026 PizzaHub. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";
import {
  Search,
  ShoppingCart,
  Menu as MenuIcon,
  X,
  User,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Pizza,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully.");
      setDropdownOpen(false);
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

  // Assignment Specification:
  // Public: Home, Browse Menu, Sign In, Sign Up
  // Logged In: Home, Browse Menu, and role-based links
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Menu", href: "/browse-menu" },
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
          },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F4F6FA]/90 dark:bg-[#18181B]/90 backdrop-blur-md border-b border-[#E8EDF4] dark:border-[#333338] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-black text-2xl tracking-tight text-[#24242A] dark:text-white flex items-center">
              Pizza<span className="text-[#E66A2C]">Hub</span>
            </span>
          </Link>

          {/* Center Navigation Links (Clean & strictly following assignment requirements) */}
          <nav className="hidden md:flex items-center gap-8">
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

          {/* Right Action: Theme Toggle & Authentication */}
          <div className="flex items-center gap-3">
            {/* Dark / Light Mode Toggle */}
            <ThemeToggle />

            {/* Auth State Button / Profile Dropdown */}
            {user ? (
              <div className="relative ml-1" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white dark:bg-[#24242A] border border-[#E8EDF4] dark:border-[#333338] shadow-xs hover:border-[#E66A2C] transition-all text-xs font-semibold text-[#24242A] dark:text-white cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#FFD64F] text-[#24242A] flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name ? user.name[0] : "U"
                    )}
                  </div>
                  <span className="hidden sm:inline-block max-w-[120px] truncate font-bold">
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
              <div className="flex items-center gap-2">
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

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#24242A] dark:text-white hover:bg-white dark:hover:bg-[#24242A] transition-colors ml-1 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#E8EDF4] dark:border-[#333338] space-y-2 animate-in fade-in duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#24242A] dark:text-white hover:bg-white dark:hover:bg-[#24242A] hover:text-[#E66A2C] transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {!user && (
              <div className="pt-2 flex items-center gap-3">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-full text-xs font-bold border border-[#E8EDF4] bg-white text-[#24242A]"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-full text-xs font-bold bg-[#FFD64F] text-[#24242A]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

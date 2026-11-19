"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  User,
  Mail,
  Lock,
  Image as ImageIcon,
  Building2,
  ChefHat,
  ShoppingBag,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "vendor" ? "vendor" : "customer";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [role, setRole] = useState(initialRole);
  const [businessName, setBusinessName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Validate password rules (min 6 chars, 1 uppercase, 1 lowercase)
  const validatePassword = (pass) => {
    if (pass.length < 6) return "Password must be at least 6 characters long.";
    if (!/[A-Z]/.test(pass)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(pass)) return "Password must contain at least one lowercase letter.";
    return null;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const passError = validatePassword(password);
    if (passError) {
      toast.error(passError);
      return;
    }

    if (role === "vendor" && !businessName.trim()) {
      toast.error("Please enter your restaurant / business name.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        image: image.trim() || undefined,
        role,
        businessName: role === "vendor" ? businessName.trim() : "",
      });

      if (error) {
        toast.error(error.message || "Sign up failed. Please try again.");
        setLoading(false);
        return;
      }

      toast.success("Account created successfully! Welcome to PizzaHub.");
      if (role === "vendor") {
        router.push("/dashboard/vendor");
      } else {
        router.push("/dashboard/customer");
      }
      router.refresh();
    } catch (err) {
      console.error("Sign up exception:", err);
      toast.error(err.message || "Failed to register account.");
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: role === "vendor" ? "/dashboard/vendor" : "/dashboard/customer",
      });
    } catch (err) {
      console.error("Google sign up failed:", err);
      toast.error("Google authentication failed.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
          Join PizzaHub
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
          Create your account to order artisan woodfired pizzas or manage your restaurant.
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-[var(--background)] border border-[var(--border)] rounded-2xl">
        <button
          type="button"
          onClick={() => setRole("customer")}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            role === "customer"
              ? "bg-[#A92E24] text-white shadow-sm"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Customer</span>
        </button>

        <button
          type="button"
          onClick={() => setRole("vendor")}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            role === "vendor"
              ? "bg-[#596B45] text-white shadow-sm"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          <ChefHat className="w-4 h-4" />
          <span>Restaurant (Vendor)</span>
        </button>
      </div>

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={googleLoading}
        className="w-full py-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] text-[var(--foreground)] text-xs font-semibold flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-60"
      >
        {googleLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-[#A92E24]" />
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>Continue with Google</span>
      </button>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-[var(--border)] w-full" />
        <span className="bg-[var(--card)] px-3 text-[11px] uppercase tracking-wider text-[var(--muted-foreground)] absolute">
          Or register with email
        </span>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSignUp} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Marco Rossi"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#A92E24]/30"
            />
          </div>
        </div>

        {/* Restaurant Name (Vendor Only) */}
        {role === "vendor" && (
          <div>
            <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
              Restaurant / Pizzeria Name *
            </label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Bella Napoli Pizzeria"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#596B45]/30"
              />
            </div>
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="marco@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#A92E24]/30"
            />
          </div>
        </div>

        {/* Password with toggle */}
        <div>
          <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
            Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#A92E24]/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[10px] text-[var(--muted-foreground)] mt-1">
            Min. 6 characters, at least 1 uppercase and 1 lowercase letter.
          </p>
        </div>

        {/* Optional Profile Image URL */}
        <div>
          <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
            Profile Image URL (Optional)
          </label>
          <div className="relative">
            <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#A92E24]/30"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-[#A92E24] hover:bg-[#78231E] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#A92E24]/20 hover:shadow-xl transition-all cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          <span>Create {role === "vendor" ? "Restaurant" : "Customer"} Account</span>
        </button>
      </form>

      <div className="text-center text-xs text-[var(--muted-foreground)]">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-[#A92E24] hover:underline">
          Sign In here
        </Link>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#A92E24]" />
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}

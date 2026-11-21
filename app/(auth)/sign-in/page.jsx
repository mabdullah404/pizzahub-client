"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  Loader2,
  LogIn,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const performSignIn = async (signInEmail, signInPassword) => {
    setLoading(true);

    try {
      const { data, error } = await signIn.email({
        email: signInEmail.trim().toLowerCase(),
        password: signInPassword,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      toast.success("Welcome back to PizzaHub!");

      // If user had a specific destination
      if (redirectTo && redirectTo.startsWith("/")) {
        router.push(redirectTo);
        router.refresh();
        return;
      }

      // Role-based redirect
      const userRole = data?.user?.role || "customer";
      if (userRole === "admin") {
        router.push("/dashboard/admin");
      } else if (userRole === "vendor") {
        router.push("/dashboard/vendor");
      } else {
        router.push("/dashboard/customer");
      }
      router.refresh();
    } catch (err) {
      console.error("Sign in exception:", err);
      toast.error(err.message || "Sign in failed.");
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    await performSignIn(email, password);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signIn.social({
        provider: "google",
        callbackURL: redirectTo || "/dashboard/customer",
      });
    } catch (err) {
      console.error("Google sign in failed:", err);
      toast.error("Google authentication failed.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#24242A] border border-[#E8EDF4] dark:border-[#333338] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-[#24242A] dark:text-white tracking-tight">
          Welcome Back to PizzaHub
        </h1>
        <p className="text-xs sm:text-sm text-[#777777] dark:text-[#A1A1AA]">
          Sign in to access your dashboard, track orders, or manage your restaurant.
        </p>
      </div>

      {errorParam === "blocked" && (
        <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Your account has been suspended. Please contact platform support.</span>
        </div>
      )}

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full py-3 rounded-2xl border border-[#E8EDF4] dark:border-[#333338] bg-[#F4F6FA] dark:bg-[#1F1F24] hover:bg-[#E8EDF4] text-[#24242A] dark:text-white text-xs font-semibold flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-60"
      >
        {googleLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-[#E66A2C]" />
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
        <span>Sign in with Google</span>
      </button>

      <div className="relative flex items-center justify-center">
        <div className="border-t border-[#E8EDF4] dark:border-[#333338] w-full" />
        <span className="bg-white dark:bg-[#24242A] px-3 text-[11px] uppercase tracking-wider text-[#777777] absolute">
          Or with email
        </span>
      </div>

      {/* Credential Login Form */}
      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#24242A] dark:text-white mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777777]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4F6FA] dark:bg-[#1F1F24] border border-[#E8EDF4] dark:border-[#333338] text-xs text-[#24242A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E66A2C]/30"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#24242A] dark:text-white mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777777]" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#F4F6FA] dark:bg-[#1F1F24] border border-[#E8EDF4] dark:border-[#333338] text-xs text-[#24242A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E66A2C]/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#777777] hover:text-[#24242A] dark:hover:text-white cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-[#E66A2C] hover:bg-[#D95716] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
          <span>Sign In to PizzaHub</span>
        </button>
      </form>

      <div className="text-center text-xs text-[#777777]">
        Don't have an account?{" "}
        <Link href="/sign-up" className="font-bold text-[#E66A2C] hover:underline">
          Create one now
        </Link>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#E66A2C]" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}

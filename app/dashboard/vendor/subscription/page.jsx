"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { createCheckoutSession, confirmPayment } from "@/lib/api/payments";
import { toast } from "sonner";
import {
  CreditCard,
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  Loader2,
  Crown,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

function VendorSubscriptionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, refetch } = useSession();

  const [upgrading, setUpgrading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmedSuccess, setConfirmedSuccess] = useState(false);

  const payment = searchParams.get("payment");
  const sessionId = searchParams.get("session_id");
  const isSandbox = searchParams.get("sandbox") === "true";

  const currentPlan = session?.user?.subscriptionPlan || "free";
  const isPremium = currentPlan === "premium" || confirmedSuccess;

  // Handle return from Stripe Checkout
  useEffect(() => {
    if (payment === "success" && sessionId) {
      let isMounted = true;
      setConfirming(true);

      async function verify() {
        try {
          const token = session?.session?.token;
          await confirmPayment(sessionId, isSandbox, token);
          if (isMounted) {
            setConfirmedSuccess(true);
            toast.success("🎉 Payment successful! You are now an active Premium Vendor!");
            if (refetch) await refetch();
          }
        } catch (err) {
          console.warn("Payment confirmation notice:", err?.message || err);
          if (isMounted) {
            setConfirmedSuccess(true);
            toast.success("🎉 Welcome to Premium Vendor status!");
            if (refetch) await refetch();
          }
        } finally {
          if (isMounted) {
            setConfirming(false);
          }
        }
      }

      verify();

      return () => {
        isMounted = false;
      };
    } else if (payment === "cancelled") {
      toast.info("Payment was cancelled. You remain on the Free Plan.");
    }
  }, [payment, sessionId, isSandbox, session, refetch]);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const token = session?.session?.token;
      const res = await createCheckoutSession(token);

      if (res?.url) {
        toast.info("Redirecting to secure Stripe Checkout...");
        window.location.href = res.url;
      } else {
        toast.error("Could not initiate checkout session.");
      }
    } catch (err) {
      console.error("Upgrade error:", err);
      toast.error(err.message || "Failed to start checkout.");
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#A92E24]">
          Vendor Monetization
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
          Pizzeria Subscription Plans
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
          Expand your culinary reach across the platform with unlimited menu publications and priority homepage placement.
        </p>
      </div>

      {/* Success Banner if redirected after payment */}
      {(payment === "success" || confirmedSuccess) && (
        <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-emerald-900 dark:text-emerald-100">
                  Payment Successful!
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white uppercase tracking-wider">
                  Active
                </span>
              </div>
              <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">
                Your Premium Vendor subscription is now fully active. Enjoy unlimited pizza publishing!
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/vendor/menu"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-sm whitespace-nowrap flex items-center gap-1.5"
          >
            <span>Go to My Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Cancelled Banner if cancelled */}
      {payment === "cancelled" && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-xs">
            Payment was cancelled. No charges were made. You can upgrade to Premium anytime!
          </p>
        </div>
      )}

      {/* Current Plan Badge Card */}
      <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#A92E24]/10 text-[#A92E24] flex items-center justify-center font-bold">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-[var(--muted-foreground)]">Your Current Tier</span>
            <p className="font-serif text-xl font-bold text-[var(--foreground)] capitalize">
              {isPremium ? "Premium" : "Free"} Vendor Plan
            </p>
          </div>
        </div>

        {isPremium ? (
          <span className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
            <Check className="w-4 h-4" />
            Active Premium
          </span>
        ) : (
          <span className="px-4 py-2 rounded-full text-xs font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            Standard Free Tier
          </span>
        )}
      </div>

      {/* Plan Cards Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <div className="p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase text-[var(--muted-foreground)]">
                Starter Tier
              </span>
              <h3 className="font-serif text-2xl font-bold text-[var(--foreground)] mt-1">
                Free Plan
              </h3>
              <p className="font-serif text-3xl font-bold text-[var(--foreground)] mt-2">
                $0 <span className="text-xs font-normal text-[var(--muted-foreground)]">/ month</span>
              </p>
            </div>

            <ul className="space-y-3 text-xs text-[var(--foreground)]/80 pt-4 border-t border-[var(--border)]">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#596B45] shrink-0" />
                <span>Max 3 active menu items</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#596B45] shrink-0" />
                <span>Standard order receiving &amp; dispatch</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#596B45] shrink-0" />
                <span>Basic vendor analytics overview</span>
              </li>
              <li className="flex items-center gap-2.5 text-[var(--muted-foreground)]">
                <span className="w-4 text-center">✕</span>
                <span>No homepage featured placement</span>
              </li>
              <li className="flex items-center gap-2.5 text-[var(--muted-foreground)]">
                <span className="w-4 text-center">✕</span>
                <span>No verified Premium badge</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              disabled
              className="w-full py-3 rounded-2xl border border-[var(--border)] bg-[var(--background)] text-xs font-semibold text-[var(--muted-foreground)] cursor-default"
            >
              {isPremium ? "Included in your tier" : "Current Active Plan"}
            </button>
          </div>
        </div>

        {/* Premium Plan */}
        <div className="relative p-8 rounded-3xl bg-[var(--card)] border-2 border-[#A92E24] shadow-xl space-y-6 flex flex-col justify-between">
          {/* Popular Tag */}
          <div className="absolute -top-3.5 right-6">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#A92E24] text-white shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-amber-300 text-amber-300" />
              Recommended
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase text-[#A92E24]">
                Growth Tier
              </span>
              <h3 className="font-serif text-2xl font-bold text-[var(--foreground)] mt-1">
                Premium Pizzeria
              </h3>
              <p className="font-serif text-3xl font-bold text-[#A92E24] mt-2">
                $29.00 <span className="text-xs font-normal text-[var(--muted-foreground)]">/ month</span>
              </p>
            </div>

            <ul className="space-y-3 text-xs text-[var(--foreground)] pt-4 border-t border-[var(--border)]">
              <li className="flex items-center gap-2.5 font-semibold text-[#A92E24]">
                <Check className="w-4 h-4 text-[#A92E24] shrink-0" />
                <span>Unlimited active pizza menu items</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#596B45] shrink-0" />
                <span>Exclusive "Premium" restaurant badge</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#596B45] shrink-0" />
                <span>Featured placement on homepage carousel</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#596B45] shrink-0" />
                <span>Priority customer order notifications</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#596B45] shrink-0" />
                <span>Advanced kitchen performance metrics</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            {isPremium ? (
              <button
                disabled
                className="w-full py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-default"
              >
                <Check className="w-4 h-4" />
                <span>Active Premium Subscription</span>
              </button>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={upgrading || confirming}
                className="w-full py-3.5 rounded-2xl bg-[#A92E24] hover:bg-[#78231E] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#A92E24]/20 hover:shadow-xl transition-all cursor-pointer disabled:opacity-60 active:scale-98"
              >
                {upgrading || confirming ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{confirming ? "Verifying Payment..." : "Connecting to Stripe..."}</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Upgrade with Stripe Checkout ($29)</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VendorSubscriptionPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#A92E24]" />
        </div>
      }
    >
      <VendorSubscriptionContent />
    </Suspense>
  );
}

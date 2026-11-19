"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useSession } from "@/lib/auth-client";
import { confirmPayment } from "@/lib/api/payments";
import { toast } from "sonner";
import { CheckCircle2, Sparkles, ArrowRight, Loader2, Crown } from "lucide-react";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const sessionId = searchParams.get("session_id");
  const isSandbox = searchParams.get("sandbox") === "true";

  const [confirming, setConfirming] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function verifyCheckout() {
      if (!sessionId) {
        setConfirming(false);
        return;
      }

      try {
        const token = session?.session?.token;
        if (token) {
          await confirmPayment(sessionId, isSandbox, token);
          setSuccess(true);
          toast.success("🎉 Complimenti! Your Premium Vendor tier is active!");
        }
      } catch (err) {
        console.warn("Direct confirmation notice:", err.message);
        // Even if webhook already handled it, show success
        setSuccess(true);
      } finally {
        setConfirming(false);
      }
    }

    if (session) {
      verifyCheckout();
    }
  }, [sessionId, isSandbox, session]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 mx-auto flex items-center justify-center shadow-md">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#A92E24] text-white">
              <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              Verified Premium Pizzeria
            </span>
            <h1 className="font-serif text-3xl font-bold text-[var(--foreground)]">
              Subscription Confirmed!
            </h1>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
              Thank you for partnering with PizzaHub. Your restaurant now enjoys unlimited menu
              publishing, priority homepage placement, and our verified Italian Artisan badge.
            </p>
          </div>

          <div className="pt-4 border-t border-[var(--border)] flex flex-col gap-3">
            <Link
              href="/dashboard/vendor"
              className="w-full py-3.5 rounded-2xl bg-[#A92E24] hover:bg-[#78231E] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#A92E24]/20 hover:shadow-xl transition-all"
            >
              <span>Go to Vendor Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard/vendor/menu-items/new"
              className="w-full py-3 rounded-2xl border border-[var(--border)] hover:bg-[var(--muted)] text-xs font-semibold text-[var(--foreground)] transition-colors"
            >
              Publish Another Signature Pizza
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#A92E24]" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}

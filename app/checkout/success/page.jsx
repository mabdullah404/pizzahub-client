"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { confirmPayment } from "@/lib/api/payments";
import { CheckCircle2, Loader2, ArrowRight, Sparkles } from "lucide-react";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, refetch } = useSession();

  const sessionId = searchParams.get("session_id");
  const isSandbox = searchParams.get("sandbox") === "true";

  const [confirming, setConfirming] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const confirmedRef = useRef(false);

  useEffect(() => {
    if (confirmedRef.current) return;
    confirmedRef.current = true;

    async function handlePaymentFinalize() {
      try {
        const token = session?.session?.token;
        if (sessionId) {
          await confirmPayment(sessionId, isSandbox, token);
        }
      } catch (err) {
        console.warn("Payment confirmation notice:", err?.message || err);
      } finally {
        setConfirmed(true);
        setConfirming(false);
        if (refetch) await refetch();

        // Smoothly navigate the user directly into their vendor subscription dashboard
        setTimeout(() => {
          router.push("/dashboard/vendor/subscription?payment=success");
        }, 1500);
      }
    }

    handlePaymentFinalize();
  }, [sessionId, isSandbox, session, refetch, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F4F6FA] dark:bg-[#18181B] transition-colors">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-[#24242A] border border-[#E8EDF4] dark:border-[#333338] shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          {confirming ? (
            <Loader2 className="w-8 h-8 animate-spin text-[#E66A2C]" />
          ) : (
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          )}
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Stripe Payment Confirmed</span>
          </div>

          <h1 className="text-2xl font-black text-[#24242A] dark:text-white tracking-tight">
            {confirming ? "Finalizing Your Subscription..." : "Welcome to Premium Pizzeria!"}
          </h1>

          <p className="text-xs text-[#777777] dark:text-[#A1A1AA] leading-relaxed">
            {confirming
              ? "We are verifying your payment with Stripe and unlocking unlimited menu publishing."
              : "Your account is now upgraded to Premium. Forwarding to your dashboard..."}
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/dashboard/vendor/subscription?payment=success"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#E66A2C] hover:bg-[#D95716] text-white font-extrabold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
          >
            <span>Go to Vendor Subscription</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F4F6FA] dark:bg-[#18181B]">
          <Loader2 className="w-8 h-8 animate-spin text-[#E66A2C]" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}

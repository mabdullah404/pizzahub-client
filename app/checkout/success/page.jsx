"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("session_id");
  const isSandbox = searchParams.get("sandbox") === "true";

  useEffect(() => {
    // Automatically forward the user directly to the vendor subscription dashboard
    if (sessionId) {
      router.replace(
        `/dashboard/vendor/subscription?session_id=${encodeURIComponent(sessionId)}&payment=success${
          isSandbox ? "&sandbox=true" : ""
        }`
      );
    } else {
      router.replace("/dashboard/vendor/subscription");
    }
  }, [sessionId, isSandbox, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--background)]">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#A92E24]" />
        <h2 className="font-serif text-xl font-bold text-[var(--foreground)]">
          Payment Confirmed!
        </h2>
        <p className="text-xs text-[var(--muted-foreground)]">
          Redirecting to your Vendor Subscription Dashboard...
        </p>
      </div>
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

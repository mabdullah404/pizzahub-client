"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

function CheckoutCancelContent() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/vendor/subscription?payment=cancelled");
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--background)]">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#A92E24]" />
        <h2 className="font-serif text-xl font-bold text-[var(--foreground)]">
          Returning to Dashboard...
        </h2>
      </div>
    </div>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#A92E24]" />
        </div>
      }
    >
      <CheckoutCancelContent />
    </Suspense>
  );
}

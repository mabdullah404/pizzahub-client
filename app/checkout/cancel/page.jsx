import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function CheckoutCancelPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 sm:p-10 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-600 mx-auto flex items-center justify-center">
            <XCircle className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-bold text-[var(--foreground)]">
              Subscription Cancelled
            </h1>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
              No charges were made to your account. You can continue publishing up to 3 active pizzas
              on our Free tier, or upgrade to Premium whenever you're ready to scale.
            </p>
          </div>

          <div className="pt-4 border-t border-[var(--border)] flex flex-col gap-3">
            <Link
              href="/dashboard/vendor/subscription"
              className="w-full py-3.5 rounded-2xl bg-[#596B45] hover:bg-[#435234] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Return to Subscription Page</span>
            </Link>

            <Link
              href="/dashboard/vendor"
              className="w-full py-3 rounded-2xl border border-[var(--border)] hover:bg-[var(--muted)] text-xs font-semibold text-[var(--foreground)] transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Vendor Overview</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

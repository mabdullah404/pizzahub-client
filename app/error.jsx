"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("PizzaHub Global Error Boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[var(--background)] space-y-6">
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center shadow-md">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
          Something went wrong in the kitchen
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
          An unexpected error occurred while processing your request. Our master pizzaiolos have
          been notified.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="px-6 py-2.5 rounded-full bg-[#A92E24] hover:bg-[#78231E] text-white text-xs font-semibold flex items-center gap-2 shadow-md cursor-pointer transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>

        <Link
          href="/"
          className="px-6 py-2.5 rounded-full border border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)] text-xs font-semibold flex items-center gap-2 transition-all"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}

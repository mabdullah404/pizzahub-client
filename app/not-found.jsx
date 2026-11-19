import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Pizza, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-[#A92E24]/10 text-[#A92E24] flex items-center justify-center shadow-lg">
          <Pizza className="w-10 h-10 transform -rotate-45" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A92E24]">
            404 — Page Not Found
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
            Oops! This Crust Has Vanished.
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
            The page you are looking for might have been moved, renamed, or is currently
            unavailable in our woodfired oven.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#A92E24] hover:bg-[#78231E] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link
            href="/browse-menu"
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)] font-semibold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <span>Explore Pizza Catalog</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import Link from "next/link";
import { Pizza } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      {/* Auth Top Header */}
      <header className="w-full border-b border-[var(--border)] py-4 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#A92E24] flex items-center justify-center text-white shadow-sm">
            <Pizza className="w-5 h-5 transform -rotate-12" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-[var(--foreground)]">
            Pizza<span className="text-[#A92E24]">Hub</span>
          </span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Form Center Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="py-4 text-center text-xs text-[var(--muted-foreground)] border-t border-[var(--border)]">
        © 2026 PizzaHub. Authentic Italian Artisan Platform.
      </footer>
    </div>
  );
}

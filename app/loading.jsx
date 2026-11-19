import { Pizza, Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] p-6 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-[#A92E24] text-white flex items-center justify-center shadow-xl animate-pulse">
          <Pizza className="w-8 h-8 transform -rotate-12" />
        </div>
        <Loader2 className="w-20 h-20 text-[#A92E24]/30 animate-spin absolute -top-2 -left-2 pointer-events-none" />
      </div>

      <div className="text-center space-y-1">
        <p className="font-serif text-lg font-bold text-[var(--foreground)]">
          Preparing Fresh Artisan Crust...
        </p>
        <p className="text-xs text-[var(--muted-foreground)]">
          Loading PizzaHub authentic culinary experience
        </p>
      </div>
    </div>
  );
}

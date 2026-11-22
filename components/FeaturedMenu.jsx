"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Flame, RotateCcw, AlertCircle } from "lucide-react";
import { MenuCard } from "@/components/MenuCard";
import { Container } from "@/components/Container";
import { getApiUrl } from "@/lib/utils/apiUrl";

export function FeaturedMenu({ items: initialItems = [] }) {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(initialItems.length === 0);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchFeatured = useCallback(async (currentRetry = 0) => {
    setLoading(true);
    setError(null);
    const serverUrl = getApiUrl();

    try {
      const res = await fetch(`${serverUrl}/api/menu?limit=6`, {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        setItems(json.data);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.warn(`Featured menu fetch failed (attempt ${currentRetry + 1}/3):`, err.message);
      if (currentRetry < 2) {
        // Auto-retry up to 2 times with backoff
        setTimeout(() => {
          setRetryCount(currentRetry + 1);
          fetchFeatured(currentRetry + 1);
        }, 1200 * (currentRetry + 1));
      } else {
        setError("Unable to load featured pizzas at this moment.");
        setLoading(false);
      }
    } finally {
      if (currentRetry >= 2 || items.length > 0) {
        setLoading(false);
      }
    }
  }, [items.length]);

  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      setItems(initialItems);
      setLoading(false);
      return;
    }
    fetchFeatured(0);
  }, [initialItems, fetchFeatured]);

  const handleManualRetry = () => {
    setRetryCount(0);
    fetchFeatured(0);
  };

  return (
    <section className="py-16 sm:py-24 bg-[#F4F6FA] dark:bg-[#18181B] transition-colors">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#24242A] border border-[#E8EDF4] dark:border-[#333338] text-[#E66A2C] text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Flame className="w-3.5 h-3.5 fill-[#E66A2C]" />
              <span>FRESH FROM THE OVEN</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#24242A] dark:text-white tracking-tight">
              Featured Pizza Menu
            </h2>
            <p className="text-sm sm:text-base text-[#777777] dark:text-[#A1A1AA] max-w-xl">
              Hand-tossed dough, premium mozzarella, and authentic sauce baked to perfection.
            </p>
          </div>

          <Link
            href="/browse-menu"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-[#E66A2C] hover:text-[#D95716] group transition-colors"
          >
            <span>Explore Full Menu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Menu Cards Grid / Skeletons / States */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-3xl bg-white dark:bg-[#24242A] border border-[#E8EDF4] dark:border-[#333338] p-4 space-y-4 animate-pulse h-full"
              >
                <div className="w-full aspect-[4/3] rounded-2xl bg-[#E8EDF4] dark:bg-[#1F1F24]" />
                <div className="space-y-2">
                  <div className="h-4 w-2/3 bg-[#E8EDF4] dark:bg-[#1F1F24] rounded-md" />
                  <div className="h-3 w-full bg-[#E8EDF4] dark:bg-[#1F1F24] rounded-md" />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="h-6 w-16 bg-[#E8EDF4] dark:bg-[#1F1F24] rounded-md" />
                  <div className="h-9 w-24 bg-[#E8EDF4] dark:bg-[#1F1F24] rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 px-6 rounded-3xl bg-white dark:bg-[#24242A] border border-[#E8EDF4] dark:border-[#333338] max-w-md mx-auto space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#24242A] dark:text-white">
                {error}
              </p>
              <p className="text-xs text-[#777777] dark:text-[#A1A1AA] mt-1">
                Please check your network connection and try again.
              </p>
            </div>
            <button
              onClick={handleManualRetry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E66A2C] hover:bg-[#D4591D] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>আবার চেষ্টা করুন (Try Again)</span>
            </button>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {items.map((item) => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-3xl bg-white dark:bg-[#24242A] border border-[#E8EDF4] dark:border-[#333338] p-8 max-w-lg mx-auto">
            <p className="text-base font-bold text-[#24242A] dark:text-white">
              No menu items currently available.
            </p>
            <p className="text-xs text-[#777777] dark:text-[#A1A1AA] mt-1 mb-4">
              Our artisan bakers are preparing fresh recipes. Please explore all available options.
            </p>
            <Link
              href="/browse-menu"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FFD64F] hover:bg-[#FACC15] text-[#24242A] text-xs font-bold shadow-xs"
            >
              <span>Browse Catalog</span>
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}

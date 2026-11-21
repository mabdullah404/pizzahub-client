"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Flame, Loader2 } from "lucide-react";
import { MenuCard } from "@/components/MenuCard";
import { getApiUrl } from "@/lib/utils/apiUrl";

export function FeaturedMenu({ items: initialItems = [] }) {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(initialItems.length === 0);

  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      setItems(initialItems);
      setLoading(false);
      return;
    }

    // Client-side fallback fetch from backend API if SSR initialItems was empty
    const serverUrl = getApiUrl();

    fetch(`${serverUrl}/api/menu?limit=6`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setItems(json.data);
        }
      })
      .catch((err) => {
        console.error("Client fetch for featured pizzas error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [initialItems]);

  return (
    <section className="py-16 sm:py-24 bg-[#F4F6FA] dark:bg-[#18181B] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* Menu Cards Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#E66A2C]" />
            <p className="text-xs text-[#777777]">Fetching artisan pizzas from kitchen...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {items.map((item) => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-3xl bg-white dark:bg-[#24242A] border border-[#E8EDF4] dark:border-[#333338] p-8">
            <p className="text-base font-bold text-[#24242A] dark:text-white">
              No menu items currently available.
            </p>
            <p className="text-xs text-[#777777] mt-1">
              Please check back shortly or explore all available options.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

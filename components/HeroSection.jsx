"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame, Search } from "lucide-react";
import { CustomerAvatars } from "@/components/CustomerAvatars";
import { FeaturePills } from "@/components/FeaturePills";

export function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse-menu?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/browse-menu");
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#F4F6FA] dark:bg-[#18181B] transition-colors pt-8 sm:pt-12 lg:pt-16 pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center pb-12 sm:pb-16 lg:pb-20">
          {/* Left Column: Typography & Action Buttons */}
          <div className="lg:col-span-6 space-y-5 text-left">
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#24242A] border border-[#E8EDF4] dark:border-[#333338] shadow-2xs">
              <Flame className="w-3.5 h-3.5 text-[#E66A2C]" />
              <span className="text-[11px] font-extrabold text-[#777777] dark:text-[#A1A1AA] uppercase tracking-widest">
                FRESHLY BAKED, MADE WITH LOVE
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1.5">
              <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-black text-[#24242A] dark:text-white tracking-tight leading-[1.05]">
                Pizza Cravings?
              </h1>

              {/* Orange Subheading */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#E66A2C] tracking-tight leading-snug">
                Get It Delivered Hot & Fresh!
              </h2>
            </div>

            {/* Description Text */}
            <p className="text-sm sm:text-base text-[#777777] dark:text-[#A1A1AA] max-w-lg leading-relaxed font-normal">
              Indulge in our mouth-watering artisan pizzas, freshly woodfired with premium ingredients.
              Delivered hot and fast straight to your door!
            </p>

            {/* Hero Search Bar for Pizza Items (Assignment Req 4 & 6) */}
            <form onSubmit={handleSearchSubmit} className="pt-1 max-w-md w-full relative">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-[#777777] absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pizza by item name (e.g. Margherita, Diavola)..."
                  className="w-full pl-11 pr-24 py-3 rounded-full bg-white dark:bg-[#24242A] border border-[#E8EDF4] dark:border-[#333338] text-xs text-[#24242A] dark:text-white placeholder-[#777777] dark:placeholder-[#A1A1AA] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#E66A2C]/30 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 py-2 rounded-full bg-[#E66A2C] hover:bg-[#D95716] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Yellow Rounded CTA Button */}
            <div className="pt-1 flex flex-wrap items-center gap-4">
              <Link
                href="/browse-menu"
                className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#FFD64F] hover:bg-[#FACC15] text-[#24242A] text-xs font-extrabold uppercase tracking-wider shadow-sm hover:shadow-md transition-all duration-200"
              >
                <span>EXPLORE PIZZA MENU</span>
                <span className="w-5 h-5 rounded-full bg-[#24242A]/10 flex items-center justify-center">
                  <ArrowRight className="w-3 h-3 text-[#24242A]" />
                </span>
              </Link>
            </div>

            {/* Social Proof Avatar Group */}
            <div className="pt-1">
              <CustomerAvatars />
            </div>
          </div>

          {/* Right Column: High-End Professional Pizza Photography */}
          <div className="lg:col-span-6 flex items-center justify-center relative">
            {/* Subtle soft backdrop radial glow */}
            <div className="absolute w-[300px] sm:w-[420px] lg:w-[480px] h-[300px] sm:h-[420px] lg:h-[480px] rounded-full bg-white/80 dark:bg-[#24242A]/40 blur-3xl pointer-events-none" />

            {/* Clean Rounded Image Frame */}
            <div className="relative w-full max-w-[520px] aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden bg-white dark:bg-[#24242A] shadow-xl border border-[#E8EDF4] dark:border-[#333338] group">
              <Image
                src="/images/kelvin-t-AcA8moIiD3g-unsplash.jpg"
                alt="Artisan woodfired pizza with hot melted cheese pull"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 520px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Floating Quality Tag */}
              <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-[#24242A]/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-md border border-[#E8EDF4] dark:border-[#333338] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FFD64F] text-[#24242A] flex items-center justify-center font-black text-sm">
                  🍕
                </div>
                <div>
                  <p className="text-xs font-black text-[#24242A] dark:text-white leading-tight">
                    Artisan Hand-Tossed Crust
                  </p>
                  <p className="text-[11px] text-[#777777] dark:text-[#A1A1AA] leading-tight">
                    100% Real Mozzarella & Olive Oil
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Hero Strip (About Us + Feature Pills) */}
      <FeaturePills />
    </section>
  );
}

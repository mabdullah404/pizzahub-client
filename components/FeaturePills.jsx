"use client";

import { Sparkles, Clock, Zap, Utensils, Award } from "lucide-react";
import { Container } from "@/components/Container";

export function FeaturePills() {
  const features = [
    { name: "Easy Ordering", icon: Zap },
    { name: "Real-time Order Status", icon: Clock },
    { name: "Fast Delivery", icon: Sparkles },
    { name: "Delicious Varieties", icon: Utensils },
    { name: "Quality Ingredients", icon: Award },
  ];

  return (
    <div className="border-t border-[#E8EDF4] dark:border-[#333338] bg-white/70 dark:bg-[#1F1F24] py-8 sm:py-10 transition-colors">
      <Container>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: About Us Statement (Matches Reference) */}
          <div className="space-y-1.5 max-w-xl">
            <span className="text-[11px] font-extrabold text-[#E66A2C] uppercase tracking-widest">
              ABOUT US
            </span>
            <p className="text-sm sm:text-base md:text-lg font-black text-[#24242A] dark:text-white uppercase leading-snug tracking-tight">
              WE DELIVER DELICIOUS, FRESH PIZZAS STRAIGHT TO YOUR DOOR WITH TOP-NOTCH INGREDIENTS AND SERVICE.
            </p>
          </div>

          {/* Right: Feature Pills (Matches Reference) */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-[#24242A] border border-[#E8EDF4] dark:border-[#333338] shadow-xs text-xs font-semibold text-[#24242A] dark:text-white hover:border-[#E66A2C]/40 hover:shadow-sm transition-all cursor-default"
                >
                  <Icon className="w-3.5 h-3.5 text-[#E66A2C]" />
                  <span>{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}

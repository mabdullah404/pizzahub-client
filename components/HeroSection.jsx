"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DeliveryPath } from "@/components/DeliveryPath";
import { CustomerAvatars } from "@/components/CustomerAvatars";
import { FeaturePills } from "@/components/FeaturePills";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F4F6FA] dark:bg-[#18181B] transition-colors pt-12 sm:pt-16 lg:pt-20 pb-0">
      {/* Container framing matching reference */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Curved Delivery Road SVG illustration */}
        <DeliveryPath />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center min-h-[500px] lg:min-h-[560px] pb-16 lg:pb-20 relative z-20">
          {/* Left Column: Headlines & CTA (Matches Reference) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Small Eyebrow */}
            <div className="inline-block">
              <span className="text-[11px] font-extrabold text-[#777777] dark:text-[#A1A1AA] uppercase tracking-widest">
                FRESHLY BAKED, MADE WITH LOVE
              </span>
            </div>

            {/* Giant Bold Headline - Match Reference */}
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[78px] font-black text-[#24242A] dark:text-white tracking-tight leading-[1.02]">
                Pizza Cravings?
              </h1>

              {/* Orange Subheading */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-black text-[#E66A2C] tracking-tight leading-snug">
                Get It Delivered Hot & Fresh!
              </h2>
            </div>

            {/* Description Text */}
            <p className="text-sm sm:text-base md:text-lg text-[#777777] dark:text-[#A1A1AA] max-w-lg leading-relaxed font-normal">
              Indulge in our mouth-watering pizzas, freshly baked with the finest ingredients.
              Delivered hot and fast, straight to your door!
            </p>

            {/* Yellow Rounded CTA Button (Matches Reference) */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/browse-menu"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#FFD64F] hover:bg-[#FACC15] text-[#24242A] text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>ORDER YOUR PIZZA NOW</span>
                <span className="w-6 h-6 rounded-full bg-[#24242A]/10 flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5 text-[#24242A]" />
                </span>
              </Link>
            </div>

            {/* Social Proof Avatar Group (Matches Reference) */}
            <div className="pt-2">
              <CustomerAvatars />
            </div>
          </div>

          {/* Right Column: Prominent Pizza Imagery with Cheese Pull (Matches Reference) */}
          <div className="lg:col-span-6 flex items-center justify-center relative mt-6 lg:mt-0">
            {/* Soft backdrop glow circle */}
            <div className="absolute w-[360px] sm:w-[480px] md:w-[540px] h-[360px] sm:h-[480px] md:h-[540px] rounded-full bg-radial from-white via-[#E8EDF4]/70 to-transparent dark:from-[#24242A]/60 dark:via-[#1F1F24]/30 pointer-events-none blur-2xl" />

            {/* Circular Pizza Plate Composition */}
            <div className="relative w-[320px] sm:w-[440px] md:w-[500px] h-[320px] sm:h-[440px] md:h-[500px] rounded-full p-3 bg-gradient-to-tr from-[#CBD5E1]/40 via-white to-[#E8EDF4] dark:from-[#24242A] dark:to-[#18181B] shadow-2xl flex items-center justify-center border-4 border-white dark:border-[#333338]">
              {/* Inner dark rim representing the pizza pan/stone */}
              <div className="relative w-full h-full rounded-full overflow-hidden bg-[#24242A] border-8 border-[#24242A] shadow-inner group">
                <Image
                  src="/images/brelyn-bashrum-kpz1Y1tikGM-unsplash.jpg"
                  alt="Fresh artisan pizza with melted cheese slice lifted"
                  fill
                  priority
                  sizes="(max-width: 768px) 320px, (max-width: 1200px) 460px, 500px"
                  className="object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                />

                {/* Subtle vignette for editorial photography depth */}
                <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/20 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Hero / About Us Strip (Matches Reference) */}
      <FeaturePills />
    </section>
  );
}

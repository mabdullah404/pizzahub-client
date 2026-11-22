import Link from "next/link";
import { Utensils, Flame, Bike, ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Choose Your Favorites",
      desc: "Browse authentic trattoria menus, customize toppings, or build your combo.",
      icon: Utensils,
    },
    {
      num: "02",
      title: "Woodfired to Order",
      desc: "Fresh fermented dough stretched by hand and baked in 900°F stone ovens.",
      icon: Flame,
    },
    {
      num: "03",
      title: "Delivered Hot & Fast",
      desc: "Insulated scooter couriers deliver straight to your door in record time.",
      icon: Bike,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-[#1F1F24] border-t border-[#E8EDF4] dark:border-[#333338] transition-colors">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-[11px] font-extrabold text-[#E66A2C] uppercase tracking-widest">
            SIMPLE & SEAMLESS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#24242A] dark:text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-[#777777] dark:text-[#A1A1AA]">
            Getting fresh, authentic artisan pizza to your table in three easy steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={st.num}
                className="relative rounded-3xl bg-[#F4F6FA] dark:bg-[#24242A] border border-[#E8EDF4] dark:border-[#333338] p-8 space-y-4 hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFD64F] text-[#24242A] flex items-center justify-center font-black">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-[#E8EDF4] dark:text-[#333338]">
                    {st.num}
                  </span>
                </div>

                <h3 className="text-xl font-black text-[#24242A] dark:text-white tracking-tight">
                  {st.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#777777] dark:text-[#A1A1AA] leading-relaxed">
                  {st.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Action Banner */}
        <div className="mt-16 text-center">
          <Link
            href="/browse-menu"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#FFD64F] hover:bg-[#FACC15] text-[#24242A] text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
          >
            <span>ORDER YOUR PIZZA NOW</span>
            <ArrowRight className="w-4 h-4 text-[#24242A]" />
          </Link>
        </div>
      </Container>
    </section>
  );
}

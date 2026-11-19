import { Flame, Clock, ShieldCheck, HeartHandshake } from "lucide-react";

export function WhyChooseUs() {
  const points = [
    {
      title: "Hand-Tossed Dough",
      desc: "Slow 48-hour fermented dough crafted daily with Italian stone-ground wheat.",
      icon: HeartHandshake,
    },
    {
      title: "900°F Woodfire Oven",
      desc: "Blistered leopard-spotted crusts baked in authentic stone woodfired ovens.",
      icon: Flame,
    },
    {
      title: "Hot & Fast Delivery",
      desc: "Specially insulated thermal boxes ensure your pizza arrives piping hot.",
      icon: Clock,
    },
    {
      title: "100% Quality Guaranteed",
      desc: "Fresh San Marzano tomatoes, D.O.P cheeses, and pure extra virgin olive oil.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#F4F6FA] dark:bg-[#18181B] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-[11px] font-extrabold text-[#E66A2C] uppercase tracking-widest">
            THE PIZZAHUB DIFFERENCE
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#24242A] dark:text-white tracking-tight">
            Why Choose PizzaHub?
          </h2>
          <p className="text-sm sm:text-base text-[#777777] dark:text-[#A1A1AA]">
            We obsess over every single crust, sauce, and cheese pull so you get the best pizza every time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((pt) => {
            const Icon = pt.icon;
            return (
              <div
                key={pt.title}
                className="rounded-3xl bg-white dark:bg-[#24242A] border border-[#E8EDF4] dark:border-[#333338] p-7 shadow-xs hover:shadow-xl hover:border-[#E66A2C]/30 hover:-translate-y-1 transition-all duration-300 space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#E8EDF4] dark:bg-[#1F1F24] text-[#E66A2C] flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-[#24242A] dark:text-white tracking-tight">
                  {pt.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#777777] dark:text-[#A1A1AA] leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

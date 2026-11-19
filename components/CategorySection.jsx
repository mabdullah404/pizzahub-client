import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { LOCAL_IMAGES } from "@/lib/constants/images";

export function CategorySection() {
  const categories = [
    {
      name: "Classic Pizzas",
      tagline: "Margherita, Marinara & Traditional Crusts",
      image: LOCAL_IMAGES.MARGHERITA,
    },
    {
      name: "Meat Lovers",
      tagline: "Pepperoni, Salami & Smoky BBQ Chicken",
      image: LOCAL_IMAGES.PEPPERONI,
    },
    {
      name: "Vegetarian Pizzas",
      tagline: "Roasted Vegetables, Pesto & Buffalo Mozzarella",
      image: LOCAL_IMAGES.VEGETARIAN,
    },
    {
      name: "Specialty / Gourmet Pizzas",
      tagline: "Black Truffle, Gorgonzola & Artisanal Prosciutto",
      image: LOCAL_IMAGES.TRUFFLE_MUSHROOM,
    },
    {
      name: "Sides & Appetizers",
      tagline: "Garlic Focaccia, Bruschetta & Stuffed Crusts",
      image: LOCAL_IMAGES.SIDES_FOCACCIA,
    },
    {
      name: "Beverages & Desserts",
      tagline: "Italian Tiramisu, Cannoli & Cold Sodas",
      image: LOCAL_IMAGES.DESSERT_TIRAMISU,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-[#1F1F24] border-y border-[#E8EDF4] dark:border-[#333338] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-[11px] font-extrabold text-[#E66A2C] uppercase tracking-widest">
            EXPLORE OUR FLAVORS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#24242A] dark:text-white tracking-tight">
            Pizza Categories
          </h2>
          <p className="text-sm sm:text-base text-[#777777] dark:text-[#A1A1AA]">
            Browse your favorite styles freshly prepared with authentic Italian traditions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/browse-menu?category=${encodeURIComponent(cat.name)}`}
              className="group relative h-64 rounded-3xl overflow-hidden border border-[#E8EDF4] dark:border-[#333338] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-end p-6"
            >
              {/* Background Food Photography */}
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Dark Gradient Overlay for Typography Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              {/* Content */}
              <div className="relative z-10 space-y-1.5 text-white">
                <span className="text-[10px] font-bold text-[#FFD64F] uppercase tracking-wider block">
                  Category
                </span>
                <h3 className="text-xl font-black tracking-tight text-white group-hover:text-[#FFD64F] transition-colors flex items-center justify-between">
                  <span>{cat.name}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-white/80 line-clamp-1">
                  {cat.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Heart, Star, ArrowRight, Store } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export function MenuCard({ item }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const displayImage =
    item.images && item.images.length > 0 && item.images[0]
      ? item.images[0]
      : "/images/chad-montano-MqT0asuoIcU-unsplash.jpg";

  const locationText = item.location || item.vendorLocation || "";
  const vendorName = item.businessName || item.vendorName || "Artisan Pizzeria";

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session?.user) {
      toast.info("Please sign in to save items to your favorites.");
      router.push("/sign-in");
      return;
    }
    setIsFavorite(!isFavorite);
    toast.success(
      isFavorite ? "Removed from favorites." : "Added to favorites! ❤️"
    );
  };

  return (
    <div className="group relative flex flex-col h-full rounded-3xl bg-white dark:bg-[#24242A] border border-[#E8EDF4] dark:border-[#333338] overflow-hidden shadow-xs hover:shadow-xl hover:border-[#E66A2C]/30 hover:-translate-y-1 transition-all duration-300">
      {/* Food Photography Container (Aspect Ratio Reserved) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E8EDF4] dark:bg-[#1F1F24] shrink-0">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-[#E8EDF4] dark:bg-[#1F1F24] animate-pulse" />
        )}

        <Image
          src={displayImage}
          alt={item.itemName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className={`object-cover group-hover:scale-105 transition-transform duration-500 ease-out ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImgLoaded(true)}
        />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#24242A]/80 backdrop-blur-md text-white border border-white/10 shadow-xs">
            {item.category}
          </span>
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteToggle}
          aria-label="Add to favorites"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-[#24242A]/90 backdrop-blur-md flex items-center justify-center text-[#24242A] dark:text-white hover:text-red-500 transition-colors shadow-sm cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorite ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </button>

        {/* Location pill on image */}
        {locationText && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white/90 dark:bg-[#24242A]/90 backdrop-blur-md text-[#24242A] dark:text-white shadow-xs">
              <MapPin className="w-3 h-3 text-[#E66A2C]" />
              {locationText.split(",")[0]}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Vendor info */}
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#777777] dark:text-[#A1A1AA]">
            <Store className="w-3.5 h-3.5 text-[#E66A2C]" />
            <span className="truncate">{vendorName}</span>
          </div>

          {/* Item Name & Rating (Only show rating if exists) */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-extrabold text-base sm:text-lg text-[#24242A] dark:text-white tracking-tight group-hover:text-[#E66A2C] transition-colors line-clamp-1">
              {item.itemName}
            </h3>
            {item.rating ? (
              <div className="flex items-center gap-1 text-xs font-bold text-[#E66A2C] shrink-0">
                <Star className="w-3.5 h-3.5 fill-[#FFD64F] text-[#FFD64F]" />
                <span>{Number(item.rating).toFixed(1)}</span>
              </div>
            ) : null}
          </div>

          <p className="text-xs text-[#777777] dark:text-[#A1A1AA] line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price & CTA Button */}
        <div className="pt-3 border-t border-[#E8EDF4] dark:border-[#333338] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#777777] block leading-none">
              Price
            </span>
            <span className="text-xl font-black text-[#24242A] dark:text-white">
              {formatPrice(item.price)}
            </span>
          </div>

          <Link
            href={`/menu/${item._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFD64F] hover:bg-[#FACC15] text-[#24242A] text-xs font-extrabold uppercase tracking-wider shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <span>View Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

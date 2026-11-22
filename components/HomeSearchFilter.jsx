"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, RotateCcw } from "lucide-react";
import { PIZZA_CATEGORIES, POPULAR_LOCATIONS } from "@/lib/constants/locations";

export function HomeSearchFilter() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [sort, setSort] = useState("newest");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigateToBrowseMenu();
  };

  const navigateWithParams = (newCategory, newLocation, newSort) => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (newCategory && newCategory !== "All") params.set("category", newCategory);
    if (newLocation && newLocation !== "All") params.set("location", newLocation);
    if (newSort && newSort !== "newest") params.set("sort", newSort);

    const queryString = params.toString();
    router.push(queryString ? `/browse-menu?${queryString}` : "/browse-menu");
  };

  const navigateToBrowseMenu = () => {
    navigateWithParams(category, location, sort);
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setCategory(val);
    navigateWithParams(val, location, sort);
  };

  const handleLocationChange = (e) => {
    const val = e.target.value;
    setLocation(val);
    navigateWithParams(category, val, sort);
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSort(val);
    navigateWithParams(category, location, val);
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("All");
    setLocation("All");
    setSort("newest");
    router.push("/browse-menu");
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Subtitle from assignment reference */}
      <div className="text-center mb-4">
        <p className="text-xs sm:text-sm text-[#777777] dark:text-[#A1A1AA] max-w-2xl mx-auto">
          Search our curated selection of woodfired pizzas, traditional pasta sides, and Italian desserts from licensed independent pizzerias.
        </p>
      </div>

      {/* Main Toolbar Container matching exact screenshot media_1795266641253_f9ed4859.png */}
      <div className="bg-white dark:bg-[#24242A] border border-[#E8EDF4] dark:border-[#333338] rounded-3xl p-5 shadow-sm space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#777777] dark:text-[#A1A1AA]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by pizza name, toppings, or ingredients (e.g. Margherita, Truffle, Pepperoni)..."
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-[#F4F6FA] dark:bg-[#18181B] border border-[#E8EDF4] dark:border-[#333338] text-xs sm:text-sm text-[#24242A] dark:text-white placeholder-[#777777] dark:placeholder-[#A1A1AA] focus:outline-none focus:ring-2 focus:ring-[#A92E24]/30"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-xl bg-[#A92E24] hover:bg-[#78231E] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
          >
            Search
          </button>
        </form>

        {/* Filter and Sorting Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          {/* Category Dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#777777] dark:text-[#A1A1AA]">
              Category
            </label>
            <select
              value={category}
              onChange={handleCategoryChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F6FA] dark:bg-[#18181B] border border-[#E8EDF4] dark:border-[#333338] text-xs text-[#24242A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#A92E24]/30 cursor-pointer"
            >
              {PIZZA_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#777777] dark:text-[#A1A1AA]">
              Location (Area / City)
            </label>
            <select
              value={location}
              onChange={handleLocationChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F6FA] dark:bg-[#18181B] border border-[#E8EDF4] dark:border-[#333338] text-xs text-[#24242A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#A92E24]/30 cursor-pointer"
            >
              {POPULAR_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Price / Newest */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-[#777777] dark:text-[#A1A1AA]">
              Sort By
            </label>
            <select
              value={sort}
              onChange={handleSortChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F6FA] dark:bg-[#18181B] border border-[#E8EDF4] dark:border-[#333338] text-xs text-[#24242A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#A92E24]/30 cursor-pointer"
            >
              <option value="newest">Newest Additions</option>
              <option value="price_asc">Price: Low to High ($ → $$$)</option>
              <option value="price_desc">Price: High to Low ($$$ → $)</option>
            </select>
          </div>

          {/* Reset Button */}
          <div className="flex flex-col justify-end">
            <button
              type="button"
              onClick={handleResetFilters}
              className="w-full py-2.5 px-4 rounded-xl border border-[#E8EDF4] dark:border-[#333338] bg-[#F4F6FA] dark:bg-[#18181B] hover:bg-[#E8EDF4] dark:hover:bg-[#24242A] text-xs font-medium text-[#24242A] dark:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#A92E24]" />
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MenuCard } from "@/components/MenuCard";
import { getMenuItems } from "@/lib/api/menu-items";
import { PIZZA_CATEGORIES, POPULAR_LOCATIONS } from "@/lib/constants/images";
import { Search, Filter, RotateCcw, Pizza, ArrowUpDown, Loader2 } from "lucide-react";

function BrowseMenuContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state initialized from URL search params
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [location, setLocation] = useState(searchParams.get("location") || "All");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  // Fetch items based on active filters
  const fetchFilteredItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMenuItems({
        search,
        category,
        location,
        sort,
      });
      setItems(response.data || []);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setError("Unable to load menu items. Please check connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredItems();
  }, [category, location, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFilteredItems();
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("All");
    setLocation("All");
    setSort("newest");
    router.push("/browse-menu");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A92E24]">
            Woodfired Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] mt-2">
            Browse Authentic Pizza Menus
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-2">
            Search our curated selection of woodfired pizzas, traditional pasta sides,
            and Italian desserts from licensed independent pizzerias.
          </p>
        </div>

        {/* ===================================================================
            SEARCH & FILTER TOOLBAR (CHALLENGE REQUIREMENT 1)
           =================================================================== */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-5 mb-10 shadow-sm space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by pizza name, toppings, or ingredients (e.g. Margherita, Truffle, Pepperoni)..."
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-[var(--background)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[#A92E24]/30"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-xl bg-[#A92E24] hover:bg-[#78231E] text-white text-xs font-semibold transition-all cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Filter and Sorting Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            {/* Category Dropdown */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[var(--muted-foreground)]">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#A92E24]/30"
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
              <label className="text-xs font-medium text-[var(--muted-foreground)]">
                Location (Area / City)
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#A92E24]/30"
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
              <label className="text-xs font-medium text-[var(--muted-foreground)]">
                Sort By
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#A92E24]/30"
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
                className="w-full py-2.5 px-4 rounded-xl border border-[var(--border)] hover:bg-[var(--muted)] text-xs font-medium text-[var(--foreground)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#A92E24]" />
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* ===================================================================
            MENU CARDS GRID & STATES
           =================================================================== */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-[var(--muted-foreground)] space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#A92E24]" />
            <p className="text-sm font-medium">Fetching woodfired pizza offerings...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-[var(--card)] border border-red-200 dark:border-red-900/30 rounded-3xl p-6">
            <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
            <button
              onClick={fetchFilteredItems}
              className="mt-4 px-5 py-2 rounded-full bg-[#A92E24] text-white text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[var(--muted)] flex items-center justify-center mx-auto text-[#A92E24]">
              <Pizza className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[var(--foreground)]">
              No matching pizzas found
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] max-w-md mx-auto">
              We couldn't find any approved menu items matching your criteria. Try adjusting your
              search term, selecting a different category, or resetting your filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded-full bg-[#A92E24] text-white text-xs font-semibold hover:bg-[#78231E] transition-all cursor-pointer shadow-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6 text-xs text-[var(--muted-foreground)]">
              <span>Showing {items.length} active artisan item{items.length === 1 ? "" : "s"}</span>
              <span className="font-medium text-[#596B45]">Only Approved Menus</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
              {items.map((item) => (
                <MenuCard key={item._id} item={item} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function BrowseMenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#A92E24]" />
        </div>
      }
    >
      <BrowseMenuContent />
    </Suspense>
  );
}

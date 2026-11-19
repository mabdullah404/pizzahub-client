"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getMenuItemById } from "@/lib/api/menu-items";
import { createOrder } from "@/lib/api/orders";
import { useSession } from "@/lib/auth-client";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import {
  MapPin,
  ChefHat,
  Calendar,
  Truck,
  MessageSquare,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";

export default function ItemDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  // Order form state
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [message, setMessage] = useState("");
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Enforce authentication redirect if user is not signed in
  useEffect(() => {
    if (!sessionPending && !session?.user) {
      toast.info("Please sign in to view item details and place orders.");
      router.push(`/sign-in?redirectTo=/menu/${id}`);
    }
  }, [session, sessionPending, id, router]);

  // Load menu item details
  useEffect(() => {
    async function loadItem() {
      try {
        setLoading(true);
        const res = await getMenuItemById(id);
        if (res?.data) {
          setItem(res.data);
          if (res.data.images && res.data.images.length > 0) {
            setSelectedImage(res.data.images[0]);
          }
        }
      } catch (err) {
        console.error("Error loading menu item:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadItem();
  }, [id]);

  // Handle Order Submission
  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("You must be logged in to order.");
      router.push(`/sign-in?redirectTo=/menu/${id}`);
      return;
    }

    const userRole = session.user.role || "customer";
    if (userRole !== "customer") {
      toast.error(`Only customers can place orders. Your account role is ${userRole}.`);
      return;
    }

    if (!deliveryDate) {
      toast.error("Please select a delivery date.");
      return;
    }

    if (!deliveryAddress.trim()) {
      toast.error("Please provide a delivery address.");
      return;
    }

    setSubmittingOrder(true);
    try {
      const token = session.session?.token;
      await createOrder(
        {
          itemId: item._id,
          deliveryDate,
          deliveryAddress,
          message,
        },
        token
      );

      toast.success("🍕 Order placed successfully! The pizzeria has received your order.");
      router.push("/dashboard/customer/orders");
    } catch (err) {
      console.error("Order error:", err);
      toast.error(err.message || "Failed to place order.");
    } finally {
      setSubmittingOrder(false);
    }
  };

  // Min date for delivery date picker (today)
  const todayDateStr = new Date().toISOString().split("T")[0];

  if (loading || sessionPending) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#A92E24]" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-[#A92E24]" />
          <h1 className="font-serif text-2xl font-bold">Pizza Not Found</h1>
          <p className="text-sm text-[var(--muted-foreground)] max-w-sm">
            The requested pizza item either does not exist or has been removed from the menu.
          </p>
          <Link
            href="/browse-menu"
            className="px-6 py-2.5 rounded-full bg-[#A92E24] text-white text-xs font-semibold"
          >
            Back to Browse Menu
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const currentUser = session?.user;
  const isVendorOfItem =
    currentUser && String(currentUser._id || currentUser.id) === String(item.vendorId);
  const isCustomer = currentUser && (currentUser.role === "customer" || !currentUser.role);
  const isApproved = item.status === "approved";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Link */}
        <Link
          href="/browse-menu"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)] hover:text-[#A92E24] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Menu Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* =================================================================
              LEFT: MULTIPLE IMAGES GALLERY
             ================================================================= */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Featured Image */}
            <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-[var(--muted)] border border-[var(--border)] shadow-md">
              <img
                src={selectedImage || item.images?.[0] || "/images/chad-montano-MqT0asuoIcU-unsplash.jpg"}
                alt={item.itemName}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#29251F]/80 backdrop-blur-md text-white border border-white/10">
                  {item.category}
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery (Multiple Images Support) */}
            {item.images && item.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {item.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                      selectedImage === img
                        ? "border-[#A92E24] shadow-md scale-105"
                        : "border-[var(--border)] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Pizza Description & Details */}
            <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] space-y-4">
              <h2 className="font-serif text-xl font-bold text-[var(--foreground)]">
                Recipe &amp; Ingredients
              </h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                {item.description}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border)] text-xs">
                <div>
                  <span className="text-[var(--muted-foreground)]">Location</span>
                  <div className="flex items-center gap-1.5 font-semibold text-[var(--foreground)] mt-0.5">
                    <MapPin className="w-4 h-4 text-[#A92E24]" />
                    <span>{item.location}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[var(--muted-foreground)]">Pizzeria</span>
                  <div className="flex items-center gap-1.5 font-semibold text-[var(--foreground)] mt-0.5">
                    <ChefHat className="w-4 h-4 text-[#596B45]" />
                    <span>{item.businessName || item.vendorName || "Artisan Pizzeria"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================================
              RIGHT: ORDER FORM / DETAILS ACTION
             ================================================================= */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-lg space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#596B45]">
                  Authentic Selection
                </span>
                <h1 className="font-serif text-3xl font-bold text-[var(--foreground)] mt-1">
                  {item.itemName}
                </h1>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-bold text-[#A92E24]">
                    {formatPrice(item.price)}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)]">per whole 12" pie</span>
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-6 space-y-4">
                {/* Authorization & Status Checks */}
                {!isApproved ? (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      This item is currently {item.status} and cannot be ordered at this time.
                    </span>
                  </div>
                ) : isVendorOfItem ? (
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      You are the vendor of this menu item. Vendors cannot place orders for their own items.
                    </span>
                  </div>
                ) : !isCustomer ? (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      Ordering is restricted to Customer accounts. Your account role is {currentUser?.role}.
                    </span>
                  </div>
                ) : (
                  /* ===========================================================
                     OFFICIAL ORDER FORM (ASSIGNMENT SECTION 18)
                     =========================================================== */
                  <form onSubmit={handleOrderSubmit} className="space-y-4">
                    <h3 className="font-serif text-lg font-bold text-[var(--foreground)] flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#A92E24]" />
                      Schedule Delivery
                    </h3>

                    {/* Delivery Date */}
                    <div>
                      <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                        Delivery Date *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none" />
                        <input
                          type="date"
                          min={todayDateStr}
                          value={deliveryDate}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                          required
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#A92E24]/30"
                        />
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div>
                      <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                        Delivery Address *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none" />
                        <textarea
                          rows={3}
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="House/Apartment, Road, Block, Area, City..."
                          required
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#A92E24]/30 resize-none"
                        />
                      </div>
                    </div>

                    {/* Special Instructions Message */}
                    <div>
                      <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                        Special Instructions (Optional)
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3.5 top-3 w-4 h-4 text-[var(--muted-foreground)] pointer-events-none" />
                        <textarea
                          rows={2}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="e.g. Extra fresh basil, well-done woodfire crust, contactless delivery..."
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#A92E24]/30 resize-none"
                        />
                      </div>
                    </div>

                    {/* Submit Order Button */}
                    <button
                      type="submit"
                      disabled={submittingOrder}
                      className="w-full py-3.5 rounded-2xl bg-[#A92E24] hover:bg-[#78231E] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#A92E24]/20 hover:shadow-xl transition-all cursor-pointer disabled:opacity-60 active:scale-98"
                    >
                      {submittingOrder ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending Order to Kitchen...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirm &amp; Place Order</span>
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-[var(--muted-foreground)] text-center">
                      Payment is made directly upon delivery. No upfront card required for pizza orders.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

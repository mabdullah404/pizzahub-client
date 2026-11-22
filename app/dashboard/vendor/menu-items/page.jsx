"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { getVendorMenuItems, deleteMenuItem, updateMenuItem } from "@/lib/api/menu-items";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import {
  UtensilsCrossed,
  PlusCircle,
  Trash2,
  Edit3,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  MapPin,
  AlertCircle,
} from "lucide-react";

export default function VendorMenuItemsPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchItems = async () => {
    if (!session?.session?.token) return;
    try {
      setLoading(true);
      const res = await getVendorMenuItems(session.session.token);
      setItems(res.data || []);
    } catch (err) {
      console.error("Failed to load vendor items:", err);
      toast.error(err.message || "Failed to load menu items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [session]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    setDeletingId(id);
    try {
      const token = session?.session?.token;
      await deleteMenuItem(id, token);
      toast.success("Menu item removed from catalog.");
      setItems(items.filter((item) => item._id !== id));
    } catch (err) {
      toast.error(err.message || "Failed to delete item.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (item) => {
    const newStatus = item.status === "inactive" ? "pending" : "inactive";
    try {
      const token = session?.session?.token;
      await updateMenuItem(item._id, { status: newStatus }, token);
      toast.success(`Item status updated to ${newStatus}.`);
      setItems(
        items.map((i) => (i._id === item._id ? { ...i, status: newStatus } : i))
      );
    } catch (err) {
      toast.error(err.message || "Failed to toggle status.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-3 h-3" />
            Approved &amp; Live
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300">
            <XCircle className="w-3 h-3" />
            Rejected by Admin
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
            Inactive
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
            <Clock className="w-3 h-3" />
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#596B45]">
            My Restaurant Catalog
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)] mt-1">
            Menu Items Management
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
            View your submitted pizzas, check approval status, toggle availability, or add new recipes.
          </p>
        </div>

        <Link
          href="/dashboard/vendor/menu-items/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#A92E24] hover:bg-[#78231E] text-white font-semibold text-xs uppercase tracking-wider shadow-md shrink-0 transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Pizza</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-[#A92E24]" />
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[var(--card)] border border-[var(--border)] space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[var(--muted)] text-[#A92E24] flex items-center justify-center mx-auto">
            <UtensilsCrossed className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl font-bold">No menu items published yet</h3>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-sm mx-auto">
            Start expanding your pizzeria menu by uploading your signature artisanal recipes!
          </p>
          <Link
            href="/dashboard/vendor/menu-items/new"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#A92E24] text-white text-xs font-semibold shadow-md hover:bg-[#78231E]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create First Pizza</span>
          </Link>
        </div>
      ) : (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--background)]/60 text-[var(--muted-foreground)] font-semibold uppercase tracking-wider">
                  <th className="py-4 px-6">Item</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Location</th>
                  <th className="py-4 px-4">Approval Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-[var(--background)]/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images?.[0] || "/images/chad-montano-MqT0asuoIcU-unsplash.jpg"}
                          alt={item.itemName}
                          className="w-12 h-12 rounded-xl object-cover border border-[var(--border)] shrink-0"
                        />
                        <div>
                          <p className="font-bold text-[var(--foreground)]">{item.itemName}</p>
                          <p className="text-[10px] text-[var(--muted-foreground)] line-clamp-1 max-w-[200px]">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-medium text-[var(--foreground)]">
                      {item.category}
                    </td>

                    <td className="py-4 px-4 font-bold text-[#A92E24]">
                      {formatPrice(item.price)}
                    </td>

                    <td className="py-4 px-4 text-[var(--muted-foreground)]">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#A92E24]" />
                        <span>{item.location}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">{getStatusBadge(item.status)}</td>

                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        {item.status === "approved" && (
                          <Link
                            href={`/menu/${item._id}`}
                            className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)]"
                            title="View public page"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        )}

                        <button
                          onClick={() => handleToggleActive(item)}
                          className="px-2.5 py-1 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] text-[11px] font-medium cursor-pointer"
                          title="Toggle active status"
                        >
                          {item.status === "inactive" ? "Activate" : "Set Inactive"}
                        </button>

                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={deletingId === item._id}
                          className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer disabled:opacity-50"
                          title="Delete item"
                        >
                          {deletingId === item._id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

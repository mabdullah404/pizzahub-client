"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import {
  getMenuItems,
  updateMenuItemStatus,
  deleteMenuItem,
} from "@/lib/api/menu-items";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import ConfirmModal from "@/components/ConfirmModal";
import { getApiUrl } from "@/lib/utils/apiUrl";
import {
  UtensilsCrossed,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  Loader2,
  Check,
  X,
  Clock,
  Sparkles,
} from "lucide-react";

export default function AdminManageMenuItemsPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionId, setActionId] = useState(null);
  const [pendingDeleteItem, setPendingDeleteItem] = useState(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      // Pass empty category and high limit to inspect items
      const serverUrl = getApiUrl();
      const token = session?.session?.token;
      const query = new URLSearchParams();
      if (search) query.append("search", search);
      if (statusFilter && statusFilter !== "all") query.append("status", statusFilter);
      query.append("limit", "100");

      const res = await fetch(`${serverUrl}/api/menu/admin/all-items?${query.toString()}`, {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      setItems(json.data || []);
    } catch (err) {
      console.error("Failed to load menu items for admin:", err);
      toast.error("Failed to load catalog items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [session, statusFilter]);

  const handleStatusChange = async (itemId, newStatus) => {
    setActionId(itemId);
    try {
      const token = session?.session?.token;
      await updateMenuItemStatus(itemId, newStatus, token);
      toast.success(`Menu item marked as ${newStatus}!`);
      setItems(
        items.map((i) => (i._id === itemId ? { ...i, status: newStatus } : i))
      );
    } catch (err) {
      toast.error(err.message || `Failed to set status to ${newStatus}.`);
    } finally {
      setActionId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteItem) return;
    const itemId = pendingDeleteItem._id;

    setActionId(itemId);
    try {
      const token = session?.session?.token;
      await deleteMenuItem(itemId, token);
      toast.success("Item permanently removed from catalog.");
      setItems(items.filter((i) => i._id !== itemId));
      setPendingDeleteItem(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete item.");
    } finally {
      setActionId(null);
    }
  };

  const filteredItems = items.filter((item) => {
    if (statusFilter === "all") return true;
    return item.status === statusFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-[#78231E]">
          Catalog Moderation
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)] mt-1">
          Review &amp; Manage Pizza Menus
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
          Approve or reject newly submitted recipes from vendors. Only approved recipes appear on the public menu.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchItems();
          }}
          className="relative flex-1 w-full"
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search submitted items by title or ingredient..."
            className="w-full pl-10 pr-24 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#A92E24]/30"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-lg bg-[#A92E24] hover:bg-[#78231E] text-white text-[11px] font-semibold cursor-pointer"
          >
            Search
          </button>
        </form>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-44 px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="approved">Approved &amp; Live</option>
          <option value="pending">Pending Approval</option>
          <option value="rejected">Rejected</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-[#A92E24]" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[var(--card)] border border-[var(--border)] space-y-2">
          <UtensilsCrossed className="w-10 h-10 text-[var(--muted-foreground)] mx-auto opacity-50" />
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            No menu items found in this filter view.
          </p>
        </div>
      ) : (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--background)]/60 text-[var(--muted-foreground)] font-semibold uppercase tracking-wider">
                  <th className="py-4 px-6">Recipe</th>
                  <th className="py-4 px-4">Vendor</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Current Status</th>
                  <th className="py-4 px-6 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredItems.map((item) => {
                  const isActing = actionId === item._id;

                  return (
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

                      <td className="py-4 px-4">
                        <p className="font-semibold text-[var(--foreground)] truncate max-w-[150px]">
                          {item.businessName || item.vendorName || "Pizzeria"}
                        </p>
                        <p className="text-[10px] text-[var(--muted-foreground)] truncate max-w-[150px]">
                          {item.vendorEmail}
                        </p>
                      </td>

                      <td className="py-4 px-4 font-bold text-[#A92E24]">
                        {formatPrice(item.price)}
                      </td>

                      <td className="py-4 px-4 font-medium text-[var(--foreground)]">
                        {item.category}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            item.status === "approved"
                              ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                              : item.status === "rejected"
                              ? "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300"
                              : item.status === "inactive"
                              ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                              : "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {item.status !== "approved" && (
                            <button
                              onClick={() => handleStatusChange(item._id, "approved")}
                              disabled={isActing}
                              className="px-2.5 py-1 rounded-lg bg-[#596B45] hover:bg-[#435234] text-white font-semibold text-[11px] flex items-center gap-1 cursor-pointer disabled:opacity-50"
                              title="Approve recipe"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                          )}

                          {item.status !== "rejected" && (
                            <button
                              onClick={() => handleStatusChange(item._id, "rejected")}
                              disabled={isActing}
                              className="px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 font-semibold text-[11px] flex items-center gap-1 cursor-pointer disabled:opacity-50"
                              title="Reject recipe"
                            >
                              <X className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          )}

                          <button
                            onClick={() => setPendingDeleteItem(item)}
                            disabled={isActing}
                            className="p-1 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer disabled:opacity-50"
                            title="Delete inappropriate item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Professional Admin Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!pendingDeleteItem}
        onClose={() => setPendingDeleteItem(null)}
        onConfirm={handleConfirmDelete}
        title="Permanently Delete Recipe?"
        description="Are you sure you want to permanently delete this menu item from PizzaHub? This action is administrative and irreversible."
        confirmText="Yes, Permanently Delete"
        cancelText="Keep Item"
        variant="delete"
        loading={actionId === pendingDeleteItem?._id}
        itemName={
          pendingDeleteItem
            ? `${pendingDeleteItem.name} • by ${pendingDeleteItem.vendorName || "Pizzeria"} (${formatPrice(pendingDeleteItem.price)})`
            : null
        }
      />
    </div>
  );
}

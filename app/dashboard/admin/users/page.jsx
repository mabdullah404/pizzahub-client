"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { getAllUsers, blockUser, unblockUser, approveVendor, rejectVendor } from "@/lib/api/users";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import ConfirmModal from "@/components/ConfirmModal";
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  User,
  ChefHat,
  ShoppingBag,
  Check,
  X,
} from "lucide-react";

export default function AdminManageUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [actionUserId, setActionUserId] = useState(null);
  const [pendingUserAction, setPendingUserAction] = useState(null);
  const [pendingVendorAction, setPendingVendorAction] = useState(null); // { user, type: 'approve' | 'reject' }

  const fetchUsers = async () => {
    if (!session?.session?.token) return;
    try {
      setLoading(true);
      const apiRole = roleFilter === "pending_vendor" ? "vendor" : roleFilter;
      const res = await getAllUsers(
        { search, role: apiRole },
        session.session.token
      );
      let list = res.data || [];
      if (roleFilter === "pending_vendor") {
        list = list.filter((u) => u.status === "pending" || u.isApproved === false);
      }
      setUsers(list);
    } catch (err) {
      console.error("Failed to load users:", err);
      toast.error(err.message || "Failed to load user list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [session, roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleConfirmVendorAction = async () => {
    if (!pendingVendorAction) return;
    const { user, type } = pendingVendorAction;
    const userId = user._id || user.id;

    setActionUserId(userId);
    try {
      const token = session?.session?.token;
      if (type === "approve") {
        await approveVendor(userId, token);
        toast.success(`Pizzeria "${user.businessName || user.name}" approved successfully!`);
        setUsers(
          users.map((u) => {
            if ((u._id || u.id) === userId) {
              return { ...u, status: "approved", isApproved: true };
            }
            return u;
          })
        );
      } else {
        await rejectVendor(userId, token);
        toast.success(`Vendor "${user.name || user.email}" rejected.`);
        setUsers(
          users.map((u) => {
            if ((u._id || u.id) === userId) {
              return { ...u, status: "rejected", isApproved: false };
            }
            return u;
          })
        );
      }
      setPendingVendorAction(null);
    } catch (err) {
      toast.error(err.message || `Failed to ${type} vendor.`);
    } finally {
      setActionUserId(null);
    }
  };

  const handlePromptToggleBlock = (user) => {
    if (user.role === "admin") {
      toast.error("Administrators cannot be blocked.");
      return;
    }
    setPendingUserAction(user);
  };

  const handleConfirmToggleBlock = async () => {
    if (!pendingUserAction) return;
    const user = pendingUserAction;
    const isCurrentlyBlocked = user.isBlocked || user.banned;
    const action = isCurrentlyBlocked ? "unblock" : "block";
    const userId = user._id || user.id;

    setActionUserId(userId);
    try {
      const token = session?.session?.token;
      if (isCurrentlyBlocked) {
        await unblockUser(userId, token);
        toast.success(`User ${user.name || user.email} unblocked.`);
      } else {
        await blockUser(userId, token);
        toast.success(`User ${user.name || user.email} blocked.`);
      }

      setUsers(
        users.map((u) => {
          if ((u._id || u.id) === userId) {
            return {
              ...u,
              isBlocked: !isCurrentlyBlocked,
              banned: !isCurrentlyBlocked,
            };
          }
          return u;
        })
      );
      setPendingUserAction(null);
    } catch (err) {
      toast.error(err.message || `Failed to ${action} user.`);
    } finally {
      setActionUserId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-[#78231E]">
          User Directory
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)] mt-1">
          Manage Registered Platform Users
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
          Search users across roles, audit registration dates, and enforce account suspension policies.
        </p>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or restaurant brand..."
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
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none"
        >
          <option value="all">All Roles</option>
          <option value="customer">Customers</option>
          <option value="vendor">Vendors (All Restaurants)</option>
          <option value="pending_vendor">Pending Vendors (Need Approval)</option>
          <option value="admin">Administrators</option>
        </select>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-[#A92E24]" />
        </div>
      ) : users.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[var(--card)] border border-[var(--border)] space-y-2">
          <Users className="w-10 h-10 text-[var(--muted-foreground)] mx-auto opacity-50" />
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            No users found matching your search criteria.
          </p>
        </div>
      ) : (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--background)]/60 text-[var(--muted-foreground)] font-semibold uppercase tracking-wider">
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-4">Role</th>
                  <th className="py-4 px-4">Subscription</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Joined</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {users.map((u) => {
                  const isBlocked = u.isBlocked || u.banned;
                  const isActing = actionUserId === (u._id || u.id);
                  const isCurrentAdmin = u.role === "admin";

                  return (
                    <tr key={u._id || u.id} className="hover:bg-[var(--background)]/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {u.image ? (
                            <img
                              src={u.image}
                              alt={u.name || "User"}
                              className="w-10 h-10 rounded-full object-cover border border-[var(--border)] shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#A92E24]/10 text-[#A92E24] flex items-center justify-center font-bold text-xs shrink-0">
                              {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-[var(--foreground)]">{u.name || "Unnamed User"}</p>
                            <p className="text-[11px] text-[var(--muted-foreground)]">{u.email}</p>
                            {u.businessName && (
                              <p className="text-[10px] text-[#596B45] font-semibold mt-0.5">
                                {u.businessName}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            u.role === "admin"
                              ? "bg-[#78231E] text-white"
                              : u.role === "vendor"
                              ? "bg-[#596B45] text-white"
                              : "bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                          }`}
                        >
                          {u.role === "admin" ? (
                            <ShieldCheck className="w-3 h-3" />
                          ) : u.role === "vendor" ? (
                            <ChefHat className="w-3 h-3" />
                          ) : (
                            <ShoppingBag className="w-3 h-3" />
                          )}
                          {u.role || "customer"}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="text-[11px] font-semibold capitalize text-[var(--foreground)]">
                          {u.subscriptionPlan || "free"}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        {isBlocked ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300">
                            <Ban className="w-3 h-3" />
                            Blocked
                          </span>
                        ) : u.role === "vendor" ? (
                          u.status === "pending" || u.isApproved === false ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
                              <Clock className="w-3 h-3" />
                              Pending Approval
                            </span>
                          ) : u.status === "rejected" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300">
                              <XCircle className="w-3 h-3" />
                              Rejected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                              <CheckCircle2 className="w-3 h-3" />
                              Approved Partner
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-[var(--muted-foreground)] text-[11px]">
                        {formatDate(u.createdAt)}
                      </td>

                      <td className="py-4 px-6 text-right">
                        {isCurrentAdmin ? (
                          <span className="text-[10px] text-[var(--muted-foreground)] italic">
                            Protected Admin
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {u.role === "vendor" && (u.status === "pending" || u.isApproved === false) && (
                              <>
                                <button
                                  onClick={() => setPendingVendorAction({ user: u, type: "approve" })}
                                  disabled={isActing}
                                  className="px-2.5 py-1.5 rounded-xl bg-[#596B45] hover:bg-[#435234] text-white font-semibold text-[11px] flex items-center gap-1 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                                  title="Approve Pizzeria Partner"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Approve Vendor</span>
                                </button>
                                <button
                                  onClick={() => setPendingVendorAction({ user: u, type: "reject" })}
                                  disabled={isActing}
                                  className="px-2 py-1.5 rounded-xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 font-semibold text-[11px] flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                                  title="Reject Pizzeria Partner"
                                >
                                  <X className="w-3 h-3" />
                                  <span>Reject</span>
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => handlePromptToggleBlock(u)}
                              disabled={isActing}
                              className={`px-3 py-1.5 rounded-xl font-semibold text-[11px] transition-all cursor-pointer disabled:opacity-50 ${
                                isBlocked
                                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                                  : "border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                              }`}
                            >
                              {isActing ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : isBlocked ? (
                                "Unblock User"
                              ) : (
                                "Block User"
                              )}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Professional User Block/Unblock Confirmation Modal */}
      <ConfirmModal
        isOpen={!!pendingUserAction}
        onClose={() => setPendingUserAction(null)}
        onConfirm={handleConfirmToggleBlock}
        title={
          pendingUserAction?.isBlocked || pendingUserAction?.banned
            ? "Unblock User Access?"
            : "Block User Account?"
        }
        description={
          pendingUserAction?.isBlocked || pendingUserAction?.banned
            ? `Are you sure you want to restore platform access for "${pendingUserAction?.name || pendingUserAction?.email}"? They will be able to sign in and place orders.`
            : `Are you sure you want to block "${pendingUserAction?.name || pendingUserAction?.email}"? They will immediately lose access to their PizzaHub account and active operations.`
        }
        confirmText={
          pendingUserAction?.isBlocked || pendingUserAction?.banned
            ? "Yes, Unblock"
            : "Yes, Block Account"
        }
        cancelText="Cancel"
        variant={
          pendingUserAction?.isBlocked || pendingUserAction?.banned
            ? "warning"
            : "danger"
        }
        loading={actionUserId === (pendingUserAction?._id || pendingUserAction?.id)}
        itemName={
          pendingUserAction
            ? `${pendingUserAction.name || "User"} (${pendingUserAction.email}) • Role: ${pendingUserAction.role}`
            : null
        }
      />

      {/* Professional Vendor Partner Approval Modal */}
      <ConfirmModal
        isOpen={!!pendingVendorAction}
        onClose={() => setPendingVendorAction(null)}
        onConfirm={handleConfirmVendorAction}
        title={
          pendingVendorAction?.type === "approve"
            ? "Approve Pizzeria Partner?"
            : "Reject Vendor Application?"
        }
        description={
          pendingVendorAction?.type === "approve"
            ? `Grant verified pizzeria status to "${pendingVendorAction?.user?.businessName || pendingVendorAction?.user?.name}". They will be able to publish artisan pizzas and fulfill customer orders.`
            : `Reject vendor application for "${pendingVendorAction?.user?.name || pendingVendorAction?.user?.email}". They will not be able to publish menu items.`
        }
        confirmText={
          pendingVendorAction?.type === "approve"
            ? "Yes, Approve Vendor"
            : "Yes, Reject Application"
        }
        cancelText="Cancel"
        variant={pendingVendorAction?.type === "approve" ? "warning" : "danger"}
        loading={actionUserId === (pendingVendorAction?.user?._id || pendingVendorAction?.user?.id)}
        itemName={
          pendingVendorAction?.user
            ? `${pendingVendorAction.user.businessName ? `"${pendingVendorAction.user.businessName}" • ` : ""}${pendingVendorAction.user.name || "Vendor"} (${pendingVendorAction.user.email})`
            : null
        }
      />
    </div>
  );
}

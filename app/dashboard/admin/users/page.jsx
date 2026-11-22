"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { getAllUsers, blockUser, unblockUser } from "@/lib/api/users";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Loader2,
  User,
  ChefHat,
  ShoppingBag,
} from "lucide-react";

export default function AdminManageUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [actionUserId, setActionUserId] = useState(null);

  const fetchUsers = async () => {
    if (!session?.session?.token) return;
    try {
      setLoading(true);
      const res = await getAllUsers(
        { search, role: roleFilter },
        session.session.token
      );
      setUsers(res.data || []);
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

  const handleToggleBlock = async (user) => {
    const isCurrentlyBlocked = user.isBlocked || user.banned;
    const action = isCurrentlyBlocked ? "unblock" : "block";

    if (user.role === "admin") {
      toast.error("Administrators cannot be blocked.");
      return;
    }

    if (!confirm(`Are you sure you want to ${action} user "${user.name || user.email}"?`)) {
      return;
    }

    setActionUserId(user._id || user.id);
    try {
      const token = session?.session?.token;
      if (isCurrentlyBlocked) {
        await unblockUser(user._id || user.id, token);
        toast.success(`User ${user.name || user.email} unblocked.`);
      } else {
        await blockUser(user._id || user.id, token);
        toast.success(`User ${user.name || user.email} blocked.`);
      }

      setUsers(
        users.map((u) => {
          if ((u._id || u.id) === (user._id || user.id)) {
            return {
              ...u,
              isBlocked: !isCurrentlyBlocked,
              banned: !isCurrentlyBlocked,
            };
          }
          return u;
        })
      );
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
          className="w-full sm:w-44 px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none"
        >
          <option value="all">All Roles</option>
          <option value="customer">Customers</option>
          <option value="vendor">Vendors (Restaurants)</option>
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
                          <button
                            onClick={() => handleToggleBlock(u)}
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
    </div>
  );
}

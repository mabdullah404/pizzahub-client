"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { getAllTransactions } from "@/lib/api/payments";
import { formatPrice, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  DollarSign,
  CreditCard,
  CheckCircle2,
  Lock,
  Loader2,
  Calendar,
  Building2,
  ShieldCheck,
} from "lucide-react";

export default function AdminTransactionsPage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      if (!session?.session?.token) return;
      try {
        setLoading(true);
        const res = await getAllTransactions(session.session.token);
        setTransactions(res.data || []);
      } catch (err) {
        console.error("Failed to load transactions:", err);
        toast.error("Failed to load payment ledger.");
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, [session]);

  const totalRevenue = transactions
    .filter((t) => t.status === "succeeded")
    .reduce((acc, t) => acc + (t.amount || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#78231E]">
            <Lock className="w-3.5 h-3.5" />
            Audit Ledger (Immutable &amp; Read-Only)
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)] mt-1">
            Vendor Stripe Subscription Transactions
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
            Official immutable financial record of vendor Premium subscription payments processed via Stripe.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--background)] border border-[var(--border)] text-right shrink-0">
          <span className="text-[11px] uppercase font-bold text-[var(--muted-foreground)]">
            Total Verified Revenue
          </span>
          <p className="font-serif text-2xl font-bold text-[#A92E24]">
            {formatPrice(totalRevenue)}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-[#A92E24]" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[var(--card)] border border-[var(--border)] space-y-2">
          <CreditCard className="w-10 h-10 text-[var(--muted-foreground)] mx-auto opacity-50" />
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            No subscription transactions recorded yet.
          </p>
        </div>
      ) : (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--background)]/60 text-[var(--muted-foreground)] font-semibold uppercase tracking-wider">
                  <th className="py-4 px-6">Vendor / Restaurant</th>
                  <th className="py-4 px-4">Plan</th>
                  <th className="py-4 px-4">Amount</th>
                  <th className="py-4 px-4">Stripe Session ID</th>
                  <th className="py-4 px-4">Payment Status</th>
                  <th className="py-4 px-6 text-right">Transaction Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-[var(--background)]/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#596B45]/10 text-[#596B45] flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-[var(--foreground)]">
                            {tx.vendorName || "Vendor"}
                          </p>
                          <p className="text-[10px] text-[var(--muted-foreground)]">
                            {tx.vendorEmail}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-semibold uppercase text-xs text-[#A92E24]">
                      {tx.plan || "premium"}
                    </td>

                    <td className="py-4 px-4 font-bold text-sm text-[var(--foreground)]">
                      {formatPrice(tx.amount)} {String(tx.currency || "usd").toUpperCase()}
                    </td>

                    <td className="py-4 px-4 font-mono text-[10px] text-[var(--muted-foreground)] max-w-[180px] truncate">
                      {tx.stripeSessionId || "N/A"}
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 className="w-3 h-3" />
                        {tx.status || "succeeded"}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right text-[var(--muted-foreground)]">
                      {formatDate(tx.createdAt)}
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

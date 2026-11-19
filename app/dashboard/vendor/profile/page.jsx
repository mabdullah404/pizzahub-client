"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { getCurrentUser, updateProfile } from "@/lib/api/users";
import { toast } from "sonner";
import {
  User,
  Mail,
  Building2,
  Phone,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  Shield,
  CreditCard,
} from "lucide-react";

export default function VendorProfilePage() {
  const { data: session } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [subscriptionPlan, setSubscriptionPlan] = useState("free");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!session?.session?.token) return;
      try {
        const res = await getCurrentUser(session.session.token);
        if (res?.data) {
          setName(res.data.name || "");
          setEmail(res.data.email || "");
          setBusinessName(res.data.businessName || "");
          setPhone(res.data.phone || "");
          setImage(res.data.image || "");
          setSubscriptionPlan(res.data.subscriptionPlan || "free");
        }
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = session?.session?.token;
      await updateProfile(
        {
          name: name.trim(),
          businessName: businessName.trim(),
          phone: phone.trim(),
          image: image.trim(),
        },
        token
      );
      toast.success("Restaurant profile updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#A92E24]" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#596B45]">
          Pizzeria Profile
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
          Restaurant Settings
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
          Manage your publicly displayed culinary business information and account contact details.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email (Read Only) */}
          <div>
            <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
              Account Email (Managed by Better Auth)
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="email"
                disabled
                value={email}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--muted)]/50 border border-[var(--border)] text-xs text-[var(--muted-foreground)] cursor-not-allowed"
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
              Pizzaiolo / Owner Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#596B45]/30"
              />
            </div>
          </div>

          {/* Business Name */}
          <div>
            <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
              Restaurant / Pizzeria Brand Name *
            </label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Forno Antico Pizzeria"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#596B45]/30"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
              Contact Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1700-000000"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#596B45]/30"
              />
            </div>
          </div>

          {/* Profile Image URL */}
          <div>
            <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
              Profile Avatar / Logo URL
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/logo.jpg"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#596B45]/30"
              />
            </div>
          </div>

          {/* Tier Overview (Security Protected: Non-editable) */}
          <div className="p-4 rounded-2xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#A92E24]" />
              <span className="text-xs font-semibold">Subscription:</span>
              <span className="text-xs font-bold uppercase text-[#A92E24]">{subscriptionPlan}</span>
            </div>
            <span className="text-[10px] text-[var(--muted-foreground)]">
              Managed via Stripe billing
            </span>
          </div>

          <div className="pt-4 border-t border-[var(--border)] flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#596B45] hover:bg-[#435234] text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

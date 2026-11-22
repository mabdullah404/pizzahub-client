"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { getCurrentUser, updateProfile } from "@/lib/api/users";
import { uploadImage } from "@/lib/api/upload";
import { toast } from "sonner";
import {
  User,
  Mail,
  Building2,
  Phone,
  Camera,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Upload,
  Trash2,
  Crown,
  ChefHat,
  Sparkles,
} from "lucide-react";

export default function VendorProfilePage() {
  const { data: session, refetch } = useSession();
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [subscriptionPlan, setSubscriptionPlan] = useState("free");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  // Handle direct file upload from computer
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file is too large. Maximum allowed size is 5MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG, or WebP).");
      return;
    }

    setUploadingImage(true);
    const toastId = toast.loading("Uploading restaurant logo...");

    try {
      const token = session?.session?.token;
      const uploadedUrl = await uploadImage(file, token);

      setImage(uploadedUrl);
      toast.success("Logo uploaded successfully!", { id: toastId });
    } catch (err) {
      console.error("Logo upload failed:", err);
      toast.error(err.message || "Failed to upload image. Please try again.", { id: toastId });
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setImage("");
    toast.info("Logo removed. Click 'Save Changes' to apply.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!businessName.trim()) {
      toast.error("Please provide your restaurant or pizzeria brand name.");
      return;
    }

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

      // Refresh session so top navbar reflects the new photo and brand immediately
      if (refetch) await refetch();

      toast.success("Profile saved successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#E66A2C]" />
      </div>
    );
  }

  const isPremium = subscriptionPlan === "premium";
  const initial = (businessName || name || "P").charAt(0).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#E66A2C]">
            Restaurant Management
          </span>
          {isPremium && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#FFD64F]/30 text-[#E66A2C]">
              <Crown className="w-3 h-3 text-[#E66A2C]" />
              Premium Partner
            </span>
          )}
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-black text-[var(--foreground)] mt-1">
          Restaurant Settings
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
          Manage your publicly displayed culinary business profile, brand logo, and owner contact details.
        </p>
      </div>

      {/* Restaurant Logo / Avatar Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
            Restaurant Brand Logo
          </h2>
          {image && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Active Logo
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Logo Container with High-Resolution Render */}
          <div className="relative group shrink-0">
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-[var(--border)] shadow-sm bg-[var(--background)] flex items-center justify-center">
              {image ? (
                <img
                  src={image}
                  alt={businessName || name || "Restaurant Logo"}
                  className="w-full h-full object-cover rounded-2xl"
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-3 text-[var(--muted-foreground)]">
                  <ChefHat className="w-10 h-10 text-[#E66A2C] mb-1 opacity-80" />
                  <span className="text-xs font-bold text-[var(--foreground)]">{initial}</span>
                </div>
              )}
            </div>

            {/* Upload Spinner Overlay */}
            {uploadingImage && (
              <div className="absolute inset-0 rounded-2xl bg-black/60 flex flex-col items-center justify-center text-white text-xs gap-1.5 backdrop-blur-xs">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
                <span className="font-semibold text-[11px]">Uploading...</span>
              </div>
            )}

            {/* Quick Camera Trigger */}
            <button
              type="button"
              disabled={uploadingImage}
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload logo"
              className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-[#E66A2C] hover:bg-[#D4591D] text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 cursor-pointer disabled:opacity-50"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Upload Controls & Information */}
          <div className="space-y-3 text-center sm:text-left flex-1">
            <div>
              <p className="text-sm font-bold text-[var(--foreground)]">
                Brand Emblem / Store Photo
              </p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1 leading-relaxed">
                Upload your official pizzeria logo or brand image. This will be featured across your published menus, customer order receipts, and search results.
              </p>
              <p className="text-[11px] text-[var(--muted-foreground)] mt-1.5">
                Recommended: Square JPG, PNG, or WebP. High resolution (500×500px or higher, max 5MB).
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                type="button"
                disabled={uploadingImage}
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-[#24242A] dark:bg-white hover:bg-[#383842] dark:hover:bg-[#E8EDF4] text-white dark:text-[#24242A] text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-60"
              >
                {uploadingImage ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>{image ? "Change Photo" : "Choose File"}</span>
                  </>
                )}
              </button>

              {image && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-3.5 py-2 rounded-xl border border-[var(--border)] hover:bg-red-500/10 hover:border-red-500/30 text-xs font-semibold text-red-600 dark:text-red-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Address (Read-only Better Auth) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-[var(--foreground)]">
                Account Email
              </label>
              <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified via Better Auth
              </span>
            </div>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="email"
                disabled
                value={email}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--muted)]/40 border border-[var(--border)] text-xs text-[var(--muted-foreground)] cursor-not-allowed select-none"
              />
            </div>
          </div>

          {/* Restaurant Brand Name */}
          <div>
            <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
              Pizzeria / Restaurant Brand Name *
            </label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Forno Antico Artisan Pizzeria"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#E66A2C]/30"
              />
            </div>
            <p className="text-[11px] text-[var(--muted-foreground)] mt-1">
              Displayed as the restaurant author on your published pizzas and storefront listings.
            </p>
          </div>

          {/* Pizzaiolo / Owner Full Name */}
          <div>
            <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
              Pizzaiolo / Owner Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter owner full name"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#E66A2C]/30"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-[var(--foreground)] mb-1">
              Kitchen Contact Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1700-000000"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#E66A2C]/30"
              />
            </div>
            <p className="text-[11px] text-[var(--muted-foreground)] mt-1">
              Direct contact line for order coordination and customer inquiries.
            </p>
          </div>

          {/* Subscription Tier Overview */}
          <div className="p-4 rounded-2xl bg-[var(--muted)]/20 border border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#E66A2C]" />
              <span className="text-xs font-semibold">Subscription Plan:</span>
              <span className="text-xs font-bold uppercase text-[#E66A2C]">{subscriptionPlan}</span>
            </div>
            <span className="text-[11px] text-[var(--muted-foreground)]">
              Managed via Stripe Monetization
            </span>
          </div>

          {/* Save Changes Action */}
          <div className="pt-4 border-t border-[var(--border)] flex justify-end">
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="px-6 py-2.5 rounded-full bg-[#E66A2C] hover:bg-[#D4591D] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

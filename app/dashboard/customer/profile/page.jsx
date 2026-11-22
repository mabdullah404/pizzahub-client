"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { getCurrentUser, updateProfile } from "@/lib/api/users";
import { uploadImage } from "@/lib/api/upload";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Camera,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Upload,
  Trash2,
  Sparkles,
} from "lucide-react";

export default function CustomerProfilePage() {
  const { data: session, refetch } = useSession();
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
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
          setPhone(res.data.phone || "");
          setImage(res.data.image || "");
        }
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [session]);

  // Handle direct file upload from PC
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file is too large. Maximum size is 5MB.");
      return;
    }

    // Validate type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, or WEBP).");
      return;
    }

    setUploadingImage(true);
    const toastId = toast.loading("Uploading photo from your PC to ImgBB...");

    try {
      const token = session?.session?.token;
      const uploadedUrl = await uploadImage(file, token);

      setImage(uploadedUrl);
      toast.success("Profile photo uploaded to ImgBB successfully!", { id: toastId });
    } catch (err) {
      console.error("Image upload failed:", err);
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
    toast.info("Profile photo removed. Click 'Save Changes' to apply.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = session?.session?.token;
      await updateProfile(
        {
          name: name.trim(),
          phone: phone.trim(),
          image: image.trim(),
        },
        token
      );

      // Refresh session so top navbar reflects the new photo and name immediately
      if (refetch) await refetch();

      toast.success("Profile updated successfully!");
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

  const initial = (name || email || "C").charAt(0).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Title */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A92E24]">
            Customer Account
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
            Active
          </span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
          Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
          Manage your personal customer profile, delivery phone number, and avatar photo.
        </p>
      </div>

      {/* Profile Picture Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)] mb-4">
          Profile Avatar
        </h2>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar Container with Hover Upload Overlay */}
          <div className="relative group shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[var(--card)] ring-2 ring-[#A92E24]/30 shadow-md bg-[#A92E24]/10 flex items-center justify-center">
              {image ? (
                <img
                  src={image}
                  alt={name || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-serif text-4xl font-bold text-[#A92E24]">
                  {initial}
                </span>
              )}
            </div>

            {/* Upload Spinner Overlay */}
            {uploadingImage && (
              <div className="absolute inset-0 rounded-full bg-black/60 flex flex-col items-center justify-center text-white text-xs gap-1">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
                <span>Uploading...</span>
              </div>
            )}

            {/* Camera Badge Trigger */}
            <button
              type="button"
              disabled={uploadingImage}
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload photo from PC"
              className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-[#A92E24] hover:bg-[#78231E] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer disabled:opacity-50"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Upload Controls & Information */}
          <div className="space-y-3 text-center sm:text-left flex-1">
            <div>
              <p className="text-sm font-bold text-[var(--foreground)]">
                Upload from your Computer
              </p>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Select an image file from your PC. It will be uploaded automatically to ImgBB and saved in the database.
              </p>
              <p className="text-[11px] text-[var(--muted-foreground)] mt-1">
                Supported formats: <strong>PNG, JPG, WEBP</strong> (Max size: 5MB).
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
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
                className="px-4 py-2 rounded-xl bg-[#A92E24] hover:bg-[#78231E] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer disabled:opacity-60"
              >
                {uploadingImage ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose Photo from PC</span>
                  </>
                )}
              </button>

              {image && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-3 py-2 rounded-xl border border-[var(--border)] hover:bg-red-500/10 hover:border-red-500/30 text-xs font-medium text-red-600 dark:text-red-400 transition flex items-center gap-1.5 cursor-pointer"
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
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Address (Read-only Better Auth) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[var(--foreground)]">
                Account Email
              </label>
              <span className="flex items-center gap-1 text-[11px] text-[var(--muted-foreground)]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified via Better Auth
              </span>
            </div>
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
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#A92E24]/30"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
              Delivery Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1700-000000"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#A92E24]/30"
              />
            </div>
            <p className="text-[11px] text-[var(--muted-foreground)] mt-1">
              Used by pizzeria couriers to contact you upon pizza arrival.
            </p>
          </div>

          {/* Save Changes Action */}
          <div className="pt-4 border-t border-[var(--border)] flex justify-end">
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="px-6 py-2.5 rounded-xl bg-[#A92E24] hover:bg-[#78231E] text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { createMenuItem } from "@/lib/api/menu-items";
import { uploadImage } from "@/lib/api/upload";
import { PIZZA_CATEGORIES, DHAKA_LOCATIONS } from "@/lib/constants/locations";
import { toast } from "sonner";
import {
  Upload,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export default function AddMenuItemPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("Classic Pizzas");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState(DHAKA_LOCATIONS[0] || "Banani");

  // File Upload states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Handle local file selection and preview
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File type validation
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file format. Please upload JPEG, PNG, or WEBP.");
      return;
    }

    // File size validation (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file is too large. Maximum size is 10MB.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setUploadedUrl(""); // Reset if user changed file
  };

  // Upload image to ImgBB
  const handleUploadImage = async () => {
    if (!imageFile) {
      toast.error("Please choose an image file first.");
      return null;
    }

    if (uploadedUrl) return uploadedUrl;

    setUploadingImage(true);
    try {
      const token = session?.session?.token;
      const url = await uploadImage(imageFile, token);
      setUploadedUrl(url);
      toast.success("Image hosted successfully on ImgBB!");
      return url;
    } catch (err) {
      console.error("ImgBB upload failed:", err);
      toast.error(err.message || "Failed to upload image.");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.session?.token) {
      toast.error("Authentication expired. Please sign in again.");
      return;
    }

    if (!imageFile && !uploadedUrl) {
      toast.error("Menu image is required. Please select an image file.");
      return;
    }

    setSubmitting(true);
    try {
      // Ensure image is uploaded first
      let finalImageUrl = uploadedUrl;
      if (!finalImageUrl && imageFile) {
        finalImageUrl = await handleUploadImage();
        if (!finalImageUrl) {
          setSubmitting(false);
          return;
        }
      }

      const token = session.session.token;
      const payload = {
        itemName: itemName.trim(),
        category,
        description: description.trim(),
        price: parseFloat(price),
        location,
        images: [finalImageUrl],
      };

      await createMenuItem(payload, token);
      toast.success(
        "🎉 Menu item submitted successfully! It is now pending administrator review."
      );
      router.push("/dashboard/vendor/menu-items");
    } catch (err) {
      console.error("Error creating menu item:", err);
      if (err.message?.includes("Free plan limit reached")) {
        toast.error(
          "Free tier limit reached (3 active items). Please upgrade to Premium for unlimited publishing!"
        );
      } else {
        toast.error(err.message || "Failed to create menu item.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/dashboard/vendor/menu-items"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)] hover:text-[#A92E24] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Menu Items
      </Link>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#596B45]">
            Catalog Creation
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)] mt-1">
            Add New Pizza Menu Item
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
            Fill in the authentic Italian recipe details and upload a high-resolution food image via ImgBB.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Item Name */}
          <div>
            <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
              Pizza / Item Name *
            </label>
            <input
              type="text"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g. Sourdough Truffle Burrata Pizza"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#A92E24]/30"
            />
          </div>

          {/* Category & Price Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#A92E24]/30"
              >
                {PIZZA_CATEGORIES.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                Price (USD $) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.5"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 18.50"
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#A92E24]/30"
              />
            </div>
          </div>

          {/* Location Area / City */}
          <div>
            <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
              Pizzeria Location (Dhaka Area) *
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#A92E24]/30"
            >
              {DHAKA_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
              Recipe Description &amp; Ingredients *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the crust fermentation, San Marzano sauce, artisan cheese varieties, and fresh herbs used..."
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#A92E24]/30 resize-none"
            />
          </div>

          {/* =================================================================
              IMAGE UPLOAD VIA IMGBB (ASSIGNMENT REQUIREMENT)
             ================================================================= */}
          <div className="space-y-3 pt-2 border-t border-[var(--border)]">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[var(--foreground)]">
                Item Image (Required — Uploaded to ImgBB) *
              </label>
              {uploadedUrl && (
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ImgBB Hosted
                </span>
              )}
            </div>

            <div className="border-2 border-dashed border-[var(--border)] hover:border-[#A92E24]/50 rounded-2xl p-6 text-center transition-all bg-[var(--background)]">
              {imagePreview ? (
                <div className="space-y-3">
                  <div className="relative w-48 h-36 mx-auto rounded-xl overflow-hidden border border-[var(--border)] shadow-md">
                    <img
                      src={imagePreview}
                      alt="Upload Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <label className="px-4 py-1.5 rounded-lg border border-[var(--border)] text-xs font-medium cursor-pointer hover:bg-[var(--muted)]">
                      Change File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    {!uploadedUrl && (
                      <button
                        type="button"
                        onClick={handleUploadImage}
                        disabled={uploadingImage}
                        className="px-4 py-1.5 rounded-lg bg-[#596B45] hover:bg-[#435234] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                      >
                        {uploadingImage ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>Host on ImgBB</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[var(--muted)] text-[#A92E24] flex items-center justify-center mx-auto">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-[var(--foreground)]">
                    Click to select an image from your device
                  </p>
                  <p className="text-[10px] text-[var(--muted-foreground)]">
                    Supports JPEG, PNG, WEBP (Max 10MB). Automatically hosted on ImgBB.
                  </p>
                  <label className="inline-block mt-2 px-5 py-2 rounded-xl bg-[#A92E24] hover:bg-[#78231E] text-white text-xs font-semibold cursor-pointer shadow-sm">
                    Select Pizza Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-[var(--border)] flex items-center justify-end gap-3">
            <Link
              href="/dashboard/vendor/menu-items"
              className="px-5 py-2.5 rounded-xl border border-[var(--border)] text-xs font-semibold hover:bg-[var(--muted)]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="px-6 py-2.5 rounded-xl bg-[#A92E24] hover:bg-[#78231E] text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting to Database...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Menu Item</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

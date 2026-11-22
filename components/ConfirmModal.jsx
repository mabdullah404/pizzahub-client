"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Ban, Trash2, X, Loader2 } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone. Please confirm to proceed.",
  confirmText = "Confirm",
  cancelText = "Keep It",
  variant = "danger", // 'danger' | 'warning' | 'info'
  loading = false,
  itemName = null,
}) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, loading, onClose]);

  const getIcon = () => {
    if (variant === "danger") {
      return <Ban className="w-6 h-6 text-[#A92E24] dark:text-rose-400" />;
    }
    if (variant === "delete") {
      return <Trash2 className="w-6 h-6 text-[#A92E24] dark:text-rose-400" />;
    }
    return <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
  };

  const getIconBg = () => {
    if (variant === "danger" || variant === "delete") {
      return "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50";
    }
    return "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50";
  };

  const getConfirmBtnClass = () => {
    if (variant === "danger" || variant === "delete") {
      return "bg-[#A92E24] hover:bg-[#8e251d] text-white shadow-md shadow-rose-900/10";
    }
    return "bg-amber-600 hover:bg-amber-700 text-white shadow-md";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              if (!loading) onClose();
            }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            className="relative w-full max-w-md bg-[var(--card)] text-[var(--foreground)] rounded-3xl border border-[var(--border)] shadow-2xl p-6 sm:p-7 z-10 overflow-hidden"
          >
            {/* Close Button Top Right */}
            <button
              onClick={onClose}
              disabled={loading}
              className="absolute top-5 right-5 p-2 rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors disabled:opacity-50 cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-4">
              {/* Icon Pill */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${getIconBg()}`}
              >
                {getIcon()}
              </div>

              {/* Title & Body */}
              <div className="space-y-2">
                <h3
                  id="confirm-modal-title"
                  className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]"
                >
                  {title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {description}
                </p>

                {itemName && (
                  <div className="mt-3 p-3 rounded-2xl bg-[var(--muted)]/60 border border-[var(--border)] flex items-center gap-2 text-xs font-semibold text-[var(--foreground)]">
                    <span className="text-[var(--muted-foreground)] font-normal">Target:</span>
                    <span className="truncate">{itemName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-5 border-t border-[var(--border)] flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-bold text-[var(--foreground)] bg-[var(--muted)] hover:bg-[var(--muted)]/80 border border-[var(--border)] transition-all cursor-pointer disabled:opacity-50"
              >
                {cancelText}
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer disabled:opacity-50 active:scale-95 ${getConfirmBtnClass()}`}
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{confirmText}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

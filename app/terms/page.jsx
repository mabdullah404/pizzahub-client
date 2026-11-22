import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service | PizzaHub",
  description: "Read the terms and conditions governing the use of the PizzaHub platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F4F6FA] dark:bg-[#18181B] py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#777777] dark:text-[#A1A1AA] hover:text-[#E66A2C] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white dark:bg-[#24242A] rounded-3xl p-8 sm:p-12 shadow-xs border border-[#E8EDF4] dark:border-[#333338] space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E8EDF4] dark:border-[#333338]">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD64F]/20 text-[#E66A2C] flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#24242A] dark:text-white">
                Terms of Service
              </h1>
              <p className="text-xs text-[#777777] dark:text-[#A1A1AA]">
                Last updated: November 2026
              </p>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#24242A] dark:text-white">
              1. Acceptance of Terms
            </h2>
            <p className="text-xs sm:text-sm text-[#777777] dark:text-[#A1A1AA] leading-relaxed">
              By accessing or using PizzaHub, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#24242A] dark:text-white">
              2. Ordering and Fulfillment
            </h2>
            <p className="text-xs sm:text-sm text-[#777777] dark:text-[#A1A1AA] leading-relaxed">
              PizzaHub acts as a marketplace connecting customers with verified local pizzeria vendors. Food preparation and packaging are the direct responsibility of the respective vendor. Once an order is prepared and dispatched, cancellations are subject to vendor approval.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#24242A] dark:text-white">
              3. Vendor Obligations
            </h2>
            <p className="text-xs sm:text-sm text-[#777777] dark:text-[#A1A1AA] leading-relaxed">
              Pizzeria vendors registered on PizzaHub must maintain valid food safety hygiene standards, accurate menu pricing, and true ingredient representations. PizzaHub reserves the right to suspend or remove vendors violating community quality guidelines.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#24242A] dark:text-white">
              4. Questions and Disputes
            </h2>
            <p className="text-xs sm:text-sm text-[#777777] dark:text-[#A1A1AA] leading-relaxed">
              For disputes or questions regarding these terms, please contact our support team at{" "}
              <a href="mailto:support@pizzahub.com" className="text-[#E66A2C] font-semibold underline">
                support@pizzahub.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

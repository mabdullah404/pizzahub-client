import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | PizzaHub",
  description: "Learn how PizzaHub collects, protects, and manages your personal information.",
};

export default function PrivacyPage() {
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
            <div className="w-12 h-12 rounded-2xl bg-[#E66A2C]/10 text-[#E66A2C] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#24242A] dark:text-white">
                Privacy Policy
              </h1>
              <p className="text-xs text-[#777777] dark:text-[#A1A1AA]">
                Last updated: November 2026
              </p>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#24242A] dark:text-white">
              1. Information We Collect
            </h2>
            <p className="text-xs sm:text-sm text-[#777777] dark:text-[#A1A1AA] leading-relaxed">
              When you use PizzaHub to discover artisan pizzas, place orders, or register as a partner vendor, we collect essential details such as your name, email address, delivery address, phone number, and transaction history.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#24242A] dark:text-white">
              2. How We Use Your Information
            </h2>
            <p className="text-xs sm:text-sm text-[#777777] dark:text-[#A1A1AA] leading-relaxed">
              We process your information exclusively to fulfill pizza orders, communicate real-time delivery status, handle customer service requests, and safeguard our platform against fraudulent transactions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#24242A] dark:text-white">
              3. Payment Security & Third-Party Processors
            </h2>
            <p className="text-xs sm:text-sm text-[#777777] dark:text-[#A1A1AA] leading-relaxed">
              PizzaHub never stores your credit card numbers or CVV. All online payments are securely processed through Stripe, an industry-leading PCI-DSS certified payment gateway.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-[#24242A] dark:text-white">
              4. Contact Our Data Protection Team
            </h2>
            <p className="text-xs sm:text-sm text-[#777777] dark:text-[#A1A1AA] leading-relaxed">
              If you have any questions regarding your data or wish to request data deletion, contact us at{" "}
              <a href="mailto:privacy@pizzahub.com" className="text-[#E66A2C] font-semibold underline">
                privacy@pizzahub.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

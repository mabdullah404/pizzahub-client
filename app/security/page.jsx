import Link from "next/link";
import { Lock, ArrowLeft, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Security | PizzaHub",
  description: "Read about security protocols, data protection, and platform safety at PizzaHub.",
};

export default function SecurityPage() {
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
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#24242A] dark:text-white">
                Platform Security
              </h1>
              <p className="text-xs text-[#777777] dark:text-[#A1A1AA]">
                How we protect your account, payments, and data
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#F4F6FA] dark:bg-[#1E1E24] border border-[#E8EDF4] dark:border-[#333338] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#24242A] dark:text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Encrypted Transport</span>
              </div>
              <p className="text-[11px] text-[#777777] dark:text-[#A1A1AA] leading-relaxed">
                All communications between your device and PizzaHub are encrypted in transit using modern TLS 1.3 cryptography.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F4F6FA] dark:bg-[#1E1E24] border border-[#E8EDF4] dark:border-[#333338] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#24242A] dark:text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>PCI-DSS Compliant Payments</span>
              </div>
              <p className="text-[11px] text-[#777777] dark:text-[#A1A1AA] leading-relaxed">
                Card credentials are tokenized directly via Stripe servers; card numbers never touch or rest on our database.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F4F6FA] dark:bg-[#1E1E24] border border-[#E8EDF4] dark:border-[#333338] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#24242A] dark:text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Hardened Authentication</span>
              </div>
              <p className="text-[11px] text-[#777777] dark:text-[#A1A1AA] leading-relaxed">
                Passwords are salted and securely hashed. Sessions use HTTP-only, secure, SameSite cookies with strict role-based access control.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F4F6FA] dark:bg-[#1E1E24] border border-[#E8EDF4] dark:border-[#333338] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#24242A] dark:text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Automated Integrity Verification</span>
              </div>
              <p className="text-[11px] text-[#777777] dark:text-[#A1A1AA] leading-relaxed">
                Orders and subscription transactions are cryptographically verified through secure Stripe webhook signatures.
              </p>
            </div>
          </div>

          <section className="space-y-3 pt-4 border-t border-[#E8EDF4] dark:border-[#333338]">
            <h2 className="text-base font-bold text-[#24242A] dark:text-white">
              Responsible Vulnerability Disclosure
            </h2>
            <p className="text-xs sm:text-sm text-[#777777] dark:text-[#A1A1AA] leading-relaxed">
              If you discover a security vulnerability within the PizzaHub platform, please email our engineering team at{" "}
              <a href="mailto:security@pizzahub.com" className="text-[#E66A2C] font-semibold underline">
                security@pizzahub.com
              </a>
              . We investigate all credible reports promptly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

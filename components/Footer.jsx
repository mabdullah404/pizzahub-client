import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Pizza, ArrowRight, Github } from "lucide-react";
import { FOOTER_CONTACT } from "@/lib/constants/locations";

export function Footer() {
  return (
    <footer id="contact" className="bg-[#1F1F24] text-white pt-16 pb-10 border-t border-[#333338]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#333338]">
          {/* 1. Logo & Short Description */}
          <div className="lg:col-span-2 space-y-4 pr-0 lg:pr-8">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-2xl bg-[#E66A2C] flex items-center justify-center text-white shadow-md shadow-[#E66A2C]/20 transition-transform group-hover:scale-105">
                <Pizza className="w-5 h-5" />
              </div>
              <span className="font-serif font-black text-2xl tracking-tight text-white">
                Pizza<span className="text-[#E66A2C]">Hub</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed max-w-md">
              PizzaHub is your premier destination for authentic, handcrafted woodfired pizzas.
              Crafted with fresh local ingredients, slow-fermented artisanal dough, and delivered
              piping hot straight to your doorstep across Dhaka.
            </p>

            {/* Social / Project Links (Real Repository & Profiles - No generic root domains) */}
            <div className="space-y-2 pt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
                Connect & Project Source
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/mabdullah404/pizzahub-client"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Repository"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-[#E66A2C] text-[#A1A1AA] hover:text-white transition-all text-xs font-semibold border border-white/5 hover:border-transparent"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Repository</span>
                </a>
              </div>
            </div>
          </div>

          {/* 2. Important Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-l-2 border-[#E66A2C] pl-2.5">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A1A1AA]">
              <li>
                <Link href="/" className="hover:text-[#FFD64F] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#E66A2C]" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/browse-menu" className="hover:text-[#FFD64F] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#E66A2C]" />
                  <span>Browse Full Menu</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard/customer/orders" className="hover:text-[#FFD64F] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#E66A2C]" />
                  <span>Order Tracking & History</span>
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="hover:text-[#FFD64F] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#E66A2C]" />
                  <span>Sign In / My Account</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Contact Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-l-2 border-[#E66A2C] pl-2.5">
              Contact Information
            </h4>
            <ul className="space-y-3 text-xs text-[#A1A1AA]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E66A2C] mt-0.5 shrink-0" />
                <span>{FOOTER_CONTACT?.address || "Road 11, Block D, Banani, Dhaka 1213, Bangladesh"}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FFD64F] shrink-0" />
                <a href={`tel:${FOOTER_CONTACT?.phone || "+8801700749924"}`} className="hover:text-white transition-colors">
                  {FOOTER_CONTACT?.phone || "+880 1700-PIZZAHUB"}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E66A2C] shrink-0" />
                <a href={`mailto:${FOOTER_CONTACT?.email || "support@pizzahub.com"}`} className="hover:text-white transition-colors">
                  {FOOTER_CONTACT?.email || "support@pizzahub.com"}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#A1A1AA] mt-0.5 shrink-0" />
                <div>
                  <p className="text-white font-medium">Kitchen Hours:</p>
                  <p>{FOOTER_CONTACT?.hours || "10:00 AM – 11:30 PM (Daily)"}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* 5. Copyright Information & Legal Pages */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#777777] gap-4">
          <p>© 2026 PizzaHub. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-[#444449]">•</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span className="text-[#444449]">•</span>
            <Link href="/security" className="hover:text-white transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

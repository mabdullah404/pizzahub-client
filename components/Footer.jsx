import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Pizza, ArrowRight } from "lucide-react";

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
              piping hot straight to your doorstep.
            </p>

            {/* 4. Social Media Links */}
            <div className="space-y-2 pt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">
                Connect With Us
              </p>
              <div className="flex items-center gap-3">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#E66A2C] text-[#A1A1AA] hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/5 hover:border-transparent hover:shadow-lg hover:shadow-[#E66A2C]/20"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#E66A2C] text-[#A1A1AA] hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/5 hover:border-transparent hover:shadow-lg hover:shadow-[#E66A2C]/20"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#E66A2C] text-[#A1A1AA] hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/5 hover:border-transparent hover:shadow-lg hover:shadow-[#E66A2C]/20"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
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
                <Link href="/browse-menu?filter=deals" className="hover:text-[#FFD64F] transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-[#E66A2C]" />
                  <span>Special Combos & Deals</span>
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
                <span>Road 11, Block D, Banani, Dhaka 1213, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FFD64F] shrink-0" />
                <a href="tel:+8801700749924" className="hover:text-white transition-colors">
                  +880 1700-PIZZAHUB
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E66A2C] shrink-0" />
                <a href="mailto:support@pizzahub.com" className="hover:text-white transition-colors">
                  support@pizzahub.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#A1A1AA] mt-0.5 shrink-0" />
                <div>
                  <p className="text-white font-medium">Kitchen Hours:</p>
                  <p>10:00 AM – 11:30 PM (Daily)</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* 5. Copyright Information */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#777777] gap-4">
          <p>© 2026 PizzaHub. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="text-[#444449]">•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="text-[#444449]">•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

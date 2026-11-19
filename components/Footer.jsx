import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer id="contact" className="bg-[#24242A] text-white pt-16 pb-12 border-t border-[#333338]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#333338]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-black text-2xl tracking-tight text-white flex items-center">
                Pizza<span className="text-[#E66A2C]">Hub</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-sm leading-relaxed">
              Authentic handcrafted pizzas baked in blazing 900°F ovens and delivered fresh, hot, and fast to your doorstep.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-[#FFD64F] text-[#24242A]">
                Average Delivery: 30 Mins
              </span>
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-white">
                4.9 ★ Customer Rating
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-black uppercase tracking-wider text-white">
              Menu & Deals
            </h4>
            <ul className="space-y-2 text-xs text-[#A1A1AA]">
              <li>
                <Link href="/browse-menu" className="hover:text-[#FFD64F] transition-colors">
                  All Pizzas
                </Link>
              </li>
              <li>
                <Link href="/browse-menu?category=Classic%20Pizzas" className="hover:text-[#FFD64F] transition-colors">
                  Classic Pizzas
                </Link>
              </li>
              <li>
                <Link href="/browse-menu?category=Meat%20Lovers" className="hover:text-[#FFD64F] transition-colors">
                  Meat Lovers
                </Link>
              </li>
              <li>
                <Link href="/browse-menu?category=Vegetarian%20Pizzas" className="hover:text-[#FFD64F] transition-colors">
                  Vegetarian Pizzas
                </Link>
              </li>
              <li>
                <Link href="/browse-menu?filter=deals" className="hover:text-[#FFD64F] transition-colors">
                  Special Combos & Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Dashboards & Partners */}
          <div className="space-y-3">
            <h4 className="text-sm font-black uppercase tracking-wider text-white">
              For Restaurants
            </h4>
            <ul className="space-y-2 text-xs text-[#A1A1AA]">
              <li>
                <Link href="/sign-up?role=vendor" className="hover:text-[#FFD64F] transition-colors">
                  Partner with Us
                </Link>
              </li>
              <li>
                <Link href="/dashboard/vendor" className="hover:text-[#FFD64F] transition-colors">
                  Vendor Portal
                </Link>
              </li>
              <li>
                <Link href="/dashboard/vendor/subscription" className="hover:text-[#FFD64F] transition-colors">
                  Premium Vendor Plan
                </Link>
              </li>
              <li>
                <Link href="/dashboard/admin" className="hover:text-[#FFD64F] transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-black uppercase tracking-wider text-white">
              Contact Us
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A1A1AA]">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E66A2C] mt-0.5 shrink-0" />
                <span>Road 11, Banani, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FFD64F] shrink-0" />
                <span>+880 1700-PIZZAHUB</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#E66A2C] shrink-0" />
                <span>support@pizzahub.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#A1A1AA] shrink-0" />
                <span>10:00 AM – 12:00 Midnight (Daily)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#777777] gap-4">
          <p>© 2026 PizzaHub Delivery Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer">Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

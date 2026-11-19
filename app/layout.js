import { Playfair_Display, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "PizzaHub — Authentic Italian Pizza Ordering & Delivery",
  description:
    "Experience the finest artisan woodfired pizzas crafted by authentic Italian pizzerias and delivered fresh to your door.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          {/* Sonner Toaster configured with 90px offset to sit cleanly below the sticky navbar */}
          <Toaster
            position="top-right"
            richColors
            closeButton
            theme="system"
            offset="88px"
            toastOptions={{
              style: {
                borderRadius: "14px",
                fontFamily: "var(--font-inter)",
                boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.15)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

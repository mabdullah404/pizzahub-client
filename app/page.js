import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedMenu } from "@/components/FeaturedMenu";
import { CategorySection } from "@/components/CategorySection";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";

async function getFeaturedPizzas() {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
  try {
    const res = await fetch(`${serverUrl}/api/menu?limit=6`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      return json.data || [];
    }
  } catch (error) {
    console.warn("Could not fetch featured pizzas from backend:", error.message);
  }
  return [];
}

export default async function HomePage() {
  const featuredPizzas = await getFeaturedPizzas();

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F6FA] dark:bg-[#18181B] transition-colors">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section matching exact reference design with delivery path & feature pills */}
        <HeroSection />

        {/* Featured Pizza Menu (Real Database Items) */}
        <FeaturedMenu items={featuredPizzas} />

        {/* Categories Section */}
        <CategorySection />

        {/* Why Choose PizzaHub */}
        <WhyChooseUs />

        {/* How It Works */}
        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
}

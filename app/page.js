export const revalidate = 60;

import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { HomeSearchFilter } from "@/components/HomeSearchFilter";
import { FeaturedMenu } from "@/components/FeaturedMenu";
import { CategorySection } from "@/components/CategorySection";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/Container";
import { FadeIn } from "@/components/FadeIn";
import { getApiUrl } from "@/lib/utils/apiUrl";

async function getFeaturedPizzas(retries = 2) {
  const serverUrl = getApiUrl();
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);
      const res = await fetch(`${serverUrl}/api/menu?limit=6`, {
        next: { revalidate: 60 },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          return json.data;
        }
      }
    } catch (error) {
      if (attempt === retries) {
        console.warn(`Featured fetch failed after ${retries + 1} attempts:`, error.message);
      } else {
        await new Promise((r) => setTimeout(r, 600));
      }
    }
  }
  return [];
}

function FeaturedMenuSkeleton() {
  return (
    <section className="py-16 sm:py-24 bg-[#F4F6FA] dark:bg-[#18181B] transition-colors">
      <Container>
        <div className="h-10 w-64 bg-[#E8EDF4] dark:bg-[#1F1F24] rounded-xl mb-12 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-3xl bg-white dark:bg-[#24242A] border border-[#E8EDF4] dark:border-[#333338] p-4 space-y-4 animate-pulse h-full"
            >
              <div className="w-full aspect-[4/3] rounded-2xl bg-[#E8EDF4] dark:bg-[#1F1F24]" />
              <div className="space-y-2">
                <div className="h-4 w-2/3 bg-[#E8EDF4] dark:bg-[#1F1F24] rounded-md" />
                <div className="h-3 w-full bg-[#E8EDF4] dark:bg-[#1F1F24] rounded-md" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="h-6 w-16 bg-[#E8EDF4] dark:bg-[#1F1F24] rounded-md" />
                <div className="h-9 w-24 bg-[#E8EDF4] dark:bg-[#1F1F24] rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default async function HomePage() {
  const featuredPizzas = await getFeaturedPizzas();

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F6FA] dark:bg-[#18181B] transition-colors overflow-x-clip">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Prominent Homepage Search & Filter Toolbar */}
        <Container as="section" className="py-6 sm:py-8">
          <HomeSearchFilter />
        </Container>

        {/* Featured Pizza Menu with Suspense */}
        <Suspense fallback={<FeaturedMenuSkeleton />}>
          <FeaturedMenu items={featuredPizzas} />
        </Suspense>

        {/* Categories Section */}
        <FadeIn>
          <CategorySection />
        </FadeIn>

        {/* Why Choose PizzaHub */}
        <FadeIn>
          <WhyChooseUs />
        </FadeIn>

        {/* How It Works */}
        <FadeIn>
          <HowItWorks />
        </FadeIn>
      </main>

      <Footer />
    </div>
  );
}

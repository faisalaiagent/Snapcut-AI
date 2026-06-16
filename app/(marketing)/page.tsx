import type { Metadata } from "next";
import { HeroSection } from "@/components/marketing/HeroSection";
import { StatsBar } from "@/components/marketing/StatsBar";
import { ToolsSection } from "@/components/marketing/ToolsSection";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { BeforeAfterSection } from "@/components/marketing/BeforeAfterSection";
import { PricingSection } from "@/components/marketing/PricingSection";
import { TestimonialsSection } from "@/components/marketing/TestimonialsSection";
import { FAQSection } from "@/components/marketing/FAQSection";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "SnapCut AI – Remove Backgrounds & Resize Photos Instantly",
  description:
    "AI-powered background remover, passport photo maker, white background generator for Amazon/eBay, LinkedIn optimizer, and Instagram DP maker. Free to start.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <ToolsSection />
        <HowItWorks />
        <BeforeAfterSection />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}

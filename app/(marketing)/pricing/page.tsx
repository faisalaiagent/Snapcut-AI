import type { Metadata } from "next";
import { PricingSection } from "@/components/marketing/PricingSection";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "Pricing – SnapCut AI",
  description:
    "Start free with 5 edits per day. Upgrade to Pro for unlimited HD exports with no watermark at $12/month. Business plans for teams from $39/month.",
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="pt-16 pb-0 text-center">
          <p className="section-tag">Pricing</p>
          <h1 className="font-serif text-4xl md:text-5xl text-ink mb-4">
            Start free. Upgrade when ready.
          </h1>
          <p className="text-[18px] text-ink-3 font-light max-w-lg mx-auto">
            No credit card required to start. Cancel anytime. 7-day free trial on Pro.
          </p>
        </div>
        <PricingSection />
      </main>
      <Footer />
    </>
  );
}

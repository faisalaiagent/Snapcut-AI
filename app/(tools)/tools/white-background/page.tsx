import type { Metadata } from "next";
import { WhiteBgClient } from "./WhiteBgClient";

export const metadata: Metadata = {
  title: "White Background Generator – Amazon & eBay Product Photos",
  description:
    "Generate pure white background product photos for Amazon, eBay, Etsy, and Shopify. Free, no signup required.",
};

export default function WhiteBackgroundPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="section-tag">eCommerce Tool — Free to use</div>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-3">
          White Background Generator
        </h1>
        <p className="text-[17px] text-ink-3 font-light max-w-xl">
          Create marketplace-ready product photos with a pure white background.
          Perfect for Amazon, eBay, Etsy, and Shopify. No signup required.
        </p>
      </div>
      <WhiteBgClient />
      <div className="mt-10 p-5 bg-gold-light border border-[#e8d0a0] rounded-2xl">
        <h3 className="font-semibold text-ink mb-2">📦 Marketplace requirements met</h3>
        <ul className="text-[14px] text-ink-2 space-y-1">
          <li>✓ Amazon — Pure white (RGB 255,255,255), product fills 85%+ of frame</li>
          <li>✓ eBay — White or light grey background, no watermarks</li>
          <li>✓ Etsy — Clean background, high resolution (2000×2000px)</li>
          <li>✓ Shopify — Square format, consistent white background</li>
        </ul>
      </div>
    </div>
  );
}

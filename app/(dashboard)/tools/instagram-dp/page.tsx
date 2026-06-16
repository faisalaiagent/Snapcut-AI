import type { Metadata } from "next";
import { InstagramDpClient } from "./InstagramDpClient";

export const metadata: Metadata = {
  title: "Instagram DP Maker – Optimize Profile Picture for Instagram",
  description:
    "Resize and optimize your Instagram display picture. Perfect 320×320px square crop with circular preview. High quality export for mobile and desktop.",
};

export default function InstagramDpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="section-tag">Social Media Tool</div>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-3">
          Instagram DP Optimizer
        </h1>
        <p className="text-[17px] text-ink-3 font-light max-w-xl">
          Perfect square crop with circular preview. Optimised for
          Instagram&apos;s display picture format on mobile and desktop.
        </p>
      </div>
      <InstagramDpClient />
    </div>
  );
}

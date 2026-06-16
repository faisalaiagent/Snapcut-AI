import type { Metadata } from "next";
import { InstagramClient } from "./InstagramClient";

export const metadata: Metadata = {
  title: "Instagram DP Maker – Free Profile Picture Optimizer",
  description: "Resize your Instagram display picture for free. Perfect 320×320px square crop with circular preview. No signup required.",
};

export default function InstagramDpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="section-tag">Social Media Tool — Free to use</div>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-3">Instagram DP Optimizer</h1>
        <p className="text-[17px] text-ink-3 font-light max-w-xl">
          Perfect square crop with circular preview. Optimized for Instagram&apos;s display picture format. No signup required.
        </p>
      </div>
      <InstagramClient />
    </div>
  );
}

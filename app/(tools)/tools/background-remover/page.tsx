import type { Metadata } from "next";
import { BackgroundRemoverClient } from "./BackgroundRemoverClient";

export const metadata: Metadata = {
  title: "AI Background Remover – Remove Image Background Free",
  description:
    "Remove image backgrounds instantly with AI. Upload your photo and get a clean transparent PNG in seconds. Free to use, no signup required.",
};

export default function BackgroundRemoverPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="section-tag">AI Tool — Free to use</div>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-3">
          Background Remover
        </h1>
        <p className="text-[17px] text-ink-3 font-light max-w-xl">
          Upload any image and remove the background automatically with AI.
          Download a clean transparent PNG in seconds. No signup required.
        </p>
      </div>

      <BackgroundRemoverClient />

      <div className="mt-16 grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Lightning fast",
            body: "AI processing in under 3 seconds using the remove.bg API — optimised for accuracy on products, portraits, and complex subjects.",
          },
          {
            title: "Pixel-perfect edges",
            body: "Sub-pixel edge detection handles fine hair, fur, and glass. Works on any background colour or pattern.",
          },
          {
            title: "Free to start",
            body: "5 free removals per day with no signup. Upgrade to Pro for unlimited HD exports with no watermark.",
          },
        ].map((item) => (
          <div key={item.title} className="card">
            <h3 className="font-semibold text-ink mb-2">{item.title}</h3>
            <p className="text-[14px] text-ink-3 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

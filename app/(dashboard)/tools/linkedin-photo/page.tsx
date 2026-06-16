import type { Metadata } from "next";
import { LinkedInPhotoClient } from "./LinkedInPhotoClient";

export const metadata: Metadata = {
  title: "LinkedIn Profile Photo Optimizer – Professional Headshot Editor",
  description:
    "Optimize your LinkedIn profile photo with AI. Auto face-centering, 400×400px crop, and compression optimized for LinkedIn's recommendations.",
};

export default function LinkedInPhotoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="section-tag">Social Media Tool</div>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-3">
          LinkedIn Photo Optimizer
        </h1>
        <p className="text-[17px] text-ink-3 font-light max-w-xl">
          Get a professional-looking LinkedIn profile photo. Auto face-centering,
          perfect 400×400px dimensions, and optimised compression.
        </p>
      </div>

      <LinkedInPhotoClient />

      <div className="mt-10 grid sm:grid-cols-2 gap-4">
        <div className="card">
          <p className="text-[13px] font-semibold text-ink mb-2">📐 LinkedIn specs</p>
          <ul className="text-[13px] text-ink-3 space-y-1">
            <li>• Recommended: 400×400 pixels</li>
            <li>• Minimum: 200×200 pixels</li>
            <li>• Max file size: 8 MB</li>
            <li>• Format: JPG, PNG, GIF</li>
          </ul>
        </div>
        <div className="card">
          <p className="text-[13px] font-semibold text-ink mb-2">💡 Pro tips</p>
          <ul className="text-[13px] text-ink-3 space-y-1">
            <li>• Face should fill 60% of the frame</li>
            <li>• Use a plain or blurred background</li>
            <li>• Good lighting, front-facing preferred</li>
            <li>• Professional attire recommended</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { LinkedInClient } from "./LinkedInClient";

export const metadata: Metadata = {
  title: "LinkedIn Profile Photo Optimizer – Free Online",
  description: "Optimize your LinkedIn profile photo for free. Auto face-centering, 400×400px crop. No signup required.",
};

export default function LinkedInPhotoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="section-tag">Social Media Tool — Free to use</div>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-3">LinkedIn Photo Optimizer</h1>
        <p className="text-[17px] text-ink-3 font-light max-w-xl">
          Professional circular crop, face-centering, and compression for LinkedIn. No signup required.
        </p>
      </div>
      <LinkedInClient />
    </div>
  );
}

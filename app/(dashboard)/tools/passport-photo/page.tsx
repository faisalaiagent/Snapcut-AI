import type { Metadata } from "next";
import { PassportPhotoClient } from "./PassportPhotoClient";

export const metadata: Metadata = {
  title: "Passport Photo Maker – Resize for USA, UK, Pakistan & 50+ Countries",
  description:
    "Auto-resize passport photos for USA (2×2\"), UK (35×45mm), Pakistan, India, UAE, Canada, Australia and more. Compliant with official government specifications.",
};

export default function PassportPhotoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="section-tag">Document Tool</div>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-3">
          Passport Photo Maker
        </h1>
        <p className="text-[17px] text-ink-3 font-light max-w-xl">
          Select your country and upload your photo. We automatically resize and
          crop it to official passport, visa, and ID photo specifications.
        </p>
      </div>
      <PassportPhotoClient />
    </div>
  );
}

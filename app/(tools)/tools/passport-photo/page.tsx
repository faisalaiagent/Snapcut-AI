import type { Metadata } from "next";
import { PassportClient } from "./PassportClient";

export const metadata: Metadata = {
  title: "Passport Photo Maker – Free Online, All Countries",
  description:
    "Resize passport photos for USA, UK, Pakistan, India, UAE, Canada, Australia and 50+ more countries. Free, no signup required.",
};

export default function PassportPhotoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="section-tag">Document Tool — Free to use</div>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-3">
          Passport Photo Maker
        </h1>
        <p className="text-[17px] text-ink-3 font-light max-w-xl">
          Select your country and upload your photo. We automatically resize to
          official specifications. No signup required.
        </p>
      </div>
      <PassportClient />
    </div>
  );
}

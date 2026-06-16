import type { Metadata } from "next";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "About – SnapCut AI",
  description:
    "Learn about SnapCut AI – the AI-powered image editing toolkit for freelancers, sellers, and creators.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <p className="section-tag">About us</p>
        <h1 className="font-serif text-4xl text-ink mb-6">
          Making professional image editing accessible to everyone.
        </h1>
        <p className="text-[18px] text-ink-3 font-light leading-relaxed mb-12">
          SnapCut AI was built because professional image editing tools are
          expensive, complex, and overkill for the everyday tasks that
          freelancers, job seekers, eCommerce sellers, and social media
          creators need.
        </p>

        <div className="space-y-10">
          <section>
            <h2 className="font-semibold text-xl text-ink mb-3">Our mission</h2>
            <p className="text-ink-2 leading-relaxed">
              Remove the friction from image editing. We believe everyone should
              be able to create a professional passport photo, a clean product
              listing image, or a polished LinkedIn headshot — without needing
              Photoshop skills or paying a designer.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xl text-ink mb-3">The technology</h2>
            <p className="text-ink-2 leading-relaxed">
              We combine the remove.bg API (the gold standard in AI background
              removal), Cloudinary&apos;s CDN infrastructure, and Sharp&apos;s
              image processing library to deliver sub-3-second results with
              professional quality. All processing happens server-side — your
              images never touch third parties beyond what&apos;s needed.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xl text-ink mb-3">Contact us</h2>
            <p className="text-ink-2 leading-relaxed">
              Support:{" "}
              <a
                href="mailto:faisalagentai@gmail.com"
                className="text-accent hover:underline"
              >
                faisalagentai@gmail.com
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

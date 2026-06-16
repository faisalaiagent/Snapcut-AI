import type { Metadata } from "next";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy – SnapCut AI",
  description: "SnapCut AI Privacy Policy. How we collect, use, and protect your personal data.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-serif text-4xl text-ink mb-4">Privacy Policy</h1>
        <p className="text-ink-4 text-[14px] mb-10">Last updated: January 2025</p>

        <div className="space-y-8 text-ink-2 leading-relaxed">
          <section>
            <h2 className="font-semibold text-xl text-ink mb-3">1. Information We Collect</h2>
            <p>
              When you use SnapCut AI, we collect: your email address and name
              when you create an account; images you upload for processing; usage
              data including which tools you use and when; and technical data like
              your IP address, browser type, and device information.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xl text-ink mb-3">2. How We Use Your Information</h2>
            <p>
              We use your information to: provide and improve our image editing
              services; process your images using our AI tools; send you
              service-related emails; enforce our Terms of Service; and comply
              with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xl text-ink mb-3">3. Image Storage and Deletion</h2>
            <p>
              Free plan users: your uploaded images are processed and
              automatically deleted from our servers within 1 hour of upload.
              Pro and Business users: images are stored securely on Cloudinary
              CDN for your project history and can be deleted at any time from
              your dashboard. We never use your images to train AI models.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xl text-ink mb-3">4. Third-Party Services</h2>
            <p>
              We use the following third-party services:{" "}
              <strong>remove.bg</strong> for AI background removal;{" "}
              <strong>Cloudinary</strong> for image storage and CDN delivery;{" "}
              <strong>Stripe</strong> for payment processing;{" "}
              <strong>Supabase</strong> for database and authentication; and{" "}
              <strong>Google</strong> for OAuth login.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xl text-ink mb-3">5. Cookies</h2>
            <p>
              We use essential cookies for authentication and session management.
              We use analytics cookies (with your consent) to understand how you
              use our service.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xl text-ink mb-3">6. Your Rights (GDPR)</h2>
            <p>
              If you are in the EU/EEA, you have the right to: access the
              personal data we hold about you; request correction or deletion of
              your data; object to processing; and data portability.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xl text-ink mb-3">7. Contact</h2>
            <p>
              For privacy concerns, contact us at{" "}
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

import type { Metadata } from "next";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "Terms of Service – SnapCut AI",
  description: "SnapCut AI Terms of Service. Read our terms before using the platform.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-serif text-4xl text-ink mb-4">Terms of Service</h1>
        <p className="text-ink-4 text-[14px] mb-10">Last updated: January 2025</p>

        <div className="space-y-8 text-ink-2 leading-relaxed">
          <section>
            <h2 className="font-semibold text-xl text-ink mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using SnapCut AI (&quot;Service&quot;), you agree
              to be bound by these Terms. If you disagree, do not use the
              Service.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xl text-ink mb-3">2. Acceptable Use</h2>
            <p>
              You may not use the Service to process images that are: illegal or
              infringe third-party rights; pornographic or sexually explicit;
              used to deceive, defraud, or harm others; or in violation of any
              applicable law. You are responsible for all images you upload.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xl text-ink mb-3">3. Intellectual Property</h2>
            <p>
              You retain all rights to images you upload. By uploading, you
              grant us a temporary, limited licence to process your images solely
              to provide the Service. We claim no ownership over your images or
              the processed outputs.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xl text-ink mb-3">4. Subscriptions and Billing</h2>
            <p>
              Free plan: 5 edits per day at no charge. Paid plans are billed
              monthly or annually via Stripe. You can cancel at any time; access
              continues until the end of your current period. No refunds are
              provided for partial billing periods except where required by law.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xl text-ink mb-3">5. Service Availability</h2>
            <p>
              We aim for 99.9% uptime but do not guarantee uninterrupted
              availability. We may modify or discontinue features with reasonable
              notice.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xl text-ink mb-3">6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, SnapCut AI is not liable
              for indirect, incidental, or consequential damages. Our liability
              is limited to the amount you paid us in the 3 months preceding the
              claim.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-xl text-ink mb-3">7. Contact</h2>
            <p>
              Questions? Email{" "}
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

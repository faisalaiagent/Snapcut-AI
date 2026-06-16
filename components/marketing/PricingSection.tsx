"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { cn } from "@/utils/cn";
import { PLANS } from "@/lib/stripe";

const PLAN_CONFIG = [
  {
    key: "free" as const,
    price: "$0",
    period: "forever",
    desc: "Perfect for occasional use. Get started with no credit card.",
    cta: "Get started free",
    ctaHref: "/register",
    features: [
      "5 image edits per day",
      "All 5 tools included",
      "Standard quality exports",
      "Watermarked downloads",
      "7-day image history",
    ],
  },
  {
    key: "pro" as const,
    price: "$12",
    period: "per month",
    desc: "Unlimited edits and HD exports for professionals and freelancers.",
    cta: "Start Pro — 7 days free",
    ctaHref: "/register?plan=pro",
    featured: true,
    features: [
      "Unlimited image edits",
      "HD & full-resolution exports",
      "No watermarks",
      "Priority processing",
      "Full project history",
      "API access (coming soon)",
    ],
  },
  {
    key: "business" as const,
    price: "$39",
    period: "per month",
    desc: "Bulk processing, team access, and dedicated support for businesses.",
    cta: "Start Business",
    ctaHref: "/register?plan=business",
    features: [
      "Everything in Pro",
      "Bulk upload (500/batch)",
      "5 team member seats",
      "Priority support SLA",
      "Custom watermarks",
      "Invoice billing",
    ],
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
      {/* Annual toggle */}
      <div className="flex items-center justify-center gap-3 mb-12">
        <span className={cn("text-[14px]", !annual ? "text-ink font-medium" : "text-ink-4")}>Monthly</span>
        <button
          onClick={() => setAnnual(!annual)}
          className={cn(
            "w-11 h-6 rounded-full transition-colors duration-200 relative",
            annual ? "bg-accent" : "bg-surface-3"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200",
              annual ? "translate-x-5" : "translate-x-0.5"
            )}
          />
        </button>
        <span className={cn("text-[14px]", annual ? "text-ink font-medium" : "text-ink-4")}>
          Annual <span className="text-accent text-[12px] font-semibold">Save 20%</span>
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {PLAN_CONFIG.map((plan) => (
          <div
            key={plan.key}
            className={cn(
              "rounded-2xl p-8 relative overflow-hidden",
              plan.featured
                ? "bg-ink text-white border border-ink"
                : "bg-white border border-surface-3"
            )}
          >
            {plan.featured && (
              <div className="absolute top-5 right-[-28px] bg-accent text-white text-[10px] font-bold tracking-wider px-10 py-1 rotate-45">
                POPULAR
              </div>
            )}

            <p className={cn("text-[12px] font-semibold tracking-widest uppercase mb-4", plan.featured ? "text-white/50" : "text-ink-3")}>
              {plan.key}
            </p>

            <div className="flex items-baseline gap-1 mb-2">
              <span className={cn("font-serif text-[2.8rem] tracking-tight leading-none", plan.featured ? "text-white" : "text-ink")}>
                {annual && plan.key !== "free"
                  ? `$${plan.key === "pro" ? "10" : "31"}`
                  : plan.price}
              </span>
              <span className={cn("text-[14px]", plan.featured ? "text-white/40" : "text-ink-4")}>
                /{annual && plan.key !== "free" ? "mo, billed annually" : plan.period}
              </span>
            </div>

            <p className={cn("text-[14px] mb-6 leading-relaxed", plan.featured ? "text-white/55" : "text-ink-3")}>
              {plan.desc}
            </p>

            <Link
              href={plan.ctaHref}
              className={cn(
                "block w-full text-center py-3 rounded-xl text-[14px] font-medium transition-all duration-150 no-underline mb-6",
                plan.featured
                  ? "bg-white text-ink hover:bg-surface-2"
                  : "border border-surface-3 text-ink hover:bg-surface-2"
              )}
            >
              {plan.cta}
            </Link>

            <ul className="space-y-2.5">
              {plan.features.map((feat) => (
                <li key={feat} className="flex items-center gap-2.5">
                  <div className={cn("w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[9px]",
                    plan.featured ? "bg-white/15 text-white/80" : "bg-accent-light text-accent"
                  )}>
                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                  </div>
                  <span className={cn("text-[13px]", plan.featured ? "text-white/75" : "text-ink-2")}>
                    {feat}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* FAQ link */}
      <p className="text-center mt-10 text-[14px] text-ink-4">
        Questions about pricing?{" "}
        <Link href="/#faq" className="text-accent hover:underline no-underline">
          See our FAQ
        </Link>
        {" "}or{" "}
        <Link href="/contact" className="text-accent hover:underline no-underline">
          contact us
        </Link>
      </p>
    </section>
  );
}

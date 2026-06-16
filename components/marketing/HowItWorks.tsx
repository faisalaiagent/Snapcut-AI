"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

// ─── How It Works ─────────────────────────────────────────────────────────

const STEPS = [
  { num: "1", title: "Upload your image", body: "Drag & drop or browse. Supports JPG, PNG, WEBP, HEIC up to 20 MB." },
  { num: "2", title: "Select your tool", body: "Background remover, passport resize, white background, or social media optimiser." },
  { num: "3", title: "Download instantly", body: "Your processed image is ready in seconds. HD quality, no watermark on Pro." },
];

export function HowItWorks() {
  return (
    <section className="bg-surface-2 py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <p className="section-tag">How it works</p>
        <h2 className="section-title mb-12">Three steps. Done.</h2>
        <div className="grid sm:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden sm:block absolute top-7 left-[16%] right-[16%] h-px bg-surface-3 z-0" />
          {STEPS.map((step) => (
            <div key={step.num} className="relative z-10 text-center px-4">
              <div className="w-14 h-14 bg-white border border-surface-3 rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_0_6px_var(--surface-2)]">
                <span className="font-serif text-[1.4rem] text-accent">{step.num}</span>
              </div>
              <h4 className="font-semibold text-ink mb-2">{step.title}</h4>
              <p className="text-[14px] text-ink-3 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Before / After ───────────────────────────────────────────────────────

export function BeforeAfterSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
      <p className="section-tag">Before & After</p>
      <h2 className="section-title mb-10">See the difference</h2>
      <div className="bg-white border border-surface-3 rounded-3xl p-8 md:p-12">
        <div className="grid sm:grid-cols-2 gap-6 relative">
          {/* Before */}
          <div className="rounded-2xl overflow-hidden bg-[#e8e0d5] aspect-[4/3] flex items-center justify-center relative">
            <span className="absolute top-3 left-3 bg-black/60 text-white text-[11px] font-medium px-2.5 py-1 rounded-md backdrop-blur-sm">Before</span>
            <div className="text-center">
              <div className="text-5xl mb-2">🧍</div>
              <p className="text-[13px] text-[#888]">Original photo with background</p>
            </div>
          </div>
          {/* Arrow */}
          <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-ink rounded-full items-center justify-center text-white shadow-lg">→</div>
          {/* After */}
          <div className="rounded-2xl overflow-hidden checkered aspect-[4/3] flex items-center justify-center relative">
            <span className="absolute top-3 left-3 bg-black/60 text-white text-[11px] font-medium px-2.5 py-1 rounded-md backdrop-blur-sm">After</span>
            <div className="text-center">
              <div className="text-5xl mb-2">✨</div>
              <p className="text-[13px] text-[#888]">Clean transparent background</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    stars: 5,
    text: "Processed 300 product photos for my Etsy store in under 20 minutes. The white background quality is indistinguishable from a professional studio.",
    name: "Sarah Rahman",
    role: "Etsy Seller, UK",
    initials: "SR",
    color: "bg-accent-light text-accent",
  },
  {
    stars: 5,
    text: "Got my Pakistani passport photo approved first try. The auto-centering and size validation saved me a trip back to the photo studio.",
    name: "Ahmed Khan",
    role: "Job Seeker, Karachi",
    initials: "AK",
    color: "bg-gold-light text-gold",
  },
  {
    stars: 5,
    text: "My LinkedIn profile views doubled after optimizing my headshot. The circular crop and face-centering made it look incredibly professional.",
    name: "Mark Peterson",
    role: "Marketing Manager, USA",
    initials: "MP",
    color: "bg-[#e6f0fa] text-[#185fa5]",
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-surface-2 py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-tag">Testimonials</p>
          <h2 className="section-title">Loved by 47,000+ users</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card">
              <div className="text-[#c8922a] text-sm tracking-[3px] mb-4">{"★".repeat(t.stars)}</div>
              <p className="text-[15px] text-ink-2 italic leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-semibold flex-shrink-0 ${t.color}`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-ink">{t.name}</p>
                  <p className="text-[12px] text-ink-4">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "How accurate is the AI background removal?",
    a: "We use the remove.bg API which achieves 98.7% accuracy across product shots, portraits, and complex backgrounds. Fine hair, fur, and glass edges are handled with sub-pixel precision.",
  },
  {
    q: "Will my passport photo meet official requirements?",
    a: "Each country preset is based on official government specifications. We validate dimensions and background colour automatically. Always verify with the specific embassy for critical applications.",
  },
  {
    q: "Is my data safe? Are my images stored?",
    a: "Free users: images are processed and deleted immediately after download. Pro/Business users: images are stored securely on Cloudinary CDN for project history. We never share or sell your images.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes — cancel with one click from your account settings. No long-term contracts, no fees. You retain access until the end of your billing period. Pro includes a 7-day free trial.",
  },
  {
    q: "What file formats and sizes are supported?",
    a: "We support JPG, PNG, WEBP, and HEIC. Free: up to 5 MB. Pro: up to 20 MB. Exports available as PNG (transparent), JPG (white background), or WEBP.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-12">
        <p className="section-tag">FAQ</p>
        <h2 className="section-title">Common questions</h2>
      </div>
      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <div key={i} className={cn("bg-white border border-surface-3 rounded-xl overflow-hidden")}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-surface-2 transition-all duration-150"
            >
              <span className="text-[15px] font-medium text-ink">{faq.q}</span>
              <ChevronDown className={cn("w-4 h-4 text-ink-4 ml-4 flex-shrink-0 transition-transform duration-200", open === i && "rotate-180")} />
            </button>
            {open === i && (
              <div className="px-6 pb-5 text-[14px] text-ink-3 leading-relaxed border-t border-surface-2">
                <div className="pt-4">{faq.a}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

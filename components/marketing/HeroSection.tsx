"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { UploadZone } from "@/components/tools/UploadZone";

export function HeroSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-2 bg-accent-light border border-[#b3dcc9] rounded-full px-3 py-1.5 text-[13px] font-medium text-accent-2 mb-8"
      >
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        Powered by Shah Faisal Tech
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-serif text-[clamp(2.4rem,5vw,3.8rem)] leading-[1.08] text-ink mb-5 max-w-[820px] mx-auto"
      >
        Remove Backgrounds.{" "}
        <em className="text-accent not-italic">Resize Photos.</em>{" "}
        Instantly.
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg text-ink-3 font-light leading-relaxed max-w-[540px] mx-auto mb-9"
      >
        Professional-grade AI image editing for freelancers, job seekers,
        eCommerce sellers, and social media creators — no design skills needed.
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center justify-center gap-3 flex-wrap mb-5"
      >
        <Link href="/tools/background-remover" className="btn-primary gap-2">
          <Sparkles className="w-4 h-4" />
          Remove Background Free
        </Link>
        <Link href="/#tools" className="btn-secondary gap-2">
          View all tools <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* Trust badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex items-center justify-center gap-6 flex-wrap text-[13px] text-ink-4 mb-14"
      >
        {["No signup required", "5 free edits/day", "No watermark on Pro", "Instant download"].map((t) => (
          <span key={t} className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-accent-light flex items-center justify-center text-[9px] text-accent font-bold">✓</span>
            {t}
          </span>
        ))}
      </motion.div>

      {/* Upload zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <UploadZone
          toolUsed="background_remover"
          onUploadComplete={(imageId) => {
            window.location.href = `/tools/background-remover?imageId=${imageId}`;
          }}
          label="Drop your image here, or click to upload"
          sublabel="Supports JPG, PNG, WEBP, HEIC up to 20MB"
        />
      </motion.div>
    </section>
  );
}

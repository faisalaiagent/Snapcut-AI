import Link from "next/link";
import { ArrowRight } from "lucide-react";

const TOOLS = [
  {
    emoji: "✂️",
    color: "bg-accent-light",
    title: "AI Background Remover",
    desc: "Remove any background in seconds with AI. Get crisp transparent PNGs ready for any use.",
    tags: ["Drag & drop", "Before/after", "Transparent PNG"],
    href: "/tools/background-remover",
  },
  {
    emoji: "🛂",
    color: "bg-gold-light",
    title: "Passport Photo Maker",
    desc: "Auto-resize for USA, UK, Pakistan, India, UAE, Canada, Australia and 50+ more countries.",
    tags: ["7 countries", "Auto-crop", "JPG export"],
    href: "/tools/passport-photo",
  },
  {
    emoji: "🛍️",
    color: "bg-[#e6f0fa]",
    title: "eCommerce White Background",
    desc: "Generate Amazon, eBay, Etsy and Shopify-ready product photos with pure white backgrounds.",
    tags: ["Amazon-ready", "2000×2000px", "Instant"],
    href: "/tools/white-background",
  },
  {
    emoji: "💼",
    color: "bg-[#f0ecfa]",
    title: "LinkedIn Photo Optimizer",
    desc: "Professional circular crop, face-centering, and compression for LinkedIn's exact specifications.",
    tags: ["400×400px", "Circular preview", "Face focus"],
    href: "/tools/linkedin-photo",
  },
  {
    emoji: "📸",
    color: "bg-[#faeee8]",
    title: "Instagram DP Optimizer",
    desc: "Square crop with circular preview, face-focused, high-quality export for Instagram.",
    tags: ["320×320px", "High quality", "Mobile friendly"],
    href: "/tools/instagram-dp",
  },
  {
    emoji: "⚡",
    color: "bg-ink",
    title: "Bulk Processor",
    desc: "Process hundreds of images at once. Perfect for eCommerce sellers with large product catalogues.",
    tags: ["Pro feature", "500/batch", "Priority queue"],
    href: "/pricing",
    dark: true,
  },
];

export function ToolsSection() {
  return (
    <section id="tools" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
      <div className="mb-12">
        <p className="section-tag">Core Tools</p>
        <h2 className="section-title mb-4">Everything you need, in one toolkit.</h2>
        <p className="section-sub">Six professional tools powered by AI. Free to use — no signup required.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className={`group relative card-hover block no-underline p-7 rounded-2xl border ${
              tool.dark ? "bg-ink border-ink" : "bg-white border-surface-3"
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 rounded-t-2xl" />

            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 text-[22px] ${tool.color}`}>
              {tool.emoji}
            </div>

            <h3 className={`font-semibold text-[17px] mb-2 ${tool.dark ? "text-white" : "text-ink"}`}>
              {tool.title}
            </h3>
            <p className={`text-[14px] leading-relaxed mb-4 ${tool.dark ? "text-white/60" : "text-ink-3"}`}>
              {tool.desc}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {tool.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-[12px] font-medium px-2.5 py-1 rounded ${
                    tool.dark ? "bg-white/10 text-white/70" : "bg-surface-2 text-ink-2"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className={`mt-4 flex items-center gap-1 text-[13px] font-medium ${tool.dark ? "text-white/60" : "text-accent"}`}>
              Try it free <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

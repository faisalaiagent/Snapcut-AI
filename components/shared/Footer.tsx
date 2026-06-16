import Link from "next/link";
import { Scissors } from "lucide-react";

const FOOTER_LINKS = {
  Tools: [
    { label: "Background Remover", href: "/tools/background-remover" },
    { label: "White Background",   href: "/tools/white-background" },
    { label: "Passport Photo",     href: "/tools/passport-photo" },
    { label: "LinkedIn Photo",     href: "/tools/linkedin-photo" },
    { label: "Instagram DP",       href: "/tools/instagram-dp" },
  ],
  Company: [
    { label: "About",    href: "/about" },
    { label: "Pricing",  href: "/pricing" },
    { label: "Contact",  href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy",   href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-ink py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 no-underline mb-5">
              <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
                <Scissors className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[15px] font-semibold text-white tracking-tight">SnapCut AI</span>
            </Link>
            <p className="text-[14px] text-white/50 leading-relaxed max-w-[260px]">
              Professional AI image editing for everyone. Remove backgrounds, resize photos, and
              create perfect social media images in seconds.
            </p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-[12px] font-semibold tracking-widest uppercase text-white mb-5">{group}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-white/50 hover:text-white transition-colors no-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-white/30">
          <span>© {new Date().getFullYear()} SnapCut AI · Shah Faisal Tech. All rights reserved.</span>
          <div className="flex gap-6">
            <a
              href="https://x.com/shahfaisalai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors"
            >
              Twitter
            </a>
            <a
              href="https://www.linkedin.com/in/shah-faisal-aiagent"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

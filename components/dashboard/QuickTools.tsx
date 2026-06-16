import Link from "next/link";
import { Scissors, ShoppingBag, CreditCard, Linkedin, Instagram, ArrowRight } from "lucide-react";
import { TOOL_LABELS } from "@/utils/format";
import { formatDate } from "@/utils/format";

const TOOLS = [
  { href: "/tools/background-remover", label: "Background Remover", icon: Scissors,     color: "bg-accent-light text-accent" },
  { href: "/tools/white-background",   label: "White Background",   icon: ShoppingBag,  color: "bg-[#e6f0fa] text-[#185fa5]" },
  { href: "/tools/passport-photo",     label: "Passport Photo",     icon: CreditCard,   color: "bg-gold-light text-gold" },
  { href: "/tools/linkedin-photo",     label: "LinkedIn Photo",     icon: Linkedin,     color: "bg-[#f0ecfa] text-[#5b21b6]" },
  { href: "/tools/instagram-dp",       label: "Instagram DP",       icon: Instagram,    color: "bg-[#faeee8] text-[#c2410c]" },
];

export function QuickTools() {
  return (
    <div>
      <h2 className="text-[16px] font-semibold text-ink mb-4">Quick access</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {TOOLS.map(({ href, label, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="card card-hover flex flex-col items-center text-center gap-3 py-5 no-underline"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[13px] font-medium text-ink leading-tight">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

interface RecentImagesProps {
  images: {
    id: string;
    original_url: string;
    processed_url: string | null;
    tool_used: string;
    created_at: string;
  }[];
}

export function RecentImages({ images }: RecentImagesProps) {
  if (!images.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-semibold text-ink">Recent images</h2>
        <Link href="/projects" className="text-[13px] text-accent hover:underline flex items-center gap-1 no-underline">
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {images.map((img) => (
          <div key={img.id} className="card p-2 space-y-2">
            <div className="aspect-square rounded-lg overflow-hidden bg-surface-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.processed_url ?? img.original_url}
                alt="Processed"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[11px] text-ink-4 text-center leading-tight">
              {TOOL_LABELS[img.tool_used] ?? img.tool_used}
            </p>
            <p className="text-[10px] text-ink-4 text-center">{formatDate(img.created_at)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

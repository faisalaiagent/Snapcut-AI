"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Scissors, ShoppingBag, CreditCard,
  Image, Linkedin, Instagram, Settings, Folder, Scissors as Logo
} from "lucide-react";
import { cn } from "@/utils/cn";
import type { User } from "next-auth";

const TOOLS = [
  { href: "/tools/background-remover", label: "Background Remover", icon: Scissors },
  { href: "/tools/white-background",   label: "White Background",   icon: ShoppingBag },
  { href: "/tools/passport-photo",     label: "Passport Photo",     icon: CreditCard },
  { href: "/tools/linkedin-photo",     label: "LinkedIn Photo",     icon: Linkedin },
  { href: "/tools/instagram-dp",       label: "Instagram DP",       icon: Instagram },
];

const NAV = [
  { href: "/dashboard",  label: "Overview",   icon: LayoutDashboard },
  { href: "/projects",   label: "My Projects",icon: Folder },
  { href: "/settings",   label: "Settings",   icon: Settings },
];

interface DashboardSidebarProps {
  user: User & { plan?: string };
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 flex-shrink-0 bg-white border-r border-surface-3 min-h-screen">
      {/* Logo */}
      <div className="px-5 h-[60px] flex items-center border-b border-surface-3">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
            <Logo className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[14px] font-semibold text-ink tracking-tight">SnapCut AI</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {/* Main nav */}
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium no-underline transition-all duration-150",
              pathname === href
                ? "bg-accent text-white"
                : "text-ink-2 hover:bg-surface-2 hover:text-ink"
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        ))}

        {/* Divider + Tools */}
        <div className="pt-4 pb-2">
          <p className="px-3 text-[11px] font-semibold tracking-widest uppercase text-ink-4">Tools</p>
        </div>
        {TOOLS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium no-underline transition-all duration-150",
              pathname.includes(href)
                ? "bg-accent-light text-accent-2"
                : "text-ink-3 hover:bg-surface-2 hover:text-ink"
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Plan badge */}
      <div className="px-4 py-4 border-t border-surface-3">
        <div className={cn(
          "rounded-xl px-3 py-2.5 text-[12px]",
          user.plan === "pro" || user.plan === "business"
            ? "bg-accent-light"
            : "bg-surface-2"
        )}>
          <p className="font-semibold text-ink capitalize">{user.plan ?? "Free"} plan</p>
          {(!user.plan || user.plan === "free") && (
            <Link href="/pricing" className="text-accent text-[11px] font-medium no-underline hover:underline">
              Upgrade to Pro →
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}

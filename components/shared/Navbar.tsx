"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Menu, X, Scissors } from "lucide-react";
import { cn } from "@/utils/cn";

const NAV_LINKS = [
  { href: "/#tools",   label: "Tools" },
  { href: "/pricing",  label: "Pricing" },
  { href: "/about",    label: "About" },
  { href: "/contact",  label: "Contact" },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoading = status === "loading";

  return (
    <header className="sticky top-0 z-50 bg-[rgba(250,249,247,0.92)] backdrop-blur-md border-b border-surface-3">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-[60px] flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
            <Scissors className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-semibold text-ink tracking-tight">
            SnapCut AI
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink-3 px-3 py-2 rounded-lg hover:bg-surface-2 hover:text-ink transition-all duration-150 no-underline"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          {isLoading ? (
            /* Skeleton while session loads */
            <div className="w-24 h-8 bg-surface-2 rounded-lg animate-pulse" />
          ) : session ? (
            <Link
              href="/dashboard"
              className="btn-primary text-sm px-4 py-2 rounded-lg"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-ink-3 px-3 py-2 rounded-lg hover:bg-surface-2 hover:text-ink transition-all no-underline"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="btn-primary text-sm px-4 py-2 rounded-lg"
              >
                Get started free
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-surface-2 transition-all"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen
            ? <X className="w-5 h-5 text-ink" />
            : <Menu className="w-5 h-5 text-ink" />
          }
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-surface-3 bg-[rgba(250,249,247,0.98)] px-4 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink-3 px-3 py-3 rounded-lg hover:bg-surface-2 hover:text-ink no-underline transition-all"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-surface-3 mt-2 flex flex-col gap-2">
            {session ? (
              <Link
                href="/dashboard"
                className="btn-primary justify-center"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn-secondary justify-center"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="btn-primary justify-center"
                  onClick={() => setMobileOpen(false)}
                >
                  Get started free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

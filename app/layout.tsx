import type { Metadata, Viewport } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/Toaster";
import { Providers } from "@/components/shared/Providers";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "SnapCut AI – Background Remover & Photo Resizer",
    template: "%s | SnapCut AI",
  },
  description:
    "Remove image backgrounds instantly with AI. Resize passport photos for 50+ countries, create white product backgrounds for Amazon & eBay, and optimize LinkedIn & Instagram photos.",
  keywords: [
    "background remover",
    "remove background online",
    "passport photo maker",
    "white background generator",
    "LinkedIn photo editor",
    "Instagram DP maker",
    "product photo editor",
    "ecommerce photo background",
  ],
  authors: [{ name: "SnapCut AI" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SnapCut AI",
    images: [{ url: "/og/default.png", width: 1200, height: 630, alt: "SnapCut AI" }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@snapcutai",
    images: ["/og/default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0e0d0c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <body className="antialiased bg-surface text-ink font-sans">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

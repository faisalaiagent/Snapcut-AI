"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
  size: string;
  dimensions: string;
}

export const COUNTRIES: CountryOption[] = [
  { code: "usa",       name: "United States", flag: "🇺🇸", size: "2×2 in",   dimensions: "600×600 px" },
  { code: "uk",        name: "United Kingdom",flag: "🇬🇧", size: "35×45 mm", dimensions: "413×531 px" },
  { code: "canada",    name: "Canada",        flag: "🇨🇦", size: "50×70 mm", dimensions: "590×826 px" },
  { code: "australia", name: "Australia",     flag: "🇦🇺", size: "35×45 mm", dimensions: "413×531 px" },
  { code: "india",     name: "India",         flag: "🇮🇳", size: "35×45 mm", dimensions: "354×472 px" },
  { code: "pakistan",  name: "Pakistan",      flag: "🇵🇰", size: "35×45 mm", dimensions: "413×531 px" },
  { code: "uae",       name: "UAE",           flag: "🇦🇪", size: "40×60 mm", dimensions: "472×709 px" },
];

interface CountrySelectorProps {
  value: string;
  onChange: (code: string) => void;
  className?: string;
}

export function CountrySelector({ value, onChange, className }: CountrySelectorProps) {
  const [open, setOpen] = useState(false);
  const selected = COUNTRIES.find((c) => c.code === value) ?? COUNTRIES[0];

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-surface-3 bg-white hover:border-accent transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent/20"
      >
        <span className="flex items-center gap-3">
          <span className="text-2xl">{selected.flag}</span>
          <span className="text-left">
            <span className="block text-[15px] font-medium text-ink">{selected.name}</span>
            <span className="block text-[12px] text-ink-4">{selected.size} — {selected.dimensions}</span>
          </span>
        </span>
        <ChevronDown className={cn("w-4 h-4 text-ink-4 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-surface-3 rounded-xl shadow-card overflow-hidden">
          {COUNTRIES.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => { onChange(country.code); setOpen(false); }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-2 transition-all duration-100",
                country.code === value && "bg-accent-light"
              )}
            >
              <span className="text-2xl">{country.flag}</span>
              <span>
                <span className="block text-[14px] font-medium text-ink">{country.name}</span>
                <span className="block text-[12px] text-ink-4">{country.size} — {country.dimensions}</span>
              </span>
              {country.code === value && (
                <span className="ml-auto text-accent text-[12px] font-semibold">Selected</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

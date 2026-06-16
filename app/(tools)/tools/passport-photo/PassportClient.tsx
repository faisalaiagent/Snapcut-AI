"use client";

import { useState, useCallback } from "react";
import { Upload, Download, RefreshCw, Loader2, AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

const COUNTRIES = [
  { code: "usa",       name: "United States", flag: "🇺🇸", size: "2×2 in (600×600px)" },
  { code: "uk",        name: "United Kingdom",flag: "🇬🇧", size: "35×45mm (413×531px)" },
  { code: "canada",    name: "Canada",        flag: "🇨🇦", size: "50×70mm (590×826px)" },
  { code: "australia", name: "Australia",     flag: "🇦🇺", size: "35×45mm (413×531px)" },
  { code: "india",     name: "India",         flag: "🇮🇳", size: "35×45mm (354×472px)" },
  { code: "pakistan",  name: "Pakistan",      flag: "🇵🇰", size: "35×45mm (413×531px)" },
  { code: "uae",       name: "UAE",           flag: "🇦🇪", size: "40×60mm (472×709px)" },
];

export function PassportClient() {
  const [country, setCountry] = useState("pakistan");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selected = COUNTRIES.find((c) => c.code === country)!;

  const handleFile = useCallback(async (file: File) => {
    setError(null); setResultUrl(null);
    setPreviewUrl(URL.createObjectURL(file));
    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("country", country);
      const res = await fetch("/api/process/passport-public", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Processing failed");
      setResultUrl(json.data.processedUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally { setProcessing(false); }
  }, [country]);

  const handleReset = () => { setPreviewUrl(null); setResultUrl(null); setError(null); };

  const handleDownload = async () => {
    if (!resultUrl) return;
    const res = await fetch(resultUrl); const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `passport-${country}.jpg`; a.click();
    URL.revokeObjectURL(url);
  };

  if (processing) return (
    <div className="card p-12 text-center">
      <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto mb-4" />
      <p className="text-[15px] font-medium text-ink">Resizing for {selected.name}…</p>
    </div>
  );

  if (resultUrl) return (
    <div className="space-y-4">
      <div className="bg-accent-light border border-[#b3dcc9] rounded-xl px-4 py-3 text-[14px] text-accent-2">
        ✓ Resized to {selected.name} specifications ({selected.size})
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-surface-2 aspect-square flex items-center justify-center relative overflow-hidden">
          <span className="absolute top-2 left-2 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-md">Original</span>
          {previewUrl && <img src={previewUrl} alt="Original" className="max-h-full max-w-full object-contain" />}
        </div>
        <div className="rounded-2xl bg-white border border-surface-3 aspect-square flex items-center justify-center relative overflow-hidden">
          <span className="absolute top-2 left-2 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-md">Passport</span>
          <img src={resultUrl} alt="Passport" className="max-h-full max-w-full object-contain" />
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={handleDownload} className="btn-primary flex-1 justify-center gap-2"><Download className="w-4 h-4" />Download JPG</button>
        <button onClick={handleReset} className="btn-secondary px-4 gap-2"><RefreshCw className="w-4 h-4" />New Photo</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Country selector */}
      <div>
        <label className="label-base">Select country</label>
        <div className="relative">
          <button type="button" onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-surface-3 bg-white hover:border-accent transition-all">
            <span className="flex items-center gap-3">
              <span className="text-2xl">{selected.flag}</span>
              <span>
                <span className="block text-[15px] font-medium text-ink">{selected.name}</span>
                <span className="block text-[12px] text-ink-4">{selected.size}</span>
              </span>
            </span>
            <ChevronDown className={cn("w-4 h-4 text-ink-4 transition-transform", dropdownOpen && "rotate-180")} />
          </button>
          {dropdownOpen && (
            <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-surface-3 rounded-xl shadow-card overflow-hidden">
              {COUNTRIES.map((c) => (
                <button key={c.code} type="button"
                  onClick={() => { setCountry(c.code); setDropdownOpen(false); }}
                  className={cn("w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-2 transition-all", c.code === country && "bg-accent-light")}>
                  <span className="text-2xl">{c.flag}</span>
                  <span>
                    <span className="block text-[14px] font-medium text-ink">{c.name}</span>
                    <span className="block text-[12px] text-ink-4">{c.size}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload */}
      <label
        className={cn("relative block cursor-pointer border-2 border-dashed border-surface-3 rounded-3xl bg-white hover:bg-accent-light hover:border-accent transition-all duration-200 p-10 text-center", dragging && "bg-accent-light border-accent")}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
      >
        <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        <div className="w-12 h-12 bg-surface-2 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <Upload className="w-5 h-5 text-ink-2" strokeWidth={1.8} />
        </div>
        <p className="text-[16px] font-medium text-ink mb-2">Upload your photo</p>
        <p className="text-[13px] text-ink-4">Front-facing portrait recommended · No signup needed</p>
      </label>

      {error && <div className="flex items-center gap-2 text-red-600 text-[13px] bg-red-50 border border-red-200 rounded-xl px-4 py-3"><AlertCircle className="w-4 h-4 flex-shrink-0" />{error}</div>}
    </div>
  );
}

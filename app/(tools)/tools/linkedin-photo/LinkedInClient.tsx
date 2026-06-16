"use client";

import { useState, useCallback } from "react";
import { Upload, Download, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";

export function LinkedInClient() {
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null); setResultUrl(null);
    setPreviewUrl(URL.createObjectURL(file));
    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/process/linkedin-public", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Processing failed");
      setResultUrl(json.data.processedUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally { setProcessing(false); }
  }, []);

  const handleReset = () => { setPreviewUrl(null); setResultUrl(null); setError(null); };

  const handleDownload = async () => {
    if (!resultUrl) return;
    const res = await fetch(resultUrl); const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "linkedin-photo.jpg"; a.click();
    URL.revokeObjectURL(url);
  };

  if (processing) return (
    <div className="card p-12 text-center">
      <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto mb-4" />
      <p className="text-[15px] font-medium text-ink">Optimizing for LinkedIn…</p>
    </div>
  );

  if (resultUrl) return (
    <div className="space-y-4">
      <div className="flex items-center gap-5">
        <div>
          <p className="text-[12px] text-ink-4 mb-2 text-center">Preview</p>
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-surface-3 bg-surface-2">
            <img src={resultUrl} alt="LinkedIn preview" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="flex-1 bg-accent-light border border-[#b3dcc9] rounded-xl px-4 py-3 text-[14px] text-accent-2">
          ✓ Optimized to 400×400px — ready to upload to LinkedIn
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {previewUrl && <div className="rounded-2xl bg-surface-2 aspect-square flex items-center justify-center overflow-hidden relative">
          <span className="absolute top-2 left-2 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-md">Before</span>
          <img src={previewUrl} alt="Original" className="max-h-full max-w-full object-contain" />
        </div>}
        <div className="rounded-2xl bg-white border border-surface-3 aspect-square flex items-center justify-center overflow-hidden relative">
          <span className="absolute top-2 left-2 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-md">After</span>
          <img src={resultUrl} alt="Result" className="max-h-full max-w-full object-contain" />
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={handleDownload} className="btn-primary flex-1 justify-center gap-2"><Download className="w-4 h-4" />Download JPG</button>
        <button onClick={handleReset} className="btn-secondary px-4 gap-2"><RefreshCw className="w-4 h-4" />New Photo</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <label
        className={cn("relative block cursor-pointer border-2 border-dashed border-surface-3 rounded-3xl bg-white hover:bg-accent-light hover:border-accent transition-all duration-200 p-12 text-center", dragging && "bg-accent-light border-accent")}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
      >
        <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        <div className="w-14 h-14 bg-surface-2 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <Upload className="w-6 h-6 text-ink-2" strokeWidth={1.8} />
        </div>
        <p className="text-[17px] font-medium text-ink mb-2">Upload your headshot</p>
        <p className="text-[14px] text-ink-4">Portrait or square photo recommended · No signup needed</p>
      </label>
      {error && <div className="flex items-center gap-2 text-red-600 text-[13px] bg-red-50 border border-red-200 rounded-xl px-4 py-3"><AlertCircle className="w-4 h-4 flex-shrink-0" />{error}</div>}
    </div>
  );
}

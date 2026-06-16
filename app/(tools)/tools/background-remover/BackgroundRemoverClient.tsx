"use client";

import { useState, useCallback } from "react";
import { Upload, ImageIcon, X, CheckCircle, AlertCircle, Download, RefreshCw, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

export function BackgroundRemoverClient() {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sliderPos, setSliderPos] = useState(50);

  const handleFile = useCallback(async (file: File) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Unsupported format. Use JPG, PNG, or WEBP.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("File must be under 20 MB.");
      return;
    }

    setError(null);
    setResultUrl(null);
    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);

    try {
      // Send directly to our API route — no login needed
      const formData = new FormData();
      formData.append("image", file);

      setUploading(false);
      setProcessing(true);

      const res = await fetch("/api/process/remove-bg-public", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "Processing failed");
      }

      setResultUrl(json.data.processedUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setUploading(false);
      setProcessing(false);
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDownload = async () => {
    if (!resultUrl) return;
    try {
      const res = await fetch(resultUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "snapcut-no-background.png";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(resultUrl, "_blank");
    }
  };

  const handleReset = () => {
    setPreviewUrl(null);
    setResultUrl(null);
    setError(null);
    setUploading(false);
    setProcessing(false);
  };

  // Show result with before/after slider
  if (resultUrl && previewUrl) {
    return (
      <div className="space-y-4">
        <div
          className="relative rounded-2xl overflow-hidden cursor-ew-resize select-none"
          style={{ aspectRatio: "4/3" }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
            setSliderPos(pos);
          }}
        >
          {/* After — transparent result */}
          <div className="absolute inset-0 checkered">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resultUrl} alt="Result" className="w-full h-full object-contain" draggable={false} />
          </div>

          {/* Before — original */}
          <div
            className="absolute inset-0 overflow-hidden bg-surface-2"
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Original" className="w-full h-full object-contain" draggable={false} />
          </div>

          {/* Labels */}
          <span className="absolute top-3 left-3 bg-black/60 text-white text-[11px] font-medium px-2.5 py-1 rounded-md backdrop-blur-sm">Before</span>
          <span className="absolute top-3 right-3 bg-black/60 text-white text-[11px] font-medium px-2.5 py-1 rounded-md backdrop-blur-sm">After</span>

          {/* Slider */}
          <div
            className="absolute top-0 bottom-0 flex items-center justify-center pointer-events-none"
            style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
          >
            <div className="w-0.5 h-full bg-white/80" />
            <div className="absolute w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border border-surface-3 text-[10px] text-ink-3">⟺</div>
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[11px] px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none">
            Drag to compare
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handleDownload} className="btn-primary flex-1 justify-center gap-2">
            <Download className="w-4 h-4" />
            Download PNG
          </button>
          <button onClick={handleReset} className="btn-secondary px-4 gap-2">
            <RefreshCw className="w-4 h-4" />
            New Image
          </button>
        </div>
      </div>
    );
  }

  // Show processing state
  if (uploading || processing) {
    return (
      <div className="card p-12 text-center">
        <div className="w-14 h-14 bg-surface-2 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-accent animate-spin" />
        </div>
        <p className="text-[15px] font-medium text-ink mb-2">
          {uploading ? "Uploading image…" : "Removing background with AI…"}
        </p>
        <p className="text-[13px] text-ink-4">Usually takes 2–4 seconds</p>
      </div>
    );
  }

  // Show upload zone
  return (
    <div className="space-y-4">
      <label
        className={cn(
          "relative block cursor-pointer border-2 border-dashed border-surface-3 rounded-3xl",
          "bg-white hover:bg-accent-light hover:border-accent transition-all duration-200 p-12 text-center",
          dragging && "bg-accent-light border-accent scale-[1.01]"
        )}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onInputChange} />
        <div className="w-14 h-14 bg-surface-2 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <Upload className="w-6 h-6 text-ink-2" strokeWidth={1.8} />
        </div>
        <p className="text-[17px] font-medium text-ink mb-2">Drop your image here, or click to upload</p>
        <p className="text-[14px] text-ink-4 mb-5">Supports JPG, PNG, WEBP up to 20MB · No signup needed</p>
        <div className="flex justify-center gap-2 flex-wrap">
          {["JPG", "PNG", "WEBP", "Free", "Instant"].map((f) => (
            <span key={f} className="bg-surface-2 text-ink-3 rounded px-2.5 py-1 text-[12px] font-medium">{f}</span>
          ))}
        </div>
      </label>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-[13px] bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}

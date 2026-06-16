"use client";

import { useState, useRef, useCallback } from "react";
import { Download, RefreshCw } from "lucide-react";
import { cn } from "@/utils/cn";

interface ImagePreviewProps {
  originalUrl: string;
  processedUrl: string;
  onReset?: () => void;
  downloadFilename?: string;
  showCheckered?: boolean; // for transparent PNG results
}

export function ImagePreview({
  originalUrl,
  processedUrl,
  onReset,
  downloadFilename = "snapcut-result.png",
  showCheckered = false,
}: ImagePreviewProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderPos(pos);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragging) updateSlider(e.clientX);
  }, [dragging, updateSlider]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    updateSlider(e.touches[0].clientX);
  }, [updateSlider]);

  const handleDownload = async () => {
    try {
      const res = await fetch(processedUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadFilename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(processedUrl, "_blank");
    }
  };

  return (
    <div className="space-y-4">
      {/* Comparison slider */}
      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden cursor-ew-resize select-none"
        style={{ aspectRatio: "4/3" }}
        onMouseDown={() => setDragging(true)}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* Processed (right side - full width) */}
        <div
          className={cn(
            "absolute inset-0",
            showCheckered ? "checkered" : "bg-surface-2"
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={processedUrl}
            alt="Processed"
            className="w-full h-full object-contain"
            draggable={false}
          />
        </div>

        {/* Original (left side - clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <div className="absolute inset-0 bg-surface-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={originalUrl}
              alt="Original"
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>
        </div>

        {/* Labels */}
        <span className="absolute top-3 left-3 bg-black/60 text-white text-[11px] font-medium px-2.5 py-1 rounded-md backdrop-blur-sm">
          Before
        </span>
        <span className="absolute top-3 right-3 bg-black/60 text-white text-[11px] font-medium px-2.5 py-1 rounded-md backdrop-blur-sm">
          After
        </span>

        {/* Slider handle */}
        <div
          className="absolute top-0 bottom-0 flex items-center justify-center"
          style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
        >
          <div className="w-0.5 h-full bg-white/80" />
          <div className="absolute w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-ew-resize border border-surface-3">
            <span className="text-[10px] text-ink-3 font-medium select-none">⟺</span>
          </div>
        </div>

        {/* Drag hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[11px] px-2.5 py-1 rounded-full backdrop-blur-sm pointer-events-none">
          Drag to compare
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          className="btn-primary flex-1 justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Result
        </button>
        {onReset && (
          <button
            onClick={onReset}
            className="btn-secondary px-4 gap-2"
            title="Start over"
          >
            <RefreshCw className="w-4 h-4" />
            New Image
          </button>
        )}
      </div>
    </div>
  );
}

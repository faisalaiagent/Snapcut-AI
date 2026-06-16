"use client";

import { useCallback, useState } from "react";
import { Upload, ImageIcon, X, CheckCircle, AlertCircle } from "lucide-react";
import { useUpload } from "@/hooks/useUpload";
import { cn } from "@/utils/cn";
import type { ToolType } from "@/types";

interface UploadZoneProps {
  toolUsed: ToolType;
  onUploadComplete: (imageId: string) => void;
  label?: string;
  sublabel?: string;
  className?: string;
}

export function UploadZone({
  toolUsed,
  onUploadComplete,
  label = "Drop your image here, or click to upload",
  sublabel = "Supports JPG, PNG, WEBP, HEIC up to 20MB",
  className,
}: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const { uploading, progress, imageId, previewUrl, error, upload, reset } =
    useUpload(toolUsed);

  if (imageId) {
    onUploadComplete(imageId);
  }

  const handleFile = useCallback(
    (file: File) => {
      const allowed = ["image/jpeg", "image/png", "image/webp", "image/heic"];
      if (!allowed.includes(file.type)) {
        alert("Unsupported format. Use JPG, PNG, WEBP, or HEIC.");
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        alert("File must be under 20 MB.");
        return;
      }
      upload(file);
    },
    [upload]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (uploading) {
    return (
      <div className={cn("card p-10 text-center", className)}>
        <div className="w-14 h-14 bg-surface-2 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-ink-3 animate-pulse" />
        </div>
        <p className="text-[15px] font-medium text-ink mb-4">
          Uploading your image…
        </p>
        <div className="w-full bg-surface-2 rounded-full h-2 mb-2">
          <div
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[13px] text-ink-4">{progress}%</p>
      </div>
    );
  }

  if (previewUrl && !uploading) {
    return (
      <div className={cn("card p-6", className)}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-accent">
            <CheckCircle className="w-5 h-5" />
            <span className="text-[14px] font-medium">Uploaded successfully</span>
          </div>
          <button
            onClick={reset}
            className="p-1.5 rounded-lg hover:bg-surface-2 text-ink-4 hover:text-ink transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="rounded-xl overflow-hidden bg-surface-2 aspect-video flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Uploaded"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </div>
    );
  }

  return (
    <label
      className={cn(
        "relative block cursor-pointer",
        "border-2 border-dashed border-surface-3 rounded-3xl",
        "bg-white hover:bg-accent-light hover:border-accent",
        "transition-all duration-200 p-12 text-center",
        dragging && "bg-accent-light border-accent scale-[1.01]",
        className
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        className="sr-only"
        onChange={onInputChange}
      />

      <span className="absolute top-0 left-0 w-16 h-16 bg-accent-light rounded-3xl opacity-50 -translate-x-4 -translate-y-4 pointer-events-none" />
      <span className="absolute bottom-0 right-0 w-16 h-16 bg-accent-light rounded-3xl opacity-50 translate-x-4 translate-y-4 pointer-events-none" />

      <div className="w-14 h-14 bg-surface-2 rounded-2xl mx-auto mb-4 flex items-center justify-center relative z-10">
        <Upload className="w-6 h-6 text-ink-2" strokeWidth={1.8} />
      </div>

      <p className="text-[17px] font-medium text-ink mb-2 relative z-10">
        {label}
      </p>
      <p className="text-[14px] text-ink-4 mb-5 relative z-10">{sublabel}</p>

      <div className="flex justify-center gap-2 flex-wrap relative z-10">
        {["JPG", "PNG", "WEBP", "HEIC", "up to 20 MB"].map((f) => (
          <span
            key={f}
            className="bg-surface-2 text-ink-3 rounded px-2.5 py-1 text-[12px] font-medium"
          >
            {f}
          </span>
        ))}
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-600 text-[13px] justify-center relative z-10">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
    </label>
  );
}

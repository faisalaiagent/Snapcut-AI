"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { UploadZone } from "@/components/tools/UploadZone";
import { ImagePreview } from "@/components/tools/ImagePreview";
import { ProcessingStatus } from "@/components/tools/ProcessingStatus";
import { actionRemoveBackground } from "@/actions/process-image";
import type { ProcessResult } from "@/types";

export function BackgroundRemoverClient() {
  const searchParams = useSearchParams();
  const initialImageId = searchParams.get("imageId");

  const [imageId, setImageId] = useState<string | null>(initialImageId);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUploadComplete = async (uploadedImageId: string) => {
    setImageId(uploadedImageId);
    setError(null);
    setProcessing(true);

    try {
      const res = await actionRemoveBackground(uploadedImageId);
      setOriginalUrl(res.originalUrl);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setImageId(null);
    setOriginalUrl(null);
    setResult(null);
    setError(null);
    setProcessing(false);
  };

  if (result && originalUrl) {
    return (
      <ImagePreview
        originalUrl={originalUrl}
        processedUrl={result.processedUrl}
        onReset={handleReset}
        downloadFilename="snapcut-no-background.png"
        showCheckered
      />
    );
  }

  return (
    <div className="space-y-4">
      {!processing && (
        <UploadZone
          toolUsed="background_remover"
          onUploadComplete={handleUploadComplete}
        />
      )}
      <ProcessingStatus processing={processing} error={error} />
    </div>
  );
}

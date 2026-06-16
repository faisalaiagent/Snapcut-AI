"use client";

import { useState } from "react";
import { UploadZone } from "@/components/tools/UploadZone";
import { ImagePreview } from "@/components/tools/ImagePreview";
import { ProcessingStatus } from "@/components/tools/ProcessingStatus";
import { actionWhiteBackground } from "@/actions/process-image";
import type { ProcessResult } from "@/types";

export function WhiteBackgroundClient() {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUploadComplete = async (imageId: string) => {
    setError(null);
    setProcessing(true);

    try {
      const res = await actionWhiteBackground(imageId);
      setOriginalUrl(res.originalUrl);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed.");
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setOriginalUrl(null);
    setError(null);
    setProcessing(false);
  };

  if (result && originalUrl) {
    return (
      <ImagePreview
        originalUrl={originalUrl}
        processedUrl={result.processedUrl}
        onReset={handleReset}
        downloadFilename="snapcut-white-bg.jpg"
        showCheckered={false}
      />
    );
  }

  return (
    <div className="space-y-4">
      {!processing && (
        <UploadZone
          toolUsed="white_background"
          onUploadComplete={handleUploadComplete}
          label="Upload your product photo"
          sublabel="We'll remove the background and add a pure white background automatically"
        />
      )}
      <ProcessingStatus processing={processing} error={error} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { UploadZone } from "@/components/tools/UploadZone";
import { ImagePreview } from "@/components/tools/ImagePreview";
import { ProcessingStatus } from "@/components/tools/ProcessingStatus";
import { actionLinkedInPhoto } from "@/actions/process-image";
import type { ProcessResult } from "@/types";

export function LinkedInPhotoClient() {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (imageId: string) => {
    setError(null);
    setProcessing(true);
    try {
      const res = await actionLinkedInPhoto(imageId);
      setOriginalUrl(res.originalUrl);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed.");
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => { setResult(null); setOriginalUrl(null); setError(null); setProcessing(false); };

  if (result && originalUrl) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4 items-start">
          {/* Circular preview */}
          <div className="flex-shrink-0">
            <p className="text-[12px] text-ink-4 mb-2 text-center">Preview</p>
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-surface-3 bg-surface-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.processedUrl} alt="LinkedIn preview" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-accent-light border border-[#b3dcc9] rounded-xl px-4 py-3 text-[14px] text-accent-2">
              ✓ Optimised to 400×400px — ready to upload to LinkedIn
            </div>
          </div>
        </div>
        <ImagePreview
          originalUrl={originalUrl}
          processedUrl={result.processedUrl}
          onReset={handleReset}
          downloadFilename="linkedin-profile-photo.jpg"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!processing && (
        <UploadZone
          toolUsed="linkedin_photo"
          onUploadComplete={handleUpload}
          label="Upload your headshot or photo"
          sublabel="Portrait or square photo recommended for best results"
        />
      )}
      <ProcessingStatus processing={processing} error={error} />
    </div>
  );
}

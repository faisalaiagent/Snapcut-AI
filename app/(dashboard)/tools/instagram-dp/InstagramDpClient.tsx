"use client";

import { useState } from "react";
import { UploadZone } from "@/components/tools/UploadZone";
import { ImagePreview } from "@/components/tools/ImagePreview";
import { ProcessingStatus } from "@/components/tools/ProcessingStatus";
import { actionInstagramDp } from "@/actions/process-image";
import type { ProcessResult } from "@/types";

export function InstagramDpClient() {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (imageId: string) => {
    setError(null);
    setProcessing(true);
    try {
      const res = await actionInstagramDp(imageId);
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
        {/* Circular IG preview */}
        <div className="flex items-center gap-5">
          <div>
            <p className="text-[12px] text-ink-4 mb-2 text-center">Feed</p>
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#e1306c]/30 bg-surface-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.processedUrl} alt="Instagram preview" className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <p className="text-[12px] text-ink-4 mb-2 text-center">Stories</p>
            <div className="w-16 h-16 rounded-full overflow-hidden border-[3px] border-[#e1306c] bg-surface-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.processedUrl} alt="Instagram stories preview" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex-1 bg-accent-light border border-[#b3dcc9] rounded-xl px-4 py-3 text-[14px] text-accent-2">
            ✓ Optimised to 320×320px — ready to upload to Instagram
          </div>
        </div>
        <ImagePreview
          originalUrl={originalUrl}
          processedUrl={result.processedUrl}
          onReset={handleReset}
          downloadFilename="instagram-dp.jpg"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!processing && (
        <UploadZone
          toolUsed="instagram_dp"
          onUploadComplete={handleUpload}
          label="Upload your photo"
          sublabel="Square or portrait photos work best for Instagram DP"
        />
      )}
      <ProcessingStatus processing={processing} error={error} />
    </div>
  );
}

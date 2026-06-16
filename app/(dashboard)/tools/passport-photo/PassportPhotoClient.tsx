"use client";

import { useState } from "react";
import { UploadZone } from "@/components/tools/UploadZone";
import { ImagePreview } from "@/components/tools/ImagePreview";
import { ProcessingStatus } from "@/components/tools/ProcessingStatus";
import { CountrySelector, COUNTRIES } from "@/components/tools/CountrySelector";
import { actionPassportPhoto } from "@/actions/process-image";
import type { ProcessResult } from "@/types";

export function PassportPhotoClient() {
  const [country, setCountry] = useState("pakistan");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selected = COUNTRIES.find((c) => c.code === country)!;

  const handleUploadComplete = async (imageId: string) => {
    setError(null);
    setProcessing(true);
    try {
      const res = await actionPassportPhoto(imageId, country);
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
      <div className="space-y-4">
        <div className="bg-accent-light border border-[#b3dcc9] rounded-xl px-4 py-3 text-[14px] text-accent-2">
          ✓ Resized to {selected.name} passport specifications ({selected.size} / {selected.dimensions})
        </div>
        <ImagePreview
          originalUrl={originalUrl}
          processedUrl={result.processedUrl}
          onReset={handleReset}
          downloadFilename={`passport-photo-${country}.jpg`}
          showCheckered={false}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Country selector */}
      <div>
        <label className="label-base">Select country / region</label>
        <CountrySelector value={country} onChange={setCountry} />
      </div>

      {/* Requirements info */}
      <div className="bg-surface-2 rounded-xl px-4 py-3 text-[13px] text-ink-3 space-y-1">
        <p className="font-medium text-ink-2">Requirements for {selected.name}:</p>
        <p>Size: {selected.size} ({selected.dimensions})</p>
        <p>Background: Plain white or off-white</p>
        <p>Face: Centred, eyes open, neutral expression</p>
        <p>Format: JPEG, 300 DPI</p>
      </div>

      {/* Upload */}
      {!processing && (
        <UploadZone
          toolUsed="passport_photo"
          onUploadComplete={handleUploadComplete}
          label="Upload your photo"
          sublabel="Front-facing portrait photo recommended. JPG, PNG or WEBP."
        />
      )}

      <ProcessingStatus processing={processing} error={error} />
    </div>
  );
}

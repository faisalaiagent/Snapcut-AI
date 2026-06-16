"use client";

import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";

interface ProcessingStatusProps {
  processing: boolean;
  error: string | null;
  successMessage?: string;
  className?: string;
}

export function ProcessingStatus({
  processing,
  error,
  successMessage = "Done! Your image is ready.",
  className,
}: ProcessingStatusProps) {
  if (!processing && !error) return null;

  return (
    <div className={cn("rounded-xl px-5 py-4 flex items-center gap-3", className, {
      "bg-surface-2 text-ink-2": processing,
      "bg-red-50 text-red-700": !!error,
    })}>
      {processing ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin flex-shrink-0 text-accent" />
          <div>
            <p className="text-[14px] font-medium">Processing your image…</p>
            <p className="text-[12px] text-ink-4 mt-0.5">This usually takes 2–5 seconds</p>
          </div>
        </>
      ) : error ? (
        <>
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
          <p className="text-[14px] font-medium">{error}</p>
        </>
      ) : null}
    </div>
  );
}

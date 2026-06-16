"use client";

import { useState, useCallback } from "react";
import type { ProcessResult } from "@/types";

interface ProcessingState {
  processing: boolean;
  result: ProcessResult | null;
  error: string | null;
}

export function useProcessing() {
  const [state, setState] = useState<ProcessingState>({
    processing: false,
    result: null,
    error: null,
  });

  const run = useCallback(
    async (action: (imageId: string, ...args: string[]) => Promise<ProcessResult>, imageId: string, ...args: string[]) => {
      setState({ processing: true, result: null, error: null });
      try {
        const result = await action(imageId, ...args);
        setState({ processing: false, result, error: null });
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Processing failed";
        setState({ processing: false, result: null, error: message });
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ processing: false, result: null, error: null });
  }, []);

  return { ...state, run, reset };
}

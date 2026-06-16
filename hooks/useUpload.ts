"use client";

import { useState, useCallback } from "react";
import { actionSaveUpload } from "@/actions/upload";
import type { ToolType } from "@/types";

interface UploadState {
  uploading: boolean;
  progress: number;
  imageId: string | null;
  previewUrl: string | null;
  error: string | null;
}

export function useUpload(toolUsed: ToolType) {
  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    imageId: null,
    previewUrl: null,
    error: null,
  });

  const reset = useCallback(() => {
    setState({ uploading: false, progress: 0, imageId: null, previewUrl: null, error: null });
  }, []);

  const upload = useCallback(
    async (file: File) => {
      setState({ uploading: true, progress: 0, imageId: null, previewUrl: URL.createObjectURL(file), error: null });

      try {
        // Step 1: Get Cloudinary signed params from our API
        const sigRes = await fetch("/api/upload/sign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folder: "snapcut/originals" }),
        });
        if (!sigRes.ok) throw new Error("Failed to get upload signature");
        const { signature, timestamp, apiKey, cloudName, folder } = await sigRes.json();

        // Step 2: Upload directly to Cloudinary
        const form = new FormData();
        form.append("file", file);
        form.append("folder", folder);
        form.append("timestamp", String(timestamp));
        form.append("api_key", apiKey);
        form.append("signature", signature);

        setState((s) => ({ ...s, progress: 20 }));

        const cdnRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: form }
        );
        if (!cdnRes.ok) throw new Error("Cloudinary upload failed");
        const cdnData = await cdnRes.json();

        setState((s) => ({ ...s, progress: 80 }));

        // Step 3: Save record in Supabase via Server Action
        const { imageId } = await actionSaveUpload({
          originalUrl: cdnData.secure_url,
          cloudinaryPublicId: cdnData.public_id,
          toolUsed,
          fileSizeBytes: file.size,
        });

        setState((s) => ({ ...s, uploading: false, progress: 100, imageId }));
      } catch (err) {
        setState((s) => ({
          ...s,
          uploading: false,
          error: err instanceof Error ? err.message : "Upload failed",
        }));
      }
    },
    [toolUsed]
  );

  return { ...state, upload, reset };
}

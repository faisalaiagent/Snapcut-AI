"use server";

import { auth } from "@/lib/auth";
import { saveImageRecord } from "@/lib/supabase";
import type { ToolType } from "@/types";

/** Called after the client has uploaded directly to Cloudinary.
 *  Saves the record into Supabase and returns the DB image ID.
 */
export async function actionSaveUpload(params: {
  originalUrl: string;
  cloudinaryPublicId: string;
  toolUsed: ToolType;
  fileSizeBytes?: number;
}): Promise<{ imageId: string }> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const record = await saveImageRecord({
    userId: session.user.id,
    originalUrl: params.originalUrl,
    cloudinaryOriginalId: params.cloudinaryPublicId,
    toolUsed: params.toolUsed,
    status: "pending",
    fileSizeBytes: params.fileSizeBytes,
  });

  return { imageId: record.id };
}

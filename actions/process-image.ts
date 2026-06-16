"use server";

import { auth } from "@/lib/auth";
import { supabaseAdmin, getDailyUsage, logUsage } from "@/lib/supabase";
import { removeBackground } from "@/lib/remove-bg";
import {
  applyWhiteBackground,
  processPassportPhoto,
  optimiseLinkedIn,
  optimiseInstagramDp,
  validateImageBuffer,
} from "@/lib/sharp-utils";
import { uploadBuffer } from "@/lib/cloudinary";
import { PLANS } from "@/lib/stripe";
import type { Plan, ProcessResult } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────

interface ImageRow {
  original_url: string;
  cloudinary_original_id: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────

async function checkUsageLimit(userId: string, plan: Plan): Promise<void> {
  const planDef = PLANS[plan];
  if (planDef.dailyLimit === Infinity) return;
  const used = await getDailyUsage(userId);
  if (used >= planDef.dailyLimit) {
    throw new Error(
      `Daily limit reached (${planDef.dailyLimit} edits/day on Free plan). Upgrade to Pro for unlimited edits.`
    );
  }
}

async function fetchImageBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch original image");
  return Buffer.from(await res.arrayBuffer());
}

async function getImageRow(
  imageId: string,
  userId: string
): Promise<ImageRow> {
  const { data, error } = await supabaseAdmin
    .from("images")
    .select("original_url, cloudinary_original_id")
    .eq("id", imageId)
    .eq("user_id", userId)
    .single();

  if (error || !data) throw new Error("Image not found");
  return data as ImageRow;
}

async function getSession() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  return {
    userId: session.user.id,
    plan: ((session.user as Record<string, unknown>).plan ?? "free") as Plan,
  };
}

// ─── Background Remover ───────────────────────────────────────────────────

export async function actionRemoveBackground(
  imageId: string
): Promise<ProcessResult> {
  const { userId, plan } = await getSession();
  await checkUsageLimit(userId, plan);

  const img = await getImageRow(imageId, userId);
  const inputBuffer = await fetchImageBuffer(img.original_url);
  await validateImageBuffer(inputBuffer);

  const { data: resultBuffer } = await removeBackground({
    imageBuffer: inputBuffer,
  });

  const upload = await uploadBuffer(resultBuffer, {
    folder: `snapcut/${userId}/processed`,
    tags: ["background_removed"],
  });

  await supabaseAdmin
    .from("images")
    .update({
      processed_url: upload.secureUrl,
      cloudinary_processed_id: upload.publicId,
      status: "completed",
    })
    .eq("id", imageId);

  await logUsage(userId, "process", "background_remover", imageId);

  return {
    imageId,
    originalUrl: img.original_url,
    processedUrl: upload.secureUrl,
    toolUsed: "background_remover",
  };
}

// ─── White Background ─────────────────────────────────────────────────────

export async function actionWhiteBackground(
  imageId: string
): Promise<ProcessResult> {
  const { userId, plan } = await getSession();
  await checkUsageLimit(userId, plan);

  const img = await getImageRow(imageId, userId);
  const inputBuffer = await fetchImageBuffer(img.original_url);

  const { data: noBgBuffer } = await removeBackground({
    imageBuffer: inputBuffer,
  });
  const resultBuffer = await applyWhiteBackground(noBgBuffer);

  const upload = await uploadBuffer(resultBuffer, {
    folder: `snapcut/${userId}/processed`,
    tags: ["white_background"],
  });

  await supabaseAdmin
    .from("images")
    .update({
      processed_url: upload.secureUrl,
      cloudinary_processed_id: upload.publicId,
      status: "completed",
    })
    .eq("id", imageId);

  await logUsage(userId, "process", "white_background", imageId);

  return {
    imageId,
    originalUrl: img.original_url,
    processedUrl: upload.secureUrl,
    toolUsed: "white_background",
  };
}

// ─── Passport Photo ───────────────────────────────────────────────────────

export async function actionPassportPhoto(
  imageId: string,
  country: string
): Promise<ProcessResult> {
  const { userId, plan } = await getSession();
  await checkUsageLimit(userId, plan);

  const img = await getImageRow(imageId, userId);
  const inputBuffer = await fetchImageBuffer(img.original_url);
  const resultBuffer = await processPassportPhoto(inputBuffer, country);

  const upload = await uploadBuffer(resultBuffer, {
    folder: `snapcut/${userId}/processed`,
    tags: ["passport_photo", country],
    format: "jpg",
  });

  await supabaseAdmin
    .from("images")
    .update({
      processed_url: upload.secureUrl,
      cloudinary_processed_id: upload.publicId,
      status: "completed",
      metadata: { country },
    })
    .eq("id", imageId);

  await logUsage(userId, "process", "passport_photo", imageId);

  return {
    imageId,
    originalUrl: img.original_url,
    processedUrl: upload.secureUrl,
    toolUsed: "passport_photo",
  };
}

// ─── LinkedIn Photo ───────────────────────────────────────────────────────

export async function actionLinkedInPhoto(
  imageId: string
): Promise<ProcessResult> {
  const { userId, plan } = await getSession();
  await checkUsageLimit(userId, plan);

  const img = await getImageRow(imageId, userId);
  const inputBuffer = await fetchImageBuffer(img.original_url);
  const resultBuffer = await optimiseLinkedIn(inputBuffer);

  const upload = await uploadBuffer(resultBuffer, {
    folder: `snapcut/${userId}/processed`,
    tags: ["linkedin"],
  });

  await supabaseAdmin
    .from("images")
    .update({
      processed_url: upload.secureUrl,
      cloudinary_processed_id: upload.publicId,
      status: "completed",
    })
    .eq("id", imageId);

  await logUsage(userId, "process", "linkedin_photo", imageId);

  return {
    imageId,
    originalUrl: img.original_url,
    processedUrl: upload.secureUrl,
    toolUsed: "linkedin_photo",
  };
}

// ─── Instagram DP ─────────────────────────────────────────────────────────

export async function actionInstagramDp(
  imageId: string
): Promise<ProcessResult> {
  const { userId, plan } = await getSession();
  await checkUsageLimit(userId, plan);

  const img = await getImageRow(imageId, userId);
  const inputBuffer = await fetchImageBuffer(img.original_url);
  const resultBuffer = await optimiseInstagramDp(inputBuffer);

  const upload = await uploadBuffer(resultBuffer, {
    folder: `snapcut/${userId}/processed`,
    tags: ["instagram"],
  });

  await supabaseAdmin
    .from("images")
    .update({
      processed_url: upload.secureUrl,
      cloudinary_processed_id: upload.publicId,
      status: "completed",
    })
    .eq("id", imageId);

  await logUsage(userId, "process", "instagram_dp", imageId);

  return {
    imageId,
    originalUrl: img.original_url,
    processedUrl: upload.secureUrl,
    toolUsed: "instagram_dp",
  };
}

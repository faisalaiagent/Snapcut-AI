import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin, getDailyUsage, logUsage } from "@/lib/supabase";
import { removeBackground } from "@/lib/remove-bg";
import { validateImageBuffer } from "@/lib/sharp-utils";
import { uploadBuffer } from "@/lib/cloudinary";
import { PLANS } from "@/lib/stripe";
import { processSchema } from "@/utils/validation";
import type { Plan } from "@/types";

interface ImageRow { original_url: string }

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = processSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { imageId } = parsed.data;
    const userId = session.user.id;
    const plan = ((session.user as Record<string, unknown>).plan ?? "free") as Plan;

    const planDef = PLANS[plan];
    if (planDef.dailyLimit !== Infinity) {
      const used = await getDailyUsage(userId);
      if (used >= planDef.dailyLimit) {
        return NextResponse.json(
          { error: `Daily limit of ${planDef.dailyLimit} edits reached. Upgrade to Pro.` },
          { status: 402 }
        );
      }
    }

    const { data, error } = await supabaseAdmin
      .from("images")
      .select("original_url")
      .eq("id", imageId)
      .eq("user_id", userId)
      .single();

    if (error || !data) return NextResponse.json({ error: "Image not found" }, { status: 404 });
    const img = data as ImageRow;

    const inputRes = await fetch(img.original_url);
    if (!inputRes.ok) throw new Error("Failed to fetch image");
    const inputBuffer = Buffer.from(await inputRes.arrayBuffer());
    await validateImageBuffer(inputBuffer);

    const { data: resultBuffer } = await removeBackground({ imageBuffer: inputBuffer });

    const upload = await uploadBuffer(resultBuffer, {
      folder: `snapcut/${userId}/processed`,
      tags: ["background_removed"],
    });

    await supabaseAdmin
      .from("images")
      .update({ processed_url: upload.secureUrl, cloudinary_processed_id: upload.publicId, status: "completed" })
      .eq("id", imageId);

    await logUsage(userId, "process", "background_remover", imageId);

    return NextResponse.json({
      success: true,
      data: { imageId, originalUrl: img.original_url, processedUrl: upload.secureUrl, toolUsed: "background_remover" },
    });
  } catch (err) {
    console.error("[process/remove-bg]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Processing failed" }, { status: 500 });
  }
}

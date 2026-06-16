import { NextRequest, NextResponse } from "next/server";
import { removeBackground } from "@/lib/remove-bg";
import { applyWhiteBackground } from "@/lib/sharp-utils";
import { uploadBuffer } from "@/lib/cloudinary";

const ipRequests = new Map<string, { count: number; resetAt: number }>();

function checkLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipRequests.get(ip);
  if (!entry || now > entry.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + 24 * 60 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "anonymous";

    if (!checkLimit(ip)) {
      return NextResponse.json(
        { error: "Daily limit reached (5 free edits/day). Sign up for Pro for unlimited edits." },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    if (!file) return NextResponse.json({ error: "No image provided" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    const { data: noBgBuffer } = await removeBackground({ imageBuffer: inputBuffer });
    const resultBuffer = await applyWhiteBackground(noBgBuffer);

    const upload = await uploadBuffer(resultBuffer, {
      folder: "snapcut/public/processed",
      tags: ["white_background", "public"],
    });

    return NextResponse.json({
      success: true,
      data: { processedUrl: upload.secureUrl, toolUsed: "white_background" },
    });
  } catch (err) {
    console.error("[white-bg-public]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Processing failed." },
      { status: 500 }
    );
  }
}

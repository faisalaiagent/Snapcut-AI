import { NextRequest, NextResponse } from "next/server";
import { removeBackground } from "@/lib/remove-bg";
import { uploadBuffer } from "@/lib/cloudinary";

// Rate limit: track requests per IP in memory
const ipRequests = new Map<string, { count: number; resetAt: number }>();

function checkLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipRequests.get(ip);
  if (!entry || now > entry.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + 24 * 60 * 60 * 1000 });
    return true; // allowed
  }
  if (entry.count >= 5) return false; // 5 free per day
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
        {
          error:
            "Daily limit reached (5 free edits/day). Sign up for Pro to get unlimited edits.",
        },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Validate file
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/heic"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported format. Use JPG, PNG, or WEBP." },
        { status: 400 }
      );
    }
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File must be under 20 MB." },
        { status: 400 }
      );
    }

    // Convert to buffer
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Check remove.bg key
    if (!process.env.REMOVE_BG_API_KEY) {
      return NextResponse.json(
        { error: "Background removal service not configured." },
        { status: 500 }
      );
    }

    // Remove background
    const { data: resultBuffer } = await removeBackground({
      imageBuffer: inputBuffer,
    });

    // Upload to Cloudinary
    const upload = await uploadBuffer(resultBuffer, {
      folder: "snapcut/public/processed",
      tags: ["background_removed", "public"],
    });

    return NextResponse.json({
      success: true,
      data: {
        processedUrl: upload.secureUrl,
        toolUsed: "background_remover",
      },
    });
  } catch (err) {
    console.error("[remove-bg-public]", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Processing failed. Try again.",
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateSignedUploadParams } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const folder = (body.folder as string) || `snapcut/${session.user.id}/originals`;

    const params = generateSignedUploadParams(folder);

    return NextResponse.json(params);
  } catch (err) {
    console.error("[upload/sign]", err);
    return NextResponse.json({ error: "Failed to generate signature" }, { status: 500 });
  }
}

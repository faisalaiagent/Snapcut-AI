import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "12", 10)));
    const tool = searchParams.get("tool");

    let query = supabaseAdmin
      .from("images")
      .select("id, original_url, processed_url, tool_used, status, metadata, file_size_bytes, created_at", { count: "exact" })
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (tool) query = query.eq("tool_used", tool);

    const { data, count, error } = await query;
    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: {
        images: data ?? [],
        total: count ?? 0,
        page,
        limit,
        totalPages: Math.ceil((count ?? 0) / limit),
      },
    });
  } catch (err) {
    console.error("[history]", err);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { imageId } = await req.json();
    if (!imageId) return NextResponse.json({ error: "imageId required" }, { status: 400 });

    const { error } = await supabaseAdmin
      .from("images")
      .delete()
      .eq("id", imageId)
      .eq("user_id", session.user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[history DELETE]", err);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin, getDailyUsage } from "@/lib/supabase";
import { PLANS } from "@/lib/stripe";
import type { Plan } from "@/types";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const plan = ((session.user as any).plan ?? "free") as Plan;

    const [dailyUsage, totalCount, monthCount] = await Promise.all([
      getDailyUsage(userId),
      supabaseAdmin
        .from("images")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "completed"),
      supabaseAdmin
        .from("images")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "completed")
        .gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
    ]);

    const planDef = PLANS[plan];

    return NextResponse.json({
      success: true,
      data: {
        totalImages: totalCount.count ?? 0,
        imagesThisMonth: monthCount.count ?? 0,
        dailyUsage,
        dailyLimit: planDef.dailyLimit === Infinity ? null : planDef.dailyLimit,
        plan,
      },
    });
  } catch (err) {
    console.error("[usage]", err);
    return NextResponse.json({ error: "Failed to fetch usage" }, { status: 500 });
  }
}

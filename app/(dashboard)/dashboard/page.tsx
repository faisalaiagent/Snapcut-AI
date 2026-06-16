import { auth } from "@/lib/auth";
import { supabaseAdmin, getDailyUsage } from "@/lib/supabase";
import { PLANS } from "@/lib/stripe";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentImages } from "@/components/dashboard/RecentImages";
import { QuickTools } from "@/components/dashboard/QuickTools";
import type { Plan } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null; const userId: string = session.user.id;
  const plan = ((session!.user as any).plan ?? "free") as Plan;
  const planDef = PLANS[plan];

  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [dailyUsage, totalRes, monthRes, recentRes] = await Promise.all([
    getDailyUsage(userId),
    supabaseAdmin.from("images").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("status", "completed"),
    supabaseAdmin.from("images").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("status", "completed").gte("created_at", startOfMonth.toISOString()),
    supabaseAdmin.from("images").select("id, original_url, processed_url, tool_used, created_at").eq("user_id", userId).eq("status", "completed").order("created_at", { ascending: false }).limit(6),
  ]);

  const stats = {
    totalImages: totalRes.count ?? 0,
    imagesThisMonth: monthRes.count ?? 0,
    dailyUsage,
    dailyLimit: planDef.dailyLimit === Infinity ? null : planDef.dailyLimit,
    plan,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="font-serif text-2xl text-ink mb-1">Overview</h1>
        <p className="text-[14px] text-ink-3">Your SnapCut AI usage at a glance.</p>
      </div>

      <StatsCards stats={stats} />
      <QuickTools />
      <RecentImages images={recentRes.data ?? []} />
    </div>
  );
}

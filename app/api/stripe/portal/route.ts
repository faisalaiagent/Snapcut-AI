import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createBillingPortal } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", session.user.id)
      .single();

    if (!sub?.stripe_customer_id) {
      return NextResponse.json({ error: "No billing account found" }, { status: 404 });
    }

    const portal = await createBillingPortal(
      sub.stripe_customer_id,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing`
    );

    return NextResponse.json({ url: portal.url });
  } catch (err) {
    console.error("[stripe/portal]", err);
    return NextResponse.json({ error: "Failed to open billing portal" }, { status: 500 });
  }
}

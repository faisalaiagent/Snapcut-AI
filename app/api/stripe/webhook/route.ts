import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent, getPlanFromPriceId } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import type Stripe from "stripe";

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = Buffer.from(await req.arrayBuffer());
    event = constructWebhookEvent(rawBody, signature);
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // ── Subscription created / updated ──────────────────────────────
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        const priceId = sub.items.data[0]?.price?.id ?? "";
        const plan = getPlanFromPriceId(priceId);

        await supabaseAdmin.from("subscriptions").upsert(
          {
            user_id: userId,
            stripe_customer_id: sub.customer as string,
            stripe_subscription_id: sub.id,
            stripe_price_id: priceId,
            status: sub.status,
            current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            cancel_at_period_end: sub.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );

        await supabaseAdmin
          .from("users")
          .update({ plan, updated_at: new Date().toISOString() })
          .eq("id", userId);

        break;
      }

      // ── Subscription canceled / deleted ─────────────────────────────
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        await supabaseAdmin
          .from("subscriptions")
          .update({ status: "canceled", updated_at: new Date().toISOString() })
          .eq("user_id", userId);

        await supabaseAdmin
          .from("users")
          .update({ plan: "free", updated_at: new Date().toISOString() })
          .eq("id", userId);

        break;
      }

      // ── Checkout complete (link customerId to userId) ────────────────
      case "checkout.session.completed": {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        const userId = checkoutSession.client_reference_id;
        const customerId = checkoutSession.customer as string;
        if (!userId || !customerId) break;

        await supabaseAdmin
          .from("subscriptions")
          .upsert(
            { user_id: userId, stripe_customer_id: customerId },
            { onConflict: "user_id", ignoreDuplicates: true }
          );
        break;
      }

      default:
        console.log(`[webhook] Unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[webhook] Handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

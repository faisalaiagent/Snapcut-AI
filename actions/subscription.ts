"use server";

import { auth } from "@/lib/auth";
import { createCheckoutSession, createBillingPortal } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function actionCreateCheckout(priceId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const checkoutSession = await createCheckoutSession({
    userId: session.user.id,
    userEmail: session.user.email!,
    priceId,
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=1`,
    cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
  });

  redirect(checkoutSession.url!);
}

export async function actionOpenBillingPortal(): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const { data: sub } = await supabaseAdmin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", session.user.id)
    .single();

  if (!sub?.stripe_customer_id) throw new Error("No billing account found");

  const portal = await createBillingPortal(
    sub.stripe_customer_id,
    `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings/billing`
  );

  redirect(portal.url);
}

export async function actionGetSubscription() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const { data } = await supabaseAdmin
    .from("subscriptions")
    .select("*")
    .eq("user_id", session.user.id)
    .single();

  return data ?? null;
}

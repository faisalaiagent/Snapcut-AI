import Stripe from "stripe";

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    })
  : null;

export const PLANS = {
  free: {
    name: "Free",
    priceId: null,
    dailyLimit: 5,
    features: ["5 edits/day", "All tools", "Watermarked exports"],
  },
  pro: {
    name: "Pro",
    priceId: process.env.STRIPE_PRO_PRICE_ID ?? "",
    dailyLimit: Infinity,
    trialDays: 7,
    features: [
      "Unlimited edits",
      "HD exports",
      "No watermark",
      "Priority processing",
      "Full history",
    ],
  },
  business: {
    name: "Business",
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID ?? "",
    dailyLimit: Infinity,
    features: [
      "Everything in Pro",
      "Bulk processing",
      "5 team members",
      "Priority support",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export async function createCheckoutSession({
  userId,
  userEmail,
  priceId,
  successUrl,
  cancelUrl,
}: {
  userId: string;
  userEmail: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  if (!stripe)
    throw new Error(
      "Stripe is not configured. Add STRIPE_SECRET_KEY to .env.local"
    );

  const plan = Object.values(PLANS).find((p) => p.priceId === priceId) as
    | { trialDays?: number }
    | undefined;

  return stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: userEmail,
    client_reference_id: userId,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: plan?.trialDays,
      metadata: { userId },
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
  });
}

export async function createBillingPortal(
  customerId: string,
  returnUrl: string
) {
  if (!stripe) throw new Error("Stripe is not configured.");
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

export function constructWebhookEvent(rawBody: Buffer, signature: string) {
  if (!stripe) throw new Error("Stripe is not configured.");
  return stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}

export function getPlanFromPriceId(priceId: string): PlanKey {
  if (priceId === PLANS.pro.priceId) return "pro";
  if (priceId === PLANS.business.priceId) return "business";
  return "free";
}

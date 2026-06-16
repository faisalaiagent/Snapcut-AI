import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/stripe";
import { checkoutSchema } from "@/utils/validation";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const checkoutSession = await createCheckoutSession({
      userId: session.user.id,
      userEmail: session.user.email!,
      priceId: parsed.data.priceId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=1`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("[stripe/checkout]", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const { priceId } = await req.json();

    const stripeSession = await stripe.checkout.sessions.create({
      customer: session.user.stripe_customer_id!,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: absoluteUrl(`/onboarding?session_id={CHECKOUT_SESSION_ID}`),
      cancel_url: absoluteUrl(`/pricing?canceled=true`),
      metadata: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("[DIRECT_CHECKOUT_ERROR]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

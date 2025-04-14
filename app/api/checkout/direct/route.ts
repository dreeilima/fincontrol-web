import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const { priceId } = await req.json();
    const origin = headers().get("origin") || process.env.NEXT_PUBLIC_APP_URL;

    const stripeSession = await stripe.checkout.sessions.create({
      customer: session.user.stripe_customer_id!,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/onboarding?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
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

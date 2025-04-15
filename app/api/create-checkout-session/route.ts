import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { Stripe } from "stripe";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

const checkoutSchema = z.object({
  priceId: z.string(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { priceId } = checkoutSchema.parse(body);

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: session.user.email!,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
      },
      success_url: absoluteUrl(
        `/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      ),
      cancel_url: absoluteUrl(`/checkout/error`),
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error("[CHECKOUT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

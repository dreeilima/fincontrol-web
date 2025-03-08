import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Stripe } from "stripe";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  switch (event.type) {
    case "checkout.session.completed":
      await db.user.update({
        where: {
          id: session.metadata?.userId,
        },
        data: {
          stripeSubscriptionId: session.subscription as string,
          stripeCustomerId: session.customer as string,
          stripePriceId: session.metadata?.priceId,
          stripeCurrentPeriodEnd: new Date(
            (session.subscription as any).current_period_end * 1000,
          ),
        },
      });
      break;

    case "invoice.payment_succeeded":
      await db.user.update({
        where: {
          id: session.metadata?.userId,
        },
        data: {
          stripePriceId: session.metadata?.priceId,
          stripeCurrentPeriodEnd: new Date(
            (session.subscription as any).current_period_end * 1000,
          ),
        },
      });
      break;

    case "customer.subscription.deleted":
      await db.user.update({
        where: {
          id: session.metadata?.userId,
        },
        data: {
          stripePriceId: null,
          stripeSubscriptionId: null,
          stripeCurrentPeriodEnd: null,
        },
      });
      break;
  }

  return new NextResponse(null, { status: 200 });
}

export const runtime = "nodejs";

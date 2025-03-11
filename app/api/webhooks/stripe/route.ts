import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { Stripe } from "stripe";

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
    console.error("[WEBHOOK_ERROR]", error);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  switch (event.type) {
    case "checkout.session.completed": {
      if (!session?.metadata?.userId) {
        return new NextResponse("User id is required", { status: 400 });
      }

      await db.users.update({
        where: {
          id: session.metadata.userId,
        },
        data: {
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          stripe_price_id: session.metadata.priceId,
          stripe_current_period_end: new Date(
            (session.subscription as any).current_period_end * 1000,
          ),
        },
      });
      break;
    }

    case "invoice.payment_succeeded": {
      if (!session?.metadata?.userId) {
        return new NextResponse("User id is required", { status: 400 });
      }

      await db.users.update({
        where: {
          id: session.metadata.userId,
        },
        data: {
          stripe_current_period_end: new Date(
            (session.subscription as any).current_period_end * 1000,
          ),
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      if (!session?.metadata?.userId) {
        return new NextResponse("User id is required", { status: 400 });
      }

      await db.users.update({
        where: {
          id: session.metadata.userId,
        },
        data: {
          stripe_price_id: null,
          stripe_subscription_id: null,
          stripe_current_period_end: null,
        },
      });
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse(null, { status: 200 });
}

export const runtime = "nodejs";

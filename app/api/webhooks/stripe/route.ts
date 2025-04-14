import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

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
    console.error("Erro no webhook:", error);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "customer.subscription.created":
        case "customer.subscription.updated": {
          const subscription = event.data.object as Stripe.Subscription;
          const userId = subscription.metadata.userId;

          if (!userId) {
            console.error("UserId não encontrado nos metadados da assinatura");
            return new NextResponse("UserId não encontrado", { status: 400 });
          }

          await db.subscriptions.upsert({
            where: { user_id: userId },
            create: {
              user_id: userId,
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer as string,
              stripe_price_id: subscription.items.data[0].price.id,
              stripe_current_period_end: new Date(
                subscription.current_period_end * 1000,
              ),
              status: subscription.status,
              plan: subscription.items.data[0].price.nickname || "basic",
              price: subscription.items.data[0].price.unit_amount || 990,
            },
            update: {
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer as string,
              stripe_price_id: subscription.items.data[0].price.id,
              stripe_current_period_end: new Date(
                subscription.current_period_end * 1000,
              ),
              status: subscription.status,
              plan: subscription.items.data[0].price.nickname || "basic",
              price: subscription.items.data[0].price.unit_amount || 990,
            },
          });

          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          const userId = subscription.metadata.userId;

          if (!userId) {
            console.error("UserId não encontrado nos metadados da assinatura");
            return new NextResponse("UserId não encontrado", { status: 400 });
          }

          await db.subscriptions.update({
            where: { user_id: userId },
            data: {
              status: "canceled",
              stripe_current_period_end: new Date(
                subscription.current_period_end * 1000,
              ),
            },
          });

          break;
        }

        case "checkout.session.completed": {
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          const userId = checkoutSession.metadata?.userId;
          const subscriptionId = checkoutSession.subscription as string;

          if (!userId) {
            console.error("UserId não encontrado nos metadados da sessão");
            return new NextResponse("UserId não encontrado", { status: 400 });
          }

          // Buscar detalhes da assinatura
          const subscription =
            await stripe.subscriptions.retrieve(subscriptionId);

          await db.subscriptions.upsert({
            where: { user_id: userId },
            create: {
              user_id: userId,
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer as string,
              stripe_price_id: subscription.items.data[0].price.id,
              stripe_current_period_end: new Date(
                subscription.current_period_end * 1000,
              ),
              status: subscription.status,
              plan: subscription.items.data[0].price.nickname || "basic",
              price: subscription.items.data[0].price.unit_amount || 990,
            },
            update: {
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer as string,
              stripe_price_id: subscription.items.data[0].price.id,
              stripe_current_period_end: new Date(
                subscription.current_period_end * 1000,
              ),
              status: subscription.status,
              plan: subscription.items.data[0].price.nickname || "basic",
              price: subscription.items.data[0].price.unit_amount || 990,
            },
          });

          break;
        }

        default:
          throw new Error("Evento não tratado");
      }
    } catch (error) {
      console.error("Erro ao processar webhook:", error);
      return new NextResponse("Erro ao processar webhook", { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

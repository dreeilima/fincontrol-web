import { NextResponse } from "next/server";
import { auth } from "@/auth";
import Stripe from "stripe";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Recuperar a sessão do Stripe com a expansão da assinatura
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    if (stripeSession.payment_status === "paid") {
      const userId = session.user.id;
      const customerId = stripeSession.customer as string;

      // Obter a assinatura diretamente da sessão expandida
      const subscription = stripeSession.subscription as Stripe.Subscription;
      const subscriptionId = subscription.id;
      const priceId = subscription.items.data[0].price.id;

      // Tenta encontrar uma assinatura existente
      const existingSubscription = await db.subscriptions.findUnique({
        where: { user_id: userId },
      });

      console.log("Existing subscription check:", {
        userId,
        exists: !!existingSubscription,
        existingData: existingSubscription,
      });

      try {
        if (existingSubscription) {
          // Se já existe, atualizamos
          console.log("Updating existing subscription");
          await db.subscriptions.update({
            where: { user_id: userId },
            data: {
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              stripe_price_id: priceId,
              stripe_current_period_end: new Date(
                subscription.current_period_end * 1000,
              ),
              status: subscription.status,
            },
          });
        } else {
          // Se não existe, criamos
          console.log("Creating new subscription");

          // Verificar novamente para garantir que não há duplicação
          const doubleCheck = await db.subscriptions.findUnique({
            where: { user_id: userId },
          });

          if (doubleCheck) {
            console.log(
              "Double check found existing subscription, updating instead",
            );
            await db.subscriptions.update({
              where: { user_id: userId },
              data: {
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                stripe_price_id: priceId,
                stripe_current_period_end: new Date(
                  subscription.current_period_end * 1000,
                ),
                status: subscription.status,
              },
            });
          } else {
            await db.subscriptions.create({
              data: {
                user_id: userId,
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                stripe_price_id: priceId,
                stripe_current_period_end: new Date(
                  subscription.current_period_end * 1000,
                ),
                status: subscription.status,
              },
            });
          }
        }
      } catch (dbError) {
        console.error("Database operation error:", dbError);

        // Fallback: try upsert instead
        console.log("Attempting upsert as fallback");
        await db.subscriptions.upsert({
          where: { user_id: userId },
          update: {
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            stripe_price_id: priceId,
            stripe_current_period_end: new Date(
              subscription.current_period_end * 1000,
            ),
            status: subscription.status,
          },
          create: {
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            stripe_price_id: priceId,
            stripe_current_period_end: new Date(
              subscription.current_period_end * 1000,
            ),
            status: subscription.status,
          },
        });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false }, { status: 400 });
  } catch (error) {
    console.error("[VERIFY_PAYMENT_ERROR]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

export const runtime = "nodejs";

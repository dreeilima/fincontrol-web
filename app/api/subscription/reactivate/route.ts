import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { PLANS } from "@/config/subscriptions";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Busca a assinatura atual do usuário
    const subscription = await db.subscriptions.findUnique({
      where: { user_id: session.user.id },
    });

    if (!subscription) {
      return new NextResponse("Assinatura não encontrada", { status: 404 });
    }

    // Caso 1: Assinatura em status "canceling" (em cancelamento)
    if (
      subscription.status === "canceling" &&
      subscription.stripe_subscription_id
    ) {
      // Reativar a assinatura no Stripe definindo cancel_at_period_end como false
      await stripe.subscriptions.update(
        subscription.stripe_subscription_id as string,
        {
          cancel_at_period_end: false,
        },
      );

      // Atualiza o status no banco de dados de volta para "active"
      await db.subscriptions.update({
        where: { user_id: session.user.id },
        data: {
          status: "active",
        },
      });

      return NextResponse.json({
        success: true,
        message: "Assinatura reativada com sucesso",
      });
    }

    // Caso 2: Assinatura já cancelada ou inativa - criar uma nova assinatura
    if (
      (subscription.status === "canceled" ||
        subscription.status === "inactive") &&
      session.user.email
    ) {
      // Obtém o priceId do plano premium
      const premiumPlan = PLANS.PREMIUM;
      const priceId = premiumPlan.priceId;

      // Criar uma nova sessão de checkout para o usuário
      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: session.user.email,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/assinatura?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/assinatura?canceled=true`,
        metadata: {
          userId: session.user.id,
        },
      });

      return NextResponse.json({
        success: true,
        url: stripeSession.url,
        message: "Redirecionando para o checkout",
      });
    }

    return new NextResponse("Estado da assinatura não permite reativação", {
      status: 400,
    });
  } catch (error) {
    console.error("[SUBSCRIPTION_REACTIVATE_ERROR]", error);
    return new NextResponse("Erro ao reativar assinatura", { status: 500 });
  }
}

export const runtime = "nodejs";

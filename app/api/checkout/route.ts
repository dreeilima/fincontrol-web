import { NextResponse } from "next/server";
import { auth } from "@/auth";
import Stripe from "stripe";

import { PLANS } from "@/config/subscriptions";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plan, priceId, interval = "monthly" } = body;
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Se recebemos um priceId diretamente, usamos ele
    // Caso contrário, buscamos o priceId com base no plano
    let finalPriceId = priceId;

    if (!finalPriceId && plan) {
      console.log("Buscando priceId para o plano:", plan);

      // Normalizar o plano para maiúsculas e remover acentos
      let normalizedPlan = plan.toUpperCase();

      // Mapeamento específico para lidar com acentos
      const planMapping = {
        BÁSICO: "BASIC",
        BASICO: "BASIC",
        BÁSIC: "BASIC",
        BASIC: "BASIC",
        PRO: "PRO",
        PREMIUM: "PREMIUM",
      };

      normalizedPlan = planMapping[normalizedPlan] || normalizedPlan;

      console.log("Plano normalizado:", normalizedPlan);

      const planConfig = PLANS[normalizedPlan];

      if (!planConfig) {
        return new NextResponse(
          JSON.stringify({
            error: "Plano inválido",
            requestedPlan: plan,
            normalizedPlan: normalizedPlan,
            availablePlans: Object.keys(PLANS),
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      finalPriceId = planConfig.priceId;
      console.log("PriceId encontrado:", finalPriceId);
    }

    if (!finalPriceId) {
      return new NextResponse(
        JSON.stringify({
          error: "PriceId não encontrado",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const existingSubscription = await db.subscriptions.findUnique({
      where: { user_id: session.user.id },
    });

    // Usar absoluteUrl para gerar as URLs de redirecionamento
    const successUrl = absoluteUrl(
      `/onboarding?session_id={CHECKOUT_SESSION_ID}`,
    );
    const cancelUrl = absoluteUrl(`/pricing`);

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: session.user.email || undefined,
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("[CHECKOUT_ERROR]", error);
    return new NextResponse(
      JSON.stringify({
        error: "Erro interno ao criar sessão de checkout",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}

export const runtime = "nodejs";

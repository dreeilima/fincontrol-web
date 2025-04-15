import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

interface PlanType {
  id: string | undefined;
  name: string;
  price_amount: number;
  stripe_price_id: string;
  features: string[];
}

// Novo sistema com apenas dois planos: Básico (gratuito) e Premium (pago)
const PLANS = {
  basic: {
    id: undefined, // Plano gratuito, não tem ID no Stripe
    name: "Básico",
    price_amount: 0,
    stripe_price_id: "",
    features: [
      "Sistema web com gráficos interativos e gestão financeira",
      "Controle de gastos via WhatsApp por texto, áudio e imagem",
      "Até 10 transações por mês via WhatsApp",
      "Categorização automática",
      "Relatórios com gráficos mensais",
    ],
  },
  premium: {
    id: "price_1R06Q3R9fFzxPkKlHN5yFNd6", // Usar o ID do plano Premium existente ou criar um novo
    name: "Premium",
    price_amount: 1990, // R$ 19,90
    stripe_price_id: "price_1R06Q3R9fFzxPkKlHN5yFNd6", // Usar o mesmo do plano premium existente
    features: [
      "Todos os recursos do plano Básico",
      "Transações ilimitadas de gastos via WhatsApp",
      "Criação de categorias personalizadas para melhor organização",
    ],
  },
};

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Buscar assinatura do usuário
    let subscription = await db.subscriptions.findUnique({
      where: { user_id: session.user.id },
    });

    // Se não tiver assinatura, criar uma assinatura básica gratuita
    if (!subscription) {
      // Criar uma assinatura gratuita básica
      subscription = await db.subscriptions.create({
        data: {
          user_id: session.user.id,
          plan: "basic", // Mudando de "free" para "basic"
          status: "active",
          price: 0,
        },
      });

      // Retornar assinatura gratuita com informações básicas
      return NextResponse.json({
        ...subscription,
        plan: "basic",
        price_amount: 0,
        current_plan: "Básico",
        next_plans: [PLANS.premium], // Apenas o plano premium como upgrade
      });
    }

    // Para assinaturas pagas, continuar com o fluxo normal
    if (subscription.stripe_subscription_id) {
      try {
        const stripeSubscription = await stripe.subscriptions.retrieve(
          subscription.stripe_subscription_id as string,
        );

        // Get current price ID from Stripe
        const currentPriceId = stripeSubscription.items.data[0].price.id;
        const currentAmount =
          stripeSubscription.items.data[0].price.unit_amount || 0;

        // Verificar se o plano atual é premium
        const isPremium = currentPriceId === PLANS.premium.id;
        const currentPlanKey = isPremium ? "premium" : "basic";

        // No novo sistema, só existe upgrade de básico para premium
        let next_plans: PlanType[] = [];
        if (currentPlanKey === "basic") {
          next_plans = [PLANS.premium];
        }

        // Update subscription in database with correct plan
        await db.subscriptions.update({
          where: { id: subscription.id },
          data: {
            plan: currentPlanKey,
            stripe_price_id: currentPriceId,
            price: currentAmount as number,
          },
        });

        return NextResponse.json({
          ...subscription,
          plan: currentPlanKey,
          price_amount: currentAmount,
          current_plan: PLANS[currentPlanKey].name,
          next_plans: next_plans,
        });
      } catch (error) {
        console.error("[STRIPE_SUBSCRIPTION_ERROR]", error);
        // Tratar como plano básico em caso de erro
        return NextResponse.json({
          ...subscription,
          plan: "basic",
          price_amount: 0,
          current_plan: "Básico",
          next_plans: [PLANS.premium],
        });
      }
    } else {
      // Para assinaturas sem ID do Stripe (criadas manualmente ou gratuitas)
      // Considerar como plano básico
      const currentPlanKey = "basic";

      return NextResponse.json({
        ...subscription,
        plan: currentPlanKey,
        price_amount: 0,
        current_plan: "Básico",
        next_plans: [PLANS.premium],
      });
    }
  } catch (error) {
    console.error("[SUBSCRIPTION_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao carregar assinatura" },
      { status: 500 },
    );
  }
}

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

interface PlanType {
  id: string | undefined;
  name: string;
  price_amount: number;
  stripe_price_id: string; // Add this field
  features: string[];
}

const PLANS = {
  basic: {
    id: "price_1R06P8R9fFzxPkKldIyMcLC2",
    name: "Básico",
    price_amount: 990,
    stripe_price_id: "price_1R06P8R9fFzxPkKldIyMcLC2",
    features: [
      "Controle financeiro básico",
      "Até 100 transações/mês",
      "Relatórios básicos",
    ],
  },
  pro: {
    id: "price_1R06Q3R9fFzxPkKlHN5yFNd6",
    name: "Pro",
    price_amount: 1990,
    stripe_price_id: "price_1R06Q3R9fFzxPkKlHN5yFNd6",
    features: [
      "Controle financeiro avançado",
      "Transações ilimitadas",
      "Relatórios avançados",
      "Suporte prioritário",
    ],
  },
  premium: {
    id: "price_1R06RrR9fFzxPkKlvtrHmggX",
    name: "Premium",
    price_amount: 3990,
    stripe_price_id: "price_1R06RrR9fFzxPkKlvtrHmggX",
    features: [
      "Tudo do Profissional",
      "API de integração",
      "Equipe ilimitada",
      "Suporte 24/7",
    ],
  },
};

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const subscription = await db.subscriptions.findUnique({
      where: { user_id: session.user.id },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Assinatura não encontrada" },
        { status: 404 },
      );
    }

    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripe_subscription_id as string,
    );

    // Get current price ID and amount from Stripe
    const currentPriceId = stripeSubscription.items.data[0].price.id;
    const currentAmount =
      stripeSubscription.items.data[0].price.unit_amount || 0; // Add default value

    // Find current plan key by actual Stripe price ID
    const currentPlanKey =
      Object.keys(PLANS).find((key) => PLANS[key].id === currentPriceId) ||
      "basic";

    // Get next available plans based on price amount
    let next_plans: PlanType[] = [];
    const currentPlan = PLANS[currentPlanKey];

    // Sort plans by price amount to determine upgrade path
    const sortedPlans = Object.values(PLANS).sort(
      (a, b) => a.price_amount - b.price_amount,
    );
    const currentPlanIndex = sortedPlans.findIndex(
      (plan) => plan.id === currentPriceId,
    );

    if (currentPlanIndex !== -1 && currentPlanIndex < sortedPlans.length - 1) {
      next_plans = sortedPlans.slice(currentPlanIndex + 1);
    }

    // Update subscription in database with correct plan
    await db.subscriptions.update({
      where: { id: subscription.id },
      data: {
        plan: currentPlanKey,
        stripe_price_id: currentPriceId,
        price: currentAmount as number, // Type assertion to ensure it's a number
      },
    });

    return NextResponse.json({
      ...subscription,
      plan: currentPlanKey,
      price_amount: currentAmount,
      current_plan: PLANS[currentPlanKey].name,
      next_plans: next_plans.map((plan) => ({
        ...plan,
        id: plan.id,
      })),
    });
  } catch (error) {
    console.error("[SUBSCRIPTION_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao carregar assinatura" },
      { status: 500 },
    );
  }
}

export const runtime = "nodejs";

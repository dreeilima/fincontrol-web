import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { startOfMonth, subMonths } from "date-fns";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Data atual para comparações
    const currentDate = new Date();
    const firstDayOfMonth = startOfMonth(currentDate);
    const firstDayOfLastMonth = startOfMonth(subMonths(currentDate, 1));

    // Buscar dados de assinaturas ativas
    const [currentSubscribers, previousSubscribers, subscriptionData] = await Promise.all([
      // Assinantes ativos no mês atual
      db.users.count({
        where: {
          stripe_subscription_id: {
            not: null,
          },
          stripe_current_period_end: {
            gt: currentDate,
          },
        },
      }),

      // Assinantes ativos no mês anterior
      db.users.count({
        where: {
          stripe_subscription_id: {
            not: null,
          },
          stripe_current_period_end: {
            gt: firstDayOfLastMonth,
            lt: firstDayOfMonth,
          },
        },
      }),

      // Dados de assinaturas do Stripe para calcular MRR
      stripe.subscriptions.list({
        status: "active",
        limit: 100,
        expand: ["data.plan"],
      }),
    ]);

    // Calcular MRR atual (Monthly Recurring Revenue)
    const currentMRR = subscriptionData.data.reduce((total, subscription) => {
      // @ts-ignore - O tipo do Stripe não inclui plan.amount, mas sabemos que existe
      const amount = subscription.items.data[0]?.plan?.amount || 0;
      return total + amount / 100; // Converter de centavos para reais
    }, 0);

    // Buscar dados de MRR do mês anterior (simulado para este exemplo)
    // Em um ambiente real, você buscaria isso do banco de dados ou de um histórico
    const previousMRR = currentMRR * 0.9; // Simulando que o MRR anterior era 90% do atual

    // Calcular ARPU (Average Revenue Per User)
    const currentARPU = currentSubscribers > 0 ? currentMRR / currentSubscribers : 0;
    const previousARPU = previousSubscribers > 0 ? previousMRR / previousSubscribers : 0;

    // Calcular LTV (Lifetime Value) - simplificado como ARPU * 12 meses
    const currentLTV = currentARPU * 12;
    const previousLTV = previousARPU * 12;

    // Calcular variações percentuais
    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Number((((current - previous) / previous) * 100).toFixed(1));
    };

    const mrrChange = calculateGrowth(currentMRR, previousMRR);
    const arpuChange = calculateGrowth(currentARPU, previousARPU);
    const subscribersChange = calculateGrowth(currentSubscribers, previousSubscribers);
    const ltvChange = calculateGrowth(currentLTV, previousLTV);

    return NextResponse.json({
      mrr: currentMRR,
      mrrChange,
      arpu: currentARPU,
      arpuChange,
      activeSubscribers: currentSubscribers,
      subscribersChange,
      ltv: currentLTV,
      ltvChange,
      // Adicionar timestamp para facilitar debug
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[ADMIN_METRICS_MRR]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

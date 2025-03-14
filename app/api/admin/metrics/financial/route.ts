import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { startOfMonth, subMonths } from "date-fns";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Início do mês atual e anterior
    const startOfCurrentMonth = startOfMonth(new Date());
    const startOfLastMonth = startOfMonth(subMonths(new Date(), 1));

    // Buscar dados do Stripe
    const [currentMonthSubscriptions, lastMonthSubscriptions] =
      await Promise.all([
        stripe.subscriptions.list({
          status: "active",
          created: {
            gte: Math.floor(startOfCurrentMonth.getTime() / 1000),
          },
        }),
        stripe.subscriptions.list({
          status: "active",
          created: {
            gte: Math.floor(startOfLastMonth.getTime() / 1000),
            lt: Math.floor(startOfCurrentMonth.getTime() / 1000),
          },
        }),
      ]);

    // Calcular MRR (Monthly Recurring Revenue)
    const currentMRR = currentMonthSubscriptions.data.reduce(
      (acc, sub) => acc + (sub.items.data[0].price?.unit_amount || 0) / 100,
      0,
    );

    const lastMonthMRR = lastMonthSubscriptions.data.reduce(
      (acc, sub) => acc + (sub.items.data[0].price?.unit_amount || 0) / 100,
      0,
    );

    // Calcular crescimento do MRR
    const mrrGrowthRate = lastMonthMRR
      ? ((currentMRR - lastMonthMRR) / lastMonthMRR) * 100
      : 0;

    // Buscar número de usuários pagantes
    const paidUsers = await db.users.count({
      where: {
        stripe_price_id: {
          not: null,
        },
      },
    });

    // Calcular ARPU (Average Revenue Per User)
    const averageRevenuePerUser = paidUsers ? currentMRR / paidUsers : 0;

    // Calcular Churn Rate
    const canceledSubscriptions = await stripe.subscriptions.list({
      status: "canceled",
      created: {
        gte: Math.floor(startOfLastMonth.getTime() / 1000),
      },
    });

    const totalSubscriptions =
      currentMonthSubscriptions.data.length + canceledSubscriptions.data.length;
    const churnRate = totalSubscriptions
      ? (canceledSubscriptions.data.length / totalSubscriptions) * 100
      : 0;

    return NextResponse.json({
      monthlyRecurringRevenue: currentMRR,
      averageRevenuePerUser,
      churnRate: Number(churnRate.toFixed(1)),
      mrrGrowthRate: Number(mrrGrowthRate.toFixed(1)),
      totalRevenue: currentMRR * 12, // Estimativa anual
    });
  } catch (error) {
    console.error("[FINANCIAL_METRICS]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

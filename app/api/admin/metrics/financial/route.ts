import { NextResponse } from "next/server";
import { auth } from "@/auth";
import Stripe from "stripe";

import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    if (!process.env.STRIPE_API_KEY) {
      return NextResponse.json({
        monthlyRecurringRevenue: 0,
        averageRevenuePerUser: 0,
        churnRate: 0,
        mrrGrowthRate: 0,
        totalRevenue: 0,
        volume: 0,
        comparisons: {
          mrr: 0,
          revenue: 0,
          volume: 0,
          churn: 0,
        },
      });
    }

    // Datas para comparação
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1,
    );

    // Buscar assinaturas ativas do Stripe
    const subscriptions = await stripe.subscriptions.list({
      status: "active",
      expand: ["data.items.data.price"],
    });

    console.log("Assinaturas ativas:", {
      total: subscriptions.data.length,
      dados: subscriptions.data.map((sub) => ({
        id: sub.id,
        status: sub.status,
        customer: sub.customer,
        items: sub.items.data,
      })),
    });

    // Buscar assinaturas canceladas recentemente
    const canceledSubscriptions = await stripe.subscriptions.list({
      status: "canceled",
      created: {
        gte: Math.floor(firstDayOfMonth.getTime() / 1000),
      },
    });

    const lastMonthCanceledSubscriptions = await stripe.subscriptions.list({
      status: "canceled",
      created: {
        gte: Math.floor(firstDayOfLastMonth.getTime() / 1000),
        lt: Math.floor(firstDayOfMonth.getTime() / 1000),
      },
    });

    // Calcular MRR (Monthly Recurring Revenue)
    const monthlyRecurringRevenue = subscriptions.data.reduce((acc, sub) => {
      const price = sub.items.data[0].price;
      return (
        acc +
        (price?.unit_amount ?? 0) *
          (price?.recurring?.interval === "year" ? 1 / 12 : 1)
      );
    }, 0);

    // Buscar usuários ativos
    const totalUsers = await db.users.count({
      where: {
        stripe_subscription_id: {
          not: null,
        },
        stripe_current_period_end: {
          gt: new Date(),
        },
      },
    });

    console.log("Usuários ativos:", {
      total: totalUsers,
      query: {
        stripe_subscription_id: "not null",
        stripe_current_period_end: "gt now()",
      },
    });

    // Calcular métricas
    const averageRevenuePerUser =
      totalUsers > 0 ? monthlyRecurringRevenue / totalUsers / 100 : 0;
    const churnRate =
      subscriptions.data.length > 0
        ? (canceledSubscriptions.data.length / subscriptions.data.length) * 100
        : 0;
    const lastMonthChurnRate =
      subscriptions.data.length > 0
        ? (lastMonthCanceledSubscriptions.data.length /
            subscriptions.data.length) *
          100
        : 0;

    // Calcular volume total (todas as transações bem-sucedidas do Stripe)
    const charges = await stripe.charges.list({
      created: {
        gte: Math.floor(firstDayOfMonth.getTime() / 1000),
      },
    } as Stripe.ChargeListParams);

    const lastMonthCharges = await stripe.charges.list({
      created: {
        gte: Math.floor(firstDayOfLastMonth.getTime() / 1000),
        lt: Math.floor(firstDayOfMonth.getTime() / 1000),
      },
    } as Stripe.ChargeListParams);

    const volume = charges.data.reduce((acc, charge) => acc + charge.amount, 0);
    const lastMonthVolume = lastMonthCharges.data.reduce(
      (acc, charge) => acc + charge.amount,
      0,
    );

    // Calcula as variações percentuais
    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Number((((current - previous) / previous) * 100).toFixed(1));
    };

    return NextResponse.json({
      monthlyRecurringRevenue: monthlyRecurringRevenue / 100, // Converter de centavos para reais
      averageRevenuePerUser,
      churnRate,
      mrrGrowthRate: calculateGrowth(
        monthlyRecurringRevenue,
        monthlyRecurringRevenue,
      ), // Precisamos implementar comparação com mês anterior
      totalRevenue: volume / 100, // Converter de centavos para reais
      volume: volume / 100,
      comparisons: {
        mrr: calculateGrowth(monthlyRecurringRevenue, monthlyRecurringRevenue), // Implementar mês anterior
        revenue: calculateGrowth(averageRevenuePerUser, averageRevenuePerUser), // Implementar mês anterior
        volume: calculateGrowth(volume, lastMonthVolume),
        churn: calculateGrowth(churnRate, lastMonthChurnRate),
      },
    });
  } catch (error) {
    console.error("[FINANCIAL_METRICS_GET]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

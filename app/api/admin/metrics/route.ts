import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Datas para comparação
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1,
    );

    // Métricas atuais
    const [
      totalUsers,
      transactionsToday,
      newUsersThisMonth,
      activeSubscriptions,
      totalRevenue,
      lastMonthRevenue,
    ] = await Promise.all([
      db.users.count(),
      db.transactions.count({
        where: {
          created_at: {
            gte: new Date(today.setHours(0, 0, 0, 0)), // Início do dia
            lt: new Date(today.setHours(23, 59, 59, 999)), // Fim do dia
          },
        },
      }),
      db.users.count({
        where: {
          created_at: {
            gte: firstDayOfMonth,
          },
        },
      }),
      db.users.count({
        where: {
          stripe_subscription_id: {
            not: null,
          },
          stripe_current_period_end: {
            gt: new Date(),
          },
        },
      }),
      db.transactions.aggregate({
        where: {
          type: "INCOME",
          created_at: {
            gte: firstDayOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      }),
      db.transactions.aggregate({
        where: {
          type: "INCOME",
          created_at: {
            gte: firstDayOfLastMonth,
            lt: firstDayOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    // Métricas anteriores para comparação
    const [
      lastMonthUsers,
      yesterdayTransactions,
      lastMonthNewUsers,
      lastMonthActiveSubscriptions,
    ] = await Promise.all([
      db.users.count({
        where: {
          created_at: {
            lt: firstDayOfMonth,
            gte: firstDayOfLastMonth,
          },
        },
      }),
      db.transactions.count({
        where: {
          created_at: {
            gte: new Date(yesterday.setHours(0, 0, 0, 0)), // Início do dia anterior
            lt: new Date(yesterday.setHours(23, 59, 59, 999)), // Fim do dia anterior
          },
        },
      }),
      db.users.count({
        where: {
          created_at: {
            lt: firstDayOfMonth,
            gte: firstDayOfLastMonth,
          },
        },
      }),
      db.users.count({
        where: {
          stripe_subscription_id: {
            not: null,
          },
          stripe_current_period_end: {
            gt: firstDayOfMonth,
            lt: firstDayOfLastMonth,
          },
        },
      }),
    ]);

    // Calcula as variações percentuais
    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Number((((current - previous) / previous) * 100).toFixed(1));
    };

    return NextResponse.json({
      totalUsers,
      transactionsToday,
      newUsersThisMonth,
      userGrowth: calculateGrowth(newUsersThisMonth, lastMonthNewUsers),
      activeSubscriptions,
      totalRevenue: totalRevenue._sum.amount || 0,
      comparisons: {
        users: calculateGrowth(totalUsers, lastMonthUsers),
        transactions: calculateGrowth(transactionsToday, yesterdayTransactions),
        growth: calculateGrowth(newUsersThisMonth, lastMonthNewUsers),
        revenue: calculateGrowth(
          Number(totalRevenue._sum.amount || 0),
          Number(lastMonthRevenue._sum.amount || 0),
        ),
        subscriptions: calculateGrowth(
          activeSubscriptions,
          lastMonthActiveSubscriptions,
        ),
      },
    });
  } catch (error) {
    console.error("[METRICS_GET]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

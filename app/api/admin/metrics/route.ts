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
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1,
    );

    // Último dia do mês passado
    const lastDayOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0,
    );

    // Métricas atuais - usando apenas dados reais do banco
    const [
      totalUsers,
      transactionsToday,
      newUsersThisMonth,
      activeSubscriptions,
      totalRevenue,
      lastMonthRevenue,
    ] = await Promise.all([
      // Total de usuários no sistema
      db.users.count(),

      // Transações realizadas hoje
      db.transactions.count({
        where: {
          created_at: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)), // Início do dia atual
            lt: new Date(new Date().setHours(23, 59, 59, 999)), // Fim do dia atual
          },
        },
      }),

      // Novos usuários registrados neste mês
      db.users.count({
        where: {
          created_at: {
            gte: firstDayOfMonth,
          },
        },
      }),

      // Assinaturas ativas (com período atual válido)
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

      // Receita total deste mês (transações do tipo INCOME)
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

      // Receita do mês passado (transações do tipo INCOME)
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

    // Métricas anteriores para comparação - usando apenas dados reais do banco
    const [
      lastMonthUsers,
      yesterdayTransactions,
      lastMonthNewUsers,
      lastMonthActiveSubscriptions,
    ] = await Promise.all([
      // Total de usuários no mês passado
      db.users.count({
        where: {
          created_at: {
            lt: firstDayOfMonth,
            gte: firstDayOfLastMonth,
          },
        },
      }),

      // Transações realizadas ontem
      db.transactions.count({
        where: {
          created_at: {
            gte: new Date(new Date(yesterday).setHours(0, 0, 0, 0)), // Início do dia anterior
            lt: new Date(new Date(yesterday).setHours(23, 59, 59, 999)), // Fim do dia anterior
          },
        },
      }),

      // Novos usuários registrados no mês passado
      db.users.count({
        where: {
          created_at: {
            lt: firstDayOfMonth,
            gte: firstDayOfLastMonth,
          },
        },
      }),

      // Assinaturas ativas no mês passado
      db.users.count({
        where: {
          stripe_subscription_id: {
            not: null,
          },
          stripe_current_period_end: {
            gt: lastDayOfLastMonth,
          },
          created_at: {
            lt: firstDayOfMonth,
          },
        },
      }),
    ]);

    // Calcula as variações percentuais com tratamento para valores nulos ou zero
    const calculateGrowth = (current: number, previous: number) => {
      // Se ambos forem zero, não há crescimento
      if (current === 0 && previous === 0) return 0;

      // Se o valor anterior for zero, mas o atual não, é um crescimento de 100%
      if (previous === 0) return current > 0 ? 100 : 0;

      // Cálculo normal de crescimento percentual, limitado a 2 casas decimais
      return Number((((current - previous) / previous) * 100).toFixed(1));
    };

    // Valores seguros para evitar erros com valores nulos
    const safeRevenue = Number(totalRevenue._sum.amount || 0);
    const safeLastMonthRevenue = Number(lastMonthRevenue._sum.amount || 0);

    return NextResponse.json({
      // Dados principais
      totalUsers,
      transactionsToday,
      newUsersThisMonth,
      userGrowth: calculateGrowth(newUsersThisMonth, lastMonthNewUsers),
      activeSubscriptions,
      totalRevenue: safeRevenue,

      // Comparações com períodos anteriores
      comparisons: {
        users: calculateGrowth(totalUsers, lastMonthUsers),
        transactions: calculateGrowth(transactionsToday, yesterdayTransactions),
        growth: calculateGrowth(newUsersThisMonth, lastMonthNewUsers),
        revenue: calculateGrowth(safeRevenue, safeLastMonthRevenue),
        subscriptions: calculateGrowth(
          activeSubscriptions,
          lastMonthActiveSubscriptions,
        ),
      },

      // Adicionar timestamp para facilitar debug
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[METRICS_GET]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

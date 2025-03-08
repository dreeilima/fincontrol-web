import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { startOfMonth, subMonths } from "date-fns";

import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Início do mês atual
    const startOfCurrentMonth = startOfMonth(new Date());
    // Início do mês anterior
    const startOfLastMonth = startOfMonth(subMonths(new Date(), 1));

    // Buscar métricas
    const [
      totalUsers,
      newUsersThisMonth,
      lastMonthUsers,
      paidUsers,
      activeUsers,
    ] = await Promise.all([
      // Total de usuários
      db.user.count(),
      // Novos usuários este mês
      db.user.count({
        where: {
          createdAt: {
            gte: startOfCurrentMonth,
          },
        },
      }),
      // Usuários do mês passado
      db.user.count({
        where: {
          createdAt: {
            gte: startOfLastMonth,
            lt: startOfCurrentMonth,
          },
        },
      }),
      // Usuários pagantes
      db.user.count({
        where: {
          stripePriceId: {
            not: null,
          },
        },
      }),
      // Usuários ativos (com transações nos últimos 30 dias)
      db.user.count({
        where: {
          transactions: {
            some: {
              createdAt: {
                gte: subMonths(new Date(), 1),
              },
            },
          },
        },
      }),
    ]);

    // Calcular taxas
    const userGrowthRate = lastMonthUsers
      ? ((newUsersThisMonth - lastMonthUsers) / lastMonthUsers) * 100
      : 0;
    const conversionRate = (paidUsers / totalUsers) * 100;
    const retentionRate = (activeUsers / totalUsers) * 100;

    return NextResponse.json({
      totalUsers,
      newUsersThisMonth,
      userGrowthRate: Number(userGrowthRate.toFixed(1)),
      conversionRate: Number(conversionRate.toFixed(1)),
      retentionRate: Number(retentionRate.toFixed(1)),
    });
  } catch (error) {
    console.error("[GROWTH_METRICS]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

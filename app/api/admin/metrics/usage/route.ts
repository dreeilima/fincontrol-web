import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { endOfDay, startOfDay, startOfMonth, subDays } from "date-fns";

import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);
    const startOfCurrentMonth = startOfMonth(today);
    const thirtyDaysAgo = subDays(today, 30);

    // Buscar métricas
    const [
      dailyActiveUsers,
      monthlyActiveUsers,
      totalTransactions,
      totalCategories,
      topCategories,
    ] = await Promise.all([
      // Usuários ativos hoje
      db.users.count({
        where: {
          transactions: {
            some: {
              created_at: {
                gte: startOfToday,
                lte: endOfToday,
              },
            },
          },
        },
      }),
      // Usuários ativos este mês
      db.users.count({
        where: {
          transactions: {
            some: {
              created_at: {
                gte: startOfCurrentMonth,
              },
            },
          },
        },
      }),
      // Total de transações nos últimos 30 dias
      db.transactions.count({
        where: {
          created_at: {
            gte: thirtyDaysAgo,
          },
        },
      }),
      // Total de categorias
      db.categories.count(),
      // Top categorias mais usadas
      db.categories.findMany({
        select: {
          name: true,
          _count: {
            select: {
              transactions: true,
            },
          },
        },
        orderBy: {
          transactions: {
            _count: "desc",
          },
        },
        take: 5,
      }),
    ]);

    // Calcular média de transações por usuário
    const averageTransactionsPerUser = monthlyActiveUsers
      ? totalTransactions / monthlyActiveUsers
      : 0;

    // Calcular média de transações por dia
    const avgTransactionsPerDay = totalTransactions / 30;

    return NextResponse.json({
      dailyActiveUsers,
      monthlyActiveUsers,
      averageTransactionsPerUser: Number(averageTransactionsPerUser.toFixed(1)),
      topCategories: topCategories.map((cat) => ({
        name: cat.name,
        count: cat._count.transactions,
      })),
      systemUsage: {
        totalTransactions,
        totalCategories,
        avgTransactionsPerDay: Math.round(avgTransactionsPerDay),
      },
    });
  } catch (error) {
    console.error("[USAGE_METRICS]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

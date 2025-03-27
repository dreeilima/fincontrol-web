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
    const [totalUsers, transactionsToday, newUsersThisMonth] =
      await Promise.all([
        db.users.count(),
        db.transactions.count({
          where: {
            created_at: {
              gte: today,
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
      ]);

    // Métricas anteriores para comparação
    const [lastMonthUsers, yesterdayTransactions, lastMonthNewUsers] =
      await Promise.all([
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
              gte: yesterday,
              lt: today,
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
      comparisons: {
        users: calculateGrowth(totalUsers, lastMonthUsers),
        transactions: calculateGrowth(transactionsToday, yesterdayTransactions),
        growth: calculateGrowth(newUsersThisMonth, lastMonthNewUsers),
      },
    });
  } catch (error) {
    console.error("[METRICS_GET]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

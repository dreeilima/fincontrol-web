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
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1,
    );

    // Métricas atuais
    const [totalUsers, totalTransactions, totalCategories] = await Promise.all([
      db.users.count(),
      db.transactions.count(),
      db.categories.count(),
    ]);

    // Métricas do mês anterior
    const [lastMonthUsers, lastMonthTransactions] = await Promise.all([
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
      monthlyActiveUsers: totalUsers,
      systemUsage: {
        totalTransactions,
        totalCategories,
      },
      comparisons: {
        monthlyUsers: calculateGrowth(totalUsers, lastMonthUsers),
        transactions: calculateGrowth(totalTransactions, lastMonthTransactions),
      },
    });
  } catch (error) {
    console.error("[USAGE_METRICS_GET]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

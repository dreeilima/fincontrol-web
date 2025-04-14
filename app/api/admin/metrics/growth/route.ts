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
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1,
    );

    // Métricas atuais
    const [totalUsers, newUsersThisMonth] = await Promise.all([
      db.users.count(),
      db.users.count({
        where: {
          created_at: {
            gte: firstDayOfMonth,
          },
        },
      }),
    ]);

    // Métricas do mês anterior
    const [lastMonthUsers, lastMonthNewUsers] = await Promise.all([
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
      newUsersThisMonth,
      userGrowthRate: calculateGrowth(newUsersThisMonth, lastMonthNewUsers),
      conversionRate: 0, // Implementar lógica real
      retentionRate: 0, // Implementar lógica real
      comparisons: {
        users: calculateGrowth(totalUsers, lastMonthUsers),
        conversion: 0, // Implementar lógica real
        retention: 0, // Implementar lógica real
      },
    });
  } catch (error) {
    console.error("[GROWTH_METRICS_GET]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

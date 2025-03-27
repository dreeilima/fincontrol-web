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

    // Calcula as variações percentuais
    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Number((((current - previous) / previous) * 100).toFixed(1));
    };

    // Métricas simuladas por enquanto
    return NextResponse.json({
      monthlyRecurringRevenue: 5000,
      averageRevenuePerUser: 50,
      churnRate: 5,
      mrrGrowthRate: 10,
      totalRevenue: 15000,
      volume: 25000,
      comparisons: {
        mrr: 15,
        revenue: 8,
        volume: 12,
        churn: -2,
      },
    });
  } catch (error) {
    console.error("[FINANCIAL_METRICS_GET]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

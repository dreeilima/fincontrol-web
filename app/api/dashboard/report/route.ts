import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { endOfDay, startOfDay, subDays } from "date-fns";

import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Pegar parâmetros da URL
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "30"; // Padrão: 30 dias
    const categoryId = searchParams.get("categoryId");

    // Calcular datas baseado no período
    const endDate = endOfDay(new Date());
    const startDate = startOfDay(subDays(endDate, Number(period)));

    // Buscar transações do período
    const transactions = await db.transaction.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
        ...(categoryId ? { categoryId } : {}),
      },
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    // Calcular métricas
    const metrics = transactions.reduce(
      (acc, transaction) => {
        const amount = Number(transaction.amount);
        if (transaction.type === "INCOME") {
          acc.totalIncome += amount;
        } else {
          acc.totalExpense += amount;
        }
        return acc;
      },
      { totalIncome: 0, totalExpense: 0 },
    );

    // Agrupar por categoria para gráficos
    const spendingByCategory = await db.transaction.groupBy({
      by: ["categoryName"],
      where: {
        userId: session.user.id,
        type: "EXPENSE",
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    // Calcular evolução diária
    const dailyBalance = await db.transaction.groupBy({
      by: ["date"],
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return NextResponse.json({
      metrics: {
        totalIncome: metrics.totalIncome,
        totalExpense: metrics.totalExpense,
        balance: metrics.totalIncome - metrics.totalExpense,
        economyRate:
          metrics.totalIncome > 0
            ? ((metrics.totalIncome - metrics.totalExpense) /
                metrics.totalIncome) *
              100
            : 0,
      },
      spendingByCategory,
      dailyBalance,
      transactions: transactions.slice(0, 10), // Últimas 10 transações
    });
  } catch (error) {
    console.error("[REPORT]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

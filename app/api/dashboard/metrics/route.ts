import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { endOfMonth, startOfMonth } from "date-fns";

import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const startDate = startOfMonth(new Date());
    const endDate = endOfMonth(new Date());

    // Buscar transações do mês atual
    const transactions = await db.transactions.findMany({
      where: {
        user_id: session.user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Calcular métricas
    const metrics = transactions.reduce(
      (acc, transaction) => {
        const amount = Number(transaction.amount);

        if (transaction.type === "INCOME") {
          acc.monthlyIncome += amount;
        } else {
          acc.monthlyExpense += amount;
        }

        return acc;
      },
      { monthlyIncome: 0, monthlyExpense: 0 },
    );

    // Calcular saldo total (todas as transações)
    const allTransactions = await db.transactions.findMany({
      where: {
        user_id: session.user.id,
      },
    });

    const totalBalance = allTransactions.reduce((acc, transaction) => {
      const amount = Number(transaction.amount);
      return transaction.type === "INCOME" ? acc + amount : acc - amount;
    }, 0);

    return NextResponse.json({
      totalBalance,
      monthlyIncome: metrics.monthlyIncome,
      monthlyExpense: metrics.monthlyExpense,
      monthlyEconomy: metrics.monthlyIncome - metrics.monthlyExpense,
    });
  } catch (error) {
    console.error("[DASHBOARD_METRICS]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const [
      totalUsers,
      totalTransactions,
      totalCategories,
      totalIncome,
      totalExpense,
    ] = await Promise.all([
      db.user.count(),
      db.transaction.count(),
      db.category.count(),
      db.transaction.aggregate({
        where: { type: "INCOME" },
        _sum: { amount: true },
      }),
      db.transaction.aggregate({
        where: { type: "EXPENSE" },
        _sum: { amount: true },
      }),
    ]);

    return NextResponse.json({
      users: totalUsers,
      transactions: totalTransactions,
      categories: totalCategories,
      income: totalIncome._sum.amount || 0,
      expense: totalExpense._sum.amount || 0,
    });
  } catch (error) {
    console.error("[ADMIN_METRICS]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

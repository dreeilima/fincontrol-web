import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const year = parseInt(
      searchParams.get("year") || new Date().getFullYear().toString(),
    );

    const transactions = await db.transactions.findMany({
      where: {
        user_id: session.user.id,
        date: {
          gte: new Date(year, 0, 1),
          lt: new Date(year + 1, 0, 1),
        },
      },
      select: {
        amount: true,
        type: true,
        date: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    const formattedData = Array.from({ length: 12 }, (_, index) => {
      const month = new Date(year, index).toLocaleString("pt-BR", {
        month: "short",
      });

      const monthTransactions = transactions.filter(
        (item) => new Date(item.date).getMonth() === index,
      );

      const receitas = monthTransactions
        .filter((item) => item.type === "INCOME")
        .reduce((sum, item) => sum + item.amount.toNumber(), 0);

      const despesas = monthTransactions
        .filter((item) => item.type === "EXPENSE")
        .reduce((sum, item) => sum + item.amount.toNumber(), 0);

      return {
        name: month.charAt(0).toUpperCase() + month.slice(1, 3),
        receitas,
        despesas,
        saldo: receitas - despesas,
      };
    });

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("[MONTHLY_TRENDS_GET]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

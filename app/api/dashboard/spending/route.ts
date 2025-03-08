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

    // Buscar transações do mês atual agrupadas por categoria
    const spending = await db.transaction.groupBy({
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

    return NextResponse.json(spending);
  } catch (error) {
    console.error("[DASHBOARD_SPENDING]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

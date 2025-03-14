import { type } from "os";
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

    const spending = await db.transactions.groupBy({
      by: ["category"],
      where: {
        user_id: session.user.id,
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

    console.log("Dados de gastos:", spending); // Para debug

    return NextResponse.json(spending);
  } catch (error) {
    console.error("[DASHBOARD_SPENDING]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Obter parâmetros de data da URL
    const { searchParams } = new URL(req.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    // Definir datas padrão se não forem fornecidas
    const startDate = startDateParam
      ? new Date(startDateParam)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const endDate = endDateParam
      ? new Date(endDateParam)
      : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    // Contar transações do período
    const count = await db.transactions.count({
      where: {
        user_id: session.user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    console.log(`Contagem de transações para o usuário ${session.user.id}:`, {
      startDate,
      endDate,
      count,
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("[TRANSACTIONS_COUNT]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

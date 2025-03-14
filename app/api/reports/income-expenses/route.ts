import { NextResponse } from "next/server";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import getServerSession from "next-auth";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate || startDate === "null" || endDate === "null") {
      return NextResponse.json(
        { error: "Datas inicial e final são obrigatórias" },
        { status: 400 },
      );
    }

    const transactions = await prisma.transactions.findMany({
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
        user_id: session.user.id,
      },
      select: {
        date: true,
        amount: true,
        type: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    // Group by month
    const monthlyData = transactions.reduce(
      (acc, transaction) => {
        const monthKey = format(transaction.date, "MMM", { locale: ptBR });

        if (!acc[monthKey]) {
          acc[monthKey] = { receitas: 0, despesas: 0 };
        }

        if (transaction.type === "INCOME") {
          acc[monthKey].receitas += Number(transaction.amount);
        } else {
          acc[monthKey].despesas += Number(transaction.amount);
        }

        return acc;
      },
      {} as Record<string, { receitas: number; despesas: number }>,
    );

    // Convert to array format for the chart
    const chartData = Object.entries(monthlyData).map(([name, values]) => ({
      name,
      ...values,
    }));

    return NextResponse.json(chartData);
  } catch (error) {
    console.error("Erro ao gerar dados do gráfico:", error);
    return NextResponse.json(
      { error: "Erro ao gerar dados do gráfico" },
      { status: 500 },
    );
  }
}

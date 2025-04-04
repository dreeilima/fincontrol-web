import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";

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

    // Busca todas as categorias do usuário
    const categories = await db.categories.findMany({
      where: {
        user_id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        color: true,
      },
    });

    // Cria um map de categorias para fácil acesso
    const categoryMap = new Map(
      categories.map((cat) => [cat.id, { name: cat.name, color: cat.color }]),
    );

    const transactions = await db.transactions.findMany({
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
        user_id: session.user.id,
        type: "EXPENSE",
      },
      select: {
        amount: true,
        categoryId: true,
      },
    });

    // Calcula o total geral de despesas
    const totalExpenses = transactions.reduce(
      (total, t) => total + Math.abs(Number(t.amount)),
      0,
    );

    const categoryTotals = transactions.reduce(
      (acc, transaction) => {
        const categoryId = transaction.categoryId || "uncategorized";
        if (!acc[categoryId]) {
          acc[categoryId] = 0;
        }
        acc[categoryId] += Math.abs(Number(transaction.amount));
        return acc;
      },
      {} as Record<string, number>,
    );

    const chartData = Object.entries(categoryTotals)
      .map(([categoryId, value]) => {
        const category = categoryMap.get(categoryId) || {
          name: "Sem Categoria",
          color: "#4A4E69",
        };
        return {
          id: categoryId,
          name: category.name,
          value,
          percentage: (value / totalExpenses) * 100,
          color: category.color,
        };
      })
      .sort((a, b) => b.value - a.value);

    return NextResponse.json({
      data: chartData,
      total: totalExpenses,
    });
  } catch (error) {
    console.error("Erro ao gerar dados do gráfico:", error);
    return NextResponse.json(
      { error: "Erro ao gerar dados do gráfico" },
      { status: 500 },
    );
  }
}

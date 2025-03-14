import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { prisma } from "@/lib/prisma";

const CATEGORY_COLORS = {
  HOUSING: "#f97316",
  FOOD: "#ef4444",
  TRANSPORT: "#8b5cf6",
  HEALTH: "#06b6d4",
  LEISURE: "#22c55e",
  EDUCATION: "#3b82f6",
  OTHERS: "#6b7280",
};

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
        type: "EXPENSE",
      },
      select: {
        amount: true,
        category: true,
      },
    });

    const categoryTotals = transactions.reduce(
      (acc, transaction) => {
        const category = transaction.category || "OTHERS";
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += Number(transaction.amount);
        return acc;
      },
      {} as Record<string, number>,
    );

    const chartData = Object.entries(categoryTotals).map(
      ([category, value]) => ({
        name: getCategoryName(category),
        value,
        color:
          CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] ||
          CATEGORY_COLORS.OTHERS,
      }),
    );

    return NextResponse.json(chartData);
  } catch (error) {
    console.error("Erro ao gerar dados do gráfico:", error);
    return NextResponse.json(
      { error: "Erro ao gerar dados do gráfico" },
      { status: 500 },
    );
  }
}

function getCategoryName(category: string): string {
  const categoryNames: Record<string, string> = {
    HOUSING: "Moradia",
    FOOD: "Alimentação",
    TRANSPORT: "Transporte",
    HEALTH: "Saúde",
    LEISURE: "Lazer",
    EDUCATION: "Educação",
    OTHERS: "Outros",
  };

  return categoryNames[category] || "Outros";
}

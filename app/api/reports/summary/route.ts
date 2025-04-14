import { auth } from "@/auth";

import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Check if dates are valid
    if (!startDate || !endDate || startDate === "null" || endDate === "null") {
      return Response.json(
        { error: "Datas inicial e final são obrigatórias" },
        { status: 400 },
      );
    }

    // Validate if dates are valid before creating Date objects
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return Response.json(
        { error: "Datas inválidas fornecidas" },
        { status: 400 },
      );
    }

    const transactions = await db.transactions.findMany({
      where: {
        user_id: session.user.id,
        date: {
          gte: startDateObj,
          lte: endDateObj,
        },
      },
      select: {
        type: true,
        amount: true,
        categoryId: true,
        category: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    // Cálculos básicos
    const totalIncome = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((acc, t) => acc + Number(t.amount), 0);

    const totalExpense = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((acc, t) => acc + Math.abs(Number(t.amount)), 0);

    const balance = totalIncome - totalExpense;

    // Métricas adicionais
    // Taxa de economia: (Receita - Despesa) / Receita * 100, limitada a 100%
    const savingsRate =
      totalIncome > 0
        ? Math.min(((totalIncome - totalExpense) / totalIncome) * 100, 100)
        : 0;

    // Média diária de gastos
    const daysDiff = Math.max(
      1,
      Math.ceil(
        (endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24),
      ),
    );
    const dailyExpenseAvg = totalExpense / daysDiff;

    // Maiores categorias de despesa (limitando a porcentagem a 100%)
    const expensesByCategory = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce(
        (acc, t) => {
          const categoryName = t.category || "Sem Categoria";
          acc[categoryName] =
            (acc[categoryName] || 0) + Math.abs(Number(t.amount));
          return acc;
        },
        {} as Record<string, number>,
      );

    const topExpenseCategories = Object.entries(expensesByCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category, amount]) => ({
        category,
        amount: Math.abs(amount),
        percentage: Math.abs((amount / totalExpense) * 100),
      }));

    return Response.json({
      totalIncome,
      totalExpense,
      balance,
      savingsRate: Number(savingsRate.toFixed(1)),
      dailyExpenseAvg,
      topExpenseCategories,
      periodDays: daysDiff,
    });
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    return Response.json({ error: "Erro ao gerar relatório" }, { status: 500 });
  }
}

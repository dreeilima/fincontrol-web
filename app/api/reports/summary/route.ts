import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Check if dates are valid
    if (!startDate || !endDate || startDate === "null" || endDate === "null") {
      return NextResponse.json(
        { error: "Datas inicial e final são obrigatórias" },
        { status: 400 },
      );
    }

    // Validate if dates are valid before creating Date objects
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return NextResponse.json(
        { error: "Datas inválidas fornecidas" },
        { status: 400 },
      );
    }

    const transactions = await prisma.transactions.findMany({
      where: {
        date: {
          gte: startDateObj,
          lte: endDateObj,
        },
        user_id: {
          not: startDateObj.toISOString(),
        },
      },
      select: {
        type: true,
        amount: true,
      },
    });

    console.log("Transactions found:", transactions); // Debug log

    const totalIncome = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((acc, t) => acc + Number(t.amount), 0);

    const totalExpense = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((acc, t) => acc + Number(t.amount), 0);

    const balance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

    return NextResponse.json({
      totalIncome,
      totalExpense,
      balance,
      savingsRate: Number(savingsRate.toFixed(1)),
    });
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    return NextResponse.json(
      { error: "Erro ao gerar relatório" },
      { status: 500 },
    );
  }
}

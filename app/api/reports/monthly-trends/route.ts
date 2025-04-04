import { auth } from "@/auth";
import { addDays, differenceInDays, parseISO, startOfDay } from "date-fns";

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

    if (!startDate || !endDate) {
      return Response.json(
        { error: "Data inicial e final são obrigatórias" },
        { status: 400 },
      );
    }

    const parsedStartDate = parseISO(startDate);
    const parsedEndDate = parseISO(endDate);
    const daysDifference = differenceInDays(parsedEndDate, parsedStartDate);

    // Determina a granularidade baseada no período
    let groupBy = "day";
    if (daysDifference > 90) {
      // Mais de 3 meses
      groupBy = "month";
    } else if (daysDifference > 31) {
      // Mais de 1 mês
      groupBy = "week";
    }

    const transactions = await db.transactions.findMany({
      where: {
        user_id: session.user.id,
        date: {
          gte: parsedStartDate,
          lte: parsedEndDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // Agrupa transações baseado na granularidade
    const groupedData = new Map<string, any>();

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      let key;

      if (groupBy === "month") {
        key = date.toISOString().substring(0, 7); // YYYY-MM
      } else if (groupBy === "week") {
        // Encontra o início da semana
        const weekStart = startOfDay(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString();
      } else {
        key = date.toISOString().split("T")[0]; // YYYY-MM-DD
      }

      if (!groupedData.has(key)) {
        groupedData.set(key, {
          date: key,
          income: 0,
          expenses: 0,
          balance: 0,
        });
      }

      const amount = Number(transaction.amount);
      const data = groupedData.get(key);

      if (transaction.type === "INCOME") {
        data.income += amount;
        data.balance += amount;
      } else {
        data.expenses += amount;
        data.balance -= amount;
      }
    });

    // Preenche datas vazias para manter continuidade no gráfico
    interface DataPoint {
      date: string;
      income: number;
      expenses: number;
      balance: number;
    }

    const filledData: DataPoint[] = [];
    if (transactions.length > 0) {
      let currentDate = parsedStartDate;

      while (currentDate <= parsedEndDate) {
        let key;

        if (groupBy === "month") {
          key = currentDate.toISOString().substring(0, 7);
          currentDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            1,
          );
        } else if (groupBy === "week") {
          const weekStart = startOfDay(currentDate);
          weekStart.setDate(currentDate.getDate() - currentDate.getDay());
          key = weekStart.toISOString();
          currentDate = addDays(currentDate, 7);
        } else {
          key = currentDate.toISOString().split("T")[0];
          currentDate = addDays(currentDate, 1);
        }

        filledData.push(
          groupedData.get(key) || {
            date: key,
            income: 0,
            expenses: 0,
            balance: 0,
          },
        );
      }
    }

    return Response.json({
      data: filledData,
      granularity: groupBy,
    });
  } catch (error) {
    console.error("Erro ao buscar tendências mensais:", error);
    return Response.json(
      { error: "Erro ao buscar tendências mensais" },
      { status: 500 },
    );
  }
}

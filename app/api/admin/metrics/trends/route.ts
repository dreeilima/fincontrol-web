import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { format, subDays } from "date-fns";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Buscar dados dos últimos 30 dias
    const days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), i);
      return {
        date: format(date, "yyyy-MM-dd"),
        start: new Date(date.setHours(0, 0, 0, 0)),
        end: new Date(date.setHours(23, 59, 59, 999)),
      };
    }).reverse();

    const trendsData = await Promise.all(
      days.map(async ({ date, start, end }) => {
        const [users, transactions, subscriptions] = await Promise.all([
          // Novos usuários por dia
          db.users.count({
            where: {
              created_at: {
                gte: start,
                lte: end,
              },
            },
          }),
          // Transações por dia
          db.transactions.count({
            where: {
              created_at: {
                gte: start,
                lte: end,
              },
            },
          }),
          // Receita por dia (via Stripe)
          stripe.charges.list({
            created: {
              gte: Math.floor(start.getTime() / 1000),
              lte: Math.floor(end.getTime() / 1000),
            },
            limit: 100,
          }),
        ]);

        const revenue = subscriptions.data.reduce(
          (acc, charge) => acc + (charge.amount || 0) / 100,
          0,
        );

        return {
          date: format(new Date(date), "dd/MM"),
          users,
          transactions,
          revenue,
        };
      }),
    );

    return NextResponse.json(trendsData);
  } catch (error) {
    console.error("[TRENDS_METRICS]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

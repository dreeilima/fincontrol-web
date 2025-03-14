import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { format, startOfMonth, subMonths } from "date-fns";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Buscar dados dos últimos 6 meses
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), i);
      return {
        month: format(date, "MMM"),
        startDate: startOfMonth(date),
        endDate: startOfMonth(subMonths(date, -1)),
      };
    }).reverse();

    // Buscar dados financeiros e métricas
    const reportsData = await Promise.all(
      months.map(async ({ startDate, endDate }) => {
        const [revenue, costs, users, conversions] = await Promise.all([
          // Receita total (via Stripe)
          stripe.charges
            .list({
              created: {
                gte: Math.floor(startDate.getTime() / 1000),
                lt: Math.floor(endDate.getTime() / 1000),
              },
            })
            .then(
              (charges) =>
                charges.data.reduce(
                  (acc, charge) => acc + (charge.amount || 0),
                  0,
                ) / 100,
            ),

          // Custos (transações do tipo EXPENSE)
          db.transactions
            .aggregate({
              where: {
                type: "EXPENSE",
                created_at: {
                  gte: startDate,
                  lt: endDate,
                },
              },
              _sum: {
                amount: true,
              },
            })
            .then((result) => Number(result._sum.amount || 0)),

          // Novos usuários
          db.users.count({
            where: {
              created_at: {
                gte: startDate,
                lt: endDate,
              },
            },
          }),

          // Taxa de conversão (usuários que fizeram upgrade para plano pago)
          db.users
            .count({
              where: {
                stripe_price_id: {
                  not: null,
                },
                created_at: {
                  gte: startDate,
                  lt: endDate,
                },
              },
            })
            .then((paidUsers) => ({
              total: paidUsers,
              rate: paidUsers ? (paidUsers / users) * 100 : 0,
            })),
        ]);

        return {
          revenue,
          costs,
          users,
          conversions,
        };
      }),
    );

    return NextResponse.json({
      labels: months.map((m) => m.month),
      datasets: {
        revenue: reportsData.map((d) => d.revenue),
        costs: reportsData.map((d) => d.costs),
        users: reportsData.map((d) => d.users),
        conversions: reportsData.map((d) => d.conversions.rate),
      },
    });
  } catch (error) {
    console.error("[ADMIN_REPORTS]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

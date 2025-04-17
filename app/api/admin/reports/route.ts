import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { format, startOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const year =
      searchParams.get("year") || new Date().getFullYear().toString();
    const month =
      searchParams.get("month") || (new Date().getMonth() + 1).toString();

    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Data atual para comparações
    const currentDate = new Date();

    // Buscar dados dos últimos 6 meses (usando dados reais)
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(currentDate, i);
      return {
        month: format(date, "MMM", { locale: ptBR }),
        startDate: startOfMonth(date),
        endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0), // Último dia do mês
      };
    }).reverse();

    // Buscar dados financeiros e métricas usando dados reais
    const reportsData = await Promise.all(
      months.map(async ({ startDate, endDate }) => {
        const [revenue, costs, users, conversions] = await Promise.all([
          // Receita total (combinando dados do Stripe e transações do banco)
          Promise.all([
            // Receita das transações do tipo INCOME
            db.transactions
              .aggregate({
                where: {
                  type: "INCOME",
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

            // Receita do Stripe (pagamentos de assinaturas)
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
              )
              .catch(() => 0), // Em caso de erro, retorna 0
          ]).then(([dbRevenue, stripeRevenue]) => dbRevenue + stripeRevenue),

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

          // Novos usuários registrados no período
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
            .then((paidUsers) => {
              // Calcular a taxa de conversão com tratamento para divisão por zero
              const totalUsers = users || 1; // Evita divisão por zero
              const rate = paidUsers ? (paidUsers / totalUsers) * 100 : 0;
              return {
                total: paidUsers,
                rate: Number(rate.toFixed(1)), // Limita a 1 casa decimal
              };
            }),
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
        revenue: reportsData.map((d) => d.revenue || 0),
        costs: reportsData.map((d) => d.costs || 0),
        users: reportsData.map((d) => d.users || 0),
        conversions: reportsData.map((d) => d.conversions?.rate || 0),
      },
      // Adicionar dados adicionais para debug e auditoria
      metadata: {
        timestamp: new Date().toISOString(),
        period: {
          year,
          month,
        },
        dataPoints: reportsData.length,
      },
    });
  } catch (error) {
    console.error("[ADMIN_REPORTS]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

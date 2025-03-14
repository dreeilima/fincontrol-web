import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { format, startOfMonth, subMonths } from "date-fns";

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

    // Calcular datas do mês selecionado
    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0);

    // Últimos 6 meses para o gráfico de receita
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), i);
      return {
        month: format(date, "MMM"),
        startDate: startOfMonth(date),
        endDate: startOfMonth(subMonths(date, -1)),
      };
    }).reverse();

    // Buscar todas as métricas em paralelo
    const [monthlyRevenue, usersData, plansDistribution] = await Promise.all([
      // Receita mensal dos últimos 6 meses
      Promise.all(
        months.map(async ({ startDate, endDate }) =>
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
        ),
      ),

      // Dados de usuários ativos dos últimos 6 meses
      Promise.all(
        months.map(({ startDate, endDate }) =>
          db.users.count({
            where: {
              created_at: {
                gte: startDate,
                lt: endDate,
              },
            },
          }),
        ),
      ),

      // Distribuição atual dos planos
      Promise.all([
        // Usuários no plano Basic
        db.users.count({
          where: {
            stripe_price_id: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
          },
        }),
        // Usuários no plano Pro
        db.users.count({
          where: {
            stripe_price_id:
              process.env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID,
          },
        }),
      ]),
    ]);

    // Calcular crescimento da receita
    const lastMonthRevenue = monthlyRevenue[monthlyRevenue.length - 1];
    const previousMonthRevenue = monthlyRevenue[monthlyRevenue.length - 2];
    const revenueGrowth = previousMonthRevenue
      ? ((lastMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
      : 0;

    // Calcular crescimento de usuários
    const lastMonthUsers = usersData[usersData.length - 1];
    const previousMonthUsers = usersData[usersData.length - 2];
    const userGrowth = previousMonthUsers
      ? ((lastMonthUsers - previousMonthUsers) / previousMonthUsers) * 100
      : 0;

    return NextResponse.json({
      revenue: {
        total: monthlyRevenue.reduce((acc, curr) => acc + curr, 0),
        growth: revenueGrowth,
        monthly: monthlyRevenue,
      },
      users: {
        total: usersData[usersData.length - 1],
        growth: userGrowth,
        monthly: usersData,
      },
      plans: {
        basic: plansDistribution[0],
        pro: plansDistribution[1],
      },
      months: months.map((m) => m.month),
    });
  } catch (error) {
    console.error("[ADMIN_METRICS_OVERVIEW]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

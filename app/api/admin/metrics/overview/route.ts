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

    // Calcular datas do mês selecionado
    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0);

    // Data atual para comparações
    const currentDate = new Date();

    // Últimos 6 meses para o gráfico de receita (usando dados reais)
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(currentDate, i);
      return {
        month: format(date, "MMM", { locale: ptBR }),
        startDate: startOfMonth(date),
        endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0), // Último dia do mês
      };
    }).reverse();

    // Buscar todas as métricas em paralelo usando dados reais
    const [monthlyRevenue, usersData, plansDistribution] = await Promise.all([
      // Receita mensal dos últimos 6 meses (usando transações reais do banco)
      Promise.all(
        months.map(async ({ startDate, endDate }) => {
          // Buscar receita das transações do tipo INCOME
          const transactionRevenue = await db.transactions.aggregate({
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
          });

          // Buscar receita do Stripe (pagamentos de assinaturas)
          const stripeRevenue = await stripe.charges
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
            .catch(() => 0); // Em caso de erro, retorna 0

          // Retorna a soma das duas receitas
          return Number(transactionRevenue._sum.amount || 0) + stripeRevenue;
        }),
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

      // Distribuição atual dos planos (usando dados reais do banco)
      Promise.all([
        // Usuários no plano Básico (gratuito)
        db.users.count({
          where: {
            OR: [
              { stripe_price_id: null }, // Usuários sem assinatura
              { stripe_subscription_id: null }, // Usuários sem assinatura
            ],
          },
        }),
        // Usuários no plano Premium (pago)
        db.users.count({
          where: {
            AND: [
              { stripe_price_id: { not: null } }, // Com ID de preço
              { stripe_subscription_id: { not: null } }, // Com ID de assinatura
            ],
          },
        }),
      ]),
    ]);

    // Função para calcular crescimento percentual com tratamento de casos especiais
    const calculateGrowth = (current: number, previous: number) => {
      // Se ambos forem zero, não há crescimento
      if (current === 0 && previous === 0) return 0;

      // Se o valor anterior for zero, mas o atual não, é um crescimento de 100%
      if (previous === 0) return current > 0 ? 100 : 0;

      // Cálculo normal de crescimento percentual, limitado a 1 casa decimal
      return Number((((current - previous) / previous) * 100).toFixed(1));
    };

    // Calcular crescimento da receita usando dados reais
    const lastMonthRevenue = monthlyRevenue[monthlyRevenue.length - 1] || 0;
    const previousMonthRevenue = monthlyRevenue[monthlyRevenue.length - 2] || 0;
    const revenueGrowth = calculateGrowth(
      lastMonthRevenue,
      previousMonthRevenue,
    );

    // Calcular crescimento de usuários usando dados reais
    const lastMonthUsers = usersData[usersData.length - 1] || 0;
    const previousMonthUsers = usersData[usersData.length - 2] || 0;
    const userGrowth = calculateGrowth(lastMonthUsers, previousMonthUsers);

    // Calcular receita total real (soma de todos os meses)
    const totalRevenue = monthlyRevenue.reduce(
      (acc, curr) => acc + (curr || 0),
      0,
    );

    return NextResponse.json({
      revenue: {
        total: totalRevenue,
        growth: revenueGrowth,
        monthly: monthlyRevenue,
      },
      users: {
        total: lastMonthUsers,
        growth: userGrowth,
        monthly: usersData,
      },
      plans: {
        basic: plansDistribution[0] || 0,
        premium: plansDistribution[1] || 0,
      },
      months: months.map((m) => m.month),
      // Adicionar timestamp para facilitar debug
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[ADMIN_METRICS_OVERVIEW]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

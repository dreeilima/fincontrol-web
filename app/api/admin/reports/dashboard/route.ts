import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { format, parseISO, startOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    // Validar autenticação e permissão de administrador
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Definir período padrão (últimos 3 meses) se não especificado
    const from = fromParam ? parseISO(fromParam) : subMonths(new Date(), 3);
    const to = toParam ? parseISO(toParam) : new Date();

    // Gerar array de meses no período selecionado
    const months = [];
    let currentMonth = startOfMonth(from);
    const endMonth = startOfMonth(to);

    while (currentMonth <= endMonth) {
      months.push({
        month: format(currentMonth, "MMM", { locale: ptBR }),
        startDate: new Date(currentMonth),
        endDate: new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1,
          0,
          23,
          59,
          59
        ),
      });
      currentMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      );
    }

    // Buscar dados financeiros
    const financialData = await Promise.all(
      months.map(async ({ startDate, endDate, month }) => {
        // Receita mensal recorrente (MRR) - assinaturas ativas
        const subscriptions = await db.subscriptions.findMany({
          where: {
            status: "active",
            start_date: {
              lte: endDate,
            },
            OR: [
              {
                end_date: {
                  gte: startDate,
                },
              },
              {
                stripe_current_period_end: {
                  gte: startDate,
                },
              },
            ],
          },
          include: {
            plan: true,
          },
        });

        const mrr = subscriptions.reduce(
          (total, sub) => total + (sub.plan?.price || 0),
          0
        );

        // Receita total do mês (transações + assinaturas)
        const transactionsRevenue = await db.transactions.aggregate({
          where: {
            type: "INCOME",
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
          _sum: {
            amount: true,
          },
        });

        // Novos usuários no mês
        const newUsers = await db.users.count({
          where: {
            created_at: {
              gte: startDate,
              lte: endDate,
            },
          },
        });

        // Usuários que cancelaram no mês (churn)
        const churnedUsers = await db.subscriptions.count({
          where: {
            end_date: {
              gte: startDate,
              lte: endDate,
            },
            status: "inactive",
          },
        });

        // Total de usuários ativos no final do mês
        const activeUsers = await db.users.count({
          where: {
            created_at: {
              lte: endDate,
            },
            is_active: true,
          },
        });

        // Taxa de churn
        const churnRate = activeUsers > 0 ? (churnedUsers / activeUsers) * 100 : 0;

        return {
          month,
          revenue: Number(transactionsRevenue._sum.amount || 0) + mrr,
          newUsers,
          churnRate: parseFloat(churnRate.toFixed(2)),
          mrr,
        };
      })
    );

    // Calcular métricas de usuários
    const [totalUsers, activeUsers, userTransactions, userCategories, planDistribution] =
      await Promise.all([
        // Total de usuários
        db.users.count(),
        
        // Usuários ativos
        db.users.count({
          where: {
            is_active: true,
          },
        }),
        
        // Média de transações por usuário
        db.transactions.groupBy({
          by: ["user_id"],
          _count: {
            id: true,
          },
        }).then(result => {
          if (result.length === 0) return 0;
          const total = result.reduce((sum, item) => sum + item._count.id, 0);
          return total / result.length;
        }),
        
        // Média de categorias por usuário
        db.categories.groupBy({
          by: ["user_id"],
          _count: {
            id: true,
          },
        }).then(result => {
          if (result.length === 0) return 0;
          const total = result.reduce((sum, item) => sum + item._count.id, 0);
          return total / result.length;
        }),
        
        // Distribuição de planos
        Promise.all([
          // Plano básico (gratuito)
          db.users.count({
            where: {
              OR: [
                { stripe_price_id: null },
                { stripe_subscription_id: null },
              ],
            },
          }),
          
          // Plano premium
          db.users.count({
            where: {
              AND: [
                { stripe_price_id: { not: null } },
                { stripe_subscription_id: { not: null } },
              ],
            },
          }),
        ]),
      ]);

    // Calcular taxa de conversão
    const conversionRate = totalUsers > 0 
      ? (planDistribution[1] / totalUsers) * 100 
      : 0;

    // Calcular taxa de retenção (usuários ativos / total de usuários)
    const retentionRate = totalUsers > 0 
      ? (activeUsers / totalUsers) * 100 
      : 0;

    // Calcular crescimento de receita e usuários
    const currentMonthRevenue = financialData[financialData.length - 1]?.revenue || 0;
    const previousMonthRevenue = financialData[financialData.length - 2]?.revenue || 0;
    const revenueGrowth = previousMonthRevenue > 0 
      ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
      : 0;

    const currentMonthUsers = financialData[financialData.length - 1]?.newUsers || 0;
    const previousMonthUsers = financialData[financialData.length - 2]?.newUsers || 0;
    const userGrowth = previousMonthUsers > 0 
      ? ((currentMonthUsers - previousMonthUsers) / previousMonthUsers) * 100 
      : 0;

    // Calcular MRR atual e crescimento
    const currentMRR = financialData[financialData.length - 1]?.mrr || 0;
    const previousMRR = financialData[financialData.length - 2]?.mrr || 0;
    const mrrGrowth = previousMRR > 0 
      ? ((currentMRR - previousMRR) / previousMRR) * 100 
      : 0;

    // Calcular receita média por usuário
    const avgRevenuePerUser = activeUsers > 0 
      ? currentMonthRevenue / activeUsers 
      : 0;

    // Montar resposta
    return NextResponse.json({
      financial: {
        mrr: currentMRR,
        mrrGrowth: parseFloat(mrrGrowth.toFixed(2)),
        totalRevenue: financialData.reduce((sum, month) => sum + month.revenue, 0),
        revenueGrowth: parseFloat(revenueGrowth.toFixed(2)),
        avgRevenuePerUser: parseFloat(avgRevenuePerUser.toFixed(2)),
        conversionRate: parseFloat(conversionRate.toFixed(2)),
        monthlyData: financialData.map(month => ({
          month: month.month,
          revenue: month.revenue,
          newUsers: month.newUsers,
          churnRate: month.churnRate,
        })),
      },
      users: {
        totalUsers,
        activeUsers,
        userGrowth: parseFloat(userGrowth.toFixed(2)),
        avgTransactionsPerUser: parseFloat(userTransactions.toFixed(2)),
        avgCategoriesPerUser: parseFloat(userCategories.toFixed(2)),
        retentionRate: parseFloat(retentionRate.toFixed(2)),
        planDistribution: {
          basic: planDistribution[0],
          premium: planDistribution[1],
        },
      },
      dateRange: {
        from: from.toISOString(),
        to: to.toISOString(),
      },
    });
  } catch (error) {
    console.error("[ADMIN_REPORTS_DASHBOARD]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

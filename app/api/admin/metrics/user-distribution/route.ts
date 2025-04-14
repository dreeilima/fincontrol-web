import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { subDays } from "date-fns";

import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Buscar distribuição por plano
    const planCounts = await db.users.groupBy({
      by: ["stripe_price_id"],
      _count: true,
    });

    // Buscar usuários ativos/inativos (ativos = com transações nos últimos 30 dias)
    const thirtyDaysAgo = subDays(new Date(), 30);
    const [activeUsers, totalUsers] = await Promise.all([
      db.users.count({
        where: {
          transactions: {
            some: {
              created_at: {
                gte: thirtyDaysAgo,
              },
            },
          },
        },
      }),
      db.users.count(),
    ]);

    const inactiveUsers = totalUsers - activeUsers;

    return NextResponse.json({
      planDistribution: [
        {
          name: "Free",
          value:
            planCounts.find((p) => p.stripe_price_id === null)?._count || 0,
          color: "#94a3b8",
        },
        {
          name: "Pro",
          value:
            planCounts.find((p) => p.stripe_price_id?.includes("pro"))
              ?._count || 0,
          color: "#0ea5e9",
        },
        {
          name: "Premium",
          value:
            planCounts.find((p) => p.stripe_price_id?.includes("premium"))
              ?._count || 0,
          color: "#8b5cf6",
        },
      ],
      statusDistribution: [
        {
          name: "Ativos",
          value: activeUsers,
          color: "#22c55e",
        },
        {
          name: "Inativos",
          value: inactiveUsers,
          color: "#ef4444",
        },
      ],
    });
  } catch (error) {
    console.error("[USER_DISTRIBUTION]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Buscar dados reais de distribuição de planos
    const [basicPlan, premiumPlan] = await Promise.all([
      // Usuários com plano básico (gratuito)
      db.users.count({
        where: {
          OR: [
            { stripe_price_id: null }, // Sem assinatura
            { stripe_subscription_id: null }, // Sem assinatura
          ],
        },
      }),

      // Usuários com plano premium (pago)
      db.users.count({
        where: {
          AND: [
            { stripe_price_id: { not: null } }, // Com ID de preço
            { stripe_subscription_id: { not: null } }, // Com ID de assinatura
          ],
        },
      }),
    ]);

    return NextResponse.json({
      labels: ["Básico", "Premium"],
      values: [basicPlan, premiumPlan],
      // Adicionar timestamp para facilitar debug
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[ADMIN_PLANS_DISTRIBUTION]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

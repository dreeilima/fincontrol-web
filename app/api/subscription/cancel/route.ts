import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Busca a assinatura atual do usuário
    const subscription = await db.subscriptions.findUnique({
      where: { user_id: session.user.id },
    });

    if (!subscription) {
      return new NextResponse("Assinatura não encontrada", { status: 404 });
    }

    // Verificar se existe um ID de assinatura do Stripe válido
    if (!subscription.stripe_subscription_id) {
      // Para assinaturas gratuitas, apenas atualizar o status no banco
      console.log("[SUBSCRIPTION_CANCEL_INFO] Cancelando assinatura gratuita");

      await db.subscriptions.update({
        where: { user_id: session.user.id },
        data: {
          status: "canceled",
          plan: "basic", // Garantir que a assinatura seja marcada como plano básico
        },
      });

      return NextResponse.json({ success: true });
    }

    // Cancela a assinatura no Stripe - usando cancel_at_period_end para manter acesso até o fim do período
    await stripe.subscriptions.update(
      subscription.stripe_subscription_id as string,
      {
        cancel_at_period_end: true,
      },
    );

    // Atualiza o status no banco de dados para "canceling" (será cancelado no fim do período)
    await db.subscriptions.update({
      where: { user_id: session.user.id },
      data: {
        status: "canceling", // Status intermediário, indica que será cancelado no fim do período
      },
    });

    // Quando o webhook do Stripe for acionado no fim do período, o status será atualizado para "canceled"
    // e o plano será alterado para "basic"

    return NextResponse.json({
      success: true,
      message: "Assinatura será cancelada no fim do período atual",
    });
  } catch (error) {
    console.error("[SUBSCRIPTION_CANCEL_ERROR]", error);
    return new NextResponse("Erro ao cancelar assinatura", { status: 500 });
  }
}

export const runtime = "nodejs";

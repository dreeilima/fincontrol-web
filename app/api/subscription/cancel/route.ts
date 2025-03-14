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

    // Cancela a assinatura no Stripe
    await stripe.subscriptions.cancel(
      subscription.stripe_subscription_id as string,
    );

    // Atualiza o status no banco de dados
    await db.subscriptions.update({
      where: { user_id: session.user.id },
      data: {
        status: "canceled",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SUBSCRIPTION_CANCEL_ERROR]", error);
    return new NextResponse("Erro ao cancelar assinatura", { status: 500 });
  }
}

export const runtime = "nodejs";

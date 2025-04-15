import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const subscription = await db.subscriptions.findUnique({
      where: { user_id: session.user.id },
    });

    if (!subscription) {
      return new NextResponse("Assinatura não encontrada", { status: 404 });
    }

    if (!subscription.stripe_subscription_id) {
      console.log(
        "[SUBSCRIPTION_INVOICES_INFO] Assinatura gratuita sem faturas",
      );
      return NextResponse.json([]);
    }

    const invoices = await stripe.invoices.list({
      subscription: subscription.stripe_subscription_id as string,
    });

    return NextResponse.json(invoices.data);
  } catch (error) {
    console.error("[SUBSCRIPTION_INVOICES_ERROR]", error);
    return new NextResponse("Erro ao buscar faturas", { status: 500 });
  }
}

export const runtime = "nodejs";

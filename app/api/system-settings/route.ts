import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Verificar se o usuário tem uma assinatura premium
    const userSubscription = await db.subscriptions.findFirst({
      where: { 
        user_id: session.user.id,
        status: "active",
      },
      include: { plan: true },
    });

    // Se o usuário tem um plano premium, não aplicamos limites
    if (userSubscription?.plan?.price > 0) {
      return NextResponse.json({
        max_categories: null, // null significa sem limite
        max_transactions: null, // null significa sem limite
        default_currency: "BRL",
        date_format: "DD/MM/YYYY",
        decimal_separator: ",",
        thousands_separator: ".",
      });
    }

    // Buscar configurações do sistema
    const settings = await db.system_settings.findFirst();
    if (!settings) {
      // Valores padrão caso não existam configurações
      return NextResponse.json({
        max_categories: 10,
        max_transactions: 100,
        default_currency: "BRL",
        date_format: "DD/MM/YYYY",
        decimal_separator: ",",
        thousands_separator: ".",
      });
    }

    // Retornar apenas os campos necessários para o usuário
    return NextResponse.json({
      max_categories: settings.max_categories,
      max_transactions: settings.max_transactions,
      default_currency: settings.default_currency,
      date_format: settings.date_format,
      decimal_separator: settings.decimal_separator,
      thousands_separator: settings.thousands_separator,
    });
  } catch (error) {
    console.error("[SYSTEM_SETTINGS_GET]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

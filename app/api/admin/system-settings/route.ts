import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getServerSession } from "next-auth";

import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const settings = await db.system_settings.findFirst();
    if (!settings) {
      // Se não existir configurações, cria com valores padrão
      const defaultSettings = await db.system_settings.create({
        data: {
          default_currency: "BRL",
          date_format: "DD/MM/YYYY",
          time_format: "HH:mm",
          decimal_separator: ",",
          thousands_separator: ".",
          max_categories: 10,
          max_transactions: 100,
          max_file_size: 5,
          max_users: 100,
          max_plans: 5,
          max_features_per_plan: 10,
        },
      });
      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("[SYSTEM_SETTINGS_GET]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      console.error("Usuário não autorizado:", session?.user);
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const body = await req.json();
    console.log("Dados recebidos:", body);

    // Extrair apenas os campos que existem no modelo
    const {
      default_currency,
      date_format,
      time_format,
      decimal_separator,
      thousands_separator,
      max_categories,
      max_transactions,
      max_file_size,
      max_users,
      max_plans,
      max_features_per_plan,
    } = body;

    const settings = await db.system_settings.findFirst();
    if (!settings) {
      // Se não existir configurações, cria com os novos valores
      const newSettings = await db.system_settings.create({
        data: {
          default_currency,
          date_format,
          time_format,
          decimal_separator,
          thousands_separator,
          max_categories,
          max_transactions,
          max_file_size,
          max_users,
          max_plans,
          max_features_per_plan,
        },
      });
      return NextResponse.json(newSettings);
    }

    // Atualiza as configurações existentes
    const updatedSettings = await db.system_settings.update({
      where: { id: settings.id },
      data: {
        default_currency,
        date_format,
        time_format,
        decimal_separator,
        thousands_separator,
        max_categories,
        max_transactions,
        max_file_size,
        max_users,
        max_plans,
        max_features_per_plan,
      },
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error("[SYSTEM_SETTINGS_PUT]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Buscar dados dos últimos 12 meses
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = subMonths(new Date(), i);
      return {
        month: format(date, "MMM/yy", { locale: ptBR }),
        startDate: new Date(date.getFullYear(), date.getMonth(), 1),
        endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0),
      };
    }).reverse();

    // Buscar dados de MRR para cada mês
    // Em um ambiente real, você buscaria isso do banco de dados ou de um histórico
    // Aqui estamos simulando com dados crescentes
    const baseValue = 8000; // Valor base para o MRR
    const growthRate = 0.05; // Taxa de crescimento mensal (5%)

    const mrrValues = months.map((_, index) => {
      // Simular crescimento do MRR ao longo do tempo
      return Math.round(baseValue * Math.pow(1 + growthRate, index));
    });

    return NextResponse.json({
      labels: months.map(m => m.month),
      values: mrrValues,
      // Adicionar timestamp para facilitar debug
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[ADMIN_MRR_HISTORY]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

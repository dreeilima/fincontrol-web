import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";

// Cache das últimas chamadas por ID de usuário
const lastCheckTimes: Record<string, number> = {};
// Cache dos últimos dados retornados por usuário
const userDataCache: Record<string, any> = {};
const THROTTLE_WINDOW = 5000; // 5 segundos entre verificações

// Esta rota permite verificar se os dados do usuário estão atualizados
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;

    // Implementação de throttling para evitar chamadas excessivas
    const now = Date.now();
    if (
      lastCheckTimes[userId] &&
      now - lastCheckTimes[userId] < THROTTLE_WINDOW
    ) {
      console.log(`Verificação throttled para usuário ${userId}`);

      // Se temos dados em cache, retorna-os com flag de throttled
      if (userDataCache[userId]) {
        return NextResponse.json({
          ...userDataCache[userId],
          throttled: true,
          fromCache: true,
          lastChecked: lastCheckTimes[userId],
          timestamp: now,
        });
      }

      return NextResponse.json({
        throttled: true,
        message: "Verifique novamente em alguns segundos",
        timestamp: now,
      });
    }

    // Atualiza o timestamp da última verificação
    lastCheckTimes[userId] = now;

    // Limpa o cache de tempos de verificação periodicamente
    // Mantém apenas os últimos 100 usuários para evitar vazamento de memória
    if (Object.keys(lastCheckTimes).length > 100) {
      const oldestUsers = Object.entries(lastCheckTimes)
        .sort(([, timeA], [, timeB]) => timeA - timeB)
        .slice(0, 50)
        .map(([id]) => id);

      oldestUsers.forEach((id) => {
        delete lastCheckTimes[id];
        delete userDataCache[id];
      });
    }

    // Busca os dados mais recentes do usuário diretamente do banco de dados
    const currentUser = await db.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar_url: true,
        stripe_customer_id: true,
        stripe_subscription_id: true,
        stripe_price_id: true,
        stripe_current_period_end: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    // Prepara a resposta formatada - garante que role seja "admin" ou "user" (não ADMIN ou USER)
    const formattedUser = {
      ...currentUser,
      role: currentUser.role === "ADMIN" ? "admin" : "user",
      lastChecked: now,
      timestamp: now,
    };

    // Armazena no cache
    userDataCache[userId] = formattedUser;

    // Retorna os dados atualizados
    return NextResponse.json(formattedUser);
  } catch (error) {
    console.error("Erro ao verificar dados do usuário:", error);
    return NextResponse.json(
      { error: "Erro ao verificar dados do usuário" },
      { status: 500 },
    );
  }
}

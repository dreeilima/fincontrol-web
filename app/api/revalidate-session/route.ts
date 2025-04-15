import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";

// Cache das requisições recentes para evitar excesso de chamadas
let lastRevalidationTime = 0;
const THROTTLE_WINDOW = 5000; // 5 segundos entre revalidações

// Este endpoint é usado para forçar revalidação da sessão e das páginas que usam dados do usuário
export async function POST() {
  try {
    // Implementação básica de throttling para evitar muitas revalidações
    const now = Date.now();
    if (now - lastRevalidationTime < THROTTLE_WINDOW) {
      console.log("Revalidação ignorada devido ao throttle");
      return NextResponse.json({
        success: true,
        throttled: true,
        message: "Revalidação ignorada, requisição muito recente",
      });
    }

    lastRevalidationTime = now;

    const session = await auth();

    // Verifica se o usuário está logado
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Revalida todas as rotas que dependem de dados do usuário
    revalidatePath("/dashboard", "layout");
    revalidatePath("/settings", "layout");
    revalidatePath("/admin", "layout");
    revalidateTag("user-data");

    // Força uma atualização completa do objeto de sessão
    // Obtendo dados atualizados diretamente do banco de dados
    const updatedUser = await db.users.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        stripe_customer_id: true,
        stripe_subscription_id: true,
        stripe_price_id: true,
        stripe_current_period_end: true,
      },
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    // Formata o papel do usuário para o formato esperado pelo cliente
    const formattedUser = {
      ...updatedUser,
      role: updatedUser.role === "ADMIN" ? "admin" : "user",
    };

    console.log(
      "Dados do usuário na revalidação:",
      JSON.stringify(formattedUser),
    );

    // Sucesso
    return NextResponse.json({
      success: true,
      user: formattedUser,
      timestamp: now,
    });
  } catch (error) {
    console.error("Erro ao revalidar sessão:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

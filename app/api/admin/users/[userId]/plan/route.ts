import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const body = await req.json();
    const { plan } = body;

    if (!plan) {
      return new NextResponse("Plano é obrigatório", { status: 400 });
    }

    // Verificar se o usuário existe
    const user = await db.users.findUnique({
      where: { id: params.userId },
      include: { subscription: true },
    });

    if (!user) {
      return new NextResponse("Usuário não encontrado", { status: 404 });
    }

    // Se o usuário já tem uma assinatura, atualizamos
    if (user.subscription) {
      await db.subscriptions.update({
        where: { user_id: params.userId },
        data: {
          plan,
          updated_at: new Date(),
        },
      });
    } else {
      // Se não tem, criamos uma nova
      await db.subscriptions.create({
        data: {
          id: crypto.randomUUID(),
          user_id: params.userId,
          plan,
          status: "active",
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[USER_PLAN_PATCH]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

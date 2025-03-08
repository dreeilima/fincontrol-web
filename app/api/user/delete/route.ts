import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Excluir todas as transações do usuário
    await db.transaction.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    // Excluir todas as categorias do usuário
    await db.category.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    // Excluir o usuário
    await db.user.delete({
      where: {
        id: session.user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

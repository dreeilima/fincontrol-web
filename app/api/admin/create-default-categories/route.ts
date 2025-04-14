import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { createDefaultCategories } from "@/lib/utils/create-default-categories";

export async function POST(req: Request) {
  try {
    // Buscar todos os usuários que ainda não têm categorias
    const users = await db.users.findMany({
      where: {
        categories: {
          none: {}, // Usuários que não têm nenhuma categoria
        },
      },
      select: {
        id: true,
      },
    });

    // Criar categorias padrão para cada usuário
    for (const user of users) {
      await createDefaultCategories(user.id);
    }

    return NextResponse.json({
      success: true,
      message: `Categorias padrão criadas para ${users.length} usuários`,
      usersProcessed: users.length,
    });
  } catch (error) {
    console.error("[CREATE_DEFAULT_CATEGORIES_ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao criar categorias padrão" },
      { status: 500 },
    );
  }
}

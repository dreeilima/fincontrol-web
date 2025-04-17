import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Buscar categorias padrão do administrador atual (is_default = true)
    const categories = await db.categories.findMany({
      where: {
        is_default: true,
        user_id: session.user.id, // Apenas categorias do administrador atual
      },
      select: {
        id: true,
        name: true,
        type: true,
        color: true,
        icon: true,
        is_default: true,
        _count: {
          select: {
            transactions: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    console.log(
      `[ADMIN_CATEGORIES_GET] Encontradas ${categories.length} categorias padrão do administrador ${session.user.id}`,
    );

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[ADMIN_CATEGORIES_GET]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const { name, type, color, icon } = await req.json();

    // Verificar se já existe uma categoria com o mesmo nome e tipo
    const existingCategory = await db.categories.findFirst({
      where: {
        name,
        type,
        user_id: session.user.id,
        is_default: true,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          error: `Já existe uma categoria padrão com o nome '${name}' e tipo '${type}'`,
        },
        { status: 400 },
      );
    }

    // Criar nova categoria padrão
    const category = await db.categories.create({
      data: {
        id: crypto.randomUUID(),
        name,
        type,
        color: color || (type === "INCOME" ? "#22c55e" : "#ef4444"), // Verde para receitas, vermelho para despesas
        icon: icon || (type === "INCOME" ? "💰" : "💸"), // 💰 para receitas, 💸 para despesas
        user_id: session.user.id,
        is_default: true, // Marca como categoria padrão
      },
    });

    console.log(`Nova categoria padrão criada: ${name} (${type})`);

    return NextResponse.json(category);
  } catch (error) {
    console.error("[ADMIN_CATEGORIES_POST]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

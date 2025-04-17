import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    // Verificar se o cliente Prisma está inicializado
    if (!db) {
      console.error("Cliente Prisma não inicializado");
      return new NextResponse("Erro de configuração do banco de dados", {
        status: 500,
      });
    }

    // Buscar as categorias específicas do usuário
    const userCategories = await db.categories.findMany({
      where: {
        user_id: session.user.id,
        is_default: false, // Apenas categorias não-padrão do usuário
      },
      orderBy: {
        name: "asc",
      },
    });

    // Buscar categorias padrão existentes
    const defaultCategories = await db.categories.findMany({
      where: {
        is_default: true, // Categorias padrão do sistema
      },
      orderBy: {
        name: "asc",
      },
    });

    // Verificar se as categorias padrão já existem para o usuário (por nome e tipo)
    const existingCategoryKeys = new Set(
      userCategories.map((cat) => `${cat.name}-${cat.type}`),
    );

    // Filtrar categorias padrão que o usuário já possui
    const missingDefaultCategories = defaultCategories.filter(
      (defCat) => !existingCategoryKeys.has(`${defCat.name}-${defCat.type}`),
    );

    // Criar categorias padrão faltantes para o usuário
    for (const defCat of missingDefaultCategories) {
      try {
        await db.categories.create({
          data: {
            id: crypto.randomUUID(),
            name: defCat.name,
            type: defCat.type,
            color: defCat.color,
            icon: defCat.icon,
            user_id: session.user.id,
            is_default: false, // Não é uma categoria padrão, mas sim uma cópia para o usuário
          },
        });
      } catch (error) {
        console.error(
          `Erro ao criar categoria padrão ${defCat.name} para usuário:`,
          error,
        );
      }
    }

    // Buscar novamente todas as categorias do usuário (incluindo as recém-criadas)
    const allUserCategories = await db.categories.findMany({
      where: {
        user_id: session.user.id,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(allUserCategories);
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Não autorizado", { status: 401 });
    }

    const { name, type, icon, color } = await req.json();

    // Verificar se o usuário tem uma assinatura premium
    const userSubscription = await db.subscriptions.findFirst({
      where: {
        user_id: session.user.id,
        status: "active",
      },
      include: { plan: true },
    });

    // Se o usuário não tem um plano premium, verificamos os limites
    if (!userSubscription || userSubscription.plan?.price === 0) {
      // Buscar configurações do sistema para obter o limite de categorias
      const settings = await db.system_settings.findFirst();
      const maxCategories = settings?.max_categories || 10; // Valor padrão se não existir configuração

      // Contar categorias do usuário
      const categoriesCount = await db.categories.count({
        where: {
          user_id: session.user.id,
        },
      });

      if (categoriesCount >= maxCategories) {
        return new NextResponse(
          `Limite de ${maxCategories} categorias atingido. Atualize para o plano Premium para categorias ilimitadas.`,
          { status: 403 },
        );
      }
    }

    const category = await db.categories.create({
      data: {
        id: crypto.randomUUID(),
        name,
        type,
        icon,
        color,
        user_id: session.user.id,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORIES_POST]", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
